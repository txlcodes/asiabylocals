const fs = require('fs');

const content = fs.readFileSync('TourCreationForm.tsx', 'utf8');

const missingIdOrName = [];
const missingHtmlFor = [];

// Helper to get line number from character index
function getLineNumber(index) {
  return content.substring(0, index).split('\n').length;
}

// Find inputs, selects, textareas that span multiple lines
const inputRegex = /<(input|select|textarea)\b([\s\S]*?)>/g;
let match;
while ((match = inputRegex.exec(content)) !== null) {
  const tag = match[1];
  const attrs = match[2];
  if (!attrs.includes('id=') && !attrs.includes('name=')) {
    missingIdOrName.push({
      line: getLineNumber(match.index),
      tag: tag
    });
  }
}

// Find labels
const labelRegex = /<label\b([\s\S]*?)>/g;
while ((match = labelRegex.exec(content)) !== null) {
  const attrs = match[1];
  if (!attrs.includes('htmlFor=')) {
    // Check if the label wraps an input. We can do a simple check:
    // Find the closing </label>
    const endIndex = content.indexOf('</label>', match.index);
    if (endIndex !== -1) {
      const labelContent = content.substring(match.index, endIndex);
      if (!labelContent.includes('<input') && !labelContent.includes('<select') && !labelContent.includes('<textarea')) {
        missingHtmlFor.push({
          line: getLineNumber(match.index),
          content: labelContent.split('\n')[0].trim()
        });
      }
    }
  }
}

console.log('--- Missing ID or Name ---');
missingIdOrName.forEach(item => console.log(`Line ${item.line}: <${item.tag}>`));

console.log('\n--- Missing htmlFor ---');
missingHtmlFor.forEach(item => console.log(`Line ${item.line}: ${item.content}`));
