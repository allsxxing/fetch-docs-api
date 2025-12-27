import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConversationsAnalyzer } from './analyze_conversations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Testing Conversations Analyzer ===\n');

// Test 1: Load sample data
console.log('Test 1: Loading sample conversations...');
const samplePath = path.join(__dirname, 'sample_conversations.json');
if (!fs.existsSync(samplePath)) {
  console.error('❌ Sample file not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
console.log(`✓ Loaded ${data.length} sample conversations\n`);

// Test 2: Create analyzer and run analysis
console.log('Test 2: Running analysis...');
const analyzer = new ConversationsAnalyzer(data);
const result = analyzer.analyze();
console.log('✓ Analysis completed\n');

// Test 3: Verify analysis results
console.log('Test 3: Verifying analysis results...');
let testsPass = true;

if (!result.codeStyles) {
  console.error('❌ Missing codeStyles in result');
  testsPass = false;
} else {
  console.log('✓ Code styles analyzed');
}

if (!result.projects) {
  console.error('❌ Missing projects in result');
  testsPass = false;
} else {
  console.log('✓ Projects mapped');
}

if (!result.instructions) {
  console.error('❌ Missing instructions in result');
  testsPass = false;
} else {
  console.log('✓ Instructions extracted');
}

if (!result.triggers) {
  console.error('❌ Missing triggers in result');
  testsPass = false;
} else {
  console.log('✓ Workflow triggers detected');
}

// Test 4: Generate markdown output
console.log('\nTest 4: Generating Markdown output...');
const markdown = analyzer.generateMarkdown(result);
if (markdown.includes('# User DNA Profile')) {
  console.log('✓ Markdown generated with proper header');
} else {
  console.error('❌ Markdown missing header');
  testsPass = false;
}

if (markdown.includes('## Core Identity')) {
  console.log('✓ Core Identity section present');
} else {
  console.error('❌ Missing Core Identity section');
  testsPass = false;
}

if (markdown.includes('## Technical Blueprint')) {
  console.log('✓ Technical Blueprint section present');
} else {
  console.error('❌ Missing Technical Blueprint section');
  testsPass = false;
}

// Test 5: Generate JSON output
console.log('\nTest 5: Generating JSON output...');
const jsonOutput = analyzer.generateJSON(result);
try {
  const parsed = JSON.parse(jsonOutput);
  console.log('✓ Valid JSON generated');
  if (parsed.codeStyles && parsed.projects && parsed.instructions && parsed.triggers) {
    console.log('✓ All required sections in JSON');
  } else {
    console.error('❌ Missing sections in JSON');
    testsPass = false;
  }
} catch (e) {
  console.error('❌ Invalid JSON generated');
  testsPass = false;
}

// Test 6: Token estimation
console.log('\nTest 6: Token estimation...');
const tokenCount = analyzer.estimateTokens(markdown);
console.log(`  Estimated tokens: ${tokenCount}`);
if (tokenCount > 0) {
  console.log('✓ Token estimation working');
} else {
  console.error('❌ Token estimation failed');
  testsPass = false;
}

// Test 7: Check for expected patterns in sample data
console.log('\nTest 7: Verifying pattern detection...');
const mdLower = markdown.toLowerCase();

if (mdLower.includes('walemania') || mdLower.includes('wilde west')) {
  console.log('✓ Project names detected');
} else {
  console.error('⚠️  Warning: Expected project names not found (may be filtered)');
}

if (mdLower.includes('node') || mdLower.includes('python') || mdLower.includes('typescript')) {
  console.log('✓ Languages detected');
} else {
  console.error('⚠️  Warning: Expected languages not found');
}

// Test 8: Write test output files
console.log('\nTest 8: Writing test output files...');
try {
  fs.writeFileSync(
    path.join(__dirname, 'test_output.md'),
    markdown,
    'utf8'
  );
  console.log('✓ Markdown test output written to test_output.md');

  fs.writeFileSync(
    path.join(__dirname, 'test_output.json'),
    jsonOutput,
    'utf8'
  );
  console.log('✓ JSON test output written to test_output.json');
} catch (e) {
  console.error(`❌ Failed to write test outputs: ${e.message}`);
  testsPass = false;
}

// Summary
console.log('\n=================================');
if (testsPass) {
  console.log('✅ All tests passed!');
  console.log('\nSample Markdown Output:');
  console.log('------------------------');
  console.log(markdown);
} else {
  console.error('❌ Some tests failed');
  process.exit(1);
}
