const Markdown = require('./js/markdown.js');
const assert = require('assert');

console.log('--- Running Inkwell Markdown & Wiki-Link Test Suite ---');

// 1. Test basic markdown
const h = Markdown.render('# Header 1\n## Header 2');
assert(h.includes('<h1>Header 1</h1>') && h.includes('<h2>Header 2</h2>'), 'Headers failed');
console.log('✓ Headings pass');

// 2. Test bold, italic, strikethrough
const formatting = Markdown.render('**bold** and *italic* and ~~deleted~~ and snake_case_identifier');
assert(formatting.includes('<strong>bold</strong>'), 'Bold failed');
assert(formatting.includes('<em>italic</em>'), 'Italic failed');
assert(formatting.includes('<del>deleted</del>'), 'Strikethrough failed');
assert(formatting.includes('snake_case_identifier') && !formatting.includes('<em>case</em>'), 'Snake_case wrongly italicized');
console.log('✓ Bold, Italic & snake_case protection pass');

// 3. Test inline code isolation
const codeTest = Markdown.render('`**not bold**` and `*not italic*`');
assert(codeTest.includes('<code>**not bold**</code>'), 'Code isolation failed for bold');
assert(codeTest.includes('<code>*not italic*</code>'), 'Code isolation failed for italic');
console.log('✓ Code isolation pass');

// 4. Test Wiki-links
const wikiTest = Markdown.render('Explore [[The Order of the Ashen Quill]] or [[Aethelgard|The Citadel]].');
assert(wikiTest.includes('data-wiki="The Order of the Ashen Quill"'), 'Wiki target failed');
assert(wikiTest.includes('The Order of the Ashen Quill</a>'), 'Wiki display without alias failed');
assert(wikiTest.includes('data-wiki="Aethelgard"'), 'Wiki alias target failed');
assert(wikiTest.includes('The Citadel</a>'), 'Wiki alias display failed');
console.log('✓ Obsidian Wiki-links pass');

// 5. Test Wiki-link extractor
const links = Markdown.extractWikiLinks('Mentions [[Order of the Ashen Quill]], [[Aethelgard|Capital]], and [[Order of the Ashen Quill]].');
assert.deepStrictEqual(links, ['Order of the Ashen Quill', 'Aethelgard'], 'Extractor failed');
console.log('✓ Wiki-link extraction pass');

// 6. Test Task lists
const taskTest = Markdown.render('- [ ] Pending item\n- [x] Done item');
assert(taskTest.includes('class="task-list"'), 'Task list container failed');
assert(taskTest.includes('task-item task-done'), 'Task done failed');
assert(taskTest.includes('Pending item'), 'Task pending text failed');
console.log('✓ Obsidian Task Lists pass');

// 7. XSS prevention
const xss = Markdown.render('<script>alert("xss")</script>');
assert(!xss.includes('<script>'), 'XSS prevention failed');
console.log('✓ XSS prevention pass');

console.log('ALL 7 TEST SUITES PASSED SUCCESSFULLY!');
