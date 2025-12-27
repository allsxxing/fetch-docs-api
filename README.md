# fetch-docs-api

A collection of utilities for documentation and conversation analysis.

## Projects

### 1. Fetch Docs API
An Express.js API for fetching and summarizing platform documentation.

**Files:** `index.js`

**Usage:**
```bash
node index.js
```

**Endpoints:**
- `POST /get-guidelines` - Fetches and summarizes documentation from a URL

### 2. CSV Data Utilities
Tools for converting JSON data to CSV format.

**Files:** `generate_csv.js`, `verify_csv.js`, `test_csv_edge_cases.js`

**Documentation:** See [CSV_README.md](./CSV_README.md)

**Usage:**
```bash
# Generate CSV files from JSON
node generate_csv.js

# Verify CSV files
node verify_csv.js

# Test edge cases
node test_csv_edge_cases.js
```

### 3. ChatGPT Conversations Analyzer ⭐ NEW
A powerful tool for analyzing ChatGPT conversation exports to extract user patterns and preferences into a structured "User DNA" profile. Optimized for use with Gemini's Personal Context window.

**Files:** `analyze_conversations.js`, `test_analyzer.js`, `sample_conversations.json`

**Documentation:** See [ANALYZER_README.md](./ANALYZER_README.md)

**Quick Start:**
```bash
# Analyze your ChatGPT conversations
node analyze_conversations.js path/to/conversations.json

# Output as JSON
node analyze_conversations.js path/to/conversations.json --format=json

# Run tests
node test_analyzer.js
```

**Features:**
- 📊 Analyzes code styles, project context, and workflow patterns
- 🎯 Extracts instructional preferences and "Core Rules"
- 🚀 Identifies workflow triggers (emojis, hashtags)
- 📝 Generates Markdown or JSON output
- 🎚️ Token-optimized (< 2,000 tokens) for LLM context windows
- ✅ Comprehensive test suite

## Installation

```bash
npm install
```

## Requirements

- Node.js v14+ (ES modules support)
- npm

## Project Structure

```
fetch-docs-api/
├── index.js                      # Main API server
├── generate_csv.js               # CSV generation utility
├── verify_csv.js                 # CSV verification utility
├── test_csv_edge_cases.js        # CSV edge case tests
├── analyze_conversations.js      # Conversations analyzer ⭐
├── test_analyzer.js              # Analyzer test suite ⭐
├── sample_conversations.json     # Sample data for testing ⭐
├── character_assets.json         # Sample game assets data
├── core_engine_settings.json     # Sample engine settings
├── prompt_library_v1.json        # Sample prompt library
├── CSV_README.md                 # CSV utilities documentation
├── ANALYZER_README.md            # Analyzer documentation ⭐
└── package.json                  # Project configuration
```

## Contributing

Contributions are welcome! Please ensure:
- All tests pass
- Code follows ES module standards
- New features include tests and documentation

## License

MIT
