//! Pure Rust Core Engine for Lord Spey — Author's Workspace.
//!
//! Provides high-performance, memory-safe manuscript analytics, Flesch-Kincaid
//! readability scoring, Obsidian `[[Wiki-Link]]` graph indexing, document outline
//! extraction, Markdown-to-HTML rendering, `.spey` project bundle validation,
//! and semantic version comparison.
//!
//! Works natively inside the Tauri v2 desktop binary (`lord-spey`) and optionally
//! compiles to WebAssembly when the `wasm` Cargo feature is enabled.

use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Real-time manuscript statistics and readability metrics for an author's note or chapter.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ManuscriptMetrics {
    pub words: usize,
    pub chars: usize,
    pub chars_no_spaces: usize,
    pub sentences: usize,
    pub paragraphs: usize,
    pub avg_sentence_length: f64,
    pub reading_time_sec: usize,
    pub reading_time_formatted: String,
    pub speaking_time_sec: usize,
    pub speaking_time_formatted: String,
    pub flesch_reading_ease: f64,
    pub readability_label: String,
}

/// An Obsidian-style `[[Target|Alias]]` wiki-link extracted from Markdown prose.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct WikiLink {
    pub target: String,
    pub alias: String,
    pub line: usize,
}

/// A structural heading or narrative scene break entry for the Document Outline drawer.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct HeadingEntry {
    pub level: u8,
    pub text: String,
    pub line: usize,
    pub is_scene_break: bool,
}

/// Breakdown of entity counts inside a `.spey` author project bundle.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SpeyStats {
    pub total_notes: usize,
    pub chapters: usize,
    pub lore: usize,
    pub world: usize,
    pub drafts: usize,
    pub word_count: usize,
    pub map_pins: usize,
    pub timeline_events: usize,
    pub characters: usize,
    pub relationships: usize,
}

/// Validation summary returned when inspecting a `.spey` or `.json` vault file.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SpeyValidationResult {
    pub valid: bool,
    pub format: String,
    pub version: u32,
    pub project_name: String,
    pub stats: SpeyStats,
}

/// Counts English syllables heuristically for Flesch-Kincaid readability analysis.
pub fn count_syllables_in_word(word: &str) -> usize {
    let clean: String = word
        .chars()
        .filter(|c| c.is_ascii_alphabetic())
        .map(|c| c.to_ascii_lowercase())
        .collect();

    if clean.is_empty() {
        return 0;
    }
    if clean.len() <= 3 {
        return 1;
    }

    let vowels = [b'a', b'e', b'i', b'o', b'u', b'y'];
    let mut stem = clean.as_str();
    let mut extra = 0usize;

    // Count syllabic consonant + "le" (e.g. lit-tle, cas-tle, ta-ble)
    if stem.len() > 2 && stem.ends_with("le") {
        let prev = stem.as_bytes()[stem.len() - 3];
        if !vowels.contains(&prev) {
            extra += 1;
            stem = &stem[..stem.len() - 2];
        }
    }

    // Strip silent trailing 'e', 'ed', 'es'
    if stem.len() > 2 && stem.ends_with("ed") {
        let prev = stem.as_bytes()[stem.len() - 3];
        if prev != b't' && prev != b'd' {
            stem = &stem[..stem.len() - 2];
        }
    } else if stem.len() > 2 && stem.ends_with("es") {
        let prev = stem.as_bytes()[stem.len() - 3];
        if prev != b's' && prev != b'z' && prev != b'x' {
            stem = &stem[..stem.len() - 2];
        }
    } else if stem.len() > 1 && stem.ends_with('e') {
        let prev = stem.as_bytes()[stem.len() - 2];
        if !vowels.contains(&prev) {
            stem = &stem[..stem.len() - 1];
        }
    }

    let bytes = stem.as_bytes();
    let mut count = 0usize;
    let mut prev_vowel = false;

    for &b in bytes {
        let is_v = vowels.contains(&b);
        if is_v && !prev_vowel {
            count += 1;
        }
        prev_vowel = is_v;
    }

    (count + extra).max(1)
}

/// Formats a duration in seconds into a concise author status label (`< 1m`, `4m`, `1h 12m`).
pub fn format_duration_seconds(seconds: usize) -> String {
    if seconds == 0 {
        return "0m".to_string();
    }
    if seconds < 60 {
        return "< 1m".to_string();
    }
    let total_mins = (seconds + 30) / 60;
    if total_mins < 60 {
        format!("{}m", total_mins)
    } else {
        let hrs = total_mins / 60;
        let rem_mins = total_mins % 60;
        if rem_mins == 0 {
            format!("{}h", hrs)
        } else {
            format!("{}h {}m", hrs, rem_mins)
        }
    }
}

