import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

interface DropdownOption {
	value: string;
	label: string;
}

@customElement("toolbar-hx")
export class ToolbarComponent extends LitElement {
	@property({ type: String })
	activeDropdown = "";

	@property({ type: Object })
	prefs = {
		preview: false,
		toolbarState: "float",
		keepFilters: true,
	};

	@property({ type: Object })
	selectedValues = {
		resolution: [
			"1000x1500",
			"1200x1800",
			"1440x2160",
			"1843x2763",
			"2280x3420",
		] as string[],
		aspectRatio: ["2:3", "92:43"] as string[],
		sortBy: "newest",
	};

	@property({ type: Array })
	resolutionOptions: DropdownOption[] = [
		{ value: "1000x1500", label: "1000x1500" },
		{ value: "1200x1800", label: "1200x1800" },
		{ value: "1440x2160", label: "1440x2160" },
		{ value: "1843x2763", label: "1843x2763" },
		{ value: "2280x3420", label: "2280x3420" },
	];

	@property({ type: Array })
	aspectRatioOptions: DropdownOption[] = [
		{ value: "2:3", label: "Steam Vertical (2:3)" },
		{ value: "92:43", label: "Steam Horizontal (92:43)" },
	];

	@property({ type: Array })
	sortOptions: DropdownOption[] = [
		{ value: "newest", label: "Newest First" },
		{ value: "oldest", label: "Oldest First" },
		{ value: "nameasc", label: "Name Ascending (A-Z)" },
		{ value: "namedesc", label: "Name Descending (Z-A)" },
	];

