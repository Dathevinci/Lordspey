/* ═══════════════════════════════════════════════
   Storage Module — Lord Spey Author's Workspace
   localStorage persistence & clean vault management
   ═══════════════════════════════════════════════ */

const Storage = (() => {
  const NOTES_KEY = 'lordspey_notes';
  const SETTINGS_KEY = 'lordspey_settings';

  // Clear legacy inkwell keys if present so user has a clean slate
  try {
    if (localStorage.getItem('inkwell_notes')) {
      localStorage.removeItem('inkwell_notes');
      localStorage.removeItem('inkwell_settings');
      localStorage.removeItem('inkwell_seeded_v1');
    }
  } catch {
    // Ignore storage access errors
  }

  // Optional starter data for inspiration (only loaded if user explicitly requests it)
  const STARTER_NOTES = [
    {
      id: 'demo-chap-1',
      title: 'Chapter I: The Obsidian Gate',
      category: 'chapter',
      tags: 'act-1, prose, prologue',
      body: `# Chapter I: The Obsidian Gate

The bell in the high spire tolled midnight, shivering across the valley like a dying pulse.

Vespera tightened her cloak against the cold wind rising from [[The Ashen Vale]]. Far below, torches flickered where the acolytes prepared for the convergence.

> *"When the third star bleeds into the veil, that which was sealed shall awaken."*

Tonight's vigil demanded three steps:
- [x] Secure the high observatory
- [x] Decrypt the ancient seal
- [ ] Retrieve the star astrolabe before the inquisitors arrive

Corvus approached from the shadow of the archway, his blade drawn. "[[The Order of Lore]] is no longer alone in these mountains."`,
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'demo-lore-1',
      title: 'The Order of Lore',
      category: 'lore',
      tags: 'factions, magic, lore',
      body: `# The Order of Lore

An ancient monastic fellowship dedicated to preserving forbidden manuscripts and cosmic history.

---

### Core Tenets
1. **The Inviolable Word** — Truth must be transcribed regardless of the empire it unseats.
2. **The Silent Vigil** — Watch from the heights of [[The Ashen Vale]]; intervene only when the cosmic seals weaken.

### Key Figures
- **Vespera** — Protagonist of [[Chapter I: The Obsidian Gate]].
- **Lord Commander Corvus** — Master of the Veilblades.`,
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'demo-world-1',
      title: 'The Ashen Vale',
      category: 'world',
      tags: 'geography, worldbuilding, map',
      body: `# The Ashen Vale

A highland territory situated at the convergence of the Three Moons, shrouded in perpetual twilight.

## Key Landmarks
- **The Obsidian Spire**: Houses the highest observatory of [[The Order of Lore]].
- **The Bleeding Chasm**: A geothermal fissure glowing with ruby radiance at midnight.`,
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'demo-draft-1',
      title: 'Story Beats & Scene Outlines',
      category: 'draft',
      tags: 'outline, planning, draft',
      body: `# Story Beats & Scene Outlines

### Milestone Checklist
- [x] Establish the opening atmosphere in [[Chapter I: The Obsidian Gate]]
- [ ] Outline the conflict with the Inquisition
- [ ] Describe the descent into [[The Ashen Vale]]`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  ];

  // ── Note CRUD ──

  function getAllNotes() {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function _saveAll(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }

  function getNote(id) {
    return getAllNotes().find(n => n.id === id) || null;
  }

  function findNoteByTitle(title) {
    if (!title) return null;
    const clean = title.trim().toLowerCase();
    return getAllNotes().find(n => (n.title || '').trim().toLowerCase() === clean) || null;
  }

  function createNote({ title, category, body = '', tags = '' }) {
    const notes = getAllNotes();
    const note = {
      id: _uid(),
      title: title || 'Untitled',
      category: category || 'draft',
      body,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.unshift(note);
    _saveAll(notes);
    return note;
  }

  function updateNote(id, updates) {
    const notes = getAllNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    Object.assign(notes[idx], updates, { updatedAt: Date.now() });
    _saveAll(notes);
    return notes[idx];
  }

  function deleteNote(id) {
    const notes = getAllNotes().filter(n => n.id !== id);
    _saveAll(notes);
  }

  function clearAllNotes() {
    _saveAll([]);
    saveSetting('lastOpenNote', null);
  }

  function loadStarterVault() {
    _saveAll(STARTER_NOTES);
    return STARTER_NOTES;
  }

  function searchNotes(query) {
    if (!query) return getAllNotes();
    const q = query.toLowerCase();
    return getAllNotes().filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.body || '').toLowerCase().includes(q) ||
      (n.tags || '').toLowerCase().includes(q)
    );
  }

  function getNotesByCategory(category) {
    return getAllNotes().filter(n => n.category === category);
  }

  // ── Backlinks / Mentions ──

  function getBacklinks(targetTitle) {
    if (!targetTitle) return [];
    const cleanTarget = targetTitle.trim().toLowerCase();
    const notes = getAllNotes();
    const backlinks = [];

    const wikiRegex = /\[\[([^|\]\n]+)(?:\|[^\]\n]+)?\]\]/g;

    for (const note of notes) {
      if ((note.title || '').trim().toLowerCase() === cleanTarget) continue;
      const body = note.body || '';
      let match;
      let matched = false;
      wikiRegex.lastIndex = 0;
      while ((match = wikiRegex.exec(body)) !== null) {
        if (match[1].trim().toLowerCase() === cleanTarget) {
          matched = true;
          break;
        }
      }
      if (matched) {
        backlinks.push(note);
      }
    }
    return backlinks;
  }

  // ── Settings ──

  function getSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveSetting(key, value) {
    const s = getSettings();
    s[key] = value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  // ── Export / Import ──

  function exportJSON() {
    const data = {
      version: 1,
      appName: 'Lord Spey',
      exportedAt: new Date().toISOString(),
      notes: getAllNotes(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lordspey-vault-${_datestamp()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportMarkdown(noteId) {
    const note = getNote(noteId);
    if (!note) return;
    const content = `---
title: ${note.title || 'Untitled'}
category: ${note.category}
tags: [${note.tags || ''}]
created: ${new Date(note.createdAt).toISOString()}
updated: ${new Date(note.updatedAt).toISOString()}
---

${note.body || ''}`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (note.title || 'note').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    a.href = url;
    a.download = `${safeTitle}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          const incoming = data.notes || data;
          if (!Array.isArray(incoming)) throw new Error('Invalid format');
          const existing = getAllNotes();
          const existingIds = new Set(existing.map(n => n.id));
          let added = 0;
          for (const note of incoming) {
            if (!existingIds.has(note.id)) {
              existing.push(note);
              added++;
            }
          }
          _saveAll(existing);
          resolve(added);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  // ── Helpers ──

  function _uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function _datestamp() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  return {
    getAllNotes,
    getNote,
    findNoteByTitle,
    createNote,
    updateNote,
    deleteNote,
    clearAllNotes,
    loadStarterVault,
    searchNotes,
    getNotesByCategory,
    getBacklinks,
    getSettings,
    saveSetting,
    exportJSON,
    exportMarkdown,
    importJSON,
  };
})();
