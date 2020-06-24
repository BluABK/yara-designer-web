# YARA-Designer GUI (Web Frontend)

## Dependencies
### Git repository
The following Git repository must be set up and available.
- TheOracle (YARA rules git repository)
### Projects
The following projects must be running and available over network.
- yara-designer-core (backend/API)

### Frameworks
- Node.js (node/npm)

## Setup
1. Copy `dotenv.sample` to `.env` and configure it.
2. Install packages: `$ npm install` (for dependencies see `packages.json`).

## Usage
1. Start the web server: `$ npm start`
2. Open the YARA-Designer web page.

## Optional URL parameters
| Parameter | Description                                               |
|-----------|-----------------------------------------------------------|
| id        | Loads case with the given case ID                         |
| theme     | Use custom theme (currently only supports `light`/`dark`) |