/// Computes comprehensive manuscript metrics and Flesch-Kincaid readability for prose text.
pub fn compute_manuscript_metrics(text: &str) -> ManuscriptMetrics {
    let chars = text.chars().count();
    let chars_no_spaces = text.chars().filter(|c| !c.is_whitespace()).count();

    let words_vec: Vec<&str> = text
        .split_whitespace()
        .filter(|w| w.chars().any(|c| c.is_alphanumeric()))
        .collect();
    let words = words_vec.len();

    if words == 0 {
        return ManuscriptMetrics {
            words: 0,
            chars,
            chars_no_spaces,
            sentences: 0,
            paragraphs: 0,
            avg_sentence_length: 0.0,
            reading_time_sec: 0,
            reading_time_formatted: "0m".to_string(),
            speaking_time_sec: 0,
            speaking_time_formatted: "0m".to_string(),
            flesch_reading_ease: 100.0,
            readability_label: "N/A".to_string(),
        };
    }

    let sentences = text
        .split(|c| c == '.' || c == '!' || c == '?')
        .filter(|s| s.chars().any(|c| c.is_alphanumeric()))
        .count()
        .max(1);

    let paragraphs = text
        .replace("\r\n", "\n")
        .split("\n\n")
        .filter(|p| !p.trim().is_empty())
        .count()
        .max(1);

    let avg_sentence_length = ((words as f64 / sentences as f64) * 10.0).round() / 10.0;

    // Silent reading @ 225 WPM, aloud speaking @ 130 WPM
    let reading_time_sec = ((words as f64 / 225.0) * 60.0).ceil() as usize;
    let speaking_time_sec = ((words as f64 / 130.0) * 60.0).ceil() as usize;

    let total_syllables: usize = words_vec.iter().map(|w| count_syllables_in_word(w)).sum();
    let asl = words as f64 / sentences as f64;
    let asw = total_syllables as f64 / words as f64;
    let raw_flesch = 206.835 - (1.015 * asl) - (84.6 * asw);
    let flesch_reading_ease = ((raw_flesch.clamp(0.0, 100.0)) * 10.0).round() / 10.0;

    let readability_label = if flesch_reading_ease >= 80.0 {
        "Accessible / Swift Pace".to_string()
    } else if flesch_reading_ease >= 60.0 {
        "Standard Literary Fiction".to_string()
    } else if flesch_reading_ease >= 40.0 {
        "Rich / Elevated Prose".to_string()
    } else {
        "Dense / Academic Lore".to_string()
    };

    ManuscriptMetrics {
        words,
        chars,
        chars_no_spaces,
        sentences,
        paragraphs,
        avg_sentence_length,
        reading_time_sec,
        reading_time_formatted: format_duration_seconds(reading_time_sec),
        speaking_time_sec,
        speaking_time_formatted: format_duration_seconds(speaking_time_sec),
        flesch_reading_ease,
        readability_label,
    }
}

/// Extracts all Obsidian `[[Target]]` and `[[Target|Alias]]` wiki-links from Markdown text,
/// ignoring both fenced code blocks (` ``` `) and inline code spans (`` `...` ``).
pub fn extract_wiki_links(markdown: &str) -> Vec<WikiLink> {
    let mut links = Vec::new();
    let mut in_code_block = false;

    for (idx, raw_line) in markdown.replace("\r\n", "\n").lines().enumerate() {
        let trimmed = raw_line.trim();
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            continue;
        }
        if in_code_block {
            continue;
        }

        let bytes = raw_line.as_bytes();
        let mut i = 0;
        while i < bytes.len() {
            // Skip inline code span `...`
            if bytes[i] == b'`' {
                if let Some(rel_close) = raw_line[i + 1..].find('`') {
                    i += rel_close + 2;
                    continue;
                }
            }

            if i + 3 < bytes.len() && bytes[i] == b'[' && bytes[i + 1] == b'[' {
                let start = i + 2;
                let mut end = None;
                let mut j = start;
                while j + 1 < bytes.len() {
                    if bytes[j] == b'[' || bytes[j] == b'`' {
                        // Unclosed `[[` before another bracket or code span
                        break;
                    }
                    if bytes[j] == b']' && bytes[j + 1] == b']' {
                        end = Some(j);
                        break;
                    }
                    j += 1;
                }
                if let Some(close_idx) = end {
                    let inner = &raw_line[start..close_idx];
                    if !inner.trim().is_empty()
                        && !inner.contains('\n')
                        && !inner.contains('[')
                        && !inner.contains(']')
                    {
                        let (target, alias) = if let Some(pipe_pos) = inner.find('|') {
                            let t = inner[..pipe_pos].trim();
                            let a = inner[pipe_pos + 1..].trim();
                            (
                                t.to_string(),
                                if a.is_empty() {
                                    t.to_string()
                                } else {
                                    a.to_string()
                                },
                            )
                        } else {
                            let t = inner.trim().to_string();
                            (t.clone(), t)
                        };
                        if !target.is_empty() {
                            links.push(WikiLink {
                                target,
                                alias,
                                line: idx + 1,
                            });
                        }
                    }
                    i = close_idx + 2;
                    continue;
                }
                i += 2;
                continue;
            }
            i += 1;
        }
    }

    links
}

