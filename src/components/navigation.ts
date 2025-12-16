import { LitElement, html, css, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("navigation-hx")
export class NavComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 48px;
    }
    nav {
      display: flex;
      position: fixed;
      justify-content: space-between;
      justify-items: stretch;
      align-items: center;
      width: 100%;
      height: 48px;
      background-color: var(--hx-background-alpha-100);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--hx-border-100);
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      margin-left: 2.5rem;
      color: var(--hx-text-brand);
    }
    .brand span {
      font-weight: 600;
      font-size: 1.25rem;
      margin-left: 8px;
    }
    ul {
      display: flex;
      height: 100%;
      align-items: center;
      list-style-type: none;
      margin: 0;
      margin-right: 1.75rem;
      padding: 0;
      overflow-x: scroll;
    }
    li {
      display: inline;
    }
    a {
      padding: 16px 12px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--hx-text-200);
      text-decoration: none;
      transition: color 0.3s ease-in-out;
    }
    a.current {
      color: var(--hx-text-100);
    }
    a:hover {
      color: var(--hx-text-100);
    }
    span.ver {
      margin-left: 8px;
      font-family: var(--hx-font-mono);
      font-size: 0.75rem;
      font-weight: 400;
      color: var(--hx-text-200);
    }
    @media (max-width: 990px) {
      .brand {
        margin-left: 2rem;
      }
      ul {
        margin-right: 1.25rem;
      }
    }
    @media (max-width: 480px) {
      .brand {
        margin-left: 1rem;
      }
      ul {
        margin-right: 0.25rem;
      }
    }
  `;

  firstUpdated() {
    const links = this.shadowRoot!.querySelectorAll("a");
    const path = window.location.pathname;
    links.forEach((link) => {
      if (link.getAttribute("href") === path) {
        link.classList.add("current");
      } else if (path === "/") {
        links[0].classList.add("current");
      }
    });
    var ver = localStorage.getItem("prefs");
    if (ver === null) {
      ver = '{"preview": false}';
    }
    const prefs = JSON.parse(ver);
    const isPreview = prefs.preview;
    if (isPreview) {
      var previewBranding = document.createElement("span");
      previewBranding.classList.add("ver");
      previewBranding.textContent = "PREVIEW";
      this.shadowRoot?.querySelector(".brand")?.appendChild(previewBranding);
    }
  }

  render() {
    return html`
      <nav>
        <div class="brand">
          <svg
            height="1.25rem"
            viewBox="0 0 16 16"
            style="color: currentcolor;"
            stroke="#cacaca"
            stroke-width="0.00016"
          >
            <g stroke-width="0" />
            <g
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#ffffff"
              stroke-width="0.128"
            />
            <g>
              <path
                d="M0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm9 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm0 9a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5z"
                fill="currentColor"
              />
            </g>
          </svg>
          <span>Vault</span>
        </div>
        <ul tabindex="-1">
          <li><a href="/">BROWSE</a></li>
          <li><a href="/collection/map-labs">MAPLABS</a></li>
          <li><a href="/collection/lego">LEGO</a></li>
          <li><a href="/collection/software">SOFTWARE</a></li>
        </ul>
      </nav>
    `;
  }
}
