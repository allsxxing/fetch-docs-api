import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verifyCSV(filename, expectedColumns, expectedRowCount) {
  console.log(`\nVerifying ${filename}...`);
  const csvPath = path.join(__dirname, filename);
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${filename}`);
    return false;
  }
  
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  
  // Check headers
  const headers = lines[0].split(',');
  console.log(`  Headers: ${headers.join(', ')}`);
  
  if (headers.length !== expectedColumns.length) {
    console.error(`  ❌ Expected ${expectedColumns.length} columns, found ${headers.length}`);
    return false;
  }
  
  for (let i = 0; i < expectedColumns.length; i++) {
    if (headers[i] !== expectedColumns[i]) {
      console.error(`  ❌ Expected column "${expectedColumns[i]}", found "${headers[i]}"`);
      return false;
    }
  }
  
  // Check row count
  const dataRows = lines.length - 1; // Exclude header
  console.log(`  Data rows: ${dataRows}`);
  
  if (expectedRowCount !== null && dataRows !== expectedRowCount) {
    console.error(`  ❌ Expected ${expectedRowCount} rows, found ${dataRows}`);
    return false;
  }
  
  console.log(`  ✓ ${filename} is valid`);
  return true;
}

console.log('=== CSV File Verification ===');

let allValid = true;

// Verify character_assets.csv
allValid = allValid && verifyCSV('character_assets.csv', ['asset_name', 'attribute', 'description'], 5);

// Verify core_engine_settings.csv
allValid = allValid && verifyCSV('core_engine_settings.csv', ['setting', 'value'], 11);

// Verify prompt_library_v1.csv
allValid = allValid && verifyCSV('prompt_library_v1.csv', ['id', 'prompt'], 5);

console.log('\n=================================');
if (allValid) {
  console.log('✓ All CSV files are valid!');
} else {
  console.error('❌ Some CSV files have errors');
  process.exit(1);
}