/// Extracts `#`–`######` headings and `* * *` narrative scene breaks for the Document Outline.
pub fn extract_outline(markdown: &str) -> Vec<HeadingEntry> {
    let mut entries = Vec::new();
    let mut in_code_block = false;

    for (idx, raw_line) in markdown.replace("\r\n", "\n").lines().enumerate() {
        let trimmed = raw_line.trim();
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            continue;
        }
        if in_code_block {
            continue;
        }

        // Check narrative scene break (* * *)
        if is_scene_break_line(trimmed) {
            entries.push(HeadingEntry {
                level: 0,
                text: "* * * (Scene Break)".to_string(),
                line: idx + 1,
                is_scene_break: true,
            });
            continue;
        }

        // Check ATX headings (# to ######)
        let hash_count = trimmed.chars().take_while(|&c| c == '#').count();
        if (1..=6).contains(&hash_count) {
            let rest = &trimmed[hash_count..];
            if rest.starts_with(' ') || rest.starts_with('\t') {
                let heading_text = rest.trim();
                if !heading_text.is_empty() {
                    entries.push(HeadingEntry {
                        level: hash_count as u8,
                        text: heading_text.to_string(),
                        line: idx + 1,
                        is_scene_break: false,
                    });
                }
            }
        }
    }

    entries
}

fn is_scene_break_line(trimmed: &str) -> bool {
    if !trimmed.contains(' ') {
        return false;
    }
    let stars = trimmed.chars().filter(|&c| c == '*').count();
    let all_stars_or_space = trimmed.chars().all(|c| c == '*' || c.is_whitespace());
    all_stars_or_space && stars >= 3
}

fn is_horizontal_rule_line(trimmed: &str) -> bool {
    if trimmed.len() < 3 {
        return false;
    }
    let all_dashes = trimmed.chars().all(|c| c == '-');
    let all_underscores = trimmed.chars().all(|c| c == '_');
    let all_stars = trimmed.chars().all(|c| c == '*');
    all_dashes || all_underscores || all_stars || is_scene_break_line(trimmed)
}

/// Escapes special HTML characters (`&`, `<`, `>`, `"`, `'`).
pub fn escape_html(input: &str) -> String {
    let mut out = String::with_capacity(input.len());
    for c in input.chars() {
        match c {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&#39;"),
            _ => out.push(c),
        }
    }
    out
}

fn get_callout_icon(callout_type: &str) -> &'static str {
    match callout_type.to_ascii_lowercase().as_str() {
        "note" => "✦",
        "tip" | "hint" => "💡",
        "warning" | "caution" => "⚠",
        "important" => "★",
        "danger" | "error" => "✕",
        "info" => "ℹ",
        "todo" => "☑",
        "quote" => "❝",
        "bug" => "🐞",
        "example" => "📋",
        "question" | "help" | "faq" => "❓",
        "success" | "check" | "done" => "✔",
        "summary" | "abstract" | "tldr" => "📑",
        _ => "✦",
    }
}

