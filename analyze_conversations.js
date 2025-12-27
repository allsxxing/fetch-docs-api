import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ChatGPT Conversations Analyzer
 * 
 * Analyzes bulk export of ChatGPT conversations.json to extract:
 * - Code style & standards
 * - Project context
 * - Instructional preferences
 * - Workflow triggers
 * 
 * Outputs a structured summary optimized for Gemini's Personal Context (< 2,000 tokens)
 */

class ConversationsAnalyzer {
  constructor(conversationsData) {
    this.conversations = conversationsData;
    this.recentConversations = [];
    this.patterns = {
      codeStyles: {},
      projects: {},
      instructions: [],
      triggers: {}
    };
  }

  /**
   * Get the most recent 20% of conversations
   */
  getRecentConversations() {
    // Sort conversations by update_time or create_time
    const sorted = [...this.conversations].sort((a, b) => {
      const timeA = a.update_time || a.create_time || 0;
      const timeB = b.update_time || b.create_time || 0;
      return timeB - timeA; // Most recent first
    });

    // Get top 20%
    const topPercent = Math.max(1, Math.ceil(sorted.length * 0.2));
    this.recentConversations = sorted.slice(0, topPercent);
    
    console.log(`📊 Analyzing ${this.recentConversations.length} conversations (20% of ${this.conversations.length} total)`);
    return this.recentConversations;
  }

  /**
   * Extract all messages from conversations
   */
  extractMessages() {
    const messages = [];
    
    for (const conv of this.recentConversations) {
      if (!conv.mapping) continue;
      
      for (const [id, node] of Object.entries(conv.mapping)) {
        const message = node.message;
        if (!message || !message.content) continue;
        
        const parts = message.content.parts || [];
        const text = parts.join(' ').trim();
        
        if (text && message.author) {
          messages.push({
            role: message.author.role,
            text: text,
            timestamp: message.create_time,
            conversationId: conv.id,
            conversationTitle: conv.title
          });
        }
      }
    }
    
    return messages;
  }

