# Vault

Vault is a web application built using LitElement and Bun, designed to display a grid of assets with metadata. The project includes custom components for navigation and grid display, and leverages modern web technologies for a seamless user experience.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Build Process](#build-process)
- [Deployment](#deployment)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with Vault, clone the repository and install the dependencies:

```sh
git clone https://github.com/yourusername/vault.git
cd vault
bun install
```

## Usage

To run the application locally, use the following command:

```sh
bun run dev
```

This will start a development server at `http://localhost:25420`.

## Development

### File Structure

- `src/`: Contains the source code for the application.
  - `components/`: Custom LitElement components.
    - `grid.ts`: Grid component to display assets.
    - `navigation.ts`: Navigation component.
  - `stylesheets/`: Global CSS styles.
  - `data/`: Metadata for assets.
  - `index.ts`: Main entry point for the application.
- `build.js`: Script to process assets and inject them into the grid component.
- `index.html`: HTML template for the application.
- `tsconfig.json`: TypeScript configuration.
- `package.json`: Project configuration and dependencies.

### Scripts

- `bun run build`: Processes assets and builds the project.
- `bun run dev`: Runs the development server.
- `bun run dev-w`: Runs the development server with file watching.

## Build Process

The build process involves processing assets and injecting them into the grid component. This is handled by the `build.js` script, which reads metadata from `src/data/metadata.json` and updates `src/components/grid.ts` accordingly.

To build the project, run:

```sh
bun run build
```

## Deployment

The project is configured to deploy to GitHub Pages using GitHub Actions. The deployment workflow is defined in `.github/workflows/deploy.yml`.

To deploy the project, push changes to the `main` branch:

```sh
git push origin main
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
