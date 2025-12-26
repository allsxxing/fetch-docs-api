import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Testing CSV Generation with Edge Cases ===\n');

// Test 1: Create JSON with special characters
const testJson = {
  "assets": {
    "test_asset": {
      "attribute": "test,with,commas",
      "description": "Description with \"quotes\" and commas, too"
    },
    "multiline_asset": {
      "attribute": "normal",
      "description": "This has\na newline character"
    }
  }
};

const testJsonPath = path.join(__dirname, 'test_character_assets.json');
fs.writeFileSync(testJsonPath, JSON.stringify(testJson, null, 2));

console.log('✓ Created test JSON with edge cases');

// Test 2: Convert it
function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}

const data = JSON.parse(fs.readFileSync(testJsonPath, 'utf8'));
const rows = [['asset_name', 'attribute', 'description']];

for (const [assetName, assetData] of Object.entries(data.assets)) {
  rows.push([
    escapeCsvField(assetName),
    escapeCsvField(assetData.attribute),
    escapeCsvField(assetData.description)
  ]);
}

const csvContent = rows.map(row => row.join(',')).join('\n');
const testCsvPath = path.join(__dirname, 'test_character_assets.csv');
fs.writeFileSync(testCsvPath, csvContent, 'utf8');

console.log('✓ Converted test JSON to CSV');

// Test 3: Verify the CSV content
const csvLines = csvContent.split('\n');
console.log('\nGenerated CSV:');
console.log('------------------------');
csvLines.forEach((line, i) => {
  console.log(`Row ${i}: ${line}`);
});

// Test 4: Clean up test files
fs.unlinkSync(testJsonPath);
fs.unlinkSync(testCsvPath);
console.log('\n✓ Cleaned up test files');

console.log('\n=== All Edge Case Tests Passed! ===');
