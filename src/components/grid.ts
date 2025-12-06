import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IndexedDbService } from '../modules/indexedDb';

interface Asset {
  id: number;
  src: string;
  title: string;
  release: string;
  author: string;
  resolution: string;
  sgdb?: string;
  sdb?: string;
  attributes?: string[];
  tags: string[];
}

@customElement('grid-hx')
export class GridComponent extends LitElement {
  @property({ type: String, attribute: 'collection' })
  collectionRenderer = '';

  @state()
  private assets: Asset[] = [];

  @state()
  private currentFilters = {
    resolution: [] as string[],
    aspectRatio: [] as string[],
    sortBy: 'newest'
  };

  private dbService = new IndexedDbService();
  private collections: { [key: string]: Asset[] } = {};
  private imageObserver: IntersectionObserver | null = null;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('vault-filter-change', this.handleFilterChange.bind(this) as EventListener);
    this.loadFilters();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('vault-filter-change', this.handleFilterChange.bind(this) as EventListener);
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
  }

  private handleFilterChange(e: CustomEvent) {
    this.currentFilters = e.detail;
    this.requestUpdate(); // Ensure re-render
  }

  private loadFilters() {
    const stored = sessionStorage.getItem('selectedValues');
    if (stored) {
      this.currentFilters = JSON.parse(stored);
    }
  }

  private getFilteredAssets(): Asset[] {
    let filtered = [...this.assets];

    // Filter by Resolution
    if (this.currentFilters.resolution && this.currentFilters.resolution.length > 0) {
      filtered = filtered.filter(a => {
        // Always include horizontal assets in resolution check as they have custom resolutions
        if (a.attributes?.includes('horizontal')) return true;
        return this.currentFilters.resolution.includes(a.resolution);
      });
    }

    // Filter by Aspect Ratio
    if (this.currentFilters.aspectRatio && this.currentFilters.aspectRatio.length > 0) {
      filtered = filtered.filter(a => {
        const isHorizontal = a.attributes?.includes('horizontal');
        const showVertical = this.currentFilters.aspectRatio.includes('2:3');
        const showHorizontal = this.currentFilters.aspectRatio.includes('92:43');

        if (showVertical && showHorizontal) return true;
        if (showVertical) return !isHorizontal;
        if (showHorizontal) return isHorizontal;
        return false;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.currentFilters.sortBy) {
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'nameasc':
          return a.title.localeCompare(b.title);
        case 'namedesc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }

  static styles = css`
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .grid {
      display: grid; 
      grid-auto-rows: auto;
      grid-template-columns: repeat(6, 1fr); 
      gap: 2rem;
      padding: 0rem 2.5rem 2.5rem;
    }
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      aspect-ratio: 2/3;
      background-color: var(--hx-background-alpha-100);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border: 1px solid var(--hx-border-100);
      border-radius: 12px;
    }
    .item.horizontal img {
      border-radius: 0px;
    }
    .item img {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      cursor: pointer;
    }
    .item .info {
      margin-top: 8px;
      text-align: center;
    }
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100svh;
      height: 100vh;
      background: var(--hx-background-alpha-100);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s, opacity 0.3s ease;
    }
    .overlay .content {
      position: relative;
      object-fit: scale-down;
      max-width: 100vw;
      height: 94dvh;
      height: 94vh;
      aspect-ratio: 2/3;
    }
    .overlay .content.horizontal {
      width: 80vw;
      height: auto;
      aspect-ratio: 92/43;
    }
    .overlay img {
      max-width: 100%;
      visibility: hidden;
      object-fit: contain;
      opacity: 0;
      transition: visibility 0s, opacity 0.3s ease;
      z-index: 1;
    }
    .overlay img.visible {
      visibility: visible;
      opacity: 1;
    }
    .overlay.visible {
      visibility: visible;
      opacity: 1;
    }
    .overlay img.loaded {
      animation: fadeIn 0.5s ease-in-out;
    }
    .overlay .skeleton,
    .overlay img,
    .overlay .full-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .skeleton {
      opacity: 0;
      background-color: #e0e0e0;
      background-image: linear-gradient(90deg, var(--hx-background-200), var(--hx-background-300), var(--hx-background-200));
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      transition: opacity 0.3s ease;
    }
    .skeleton.visible {
      opacity: 1;
    }
    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    .full-overlay {
      position: absolute;
      width: 100%;
      display: flex;
      position: absolute;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      z-index: 2;
    }
    .full-overlay:hover {
      opacity: 1;
    }
    .full-overlay:hover.invisible {
      opacity: 0;
    }
    .full-overlay a {
      margin: .5rem;
    }
    .full-overlay span {
      color: var(--hx-text-100);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      padding: 8px;
      background-color: var(--hx-background-alpha-200);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid var(--hx-border-200);
      line-height: 1;
      transition: color 0.3s ease-in-out;
      pointer-events: all;
    }
    .full-overlay > span {
      margin: .5rem;
      padding: 4px;
      font-size: .875rem;
    }
    .full-overlay a:hover > span {
      color: var(--hx-text-brand);
    }
    .error-container {
      color: var(--hx-red-500);
      position: absolute;
      z-index: 1;
    }
    .error-container p {
      color: var(--hx-text-100);
      text-align: center;
    }
    .info-pane {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgb(10,10,10);
      background: -moz-linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(255,0,0,0) 64%);
      background: -webkit-linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(255,0,0,0) 64%);
      background: linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(255,0,0,0) 64%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#0a0a0a",endColorstr="#ff0000",GradientType=1);
      border-radius: 11px;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
      overflow: hidden;
    }
    .info-pane.visible {
      opacity: 1;
    }
    #info-pane-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: .5rem 1rem;
    }
    #info-pane-top span {
      font-size: .8rem;
      padding: 4px;
      border-radius: 6px;
      color: var(--hx-text-100);
      background-color: var(--hx-background-alpha-200);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid var(--hx-border-200);
      line-height: 1;
    }
    #info-pane-top a > span{
      color: var(--hx-text-100);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      padding: 6px;
      transition: color 0.3s ease-in-out;
      pointer-events: all;
    }
    #info-pane-top a:hover > span {
      color: var(--hx-text-brand);
    }
    #info-pane-bottom {
      padding: 1.5rem 1rem;
    }
    #info-pane-bottom p {
      color: var(--hx-text-200);
      margin: 0;
      font-size: .9rem;
      font-weight: 500;
    }
    #info-pane-bottom h2 {
      color: var(--hx-text-100);
      margin-bottom: 8px;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1;
    }
    .visible {
      opacity: 1;
    }
    /* BREAKPOINTS */
    @media (max-width: 1600px) {
      .grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }
    @media (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    @media (max-width: 990px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
        padding: 0rem 2rem 2rem;
      }
    }
    @media (max-width: 770px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 550px) {
      .overlay .content {
        width: 100vw;
        height: auto;
      }
      .overlay img {
        max-width: 100%;
        height: auto;
      }
    }
    @media (max-width: 480px) {
      .grid {
        grid-template-columns: 1fr;
        padding: 0rem 1rem 1rem;
        gap: 1rem;
      }
    }
  `;

private lastFocusedElement: HTMLElement | null = null;

  private collectionsCollector(assets: Asset[]) {
    const collections: { [key: string]: Asset[] } = {};
    const browseCollection: Asset[] = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      let addedToCollection = false;

      for (const tag of asset.tags) {
        if (tag.startsWith('collection:')) {
          const collectionName = tag.substring(11) || 'default';
          if (!collections[collectionName]) {
            collections[collectionName] = [];
          }
          collections[collectionName].push(asset);
          addedToCollection = true;
          break;
        }
      }

      if (!addedToCollection) {
        browseCollection.push(asset);
      }
    }

    if (browseCollection.length > 0) {
      collections['browse'] = browseCollection;
    }

    this.collections = collections;
  }
  private readonly OVERLAY_SELECTORS = {
    overlay: '.overlay',
    image: '.overlay img',
    skeleton: '.skeleton',
    fullOverlay: '.full-overlay',
    content: '.overlay .content',
    download: '.overlay .content a',
    gridInfo: '#overlay-grid-info'
  } as const;

  private readonly ANIMATION_DURATION = 2000;

  private showOverlay(src: number, sourceElement?: Element | null) {
    // Cache DOM queries
    const elements = Object.entries(this.OVERLAY_SELECTORS).reduce((acc, [key, selector]) => ({
      ...acc,
      [key]: this.shadowRoot?.querySelector(selector)
    }), {} as Record<keyof typeof this.OVERLAY_SELECTORS, Element | null>);

    // Validate all required elements exist
    if (Object.values(elements).some(el => !el)) {
      console.error('Required overlay elements not found');
      return;
    }

    const asset = this.assets.find(asset => asset.id === src);
    if (!asset) {
      this.constructError(404, src);
      return;
    }

    // Type assertions for elements
    const {
      overlay,
      image,
      skeleton,
      fullOverlay,
      content,
      download,
      gridInfo
    } = elements as Record<keyof typeof this.OVERLAY_SELECTORS, HTMLElement>;

    // Cleanup function for event listeners
    const cleanup = () => {
      window.removeEventListener('scroll', handleScroll);
      image.removeEventListener('load', handleImageLoad);
      image.removeEventListener('error', handleImageError);
    };

    // Event handlers
    const handleScroll = () => {
      cleanup();
      this.hideOverlay();
    };

    const handleImageLoad = () => {
      image.classList.add('visible');
      skeleton.classList.remove('visible');
      download.setAttribute('href', `/asset/grid/${src}.png`);
      gridInfo.textContent = asset.resolution;
      fullOverlay.classList.add('visible');

      const isDesktop = !('ontouchstart' in window);

      if (isDesktop && sourceElement === undefined) {
        const timeout = setTimeout(() => {
          fullOverlay.classList.remove('visible');
          clearTimeout(timeout);
        }, this.ANIMATION_DURATION);
      }
    };

    const handleImageError = () => {
      skeleton.classList.remove('visible');
      fullOverlay.classList.add('invisible');
      this.constructError(404, src);
      cleanup();
    };

    try {
      // Reset state
      (image as HTMLImageElement).src = '';
      skeleton.classList.add('visible');
      fullOverlay.classList.remove('visible', 'invisible');
      content.classList.remove('horizontal');
      skeleton.classList.remove('horizontal');

      // Handle horizontal layout
      const isHorizontal = asset.attributes?.includes('horizontal');
      if (isHorizontal) {
        content.classList.add('horizontal');
        skeleton.classList.add('horizontal');
      }

      // Add event listeners
      window.addEventListener('scroll', handleScroll, { passive: true });
      image.addEventListener('load', handleImageLoad, { once: true });
      image.addEventListener('error', handleImageError, { once: true });

      // Show overlay and update image
      overlay.classList.add('visible');
      (image as HTMLImageElement).src = `/asset/grid/${src}.png`;
      window.location.hash = `#preview${src}`;
      this.lastFocusedElement = sourceElement as HTMLElement || document.activeElement as HTMLElement;
      overlay.focus();
    } catch (error) {
      console.error('Error showing overlay:', error);
      this.constructError(500, src);
      cleanup();
    }
  }

  private hideOverlay() {
    const overlay = this.shadowRoot?.querySelector('.overlay');
    const overlayImg = overlay?.querySelector('img');
    const overlayFull = overlay?.querySelector('.full-overlay');
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
    if (overlay) {
      var prevError = overlay.querySelector('.error-container');
      if (prevError) {
        prevError.remove();
      }
      overlay.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: 300,
        easing: 'ease'
      }).onfinish = () => {
        overlay.classList.remove('visible');
      };
      overlayImg?.classList.remove('visible');
      if (overlayFull) {
        const overlayGridInfo = overlayFull.querySelector('#overlay-grid-info');
        overlayFull.classList.remove('visible');
        if (overlayGridInfo) {
          overlayGridInfo.innerHTML = '';
        }
      }
    }
    history.replaceState(null, '', ' ');
  }

  private handleGridKeydown(e: KeyboardEvent, asset: Asset) {
    const target = e.target as HTMLElement;
    
    switch(e.key) {
      case 'Enter':
        this.showOverlay(asset.id, e.target as HTMLElement);
        break;
      case 'ArrowRight':
        e.preventDefault();
        (target.nextElementSibling as HTMLElement)?.focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        (target.previousElementSibling as HTMLElement)?.focus();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        const items = Array.from(this.shadowRoot!.querySelectorAll('.item'));
        const currentIndex = items.indexOf(target);
        const columns = getComputedStyle(target.parentElement!).gridTemplateColumns.split(' ').length;
        const nextIndex = currentIndex + (e.key === 'ArrowDown' ? columns : -columns);
        if (items[nextIndex]) {
          (items[nextIndex] as HTMLElement).focus();
        }
        break;
    }
  }

  private lazyLoadImages() {
    const images = this.shadowRoot?.querySelectorAll('img[data-src]');
    
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }

    if (images && images.length > 0) {
      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.style.opacity = '0';
              img.src = img.dataset.src!;
              img.onload = () => {
                img.style.transition = 'opacity 0.3s ease-in-out';
                img.style.opacity = '1';
                img.classList.add('loaded');
              };
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '10% 0px'
      });

      images.forEach(img => this.imageObserver!.observe(img));
    }
  }

  private handleHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#preview')) {
      const assetId = parseInt(hash.replace('#preview', ''), 10);
      if (!isNaN(assetId)) {
        this.showOverlay(assetId);
      }
    }
  }

  private constructError(status: number = 404, src?: number) {
    const overlay = this.shadowRoot?.querySelector('.overlay');
    if (overlay) {
      const errorContainer = document.createElement('div');
      errorContainer.classList.add('error-container');

      const errorTop = document.createElement('div');
      errorTop.style.display = 'flex';
      errorTop.style.justifyContent = 'center';
      const errorTitle = document.createElement('span');
      const errorIcon = document.createElement('span');
      errorIcon.style.marginRight = '8px';
      errorIcon.innerHTML = '<svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.55846 2H7.44148L1.88975 13.5H14.1102L8.55846 2ZM9.90929 1.34788C9.65902 0.829456 9.13413 0.5 8.55846 0.5H7.44148C6.86581 0.5 6.34092 0.829454 6.09065 1.34787L0.192608 13.5653C-0.127943 14.2293 0.355835 15 1.09316 15H14.9068C15.6441 15 16.1279 14.2293 15.8073 13.5653L9.90929 1.34788ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z" fill="currentColor"></path></svg>';


      const errorMessage = document.createElement('p');
      switch (status) {
        case 404:
          errorTitle.textContent = 'Error: Not Found';
          errorMessage.textContent = 'We cannot found the asset you are looking for.';
          break;
        case 501:
          errorTitle.textContent = 'Error: Not Implemented';
          errorMessage.innerHTML = `The asset/collection is not yet implemented.<br><br><span style="font-family: var(--hx-font-mono)">asset-access-${status}-id-${src}</span>`;
          break;
        default:
          errorTitle.textContent = 'Not Found';
          break;
      }
      errorTop.appendChild(errorIcon);
      errorTop.appendChild(errorTitle);
      errorContainer.appendChild(errorTop);
      errorContainer.appendChild(errorMessage);

      overlay.appendChild(errorContainer);
    }
  }

  private showInfoPane(event: MouseEvent | FocusEvent, asset: Asset) {
    const target = event.currentTarget as HTMLElement;
    const source = "/asset/grid/" + asset.id + ".png"
    // Remove any existing info pane
    const existingInfoPane = target.querySelector('.info-pane');
    if (existingInfoPane) {
      existingInfoPane.remove();
    }

    const infoPane = document.createElement('div');
    infoPane.classList.add('info-pane');
    infoPane.innerHTML = `
      <div id="info-pane-top">
        <span>${asset.resolution}</span>
        <a href="${source}" aria-label="Download this asset" tabindex="-1" download>
          <span id="svg-container">
            <svg height="20" stroke-linejoin="round" viewBox="0 0 16 16" width="20" style="color: currentcolor;"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z" fill="currentColor"></path></svg>
          </span>
        </a>
      </div>
      <div id="info-pane-bottom">
        <h2>${asset.title}</h2>
        <p>by ${asset.author}</p>
      </div>
    `;

    target.appendChild(infoPane);
    requestAnimationFrame(() => infoPane.classList.add('visible'));
  }

  private hideInfoPane(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const infoPane = target.querySelector('.info-pane');
    if (infoPane) {
      infoPane.classList.remove('visible');
      infoPane.addEventListener('transitionend', () => infoPane.remove(), { once: true });
    }
  }

  async firstUpdated() {
    try {
      await this.dbService.initDatabase();
      this.assets = await this.dbService.getAllAssets();
      this.collectionsCollector(this.assets);
      setTimeout(() => this.handleHash(), 0);
      this.requestUpdate();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      this.constructError(500);
    }
  }

  updated() {
    this.lazyLoadImages();
  }

    render() {
      const filteredAssets = this.getFilteredAssets();
      this.collectionsCollector(filteredAssets);

      if (this.assets.length > 0 && !this.collections[this.collectionRenderer]) {
        this.collections[this.collectionRenderer] = [];
      }
  
      if (!this.collections[this.collectionRenderer]) {
        return html`
        <div class="grid">
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
        </div>`;
      }
  
      return html`
        <div class="grid">
          ${this.collections[this.collectionRenderer].map((asset) => html`
        <div class="item${asset.attributes ? " " + asset.attributes[0] : ""}" tabindex="0"
             @mouseenter="${(e: MouseEvent) => this.showInfoPane(e, asset)}"
             @focus="${(e: FocusEvent) => this.showInfoPane(e, asset)}"
             @blur="${this.hideInfoPane}"
             @mouseleave="${this.hideInfoPane}"
             @keydown="${(e: KeyboardEvent) => this.handleGridKeydown(e, asset)}">
              <img data-src="/asset/grid/thumbnail/${asset.id}.webp" 
                   aria-label="Custom Asset for ${asset.title} by ${asset.author}" 
                   @click="${() => this.showOverlay(asset.id)}">
            </div>
          `)}
        </div>
        <div class="overlay" @click="${this.hideOverlay}" tabindex="0"
          @keydown="${(e: KeyboardEvent) => { if (e.key === 'Escape') this.hideOverlay(); }}">
          <div class="content">
            <img src="" alt="Zoomed Image">
            <div class="skeleton"></div>
            <div class="full-overlay">
              <span id="overlay-grid-info"></span>
              <a title="Download the asset" href="" tabindex="0" download>
                <span>
                  <svg height="24" stroke-linejoin="round" viewBox="0 0 16 16" width="24" style="color: currentcolor;">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z" fill="currentColor"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      `;
    }
}