fn render_inline_escaped(escaped: &str) -> String {
    let mut result = String::with_capacity(escaped.len() + 32);
    let bytes = escaped.as_bytes();
    let mut i = 0;

    while i < bytes.len() {
        // Inline code `...`
        if bytes[i] == b'`' {
            if let Some(rel_end) = escaped[i + 1..].find('`') {
                let code_inner = &escaped[i + 1..i + 1 + rel_end];
                result.push_str("<code>");
                result.push_str(code_inner);
                result.push_str("</code>");
                i += rel_end + 2;
                continue;
            }
        }

        // Wiki-link [[Target|Alias]]
        if i + 3 < bytes.len() && bytes[i] == b'[' && bytes[i + 1] == b'[' {
            if let Some(rel_end) = escaped[i + 2..].find("]]") {
                let inner = &escaped[i + 2..i + 2 + rel_end];
                if !inner.contains('[') && !inner.contains(']') {
                    let (target, alias) = if let Some(pipe_idx) = inner.find('|') {
                        let t = inner[..pipe_idx].trim();
                        let a = inner[pipe_idx + 1..].trim();
                        (t, if a.is_empty() { t } else { a })
                    } else {
                        let t = inner.trim();
                        (t, t)
                    };
                    if !target.is_empty() {
                        result.push_str(&format!(
                            "<a class=\"wiki-link\" data-wiki=\"{target}\" href=\"javascript:void(0)\" title=\"Navigate to [[{target}]]\"><span class=\"wiki-icon\">✦</span>{alias}</a>",
                            target = target,
                            alias = alias
                        ));
                        i += rel_end + 4;
                        continue;
                    }
                }
            }
        }

        // Highlight ==text==
        if i + 3 < bytes.len() && bytes[i] == b'=' && bytes[i + 1] == b'=' {
            if let Some(rel_end) = escaped[i + 2..].find("==") {
                if rel_end > 0 {
                    let inner = &escaped[i + 2..i + 2 + rel_end];
                    result.push_str("<mark class=\"md-highlight\">");
                    result.push_str(&render_inline_escaped(inner));
                    result.push_str("</mark>");
                    i += rel_end + 4;
                    continue;
                }
            }
        }

        // Strikethrough ~~text~~
        if i + 3 < bytes.len() && bytes[i] == b'~' && bytes[i + 1] == b'~' {
            if let Some(rel_end) = escaped[i + 2..].find("~~") {
                if rel_end > 0 {
                    let inner = &escaped[i + 2..i + 2 + rel_end];
                    result.push_str("<del>");
                    result.push_str(&render_inline_escaped(inner));
                    result.push_str("</del>");
                    i += rel_end + 4;
                    continue;
                }
            }
        }

        // Bold **text**
        if i + 3 < bytes.len() && bytes[i] == b'*' && bytes[i + 1] == b'*' {
            if let Some(rel_end) = escaped[i + 2..].find("**") {
                if rel_end > 0 {
                    let inner = &escaped[i + 2..i + 2 + rel_end];
                    result.push_str("<strong>");
                    result.push_str(&render_inline_escaped(inner));
                    result.push_str("</strong>");
                    i += rel_end + 4;
                    continue;
                }
            }
        }

        // Italic *text*
        if i + 2 < bytes.len() && bytes[i] == b'*' {
            if let Some(rel_end) = escaped[i + 1..].find('*') {
                if rel_end > 0 {
                    let inner = &escaped[i + 1..i + 1 + rel_end];
                    result.push_str("<em>");
                    result.push_str(&render_inline_escaped(inner));
                    result.push_str("</em>");
                    i += rel_end + 2;
                    continue;
                }
            }
        }

        // Advance one UTF-8 character safely
        if let Some(ch) = escaped[i..].chars().next() {
            result.push(ch);
            i += ch.len_utf8();
        } else {
            break;
        }
    }

    result
}

/// Renders inline Markdown constructs (`[[Target|Alias]]`, `==mark==`, `~~del~~`, `**bold**`, `*em*`, `` `code` ``).
pub fn render_inline_markdown(text: &str) -> String {
    render_inline_escaped(&escape_html(text))
}

#[derive(Clone)]
struct ListItemEntry {
    is_task: bool,
    checked: bool,
    text: String,
}

