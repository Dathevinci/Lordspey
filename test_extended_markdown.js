const assert = require('assert');
const Markdown = require('./js/markdown.js');

console.log('--- Testing Extended Markdown Suite ---');

// 1. Tables with wiki-link, code span, and escaped pipe
const tableMd = `
| Item | Link | Code | Escaped |
| :--- | :---: | ---: | --- |
| Sword | [[WeaponVault|Excalibur]] | \`a | b\` | A \\| B |
`;
const tableHtml = Markdown.render(tableMd);
assert(tableHtml.includes('<a class="wiki-link" data-wiki="WeaponVault"'), 'Wiki target in table failed');
assert(tableHtml.includes('Excalibur</a>'), 'Wiki alias in table failed');
assert(tableHtml.includes('<code>a | b</code>'), 'Code span in table failed');
assert(tableHtml.includes('A | B'), 'Escaped pipe in table failed');
// Verify it only has 4 columns (not split into more)
const thCount = (tableHtml.match(/<th[\s>]/g) || []).length;
const tdCount = (tableHtml.match(/<td[\s>]/g) || []).length;
assert.strictEqual(thCount, 4, `Expected 4 headers, got ${thCount}`);
assert.strictEqual(tdCount, 4, `Expected 4 data cells, got ${tdCount}`);
console.log('✓ Table parsing with wiki-links, code spans & escaped pipes passed');

// 2. Callouts with nested task lists and foldable syntax
const calloutMd = `
> [!NOTE]+ Chapter Outline
> - [x] Scene 1: Arrival
> - [ ] Scene 2: The Chamber
>
> Continue drafting tomorrow.
`;
const calloutHtml = Markdown.render(calloutMd);
assert(calloutHtml.includes('class="callout callout-note"'), 'Callout note class failed');
assert(calloutHtml.includes('data-folded="false"'), 'Callout fold false failed');
assert(calloutHtml.includes('Chapter Outline</span>'), 'Callout title failed');
assert(calloutHtml.includes('class="task-list"'), 'Callout inner task list failed');
assert(calloutHtml.includes('task-item task-done'), 'Callout inner done task failed');
assert(calloutHtml.includes('Continue drafting tomorrow.</p>'), 'Callout inner paragraph failed');
console.log('✓ Obsidian callouts with foldable syntax & inner task list passed');

// 3. Wiki link extractor ignoring code blocks & spans
const codeBlockMd = `
Real mention: [[The Citadel]].
\`\`\`
const fake = "[[GhostLink]]";
\`\`\`
Inline: \`[[NotALink]]\`
`;
const extracted = Markdown.extractWikiLinks(codeBlockMd);
assert.deepStrictEqual(extracted, ['The Citadel'], `Expected only ['The Citadel'], got ${JSON.stringify(extracted)}`);
console.log('✓ Wiki link extractor ignores code blocks and inline code spans');

// 4. Footnotes with multiple references & unique IDs
const fnMd = `
First mention[^1] and second mention[^1].
And another note[^2].

[^1]: First footnote details
    spanning multiple indented lines.
[^2]: Second footnote details.
`;
const fnHtml = Markdown.render(fnMd);
assert(fnHtml.includes('id="fnref-1"'), 'First fn ref failed');
assert(fnHtml.includes('id="fnref-1-2"'), 'Second fn ref unique ID failed');
assert(fnHtml.includes('id="fn-1"'), 'Footnote definition ID failed');
assert(fnHtml.includes('spanning multiple indented lines'), 'Multiline footnote definition failed');
assert(fnHtml.includes('href="#fnref-1"'), 'Backref 1 failed');
assert(fnHtml.includes('href="#fnref-1-2"'), 'Backref 2 failed');
console.log('✓ Footnotes with unique multi-reference IDs & multiline text passed');

// 5. Scene break vs horizontal rule
const sceneHtml = Markdown.render('* * *\n\n---\n\n*   *   *   *');
assert(sceneHtml.includes('<hr class="scene-break" />'), 'Scene break failed');
assert(sceneHtml.includes('<hr />'), 'Standard horizontal rule failed');
// False positive check
const falseSceneHtml = Markdown.render('* * * not a break');
assert(!falseSceneHtml.includes('<hr class="scene-break" />'), 'False positive scene break rendered as hr');
console.log('✓ Scene break (* * *) detection and precedence passed');

// 6. Strikethrough and Highlighter
const inlineFmt = Markdown.render('~~stricken~~ and ==highlighted==');
assert(inlineFmt.includes('<del>stricken</del>'), 'Strikethrough failed');
assert(inlineFmt.includes('<mark class="md-highlight">highlighted</mark>'), 'Highlighter failed');
console.log('✓ Strikethrough and Highlighter passed');

console.log('ALL EXTENDED MARKDOWN TESTS PASSED!');
