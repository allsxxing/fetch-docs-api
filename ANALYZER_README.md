# ChatGPT Conversations Analyzer

A tool for analyzing bulk exports of ChatGPT `conversations.json` files to extract a high-fidelity "User DNA" profile. The output is optimized for use in Gemini's Personal Context window or other LLM context settings.

## Features

- **Code Style & Standards Detection**: Identifies recurring patterns in preferred languages, naming conventions, and architectural choices (e.g., functional vs. OOP)
- **Project Context Mapping**: Maps out recurring project names, their tech stacks, and core logic
- **Instructional Preferences Extraction**: Extracts specific "Core Rules" and workflow preferences
- **Workflow Triggers Detection**: Identifies emojis and hashtags used as shorthand for complex tasks

## Output Format

The analyzer generates a clean, hierarchical summary with the following sections:

- **Core Identity**: Role, tone, and cultural context
- **Technical Blueprint**: Preferred tech stacks, formatting protocols, and CLI/API preferences
- **Project Catalog**: Summary of active projects and their status
- **Personal Heuristics**: The "Always/Never" rules of your workflow
- **Workflow Triggers**: Common emojis and hashtags used

## Installation

```bash
npm install
```

No additional dependencies required beyond Node.js (ES modules).

## Usage

### Basic Usage

```bash
node analyze_conversations.js <path-to-conversations.json>
```

This will:
1. Load your ChatGPT conversations export
2. Analyze the most recent 20% of conversations (highest relevance)
3. Generate a Markdown summary
4. Save the output to `user_dna_profile.md`
5. Estimate token count (target: < 2,000 tokens)

### Output Formats

**Markdown (default):**
```bash
node analyze_conversations.js ./conversations.json
```

**JSON:**
```bash
node analyze_conversations.js ./conversations.json --format=json
```

## Getting Your ChatGPT Data

1. Go to ChatGPT Settings → Data Controls
2. Click "Export Data"
3. Wait for the email with your export
4. Download and extract the ZIP file
5. Look for `conversations.json` in the extracted folder

## Example Output

```markdown
# User DNA Profile

> Generated from 42 conversations (327 messages)

## Core Identity

**Tone:** casual/direct

**Communication Style:** Direct, efficiency-focused

## Technical Blueprint

### Preferred Languages
- javascript
- python
- typescript

### Architectural Patterns
- functional programming
- REST API
- microservices

### Naming Conventions
- camelCase
- snake_case

## Project Catalog

- **WALEMANIA** (15 mentions)
- **WILDE WEST** (8 mentions)

### Tech Stack
- Node.js + Express
- Python + Flask
- MongoDB
- AWS
- Docker

## Personal Heuristics

### Core Rules
1. No fluff - keep responses tight and concise
2. Always use camelCase for JavaScript variables
3. Prefer functional programming over OOP
4. Never use 'any' type in TypeScript

## Workflow Triggers

### Common Emojis
- 🤫 (12 uses)
- 🚀 (8 uses)

### Hashtags
- #prompt (15 uses)
- #deploy (7 uses)
```

## Token Optimization

The analyzer is designed to keep output under 2,000 tokens to fit comfortably in Gemini's Personal Context window:

- Prioritizes the most recent 20% of conversations
- Excludes redundant conversation fluff
- Limits each section to the most relevant items
- Provides token count estimation after generation

If the output exceeds 2,000 tokens, consider:
- Using a smaller subset of conversations
- Filtering by conversation titles or dates
- Adjusting the percentage of recent conversations

## Testing

Run the test suite with sample data:

```bash
node test_analyzer.js
```

This will:
- Test the analyzer with sample conversations
- Verify all analysis functions work correctly
- Generate test outputs (test_output.md and test_output.json)
- Validate the output format

## Technical Details

### Analysis Process

1. **Data Loading**: Loads and validates conversations.json
2. **Recent Selection**: Sorts by update_time and selects top 20%
3. **Message Extraction**: Parses conversation mappings to extract messages
4. **Pattern Analysis**:
   - Language detection via keywords
   - Project name extraction (all-caps patterns)
   - Instruction parsing (keyword-based)
   - Emoji and hashtag extraction
5. **Output Generation**: Formats results as Markdown or JSON

### Supported Features

- ✅ Multiple language detection (JavaScript, Python, TypeScript, Java, Go, Rust, C++, C#)
- ✅ Tech stack identification (Node.js, React, Flask, Django, MongoDB, PostgreSQL, AWS, etc.)
- ✅ Architectural pattern recognition (functional, OOP, microservices, REST API)
- ✅ Naming convention detection (camelCase, snake_case, kebab-case)
- ✅ Tone analysis (casual, formal, balanced)
- ✅ Project name extraction (all-caps patterns)
- ✅ Emoji and hashtag tracking
- ✅ Rule and instruction extraction

## Sample Data

A sample `sample_conversations.json` file is included for testing. It demonstrates the expected input format and includes examples of:
- Project mentions (WALEMANIA, WILDE WEST)
- Multiple tech stacks
- Core rules and preferences
- Emojis and hashtags
- Various programming languages

## Constraints & Design Decisions

- **20% Recent Data**: Focuses on the most recent conversations for relevance
- **Token Limit**: Designed to stay under 2,000 tokens for LLM context windows
- **No Redundancy**: Filters out conversational fluff and duplicates
- **Hierarchical Structure**: Organizes information for easy scanning and reference
- **Language Agnostic**: Works with conversations in any language (keyword matching is English-focused)

## Integration with Gemini

To use the generated profile with Gemini:

1. Generate your profile: `node analyze_conversations.js conversations.json`
2. Open Gemini and go to Personal Context settings
3. Copy the contents of `user_dna_profile.md`
4. Paste into Gemini's context window
5. Save and test with a query to see if Gemini understands your preferences

## Troubleshooting

**Error: No conversations found**
- Ensure your JSON file contains an array of conversations or has a `conversations` key
- Check that the file is valid JSON

**Error: File not found**
- Verify the path to your conversations.json file
- Use absolute paths if relative paths don't work

**Output exceeds 2,000 tokens**
- Reduce the percentage of conversations analyzed (modify code)
- Filter conversations by date or title
- Remove less relevant sections from output

**Missing expected patterns**
- Ensure your conversations contain relevant keywords
- Check that messages are being extracted correctly
- The analyzer prioritizes recent conversations - older patterns may be excluded

## Contributing

This tool is part of the `fetch-docs-api` repository. Contributions are welcome!

## License

Same as the parent repository.