	static styles = css`
		:host {
			display: flex;
			justify-content: center;
			padding: 0 2.5rem;
			width: 100%;
			min-height: 4.2rem;
			z-index: 99;
		}

		.toolbar {
			position: relative !important;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: max-content;
			margin: 0.5rem 0;
			background-color: var(--hx-background-alpha-100);
			-webkit-backdrop-filter: blur(10px);
			backdrop-filter: blur(10px);
			border: 1px solid var(--hx-border-100);
			border-radius: 12px;
			z-index: 199;
			transition: all 0.3s ease-in-out;
			opacity: 1;
			transform: translateY(0);
			box-sizing: border-box;
		}

		.toolbar.float {
			position: fixed !important;
			width: calc(100% - 5rem);
			transform: translateY(-20px);
			animation: slideIn 0.3s ease-in-out forwards;
		}

		@keyframes slideOut {
			from {
				opacity: 1;
				transform: translateY(0);
			}
			to {
				opacity: 0;
				transform: translateY(-20px);
			}
		}

		@keyframes slideIn {
			from {
				transform: translateY(-20px);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.toolbar > div {
			height: 100%;
			border-right: 1px solid var(--hx-border-100);
			position: relative;
			display: flex;
			align-items: center;
			padding: 0.5rem 1.5rem;
			cursor: pointer;
			user-select: none;
			transition: background-color 0.2s;
		}

		.toolbar > div#brand {
			display: flex;
			justify-content: flex-start;
			margin-right: auto;
			align-items: center;
			padding: 0.5rem 1rem;
			gap: 0.5rem;
			color: var(--hx-text-brand);
		}

		.toolbar > div#menu {
			padding: 0.75rem;
			margin: .25rem;
			margin-left: auto;
			border-radius: 8px;
			background: color-mix(in srgb, #fff 5%, transparent);
		}
		.toolbar > div#menu:hover {
			background: color-mix(in srgb, #fff 10%, transparent);
		}

		.toolbar > div#brand svg {
			margin: 0;
		}

		.toolbar > div#toolbar-sort span.selections {
			display: inline-block;
			overflow-x: hidden;
			overflow-y: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 124px;
		}

		.toolbar > div#toolbar-prefs svg {
			margin-left: 0;
			height: 1.8rem;
		}

		.toolbar > div#toolbar-prefs .dropdown-container {
			left: auto;
			right: 0;
		}

		.toolbar > div:last-child,
		.toolbar > div:first-child {
			border-right: none;
		}

		.toolbar > div > span {
			font-size: .9rem;
			font-weight: 600;
			font-family: var(--hx-font-sans);
			line-height: 0.9;
			flex-wrap: nowrap;
			transition: filter 0.2s;
		}

		.toolbar > div#brand span {
			font-size: 1rem;
		}
		

		.toolbar > div#menu span {
			font-weight: 500;
			font-size: 0.9rem;
		}

		.toolbar > div#menu span.svg {
			display: none;
		}

		.toolbar > div span.selections {
			color: var(--hx-text-200);
			font-size: 0.875rem;
			font-weight: 400;
		}

		.dropdown-container {
			position: absolute;
			top: 100%;
			left: 0;
			padding-top: 4px;
			min-width: 100%;
			width: max-content;
			z-index: 200;
		}

		.dropdown-content {
			background: var(--hx-background-alpha-100);
			-webkit-backdrop-filter: blur(6px);
			backdrop-filter: blur(6px);
			border: 1px solid var(--hx-border-100);
			border-radius: 8px;
			padding: 0.25rem;
			display: none;
			transform: translateZ(0); /* Promotes to its own compositing layer */
		}

		.dropdown-content > span {
			display: block;
			color: var(--hx-text-100);
			padding: 0.75rem 1rem 0.5rem;
		}

		.toolbar > div.active .dropdown-content {
			display: block;
			animation: slideIn 0.2s ease forwards;
		}
		/* Apply slideOut animation when .closing is added */
		.toolbar > div.active .dropdown-content.closing {
			animation: slideOut 0.2s ease forwards;
		}
		.toolbar > div svg {
			margin-left: 0.75rem;
			transition: transform 0.2s;
		}
		.toolbar > div.active svg {
			transform: rotate(180deg);
		}
		.toolbar > div#toolbar-resolution {
			border-left: 1px solid var(--hx-border-100);
		}
		.toolbar > div#toolbar-prefs {
			color: var(--hx-text-200);
			transition: color 0.2s;
		}
		.toolbar > div#toolbar-prefs svg {
			width: 1rem;
		}
		.toolbar > div#toolbar-prefs.active {
			color: var(--hx-red-500);
		}
		.toolbar > div#toolbar-prefs.active svg {
			transform: none;
		}
		.toolbar > div#menu span.svg {
			display: none;
		}
		.toolbar > div#menu svg {
			margin: 0;
			display: flex;
		}
		.toolbar > div#menu.active svg {
			transform: none;
		}

		.dropdown-layout {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: .5rem;
		}

		.dropdown-item {
			padding: 0.75rem 1rem;
			transition: background-color 0.2s;
			color: var(--hx-text-200);
			font-size: 0.875rem;
			border-radius: 6px;
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		.dropdown-item:not(.menu-browse):not(.menu-maplabs):not(.menu-lego):not(.menu-software):hover {
			background: color-mix(in srgb, #fff 5%, transparent);
		}

		.dropdown-item:hover .checkbox,
		.dropdown-item:hover .radio-circle {
			border-color: var(--hx-text-200);
		}

		.dropdown-item:hover .checkbox.selected,
		.dropdown-item:hover .radio-circle.selected {
			border-color: var(--hx-red-500);
		}

		.toolbar > div#menu .dropdown-container {
			left: auto;
			right: -4.6px;
			padding-top: 8px;
		}

		.toolbar > div#menu .dropdown-content {
			width: calc(50vw - 2.5rem);
			padding: .75rem;
		}

		.toolbar > div#menu .dropdown-item {
			display: flex;
			justify-content: start;
			align-items: flex-end;
			aspect-ratio: 2/1;
			border-radius: 8px;
			border: 1px solid var(--hx-border-200);
			padding: 1rem;
			background-size: cover;
			background-position: center;
			transition: all 0.3s;
		}

		.toolbar > div#menu .dropdown-item span {
			font-size: 1.25rem;
			font-weight: 600;
			text-shadow: 0 0 4px var(--hx-background-alpha-100);
		}

		.menu-browse {
			background: linear-gradient(6deg,var(--hx-text-brand) 0%, var(--hx-background-200) 50%);
		}

		.menu-browse:hover {
			border: 1px solid var(--hx-border-300) !important;
			background: linear-gradient(6deg,var(--hx-text-brand) 0%, var(--hx-background-300) 50%);
		}

		.menu-maplabs {
			background-image: url("/src/image/temporary/map-labs.jpg");
		}

		.menu-maplabs:hover {
			border: 1px solid var(--hx-collection-maplabs) !important;
			color: var(--hx-collection-maplabs) !important;
		}

		.menu-lego {
			background-image: url("/src/image/temporary/lego.jpg");
		}

		.menu-lego:hover {
			border: 1px solid var(--hx-collection-lego) !important;
			color: var(--hx-collection-lego) !important;
		}
		

		.menu-software {
			background-image: url("/src/image/temporary/software.jpg");
		}

		.menu-software:hover {
			border: 1px solid var(--hx-collection-software) !important;
			color: var(--hx-collection-software) !important;
		}

		.checkbox {
			display: inline-block;
			width: 12px;
			height: 12px;
			border: 2px solid var(--hx-border-300);
			border-radius: 4px;
			position: relative;
		}

		.checkbox.selected,
		.radio-circle.selected {
			border-color: var(--hx-red-500);
			background-color: var(--hx-red-100);
		}

		.radio-circle {
			width: 12px;
			height: 12px;
			border: 2px solid var(--hx-border-300);
			border-radius: 50%;
			position: relative;
		}

		a {
			text-decoration: none;
		}

		/* BREAKPOINTS */
		@media (max-width: 990px) {
			:host {
				padding: 0 2rem;
			}
			.toolbar.float {
				width: calc(100% - 4rem);
			}
			.toolbar > div#menu {
				padding: 0.6rem;
			}
			.toolbar > div#brand span {
				display: none;
			}
			.toolbar > div#brand {
				padding: .85rem;
			}
			.toolbar > div#menu span:not(.svg) {
				display: none;
			}
			.toolbar > div#menu span.svg {
				display: block;
			}
			.toolbar > div#menu .dropdown-content {
				width: calc(100vw - 6rem + 6.6px);
			}
		}
		@media (max-width: 698px) {
			:host {
				padding: 1rem 2rem;
				padding-top: 0;
			}
			.toolbar {
				width: 100%;
				flex-wrap: wrap;
				justify-content: stretch;
				border-radius: 0px 0px 12px 12px;
				margin: 0;
			}
			.toolbar > div {
				justify-content: space-between;
				border-right: none;
				border-radius: 8px;
				padding: 0.5rem;
				margin: 0.125rem;
			}
			.toolbar > div.active {
				background-color: color-mix(in srgb, #fff 5%, transparent);
			}
			.toolbar > div#toolbar-prefs .dropdown-container,
			.toolbar > div#toolbar-aspect-ratio .dropdown-container {
				left: auto;
				right: 0;
			}
			.toolbar > div#toolbar-resolution {
				border-left: none;
			}
			.dropdown-layout {
				grid-template-columns: 1fr;
			}
		}
		@media (max-width: 480px) {
			:host {
				padding: 1rem;
			}
			.toolbar.float {
				margin: 0 0.5rem;
			}
		}
		@media (max-width: 370px) {
		}
	`;

