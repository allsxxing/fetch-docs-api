import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to escape CSV fields
function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  const stringField = String(field);
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

// Convert character_assets.json to CSV
function convertCharacterAssets() {
  const jsonPath = path.join(__dirname, 'character_assets.json');
  const csvPath = path.join(__dirname, 'character_assets.csv');
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const rows = [['asset_name', 'attribute', 'description']];
  
  for (const [assetName, assetData] of Object.entries(data.assets)) {
    rows.push([
      escapeCsvField(assetName),
      escapeCsvField(assetData.attribute),
      escapeCsvField(assetData.description)
    ]);
  }
  
  const csvContent = rows.map(row => row.join(',')).join('\n');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✓ Created ${csvPath}`);
}

// Convert core_engine_settings.json to CSV
function convertCoreEngineSettings() {
  const jsonPath = path.join(__dirname, 'core_engine_settings.json');
  const csvPath = path.join(__dirname, 'core_engine_settings.csv');
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const rows = [['setting', 'value']];
  
  // Add global_logic entries
  for (const [key, value] of Object.entries(data.global_logic)) {
    rows.push([
      escapeCsvField(key),
      escapeCsvField(value)
    ]);
  }
  
  // Add negative_constraints entries
  for (const [key, constraint] of Object.entries(data.negative_constraints)) {
    rows.push([
      escapeCsvField(key),
      escapeCsvField(constraint)
    ]);
  }
  
  const csvContent = rows.map(row => row.join(',')).join('\n');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✓ Created ${csvPath}`);
}

// Convert prompt_library_v1.json to CSV
function convertPromptLibrary() {
  const jsonPath = path.join(__dirname, 'prompt_library_v1.json');
  const csvPath = path.join(__dirname, 'prompt_library_v1.csv');
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const rows = [['id', 'prompt']];
  
  for (const scene of data.scenes) {
    rows.push([
      escapeCsvField(scene.id),
      escapeCsvField(scene.prompt)
    ]);
  }
  
  const csvContent = rows.map(row => row.join(',')).join('\n');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✓ Created ${csvPath}`);
}

// Run all conversions
console.log('Converting JSON files to CSV...\n');
convertCharacterAssets();
convertCoreEngineSettings();
convertPromptLibrary();
console.log('\n✓ All CSV files generated successfully!');