fn flush_list_items(
    out: &mut Vec<String>,
    in_list: &mut bool,
    list_type: &str,
    items: &mut Vec<ListItemEntry>,
) {
    if !*in_list || items.is_empty() {
        *in_list = false;
        items.clear();
        return;
    }
    let tag = if list_type == "ol" { "ol" } else { "ul" };
    let has_tasks = items.iter().any(|item| item.is_task);
    let list_class = if has_tasks { " class=\"task-list\"" } else { "" };

    let mut rendered_items = Vec::with_capacity(items.len());
    for item in items.iter() {
        if item.is_task {
            let checked_class = if item.checked { " task-done" } else { "" };
            let checked_attr = if item.checked { " checked" } else { "" };
            rendered_items.push(format!(
                "<li class=\"task-item{}\"><input type=\"checkbox\" class=\"task-checkbox\"{} disabled /> <span>{}</span></li>",
                checked_class,
                checked_attr,
                render_inline_markdown(&item.text)
            ));
        } else {
            rendered_items.push(format!("<li>{}</li>", render_inline_markdown(&item.text)));
        }
    }

    out.push(format!(
        "<{tag}{list_class}>\n{body}\n</{tag}>",
        tag = tag,
        list_class = list_class,
        body = rendered_items.join("\n")
    ));
    *in_list = false;
    items.clear();
}

/// Renders Markdown document text to HTML with Obsidian wiki-links, task lists,
/// scene breaks, callouts, blockquotes, lists, and fenced code blocks.
pub fn render_markdown(src: &str) -> String {
    if src.is_empty() {
        return String::new();
    }

    let normalized = src.replace("\r\n", "\n");
    let lines: Vec<&str> = normalized.split('\n').collect();
    let mut out: Vec<String> = Vec::new();
    let mut in_code_block = false;
    let mut code_lines: Vec<&str> = Vec::new();
    let mut in_list = false;
    let mut list_type = String::new();
    let mut list_items: Vec<ListItemEntry> = Vec::new();

    let mut i = 0;
    while i < lines.len() {
        let line = lines[i];
        let trimmed = line.trim();

        if trimmed.starts_with("```") {
            if in_code_block {
                out.push(format!(
                    "<pre><code>{}</code></pre>",
                    escape_html(&code_lines.join("\n"))
                ));
                code_lines.clear();
                in_code_block = false;
            } else {
                flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
                in_code_block = true;
            }
            i += 1;
            continue;
        }

        if in_code_block {
            code_lines.push(line);
            i += 1;
            continue;
        }

        if trimmed.is_empty() {
            flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
            i += 1;
            continue;
        }

        // Scene break or horizontal rule
        if is_horizontal_rule_line(trimmed) {
            flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
            if is_scene_break_line(trimmed) {
                out.push("<hr class=\"scene-break\" />".to_string());
            } else {
                out.push("<hr />".to_string());
            }
            i += 1;
            continue;
        }

        // Headings (# to ######)
        let hashes = trimmed.chars().take_while(|&c| c == '#').count();
        if (1..=6).contains(&hashes) {
            let rest = &trimmed[hashes..];
            if rest.starts_with(' ') || rest.starts_with('\t') {
                flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
                out.push(format!(
                    "<h{level}>{content}</h{level}>",
                    level = hashes,
                    content = render_inline_markdown(rest.trim())
                ));
                i += 1;
                continue;
            }
        }

        // Blockquotes & Obsidian Callouts (> [!NOTE] Title)
        if trimmed.starts_with('>') {
            flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
            let mut bq_lines: Vec<&str> = Vec::new();
            while i < lines.len() && lines[i].trim().starts_with('>') {
                let raw_bq = lines[i].trim();
                let stripped = raw_bq
                    .strip_prefix("> ")
                    .or_else(|| raw_bq.strip_prefix('>'))
                    .unwrap_or("");
                bq_lines.push(stripped);
                i += 1;
            }

            let first = bq_lines.first().copied().unwrap_or("").trim();
            if let Some(after_bang) = first.strip_prefix("[!") {
                if let Some(close_bracket) = after_bang.find(']') {
                    let raw_type = &after_bang[..close_bracket];
                    if !raw_type.is_empty() && raw_type.chars().all(|c| c.is_ascii_alphabetic()) {
                        let ctype = raw_type.to_ascii_lowercase();
                        let after_bracket = &after_bang[close_bracket + 1..];
                        let (fold_attr, title_part) = if let Some(rest) = after_bracket.strip_prefix('-') {
                            (" data-folded=\"true\"", rest.trim())
                        } else if let Some(rest) = after_bracket.strip_prefix('+') {
                            (" data-folded=\"false\"", rest.trim())
                        } else {
                            ("", after_bracket.trim())
                        };
                        let default_title = {
                            let mut chars = ctype.chars();
                            match chars.next() {
                                Some(first_ch) => {
                                    first_ch.to_ascii_uppercase().to_string() + chars.as_str()
                                }
                                None => "Note".to_string(),
                            }
                        };
                        let title = if title_part.is_empty() {
                            default_title
                        } else {
                            title_part.to_string()
                        };
                        let icon = get_callout_icon(&ctype);
                        let body_text = bq_lines[1..].join("\n").trim().to_string();
                        let body_html = if body_text.is_empty() {
                            String::new()
                        } else {
                            format!("<div class=\"callout-body\">{}</div>", render_markdown(&body_text))
                        };
                        out.push(format!(
                            "<blockquote class=\"callout callout-{ctype}\"{fold_attr}><div class=\"callout-header\"><span class=\"callout-icon\">{icon}</span> <span class=\"callout-title\">{title}</span></div>{body_html}</blockquote>",
                            ctype = ctype,
                            fold_attr = fold_attr,
                            icon = icon,
                            title = render_inline_markdown(&title),
                            body_html = body_html
                        ));
                        continue;
                    }
                }
            }

            let bq_text = bq_lines.join("\n").trim().to_string();
            let bq_html = if bq_text.is_empty() {
                "<p></p>".to_string()
            } else {
                render_markdown(&bq_text)
            };
            out.push(format!("<blockquote>{}</blockquote>", bq_html));
            continue;
        }

        // Unordered list (-, *, +) and Task list (- [ ], - [x])
        if let Some(rest) = trimmed
            .strip_prefix("- ")
            .or_else(|| trimmed.strip_prefix("* "))
            .or_else(|| trimmed.strip_prefix("+ "))
        {
            if !in_list || list_type != "ul" {
                flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
                in_list = true;
                list_type = "ul".to_string();
            }
            if let Some(task_text) = rest.strip_prefix("[ ] ") {
                list_items.push(ListItemEntry {
                    is_task: true,
                    checked: false,
                    text: task_text.to_string(),
                });
            } else if let Some(task_text) = rest
                .strip_prefix("[x] ")
                .or_else(|| rest.strip_prefix("[X] "))
            {
                list_items.push(ListItemEntry {
                    is_task: true,
                    checked: true,
                    text: task_text.to_string(),
                });
            } else {
                list_items.push(ListItemEntry {
                    is_task: false,
                    checked: false,
                    text: rest.to_string(),
                });
            }
            i += 1;
            continue;
        }

        // Ordered list (1. item)
        let digit_len = trimmed.chars().take_while(|c| c.is_ascii_digit()).count();
        if digit_len > 0 && trimmed[digit_len..].starts_with(". ") {
            let item_text = &trimmed[digit_len + 2..];
            if !in_list || list_type != "ol" {
                flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
                in_list = true;
                list_type = "ol".to_string();
            }
            list_items.push(ListItemEntry {
                is_task: false,
                checked: false,
                text: item_text.to_string(),
            });
            i += 1;
            continue;
        }

        // Paragraph
        flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);
        out.push(format!("<p>{}</p>", render_inline_markdown(trimmed)));
        i += 1;
    }

    if in_code_block {
        out.push(format!(
            "<pre><code>{}</code></pre>",
            escape_html(&code_lines.join("\n"))
        ));
    }
    flush_list_items(&mut out, &mut in_list, &list_type, &mut list_items);

    out.join("\n")
}

