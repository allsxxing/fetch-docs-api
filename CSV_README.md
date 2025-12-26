# CSV Data Files

This directory contains JSON source files and their corresponding CSV versions.

## Files

### 1. character_assets.json / character_assets.csv
**Purpose:** Stores character asset definitions with attributes and descriptions.

**JSON Structure:**
```json
{
  "assets": {
    "asset_name": {
      "attribute": "category",
      "description": "detailed description"
    }
  }
}
```

**CSV Structure:**
- **Columns:** `asset_name`, `attribute`, `description`
- **Description:** Each row represents a single asset with its category and description.

### 2. core_engine_settings.json / core_engine_settings.csv
**Purpose:** Defines global engine settings and negative constraints.

**JSON Structure:**
```json
{
  "global_logic": {
    "setting_key": value
  },
  "negative_constraints": {
    "constraint_key": "description"
  }
}
```

**CSV Structure:**
- **Columns:** `setting`, `value`
- **Description:** Rows contain both global_logic settings and negative_constraints flattened into a single table.

### 3. prompt_library_v1.json / prompt_library_v1.csv
**Purpose:** Library of scene prompts for content generation.

**JSON Structure:**
```json
{
  "scenes": [
    {
      "id": "scene_id",
      "prompt": "prompt text"
    }
  ]
}
```

**CSV Structure:**
- **Columns:** `id`, `prompt`
- **Description:** Each row represents a scene with its unique ID and prompt text.

## Generating CSV Files

To regenerate CSV files from JSON sources, run:

```bash
node generate_csv.js
```

## Verifying CSV Files

To verify that all CSV files are correctly formatted, run:

```bash
node verify_csv.js
```

This will check:
- Column headers match expected format
- Data row counts
- File existence and readability

## Notes

- CSV files are automatically escaped for special characters (commas, quotes, newlines)
- All text fields are properly quoted when necessary
- Maintain logical structure for readability with clear headers