  /**
   * Analyze code style and standards
   */
  analyzeCodeStyle(messages) {
    const languages = {};
    const namingPatterns = [];
    const architecturalChoices = [];

    for (const msg of messages) {
      const text = msg.text.toLowerCase();
      
      // Detect languages
      const langKeywords = {
        javascript: ['javascript', 'js', 'node.js', 'npm', 'react', 'vue'],
        python: ['python', 'pip', 'django', 'flask', 'pandas'],
        typescript: ['typescript', 'ts', 'tsx'],
        java: ['java', 'spring', 'maven', 'gradle'],
        go: ['golang', 'go '],
        rust: ['rust', 'cargo'],
        cpp: ['c++', 'cpp'],
        csharp: ['c#', 'csharp', '.net', 'dotnet']
      };

      for (const [lang, keywords] of Object.entries(langKeywords)) {
        if (keywords.some(kw => text.includes(kw))) {
          languages[lang] = (languages[lang] || 0) + 1;
        }
      }

      // Detect architectural patterns
      if (text.includes('functional') || text.includes('pure function')) {
        architecturalChoices.push('functional programming');
      }
      if (text.includes('oop') || text.includes('object-oriented')) {
        architecturalChoices.push('object-oriented');
      }
      if (text.includes('microservice')) {
        architecturalChoices.push('microservices');
      }
      if (text.includes('rest') || text.includes('restful')) {
        architecturalChoices.push('REST API');
      }

      // Detect naming conventions
      if (text.includes('camelcase') || text.includes('camel case')) {
        namingPatterns.push('camelCase');
      }
      if (text.includes('snake_case') || text.includes('snake case')) {
        namingPatterns.push('snake_case');
      }
      if (text.includes('kebab-case') || text.includes('kebab case')) {
        namingPatterns.push('kebab-case');
      }
    }

    this.patterns.codeStyles = {
      languages: Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang),
      naming: [...new Set(namingPatterns)],
      architecture: [...new Set(architecturalChoices)]
    };
  }

  /**
   * Map project context
   */
  analyzeProjects(messages) {
    const projects = {};
    const techStacks = {};

    // Common project name patterns (all caps, specific naming)
    const projectNamePattern = /\b([A-Z]{3,}(?:\s+[A-Z]{3,})*)\b/g;

    for (const msg of messages) {
      if (msg.role !== 'user') continue;

      const text = msg.text;
      
      // Find all-caps project names
      const matches = text.match(projectNamePattern);
      if (matches) {
        matches.forEach(match => {
          if (match.length >= 4 && match.length <= 30) { // Reasonable project name length
            projects[match] = (projects[match] || 0) + 1;
          }
        });
      }

      // Detect tech stacks
      const stackKeywords = {
        'Node.js + Express': ['node', 'express'],
        'React': ['react', 'jsx'],
        'Vue.js': ['vue'],
        'Python + Flask': ['python', 'flask'],
        'Python + Django': ['python', 'django'],
        'MongoDB': ['mongodb', 'mongo'],
        'PostgreSQL': ['postgresql', 'postgres'],
        'Docker': ['docker', 'container'],
        'AWS': ['aws', 'amazon web services'],
        'Firebase': ['firebase']
      };

      for (const [stack, keywords] of Object.entries(stackKeywords)) {
        if (keywords.some(kw => text.toLowerCase().includes(kw))) {
          techStacks[stack] = (techStacks[stack] || 0) + 1;
        }
      }
    }

    this.patterns.projects = {
      names: Object.entries(projects)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, mentions: count })),
      techStacks: Object.entries(techStacks)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([stack]) => stack)
    };
  }

  /**
   * Extract instructional preferences (Core Rules)
   */
  analyzeInstructions(messages) {
    const rules = [];
    const keywords = [
      'no fluff', 'tight', 'concise', 'brief',
      'bold', 'edgy', 'direct',
      'always', 'never', 'must', 'should',
      'prefer', 'avoid', 'use'
    ];

    for (const msg of messages) {
      if (msg.role !== 'user') continue;

      const text = msg.text;
      const lower = text.toLowerCase();

      // Find sentences with instruction keywords
      const sentences = text.split(/[.!?]+/);
      for (const sentence of sentences) {
        const lowerSentence = sentence.toLowerCase().trim();
        
        if (keywords.some(kw => lowerSentence.includes(kw))) {
          if (sentence.length > 15 && sentence.length < 150) {
            rules.push(sentence.trim());
          }
        }
      }

      // Look for explicit rules or instructions
      if (lower.includes('rule:') || lower.includes('core rule')) {
        rules.push(text.substring(0, 200));
      }
    }

    // Get unique rules and limit to most relevant
    this.patterns.instructions = [...new Set(rules)].slice(0, 15);
  }

  /**
   * Detect workflow triggers (emojis, keywords)
   */
  analyzeWorkflowTriggers(messages) {
    const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojis = {};
    const hashtags = {};

    for (const msg of messages) {
      if (msg.role !== 'user') continue;

      const text = msg.text;

      // Extract emojis
      const foundEmojis = text.match(emojiPattern);
      if (foundEmojis) {
        foundEmojis.forEach(emoji => {
          emojis[emoji] = (emojis[emoji] || 0) + 1;
        });
      }

      // Extract hashtags
      const hashtagPattern = /#\w+/g;
      const foundHashtags = text.match(hashtagPattern);
      if (foundHashtags) {
        foundHashtags.forEach(tag => {
          hashtags[tag] = (hashtags[tag] || 0) + 1;
        });
      }
    }

    this.patterns.triggers = {
      emojis: Object.entries(emojis)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([emoji, count]) => ({ emoji, count })),
      hashtags: Object.entries(hashtags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }))
    };
  }

  /**
   * Analyze tone and cultural context from messages
   */
  analyzeToneAndCulture(messages) {
    let tone = 'professional';

    const userMessages = messages.filter(m => m.role === 'user');
    
    // Analyze tone
    let casualCount = 0;
    let formalCount = 0;
    
    for (const msg of userMessages) {
      const lower = msg.text.toLowerCase();
      
      // Casual markers
      if (lower.match(/\b(hey|yo|sup|dude|bro|lol|haha)\b/)) casualCount++;
      
      // Formal markers
      if (lower.match(/\b(please|kindly|appreciate|regarding|furthermore)\b/)) formalCount++;
    }

    if (casualCount > formalCount * 2) {
      tone = 'casual/direct';
    } else if (formalCount > casualCount * 2) {
      tone = 'formal/professional';
    } else {
      tone = 'balanced/professional';
    }

    return { tone };
  }

  /**
   * Run full analysis
   */
  analyze() {
    console.log('🔍 Starting analysis...\n');

    this.getRecentConversations();
    const messages = this.extractMessages();
    
    console.log(`💬 Extracted ${messages.length} messages`);

    this.analyzeCodeStyle(messages);
    this.analyzeProjects(messages);
    this.analyzeInstructions(messages);
    this.analyzeWorkflowTriggers(messages);
    const { tone } = this.analyzeToneAndCulture(messages);

    return {
      tone,
      codeStyles: this.patterns.codeStyles,
      projects: this.patterns.projects,
      instructions: this.patterns.instructions,
      triggers: this.patterns.triggers,
      stats: {
        totalConversations: this.conversations.length,
        analyzedConversations: this.recentConversations.length,
        totalMessages: messages.length
      }
    };
  }

  /**
   * Generate Markdown output
   */
  generateMarkdown(analysisResult) {
    const { tone, codeStyles, projects, instructions, triggers, stats } = analysisResult;

    let markdown = `# User DNA Profile\n\n`;
    markdown += `> Generated from ${stats.analyzedConversations} conversations (${stats.totalMessages} messages)\n\n`;

    // Core Identity
    markdown += `## Core Identity\n\n`;
    markdown += `**Tone:** ${tone}\n\n`;
    markdown += `**Communication Style:** Direct, efficiency-focused\n\n`;

    // Technical Blueprint
    markdown += `## Technical Blueprint\n\n`;
    markdown += `### Preferred Languages\n`;
    if (codeStyles.languages.length > 0) {
      codeStyles.languages.forEach(lang => {
        markdown += `- ${lang}\n`;
      });
    } else {
      markdown += `- (No language preferences detected)\n`;
    }
    markdown += `\n`;

    markdown += `### Architectural Patterns\n`;
    if (codeStyles.architecture.length > 0) {
      codeStyles.architecture.forEach(pattern => {
        markdown += `- ${pattern}\n`;
      });
    } else {
      markdown += `- (No clear patterns detected)\n`;
    }
    markdown += `\n`;

    if (codeStyles.naming.length > 0) {
      markdown += `### Naming Conventions\n`;
      codeStyles.naming.forEach(convention => {
        markdown += `- ${convention}\n`;
      });
      markdown += `\n`;
    }

    // Project Catalog
    if (projects.names.length > 0) {
      markdown += `## Project Catalog\n\n`;
      projects.names.forEach(proj => {
        markdown += `- **${proj.name}** (${proj.mentions} mentions)\n`;
      });
      markdown += `\n`;
    }

    if (projects.techStacks.length > 0) {
      markdown += `### Tech Stack\n`;
      projects.techStacks.forEach(stack => {
        markdown += `- ${stack}\n`;
      });
      markdown += `\n`;
    }

    // Personal Heuristics
    if (instructions.length > 0) {
      markdown += `## Personal Heuristics\n\n`;
      markdown += `### Core Rules\n`;
      instructions.slice(0, 10).forEach((rule, i) => {
        markdown += `${i + 1}. ${rule}\n`;
      });
      markdown += `\n`;
    }

    // Workflow Triggers
    if (triggers.emojis.length > 0 || triggers.hashtags.length > 0) {
      markdown += `## Workflow Triggers\n\n`;
      
      if (triggers.emojis.length > 0) {
        markdown += `### Common Emojis\n`;
        triggers.emojis.forEach(({ emoji, count }) => {
          markdown += `- ${emoji} (${count} uses)\n`;
        });
        markdown += `\n`;
      }

      if (triggers.hashtags.length > 0) {
        markdown += `### Hashtags\n`;
        triggers.hashtags.forEach(({ tag, count }) => {
          markdown += `- ${tag} (${count} uses)\n`;
        });
        markdown += `\n`;
      }
    }

    return markdown;
  }

  /**
   * Generate JSON output
   */
  generateJSON(analysisResult) {
    return JSON.stringify(analysisResult, null, 2);
  }

  /**
   * Estimate token count using a more accurate approximation
   * Based on common tokenizer behavior (Gemini, GPT-4, Claude)
   */
  estimateTokens(text) {
    // More accurate approximation based on word and character analysis
    // Average: 1 token ≈ 0.75 words or 1 token ≈ 4 characters
    
    // Split into words (including punctuation as separate tokens)
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    // Count special tokens (markdown headers, code blocks, etc.)
    const specialTokens = (text.match(/#+\s|```|\*\*|__|>\s|\n\n/g) || []).length;
    
    // Estimate: words * 1.3 (accounting for subword tokenization) + special tokens
    const estimate = Math.ceil(words.length * 1.3) + specialTokens;
    
    return estimate;
  }
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node analyze_conversations.js <path-to-conversations.json> [--format=markdown|json]');
    console.log('\nExample:');
    console.log('  node analyze_conversations.js ./conversations.json');
    console.log('  node analyze_conversations.js ./conversations.json --format=json');
    process.exit(1);
  }

  const inputPath = args[0];
  const formatArg = args.find(arg => arg.startsWith('--format='));
  const format = formatArg ? formatArg.split('=')[1] : 'markdown';

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  console.log(`📂 Loading conversations from: ${inputPath}\n`);

  try {
    const fileContent = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Handle both array and object with conversations array
    const conversations = Array.isArray(data) ? data : (data.conversations || []);
    
    if (conversations.length === 0) {
      console.error('❌ Error: No conversations found in file');
      process.exit(1);
    }

    const analyzer = new ConversationsAnalyzer(conversations);
    const result = analyzer.analyze();

    console.log('\n✅ Analysis complete!\n');

    let output;
    if (format === 'json') {
      output = analyzer.generateJSON(result);
    } else {
      output = analyzer.generateMarkdown(result);
    }

    // Write output file
    const outputExt = format === 'json' ? 'json' : 'md';
    const outputPath = path.join(__dirname, `user_dna_profile.${outputExt}`);
    fs.writeFileSync(outputPath, output, 'utf8');

    const tokenCount = analyzer.estimateTokens(output);
    console.log(`📄 Output written to: ${outputPath}`);
    console.log(`📊 Estimated tokens: ${tokenCount} / 2000`);
    
    if (tokenCount > 2000) {
      console.log(`⚠️  Warning: Output exceeds 2000 token limit. Consider filtering more data.`);
    } else {
      console.log(`✅ Output is within token limit!`);
    }

    console.log('\n' + output);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ConversationsAnalyzer };