	private getDropdownContentElement(dropdownType: string): Element | null | undefined {
		if (!dropdownType) return null;
		// Dropdown triggers have IDs: "toolbar-resolution", "toolbar-aspectRatio", "toolbar-sort", "menu"
		const selector = `#${dropdownType.startsWith("toolbar-") ? dropdownType : dropdownType === "menu" ? "menu" : `toolbar-${dropdownType}`} .dropdown-content`;
		return this.shadowRoot?.querySelector(selector);
	}

	setActiveDropdown(newActiveType: string) { // newActiveType can be "resolution", "aspectRatio", "sortBy", "menu", or ""
		const previouslyActiveType = this.activeDropdown;

		// If trying to activate a dropdown that is currently in the 'closing' state (e.g., mouse re-entered quickly)
		if (newActiveType) {
			const targetDropdownContent = this.getDropdownContentElement(newActiveType);
			if (targetDropdownContent?.classList.contains('closing')) {
				targetDropdownContent.classList.remove('closing'); // Cancel closing animation
				this.activeDropdown = newActiveType; // Set it as active
				// LitElement will requestUpdate automatically due to property change.
				return;
			}
		}

		// If a different dropdown was active, and it might have been in a 'closing' state,
		// ensure 'closing' is removed as we are definitively changing state.
		if (previouslyActiveType && previouslyActiveType !== newActiveType) {
			const previouslyActiveDropdownContent = this.getDropdownContentElement(previouslyActiveType);
			previouslyActiveDropdownContent?.classList.remove('closing');
		}

		// Standard toggle: if clicking the same active one (and it's not empty string), it closes.
		// Otherwise, the new one opens (or all close if newActiveType is "").
		if (previouslyActiveType === newActiveType && newActiveType !== "") {
			this.activeDropdown = ""; // Toggle off
		} else {
			this.activeDropdown = newActiveType; // Set new one or clear if newActiveType is ""
		}
	}

