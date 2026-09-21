/* ═══════════════════════════════════════════════
   Lightweight Markdown → HTML renderer
   Supports: Obsidian wiki-links [[Target|Alias]],
   task lists (- [ ] / - [x]), headings, bold, italic,
   strikethrough (~~text~~), highlighter (==text==),
   callouts (> [!NOTE]), footnotes ([^1]), scene break (* * *),
   tables, code blocks, inline code, links, images, blockquotes,
   horizontal rules, paragraphs
   ═══════════════════════════════════════════════ */

const Markdown = (() => {

  function getCalloutIcon(type) {
    switch (type.toLowerCase()) {
      case 'note': return '✦';
      case 'tip':
      case 'hint': return '💡';
      case 'warning':
      case 'caution': return '⚠';
      case 'important': return '★';
      case 'danger':
      case 'error': return '✕';
      case 'info': return 'ℹ';
      case 'todo': return '☑';
      case 'quote': return '❝';
      case 'bug': return '🐞';
      case 'example': return '📋';
      case 'question':
      case 'help':
      case 'faq': return '❓';
      case 'success':
      case 'check':
      case 'done': return '✔';
      case 'summary':
      case 'abstract':
      case 'tldr': return '📑';
      default: return '✦';
    }
  }

  function render(src, isInner = false, sharedFootnotes = null) {
    if (!src) return '';

    // Normalize line endings
    const lines = src.replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let inCodeBlock = false;
    let codeLines = [];
    let inList = false;
    let listType = '';
    let listItems = [];
    const footnotes = sharedFootnotes || [];
    const fnRefCounts = new Map();

    function flushList() {
      if (!inList) return;
      const tag = listType === 'ol' ? 'ol' : 'ul';
      const hasTasks = listItems.some(item => item.isTask);
      const listClass = hasTasks ? ' class="task-list"' : '';
      
      const itemsHtml = listItems.map(item => {
        if (item.isTask) {
          const checkedClass = item.checked ? ' task-done' : '';
          const checkedAttr = item.checked ? ' checked' : '';
          return `<li class="task-item${checkedClass}"><input type="checkbox" class="task-checkbox"${checkedAttr} disabled /> <span>${inline(item.text, fnRefCounts)}</span></li>`;
        }
        return `<li>${inline(item.text, fnRefCounts)}</li>`;
      }).join('\n');

      out.push(`<${tag}${listClass}>\n${itemsHtml}\n</${tag}>`);
      inList = false;
      listItems = [];
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Fenced code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          out.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
          codeLines = [];
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        continue;
      }
      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Blank line
      if (line.trim() === '') {
        flushList();
        continue;
      }

      // Footnote definition [^1]: Note text (supports indented multiline continuation)
      const fnDefMatch = line.match(/^\[\^([^\]]+)\]:\s*(.*)$/);
      if (fnDefMatch) {
        flushList();
        const fnId = fnDefMatch[1].trim();
        let fnText = fnDefMatch[2] || '';
        while (i + 1 < lines.length && /^(?: {2,}|\t)(.*)$/.test(lines[i + 1])) {
          i++;
          fnText += ' ' + lines[i].trim();
        }
        footnotes.push({ id: fnId, text: fnText });
        continue;
      }

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushList();
        const level = headingMatch[1].length;
        out.push(`<h${level}>${inline(headingMatch[2], fnRefCounts)}</h${level}>`);
        continue;
      }

      // Horizontal rule & Scene separator (* * * or --- or *** or ___ )
      if (/^(-{3,}|_{3,}|\*{3,}|(?:\*\s*){3,})$/.test(line.trim())) {
        flushList();
        const isScene = /^(?:\*\s*){3,}$/.test(line.trim()) && /\s/.test(line.trim());
        out.push(isScene ? '<hr class="scene-break" />' : '<hr />');
        continue;
      }

      // Markdown Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|') && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (/^\|(\s*:?-+:?\s*\|)+$/.test(nextLine)) {
          flushList();
          const tableHeaderCells = splitTableRow(line);
          const delimiterCells = splitTableRow(nextLine);
          const alignments = delimiterCells.map(c => {
            const trimmed = c.trim();
            const leftColon = trimmed.startsWith(':');
            const rightColon = trimmed.endsWith(':');
            if (leftColon && rightColon) return 'center';
            if (rightColon) return 'right';
            return 'left';
          });

          const colCount = tableHeaderCells.length;
          const theadRows = `<tr>\n${tableHeaderCells.map((c, ci) => `  <th style="text-align: ${alignments[ci] || 'left'}">${inline(c.trim(), fnRefCounts)}</th>`).join('\n')}\n</tr>`;
          
          i += 2; // skip header and delimiter
          const tbodyRows = [];
          while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
            const rowCells = splitTableRow(lines[i]);
            const padded = [];
            for (let c = 0; c < colCount; c++) {
              padded.push(rowCells[c] !== undefined ? rowCells[c] : '');
            }
            const rowHtml = `<tr>\n${padded.map((c, ci) => `  <td style="text-align: ${alignments[ci] || 'left'}">${inline(c.trim(), fnRefCounts)}</td>`).join('\n')}\n</tr>`;
            tbodyRows.push(rowHtml);
            i++;
          }
          i--; // compensate for increment

          out.push(`<div class="table-container"><table class="md-table"><thead>\n${theadRows}\n</thead><tbody>\n${tbodyRows.join('\n')}\n</tbody></table></div>`);
          continue;
        }
      }

      // Blockquotes & Obsidian Callouts
      if (line.trim().startsWith('>')) {
        flushList();
        const bqLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          bqLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        i--; // compensate for loop

        const firstLine = bqLines[0] || '';
        const calloutMatch = firstLine.match(/^\[!([a-zA-Z]+)\]([+-])?(?:\s*(.*))?$/);

        if (calloutMatch) {
          const type = calloutMatch[1].toLowerCase();
          const fold = calloutMatch[2]; // '+' or '-'
          const title = calloutMatch[3] ? calloutMatch[3].trim() : (type.charAt(0).toUpperCase() + type.slice(1));
          const icon = getCalloutIcon(type);
          const bodyLines = bqLines.slice(1);
          const bodyText = bodyLines.join('\n').trim();
          const bodyHtml = bodyText ? render(bodyText, true, footnotes) : '';
          const foldAttr = fold === '-' ? ' data-folded="true"' : (fold === '+' ? ' data-folded="false"' : '');
          out.push(`<blockquote class="callout callout-${type}"${foldAttr}><div class="callout-header"><span class="callout-icon">${icon}</span> <span class="callout-title">${inline(title, fnRefCounts)}</span></div>${bodyHtml ? `<div class="callout-body">${bodyHtml}</div>` : ''}</blockquote>`);
        } else {
          const bqText = bqLines.join('\n').trim();
          const bqHtml = bqText ? render(bqText, true, footnotes) : '<p></p>';
          out.push(`<blockquote>${bqHtml}</blockquote>`);
        }
        continue;
      }

      // Unordered list & Task list
      const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          flushList();
          inList = true;
          listType = 'ul';
        }
        const text = ulMatch[1];
        const taskMatch = text.match(/^\[([ xX])\]\s*(.*)$/);
        if (taskMatch) {
          const checked = taskMatch[1].toLowerCase() === 'x';
          listItems.push({ isTask: true, checked, text: taskMatch[2] });
        } else {
          listItems.push({ isTask: false, text });
        }
        continue;
      }

      // Ordered list
      const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
      if (olMatch) {
        if (!inList || listType !== 'ol') {
          flushList();
          inList = true;
          listType = 'ol';
        }
        listItems.push({ isTask: false, text: olMatch[1] });
        continue;
      }

      // Paragraph
      flushList();
      out.push(`<p>${inline(line, fnRefCounts)}</p>`);
    }

    // Close any open blocks
    if (inCodeBlock) {
      out.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    }
    flushList();

    // Append Footnotes if any (top-level only)
    if (footnotes.length > 0 && !isInner) {
      const fnItems = footnotes.map(fn => {
        const cleanId = escapeAttr(fn.id);
        const refCount = fnRefCounts.get(cleanId) || 1;
        let backrefs = `<a href="#fnref-${cleanId}" class="footnote-backref" title="Jump back">↩</a>`;
        if (refCount > 1) {
          const extraRefs = [];
          for (let r = 2; r <= refCount; r++) {
            extraRefs.push(`<a href="#fnref-${cleanId}-${r}" class="footnote-backref" title="Jump to reference ${r}">↩${r}</a>`);
          }
          backrefs = `<a href="#fnref-${cleanId}" class="footnote-backref" title="Jump to reference 1">↩1</a> ` + extraRefs.join(' ');
        }
        return `
        <li id="fn-${cleanId}">
          <span>${inline(fn.text, fnRefCounts)}</span> ${backrefs}
        </li>`;
      }).join('\n');
      out.push(`<div class="footnotes-section"><hr class="footnotes-sep" /><ol class="footnotes-list">\n${fnItems}\n</ol></div>`);
    }

    return out.join('\n');
  }

  // Parse table cells while protecting escaped pipes, inline code spans, and wiki-links
  function splitTableRow(rowStr) {
    const trimmed = rowStr.trim().replace(/^\|/, '').replace(/\|$/, '');
    const cells = [];
    let current = '';
    let inBacktick = false;
    let inWiki = false;

    for (let j = 0; j < trimmed.length; j++) {
      const ch = trimmed[j];

      // Escaped pipe \|
      if (ch === '\\' && j + 1 < trimmed.length && trimmed[j + 1] === '|') {
        current += '|';
        j++;
        continue;
      }
      // Inline code `...`
      if (ch === '`') {
        inBacktick = !inBacktick;
        current += ch;
        continue;
      }
      // Wiki-link [[...]]
      if (!inBacktick && ch === '[' && j + 1 < trimmed.length && trimmed[j + 1] === '[') {
        inWiki = true;
        current += '[[';
        j++;
        continue;
      }
      if (inWiki && ch === ']' && j + 1 < trimmed.length && trimmed[j + 1] === ']') {
        inWiki = false;
        current += ']]';
        j++;
        continue;
      }
      // Column delimiter |
      if (ch === '|' && !inBacktick && !inWiki) {
        cells.push(current);
        current = '';
        continue;
      }
      current += ch;
    }
    cells.push(current);
    return cells;
  }

  // Inline formatting
  function inline(text, fnRefCounts = null) {
    let s = escapeHtml(text);

    // Extract inline code spans FIRST to protect their contents
    const codeSpans = [];
    s = s.replace(/`([^`]+)`/g, (_, code) => {
      const placeholder = `\x00CODE${codeSpans.length}\x00`;
      codeSpans.push(`<code>${code}</code>`);
      return placeholder;
    });

    // Footnote reference [^1] (excluding definition syntax)
    s = s.replace(/\[\^([^\]\s:]+)\](?!:)/g, (_, fnId) => {
      const cleanId = escapeAttr(fnId.trim());
      let refId = `fnref-${cleanId}`;
      if (fnRefCounts) {
        const count = (fnRefCounts.get(cleanId) || 0) + 1;
        fnRefCounts.set(cleanId, count);
        if (count > 1) refId = `fnref-${cleanId}-${count}`;
      }
      return `<sup class="footnote-ref" id="${refId}"><a href="#fn-${cleanId}">[${cleanId}]</a></sup>`;
    });

    // Obsidian Wiki-links [[Target]] or [[Target|Alias]]
    s = s.replace(/\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]/g, (_, target, alias) => {
      const cleanTarget = escapeAttr(target.trim());
      const display = (alias || target).trim();
      return `<a class="wiki-link" data-wiki="${cleanTarget}" href="javascript:void(0)" title="Navigate to [[${cleanTarget}]]"><span class="wiki-icon">✦</span>${display}</a>`;
    });

    // Images ![alt](src)
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Standard markdown Links [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Bold **text** or __text__
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic *text* or _text_ (excluding inside snake_case words)
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    s = s.replace(/(?<!\w)_([^\s_](?:[^_]*[^\s_])?)_(?!\w)/g, '<em>$1</em>');

    // Strikethrough ~~text~~
    s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Highlighter ==text==
    s = s.replace(/==(.+?)==/g, '<mark class="md-highlight">$1</mark>');

    // Restore code spans
    for (let i = 0; i < codeSpans.length; i++) {
      s = s.replace(`\x00CODE${i}\x00`, codeSpans[i]);
    }

    return s;
  }

  // Extract all wiki-link targets from markdown text (ignoring code blocks & code spans)
  function extractWikiLinks(src) {
    if (!src) return [];
    // Strip fenced code blocks and inline code spans so sample code doesn't produce ghost links
    const clean = src
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`\n]+`/g, '');
    const wikiRegex = /\[\[([^|\]\n]+)(?:\|[^\]\n]+)?\]\]/g;
    const links = new Set();
    let m;
    while ((m = wikiRegex.exec(clean)) !== null) {
      const target = m[1].trim();
      if (target) links.add(target);
    }
    return Array.from(links);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  return { render, extractWikiLinks };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Markdown;
}