/// Validates and inspects a `.spey` or `.json` project package payload, computing
/// note category counts and total manuscript words natively in Rust.
pub fn validate_spey_package(json_str: &str) -> Result<SpeyValidationResult, String> {
    let parsed: Value = serde_json::from_str(json_str)
        .map_err(|e| format!("Invalid .spey JSON syntax: {}", e))?;

    let (notes_arr, format_str, version_num, project_name, map_pins, timeline_events, characters, relationships) =
        if let Some(arr) = parsed.as_array() {
            (
                arr.clone(),
                "legacy-notes-array".to_string(),
                1u32,
                "Imported Vault".to_string(),
                0usize,
                0usize,
                0usize,
                0usize,
            )
        } else if let Some(obj) = parsed.as_object() {
            let notes = obj
                .get("notes")
                .and_then(|v| v.as_array())
                .cloned()
                .ok_or_else(|| "Missing 'notes' array in .spey package".to_string())?;
            let fmt = obj
                .get("format")
                .and_then(|v| v.as_str())
                .unwrap_or("lord-spey-package")
                .to_string();
            let ver = obj.get("version").and_then(|v| v.as_u64()).unwrap_or(1) as u32;
            let proj = obj
                .get("projectName")
                .and_then(|v| v.as_str())
                .unwrap_or("Untitled Project")
                .to_string();
            let pins = obj
                .get("mapPins")
                .and_then(|v| v.as_array())
                .map(|a| a.len())
                .unwrap_or(0);
            let events = obj
                .get("timelineEvents")
                .and_then(|v| v.as_array())
                .map(|a| a.len())
                .unwrap_or(0);
            let chars = obj
                .get("characters")
                .and_then(|v| v.as_array())
                .map(|a| a.len())
                .unwrap_or(0);
            let rels = obj
                .get("relationships")
                .and_then(|v| v.as_array())
                .map(|a| a.len())
                .unwrap_or(0);
            (notes, fmt, ver, proj, pins, events, chars, rels)
        } else {
            return Err("Unrecognized .spey root structure (expected object or array)".to_string());
        };

    let mut chapters = 0usize;
    let mut lore = 0usize;
    let mut world = 0usize;
    let mut drafts = 0usize;
    let mut word_count = 0usize;

    for note in &notes_arr {
        let cat = note
            .get("category")
            .and_then(|v| v.as_str())
            .unwrap_or("draft")
            .to_ascii_lowercase();
        match cat.as_str() {
            "chapter" => chapters += 1,
            "lore" => lore += 1,
            "world" => world += 1,
            _ => drafts += 1,
        }
        if let Some(body) = note.get("body").and_then(|v| v.as_str()) {
            word_count += body
                .split_whitespace()
                .filter(|w| w.chars().any(|c| c.is_alphanumeric()))
                .count();
        }
    }

    Ok(SpeyValidationResult {
        valid: true,
        format: format_str,
        version: version_num,
        project_name,
        stats: SpeyStats {
            total_notes: notes_arr.len(),
            chapters,
            lore,
            world,
            drafts,
            word_count,
            map_pins,
            timeline_events,
            characters,
            relationships,
        },
    })
}