	handleDropdownMouseLeave(dropdownType: string) {
		// Only proceed if this specific dropdown is currently the active one
		if (this.activeDropdown === dropdownType) {
			const dropdownContentElement = this.getDropdownContentElement(dropdownType);

			if (!dropdownContentElement || dropdownContentElement.classList.contains('closing')) {
				return; // Already closing or doesn't exist
			}

			dropdownContentElement.classList.add("closing");

			const animationEndHandler = () => {
				// Only truly deactivate if it's still supposed to be closing
				if (dropdownContentElement.classList.contains('closing')) {
					dropdownContentElement.classList.remove("closing");
					// And if this dropdown is still the one marked as active (no other dropdown took precedence)
					if (this.activeDropdown === dropdownType) {
						this.activeDropdown = "";
					}
				}
			};
			dropdownContentElement.addEventListener("animationend", animationEndHandler, { once: true });
			dropdownContentElement.addEventListener("animationcancel", animationEndHandler, { once: true });
		}
	}

	updatePrefs(pref: "toolbarState" | "preview" | "keepFilters") {
		switch (pref) {
			case "toolbarState":
				this.prefs.toolbarState =
					this.prefs.toolbarState === "normal" ? "float" : "normal";
				localStorage.setItem("prefs", JSON.stringify(this.prefs));
				break;
			case "keepFilters":
				this.prefs.keepFilters = !this.prefs.keepFilters;
				localStorage.setItem("prefs", JSON.stringify(this.prefs));
				break;
			case "preview":
				this.prefs.preview = !this.prefs.preview;
				localStorage.setItem("prefs", JSON.stringify(this.prefs));
				window.location.reload();
				break;
		}
	}

	handleCheckboxSelect(type: "resolution" | "aspectRatio", value: string) {
		const currentValues = [...this.selectedValues[type]];
		const index = currentValues.indexOf(value);

		if (index === -1) {
			currentValues.push(value);
		} else {
			currentValues.splice(index, 1);
		}

		this.selectedValues = {
			...this.selectedValues,
			[type]: currentValues,
		};
		sessionStorage.setItem(
			"selectedValues",
			JSON.stringify(this.selectedValues)
		);
		window.dispatchEvent(new CustomEvent('vault-filter-change', { 
			detail: this.selectedValues 
		}));
	}

	handleRadioSelect(value: string) {
		this.selectedValues = {
			...this.selectedValues,
			sortBy: value,
		};
		sessionStorage.setItem(
			"selectedValues",
			JSON.stringify(this.selectedValues)
		);
		window.dispatchEvent(new CustomEvent('vault-filter-change', { 
			detail: this.selectedValues 
		}));
	}

	firstUpdated() {
		localStorage.getItem("prefs")
			? (this.prefs = JSON.parse(localStorage.getItem("prefs")!))
			: localStorage.setItem("prefs", JSON.stringify(this.prefs));
		if (sessionStorage.getItem("selectedValues") && this.prefs.keepFilters) {
			this.selectedValues = JSON.parse(
				sessionStorage.getItem("selectedValues")!
			);
		} else {
			sessionStorage.setItem(
				"selectedValues",
				JSON.stringify(this.selectedValues)
			);
		}
	}

