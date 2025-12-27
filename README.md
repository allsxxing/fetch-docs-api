# Fetch Docs API

A lightweight Express.js API that fetches and summarizes documentation from any website. This tool is useful for quickly extracting text content from documentation pages.

## Features

- Fetch documentation content from any URL
- Extract and clean text from HTML pages
- CORS-enabled for cross-origin requests
- Returns summarized content (first 3000 characters)
- CSV/JSON data management utilities

## Installation

```bash
npm install
```

## Usage

Start the server:

```bash
node index.js
```

The API will run on `http://localhost:3000`

### API Endpoint

**POST** `/get-guidelines`

Request body:
```json
{
  "platform_name": "Example Platform",
  "doc_url": "https://example.com/docs"
}
```

Response:
```json
{
  "summary": "📘 Example Platform Docs Summary:\n\n[extracted text content...]"
}
```

## CSV Data Files

This project includes JSON data files and utilities to generate CSV versions. See [CSV_README.md](./CSV_README.md) for details.

- `character_assets.json` / `character_assets.csv` - Character asset definitions
- `core_engine_settings.json` / `core_engine_settings.csv` - Global engine settings
- `prompt_library_v1.json` / `prompt_library_v1.csv` - Scene prompt library

### Generate CSV Files

```bash
node generate_csv.js
```

### Verify CSV Files

```bash
node verify_csv.js
```

## Cloning This Repository

### Standard Clone

To clone this repository for development:

```bash
git clone https://github.com/allsxxing/fetch-docs-api.git
cd fetch-docs-api
npm install
```

### Mirror Clone (Complete Copy)

To create a complete mirror copy including all branches and refs:

```bash
git clone --mirror https://github.com/allsxxing/fetch-docs-api.git
```

This creates a bare repository suitable for migrating to another location.

## Creating a Private Copy

If you want to create your own private version of this repository:

### Method 1: Using GitHub's Import Feature (Recommended)

1. Go to https://github.com/new/import
2. Enter the clone URL: `https://github.com/allsxxing/fetch-docs-api.git`
3. Choose a new repository name (e.g., `my-private-fetch-api`)
4. Select **Private** as the repository visibility
5. Click "Begin import"

### Method 2: Manual Migration

1. **Clone the repository as a mirror:**
   ```bash
   git clone --mirror https://github.com/allsxxing/fetch-docs-api.git fetch-docs-api-mirror
   cd fetch-docs-api-mirror
   ```

2. **Create a new private repository on GitHub:**
   - Go to https://github.com/new
   - Enter a repository name (e.g., `my-private-fetch-api`)
   - Select **Private** visibility
   - **Do NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

3. **Push the mirror to your new private repository:**
   ```bash
   git push --mirror https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git
   ```

4. **Clone your new private repository for development:**
   ```bash
   cd ..
   git clone https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git
   cd YOUR_NEW_REPO
   npm install
   ```

### Method 3: Fork and Make Private

Note: GitHub free accounts may have limitations on private forks. If you fork this repository:

1. Fork the repository on GitHub
2. Go to your fork's Settings
3. Scroll to the bottom and click "Change visibility"
4. Select "Make private"

## Dependencies

- **express** (^4.18.2) - Web framework
- **axios** (^1.6.0) - HTTP client for fetching web pages
- **cheerio** (^1.0.0-rc.12) - HTML parsing and manipulation
- **cors** (^2.8.5) - Enable CORS

## Project Structure

```
fetch-docs-api/
├── index.js                    # Main API server
├── generate_csv.js             # CSV generation utility
├── verify_csv.js               # CSV verification utility
├── test_csv_edge_cases.js      # CSV testing utility
├── character_assets.json       # Character data (JSON)
├── character_assets.csv        # Character data (CSV)
├── core_engine_settings.json   # Engine settings (JSON)
├── core_engine_settings.csv    # Engine settings (CSV)
├── prompt_library_v1.json      # Prompt library (JSON)
├── prompt_library_v1.csv       # Prompt library (CSV)
├── CSV_README.md               # CSV files documentation
└── package.json                # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available for use and modification.