/// Finds a `.spey` or `.json` file path argument from process command-line arguments,
/// stripping surrounding quotes and ignoring CLI flags (`--`, `-`, `/`).
pub fn find_spey_arg(args: &[String]) -> Option<String> {
    for raw_arg in args {
        let trimmed = raw_arg.trim().trim_matches(|c| c == '"' || c == '\'');
        if trimmed.is_empty() {
            continue;
        }
        if trimmed.starts_with("--") || trimmed.starts_with('-') || trimmed.starts_with('/') {
            continue;
        }
        let lower = trimmed.to_ascii_lowercase();
        if lower.ends_with(".spey") || lower.ends_with(".json") {
            return Some(trimmed.to_string());
        }
    }
    None
}

/// Parses a semantic version string (e.g., `"v2.1.2"` or `"2.1.2"`) into numeric components.
pub fn parse_semver(version: &str) -> Vec<u32> {
    let cleaned = version
        .trim()
        .strip_prefix('v')
        .or_else(|| version.trim().strip_prefix('V'))
        .unwrap_or_else(|| version.trim());

    if cleaned.is_empty() {
        return vec![0, 0, 0];
    }

    cleaned
        .split('.')
        .map(|part| {
            let digits: String = part.chars().take_while(|c| c.is_ascii_digit()).collect();
            digits.parse::<u32>().unwrap_or(0)
        })
        .collect()
}

/// Compares two semantic version strings (`1` if `v1 > v2`, `-1` if `v1 < v2`, `0` if equal).
pub fn compare_semver(v1: &str, v2: &str) -> i32 {
    let p1 = parse_semver(v1);
    let p2 = parse_semver(v2);
    let len = p1.len().max(p2.len());

    for i in 0..len {
        let a = *p1.get(i).unwrap_or(&0);
        let b = *p2.get(i).unwrap_or(&0);
        if a > b {
            return 1;
        }
        if a < b {
            return -1;
        }
    }
    0
}

#[cfg(feature = "wasm")]
pub mod wasm_exports {
    use super::*;
    use wasm_bindgen::prelude::*;

    #[wasm_bindgen]
    pub fn wasm_compute_metrics_json(text: &str) -> String {
        let metrics = compute_manuscript_metrics(text);
        serde_json::to_string(&metrics).unwrap_or_else(|_| "{}".to_string())
    }