	render() {
		return html`
			<div
				class="toolbar ${this.prefs.toolbarState === "float" ? "float" : ""}"
			>
				<div id="brand" @click=${() => window.location.href = "/"}>
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
				<div
					id="toolbar-resolution"
					class="${this.activeDropdown === "resolution" ? "active" : ""}"
					tabindex="0"
					aria-expanded="${this.activeDropdown === "resolution"}"
					aria-controls="resolution-content"
					@mouseenter=${() => this.setActiveDropdown("resolution")}
					@mouseleave=${() => this.handleDropdownMouseLeave("resolution")}
					@keydown=${(e: KeyboardEvent) => {
						if (e.key === "Enter") {
							this.setActiveDropdown("resolution"); // Toggles the dropdown
						} else if (e.key === "Escape") {
							this.setActiveDropdown(""); // Closes any active dropdown
						}
					}}
				>
					<span
						>Resolution${this.selectedValues.resolution.length > 0
							? html`<br /><span class="selections">
										${this.selectedValues.resolution.length === 5
											? "All"
											: this.selectedValues.resolution.length + " selected"}
									</span>`
							: ""}</span
					>
					<svg
						data-testid="geist-icon"
						height="16"
						stroke-linejoin="round"
						style="color: currentcolor;"
						viewBox="0 0 16 16"
						width="16"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
							fill="currentColor"
						></path>
					</svg>
					<div class="dropdown-container">
						<div class="dropdown-content" id="resolution-content">
							${this.resolutionOptions.map(
								(option) => html`
									<div
										class="dropdown-item"
										tabindex="0"
										@click=${(e: Event) => {
											e.stopPropagation();
											this.handleCheckboxSelect("resolution", option.value);
										}}
										@keydown=${(e: KeyboardEvent) => {
											e.stopPropagation();
											if (e.key === "Enter") {
												this.handleCheckboxSelect("resolution", option.value);
											} else if (e.key === "Escape") {
												this.setActiveDropdown("");
											}
										}}
									>
										<div
											class="checkbox ${this.selectedValues.resolution.includes(
												option.value
											)
												? "selected"
												: ""}"
										></div>
										<span>${option.label}</span>
									</div>
								`
							)}
						</div>
					</div>
				</div>

				<div
					id="toolbar-aspect-ratio"
					class="${this.activeDropdown === "aspectRatio" ? "active" : ""}"
					tabindex="0"
					aria-expanded="${this.activeDropdown === "aspectRatio"}"
					aria-controls="aspectRatio-content"
					@mouseenter=${() => this.setActiveDropdown("aspectRatio")}
					@mouseleave=${() => this.handleDropdownMouseLeave("aspectRatio")}
					@keydown=${(e: KeyboardEvent) => {
						if (e.key === "Enter") {
							this.setActiveDropdown("aspectRatio"); // Toggles the dropdown
						} else if (e.key === "Escape") {
							this.setActiveDropdown(""); // Closes any active dropdown
						}
					}}
				>
					<span
						>Aspect
						Ratio${this.selectedValues.aspectRatio.length > 0
							? html`<br /><span class="selections">
										${this.selectedValues.aspectRatio.length === 2
											? "All"
											: this.selectedValues.aspectRatio}
									</span>`
							: ""}</span
					>
					<svg
						data-testid="geist-icon"
						height="16"
						stroke-linejoin="round"
						style="color: currentcolor;"
						viewBox="0 0 16 16"
						width="16"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
							fill="currentColor"
						></path>
					</svg>
					<div class="dropdown-container">
						<div class="dropdown-content" id="aspectRatio-content">
							${this.aspectRatioOptions.map(
								(option) => html` <div
									class="dropdown-item"
									tabindex="0"
									@click=${(e: Event) => {
										e.stopPropagation();
										this.handleCheckboxSelect("aspectRatio", option.value);
									}}
									@keydown=${(e: KeyboardEvent) => {
										e.stopPropagation();
										if (e.key === "Enter") {
											this.handleCheckboxSelect("aspectRatio", option.value);
										} else if (e.key === "Escape") {
											this.setActiveDropdown("");
										}
									}}
								>
									<div
										class="checkbox ${this.selectedValues.aspectRatio.includes(
											option.value
										)
											? "selected"
											: ""}"
									></div>
									<span>${option.label}</span>
								</div>`
							)}
						</div>
					</div>
				</div>

				<div
					id="toolbar-sort"
					class="${this.activeDropdown === "sortBy" ? "active" : ""}"
					tabindex="0"
					aria-expanded="${this.activeDropdown === "sortBy"}"
					aria-controls="sortBy-content"
					@mouseenter=${() => this.setActiveDropdown("sortBy")}
					@mouseleave=${() => this.handleDropdownMouseLeave("sortBy")}
					@keydown=${(e: KeyboardEvent) => {
						e.stopPropagation(); // Keep stopPropagation for sort as it was there before
						if (e.key === "Enter") {
							this.setActiveDropdown("sortBy"); // Toggles the dropdown
						} else if (e.key === "Escape") {
							this.setActiveDropdown(""); // Closes any active dropdown
						}
					}}
				>
					<span
						>Sort<br /><span class="selections" tabindex="-1"
							>${this.sortOptions.find(
								(option) => option.value === this.selectedValues.sortBy
							)?.label || ""}</span
						></span
					>
					<svg
						data-testid="geist-icon"
						height="16"
						stroke-linejoin="round"
						style="color: currentcolor;"
						viewBox="0 0 16 16"
						width="16"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
							fill="currentColor"
						></path>
					</svg>
					<div class="dropdown-container">
						<div class="dropdown-content" id="sortBy-content">
							${this.sortOptions.map(
								(option) => html`
									<div
										class="dropdown-item"
										tabindex="0"
										@click=${(e: Event) => {
											e.stopPropagation();
											this.handleRadioSelect(option.value);
										}}
										@keydown=${(e: KeyboardEvent) => {
											e.stopPropagation();
											if (e.key === "Enter") {
												this.handleRadioSelect(option.value);
											} else if (e.key === "Escape") {
												this.setActiveDropdown("");
											}
										}}
									>
										<div
											class="radio-circle ${this.selectedValues.sortBy ===
											option.value
												? "selected"
												: ""}"
										></div>
										<span>${option.label}</span>
									</div>
								`
							)}
						</div>
					</div>
				</div>

				<div
					id="menu"
					class="${this.activeDropdown === "menu" ? "active" : ""}"
					tabindex="0"
					aria-expanded="${this.activeDropdown === "menu"}"
					aria-controls="menu-content"
					@mouseenter=${() => this.setActiveDropdown("menu")}
					@mouseleave=${() => this.handleDropdownMouseLeave("menu")}
					@keydown=${(e: KeyboardEvent) => {
						e.stopPropagation();
						if (e.key === "Enter") {
							this.setActiveDropdown("menu");
						} else if (e.key === "Escape") {
							this.setActiveDropdown("");
						}
					}}
				>
					<span>Collections</span>
					<span class="svg">
						<svg height="16" stroke-linejoin="round" style="color: currentcolor;" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.25136V4.2487L0.463236 4.05702L7.71324 1.05702L8 0.938354L8.28676 1.05702L15.5368 4.05702L16 4.2487V5.25136L15.5368 5.44304L8.28676 8.44304L8 8.5617L7.71324 8.44304L0.463236 5.44304L0 5.25136ZM0 8.45825V6.83491L0.536764 7.05702L8 10.1453L15.4632 7.05702L16 6.83491V8.45825L8.28676 11.6499L8 11.7686L7.71324 11.6499L0 8.45825ZM0 11.7083V10.0849L0.536764 10.307L8 13.3953L15.4632 10.307L16 10.0849V11.7083L8.28676 14.8999L8 15.0186L7.71324 14.8999L0 11.7083ZM8 6.93835L2.71154 4.75003L8 2.5617L13.2885 4.75003L8 6.93835Z" fill="currentColor"></path></svg>
					</span>
					<div class="dropdown-container">
						<div class="dropdown-content" id="menu-content">
							<div class="dropdown-layout">
								<a href="/" tabindex="-1">
									<div class="dropdown-item menu-browse" tabindex="0">
										<span>Browse</span>
									</div>
								</a>
								<a href="/collection/map-labs" tabindex="-1">
									<div class="dropdown-item menu-maplabs" tabindex="0">
										<span>Map Labs</span>
									</div>
								</a>
								<a href="/collection/lego" tabindex="-1">
									<div class="dropdown-item menu-lego" tabindex="0">
										<span>LEGO</span>
									</div>
								</a>
								<a href="/collection/software" tabindex="-1">
									<div class="dropdown-item menu-software" tabindex="0">
										<span>Software</span>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}