    #[wasm_bindgen]
    pub fn wasm_extract_wiki_links_json(markdown: &str) -> String {
        let links = extract_wiki_links(markdown);
        serde_json::to_string(&links).unwrap_or_else(|_| "[]".to_string())
    }

    #[wasm_bindgen]
    pub fn wasm_render_markdown(markdown: &str) -> String {
        render_markdown(markdown)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_manuscript_metrics_empty_and_prose() {
        let empty = compute_manuscript_metrics("");
        assert_eq!(empty.words, 0);
        assert_eq!(empty.sentences, 0);
        assert_eq!(empty.reading_time_formatted, "0m");

        let prose = "# Chapter I: The Basalt Citadel\n\nThe obsidian spire loomed in the crimson sunset. Shadows stretched across [[The Ashen Vale]].";
        let m = compute_manuscript_metrics(prose);
        assert!(m.words >= 16);
        assert_eq!(m.sentences, 2);
        assert_eq!(m.paragraphs, 2);
        assert_eq!(m.reading_time_formatted, "< 1m");
    }

    #[test]
    fn test_extract_wiki_links_and_aliases() {
        let md = "Linking to `[[Inline Code Ignored]]`, [[ unclosed and [[The Ashen Vale]] and [[Order of Spey|The Archivists]].\n```\n[[Ignored In Code]]\n```";
        let links = extract_wiki_links(md);
        assert_eq!(links.len(), 2);
        assert_eq!(links[0].target, "The Ashen Vale");
        assert_eq!(links[0].alias, "The Ashen Vale");
        assert_eq!(links[1].target, "Order of Spey");
        assert_eq!(links[1].alias, "The Archivists");
    }

    #[test]
    fn test_render_markdown_callouts_lists_and_inline() {
        let md = "> [!NOTE]- Lore Secret\n> Hidden in [[The Ashen Vale|Ashen Vale]] with ==glowing *ember*==.\n\n- [x] First task\n- [ ] Second task";
        let html = render_markdown(md);
        assert!(html.contains("callout callout-note"));
        assert!(html.contains("data-folded=\"true\""));
        assert!(html.contains("class=\"wiki-link\" data-wiki=\"The Ashen Vale\" href=\"javascript:void(0)\""));
        assert!(html.contains("<span class=\"wiki-icon\">✦</span>Ashen Vale"));
        assert!(html.contains("<mark class=\"md-highlight\">glowing <em>ember</em></mark>"));
        assert!(html.contains("<ul class=\"task-list\">"));
    }

    #[test]
    fn test_extract_outline_headings_and_scene_breaks() {
        let md = "# Act I\nSome text\n* * *\n## Scene 2\n";
        let outline = extract_outline(md);
        assert_eq!(outline.len(), 3);
        assert_eq!(outline[0].level, 1);
        assert_eq!(outline[0].text, "Act I");
        assert!(outline[1].is_scene_break);
        assert_eq!(outline[2].level, 2);
        assert_eq!(outline[2].text, "Scene 2");
    }

    #[test]
    fn test_validate_spey_package() {
        let sample = r#"{
            "format": "lord-spey-package",
            "version": 1,
            "projectName": "Chronicles of Spey",
            "notes": [
                { "title": "Ch 1", "category": "chapter", "body": "One two three four." },
                { "title": "Lore 1", "category": "lore", "body": "Five six." }
            ],
            "mapPins": [{ "title": "Gate" }],
            "timelineEvents": [],
            "characters": [],
            "relationships": []
        }"#;
        let res = validate_spey_package(sample).expect("valid spey package");
        assert!(res.valid);
        assert_eq!(res.project_name, "Chronicles of Spey");
        assert_eq!(res.stats.total_notes, 2);
        assert_eq!(res.stats.chapters, 1);
        assert_eq!(res.stats.lore, 1);
        assert_eq!(res.stats.word_count, 6);
        assert_eq!(res.stats.map_pins, 1);
    }

    #[test]
    fn test_find_spey_arg_and_semver() {
        let args = vec![
            "--enable-logging".to_string(),
            "\"C:\\Users\\Author\\MyStory.spey\"".to_string(),
        ];
        assert_eq!(
            find_spey_arg(&args),
            Some("C:\\Users\\Author\\MyStory.spey".to_string())
        );
        assert_eq!(compare_semver("v2.1.2", "2.1.2"), 0);
        assert_eq!(compare_semver("2.2.0", "2.1.2"), 1);
        assert_eq!(compare_semver("2.0.0", "2.1.2"), -1);
    }
}
