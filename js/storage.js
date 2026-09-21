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

  // Deep Worldbuilding Storage Keys
  const MAP_PINS_KEY = 'lordspey_map_pins';
  const MAP_IMAGE_KEY = 'lordspey_map_image';
  const TIMELINE_KEY = 'lordspey_timeline_events';
  const CHARACTERS_KEY = 'lordspey_characters';
  const RELATIONSHIPS_KEY = 'lordspey_relationships';

  const STARTER_PINS = [
    {
      id: 'pin-gate',
      x: 50.5,
      y: 32.2,
      noteId: 'demo-chap-1',
      title: 'The Obsidian Gate',
      category: 'chapter',
      description: 'Mountain pass fortress where the Convergence occurs under the midnight vigil.',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'pin-order',
      x: 64.2,
      y: 53.6,
      noteId: 'demo-lore-1',
      title: 'The Order of Lore',
      category: 'lore',
      description: 'Ancient monastic citadel safeguarding forbidden manuscripts and cosmic history.',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'pin-vale',
      x: 37.8,
      y: 67.4,
      noteId: 'demo-world-1',
      title: 'The Ashen Vale',
      category: 'world',
      description: 'Twilight highland territory shrouded in perpetual mist at the Three Moons convergence.',
      createdAt: Date.now() - 86400000 * 1
    }
  ];

  const STARTER_TIMELINE = [
    {
      id: 'evt-1',
      year: 'Year 120',
      era: 'Age of Foundations',
      title: 'The Sealing of the Veil',
      description: 'Monastic scholars establish celestial wards across the mountain peaks.',
      noteId: 'demo-lore-1',
      category: 'lore',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'evt-2',
      year: 'Year 240',
      era: 'Era of the Moons',
      title: 'Construction of High Spire',
      description: 'The Order completes the celestial observatory overlooking The Ashen Vale.',
      noteId: 'demo-world-1',
      category: 'world',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'evt-3',
      year: 'Year 342',
      era: 'The Convergence',
      title: 'The Fall of the Gate',
      description: 'The third star bleeds into the veil; inquisitors approach the mountain pass.',
      noteId: 'demo-chap-1',
      category: 'chapter',
      createdAt: Date.now() - 86400000 * 1
    }
  ];

  const STARTER_CHARACTERS = [
    {
      id: 'char-vespera',
      name: 'Vespera',
      archetype: 'Protagonist',
      faction: 'The Order of Lore',
      role: 'Acolyte of the Veil',
      status: 'Active',
      noteId: 'demo-chap-1',
      bio: 'Bearer of the nocturnal astrolabe, bound to decrypt the ancient seal during convergence.',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'char-corvus',
      name: 'Lord Commander Corvus',
      archetype: 'Mentor',
      faction: 'The Order of Lore',
      role: 'Master of the Veilblades',
      status: 'Active',
      noteId: 'demo-lore-1',
      bio: 'Veteran defender protecting the archives against inquisitorial incursions.',
      createdAt: Date.now() - 86400000 * 2
    }
  ];

  const STARTER_RELATIONSHIPS = [
    {
      id: 'rel-1',
      sourceId: 'char-vespera',
      targetId: 'char-corvus',
      type: 'Mentor to',
      description: 'Corvus trained Vespera in defensive arts and safeguarding the astrolabe.',
      createdAt: Date.now() - 86400000 * 2
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

  function saveNote(note) {
    if (!note || !note.title) return null;
    if (note.id) {
      const existing = getNote(note.id);
      if (existing) {
        return updateNote(note.id, note);
      }
      const notes = getAllNotes();
      notes.unshift(note);
      _saveAll(notes);
      return note;
    }
    return createNote(note);
  }

  function clearAllNotes() {
    _saveAll([]);
    saveSetting('lastOpenNote', null);
    try {
      localStorage.removeItem(MAP_PINS_KEY);
      localStorage.removeItem(MAP_IMAGE_KEY);
      localStorage.removeItem(TIMELINE_KEY);
      localStorage.removeItem(CHARACTERS_KEY);
      localStorage.removeItem(RELATIONSHIPS_KEY);
    } catch {
      // Ignore
    }
  }

  function loadStarterVault() {
    _saveAll(STARTER_NOTES);
    try {
      localStorage.setItem(MAP_PINS_KEY, JSON.stringify(STARTER_PINS));
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(STARTER_TIMELINE));
      localStorage.setItem(CHARACTERS_KEY, JSON.stringify(STARTER_CHARACTERS));
      localStorage.setItem(RELATIONSHIPS_KEY, JSON.stringify(STARTER_RELATIONSHIPS));
    } catch {
      // Ignore
    }
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

  // ── Deep Worldbuilding: Map Pins ──

  function getAllMapPins() {
    try {
      const raw = localStorage.getItem(MAP_PINS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function _saveMapPins(pins) {
    localStorage.setItem(MAP_PINS_KEY, JSON.stringify(pins));
  }

  function getMapPin(id) {
    return getAllMapPins().find(p => p.id === id) || null;
  }

  function saveMapPin(pin) {
    const pins = getAllMapPins();
    if (!pin.id) {
      pin.id = 'pin-' + _uid();
      pin.createdAt = Date.now();
      pins.push(pin);
    } else {
      const idx = pins.findIndex(p => p.id === pin.id);
      if (idx !== -1) {
        pins[idx] = Object.assign({}, pins[idx], pin, { updatedAt: Date.now() });
      } else {
        pin.createdAt = pin.createdAt || Date.now();
        pins.push(pin);
      }
    }
    _saveMapPins(pins);
    return pin;
  }

  function deleteMapPin(id) {
    const pins = getAllMapPins().filter(p => p.id !== id);
    _saveMapPins(pins);
  }

  function getCustomMapImage() {
    try {
      return localStorage.getItem(MAP_IMAGE_KEY) || null;
    } catch {
      return null;
    }
  }

  function saveCustomMapImage(dataUrl) {
    try {
      if (dataUrl) {
        localStorage.setItem(MAP_IMAGE_KEY, dataUrl);
      } else {
        localStorage.removeItem(MAP_IMAGE_KEY);
      }
      return true;
    } catch {
      return false;
    }
  }

  function clearCustomMapImage() {
    try {
      localStorage.removeItem(MAP_IMAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  // ── Deep Worldbuilding: Chronology & Event Timeline ──

  function getTimelineEvents() {
    try {
      const raw = localStorage.getItem(TIMELINE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function _saveTimelineEvents(events) {
    localStorage.setItem(TIMELINE_KEY, JSON.stringify(events));
  }

  function saveTimelineEvent(evt) {
    const events = getTimelineEvents();
    if (!evt.id) {
      evt.id = 'evt-' + _uid();
      evt.createdAt = Date.now();
      events.push(evt);
    } else {
      const idx = events.findIndex(e => e.id === evt.id);
      if (idx !== -1) {
        events[idx] = Object.assign({}, events[idx], evt, { updatedAt: Date.now() });
      } else {
        evt.createdAt = evt.createdAt || Date.now();
        events.push(evt);
      }
    }
    _saveTimelineEvents(events);
    return evt;
  }

  function deleteTimelineEvent(id) {
    const events = getTimelineEvents().filter(e => e.id !== id);
    _saveTimelineEvents(events);
  }

  function _parseFrontmatter(body) {
    if (!body || !body.startsWith('---')) return { frontmatter: {}, bodyWithoutFm: body || '' };
    const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) return { frontmatter: {}, bodyWithoutFm: body || '' };
    const raw = match[1];
    const fm = {};
    raw.split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        const val = line.slice(colonIdx + 1).trim();
        fm[key] = val;
      }
    });
    const bodyWithoutFm = body.slice(match[0].length);
    return { frontmatter: fm, bodyWithoutFm };
  }

  function _parseYearNumber(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const clean = String(str).trim();
    const numMatch = clean.match(/-?\d+/);
    if (numMatch) {
      let val = parseInt(numMatch[0], 10);
      if (/bce|bc|before/i.test(clean) && val > 0) val = -val;
      return val;
    }
    return 0;
  }

  function _inferEra(yearStr) {
    if (!yearStr) return 'General Era';
    const num = _parseYearNumber(yearStr);
    if (num < 0) return 'Ancient Era (BCE)';
    if (num < 200) return 'Age of Foundations';
    if (num < 300) return 'Era of the Moons';
    if (num < 400) return 'The Convergence';
    return 'Modern Era';
  }

  function scanNotesForEvents(providedNotes) {
    const notes = providedNotes || getAllNotes();
    const parsed = [];
    const timelineRegex = /(?:@timeline|@event):\s*([^\n]+)/gi;
    const inlineTagRegex = /#(?:timeline|event)\/([^\s#,]+)/gi;

    for (const note of notes) {
      const fullBody = note.body || '';
      const { frontmatter: fm, bodyWithoutFm } = _parseFrontmatter(fullBody);
      let matchIdx = 0;

      // 1. YAML Frontmatter timeline extraction
      const fmTimeline = fm['timeline'] || fm['event'] || fm['timeline_event'];
      const fmYear = fm['year'] || fm['date'];
      const fmEra = fm['era'] || fm['epoch'];
      if (fmTimeline || fmYear) {
        matchIdx++;
        let rawYear = fmYear || 'Unknown Date';
        let rawEra = fmEra || '';
        let rawTitle = note.title;
        let rawDesc = `Recorded in [[${note.title}]]`;

        if (fmTimeline) {
          const parts = fmTimeline.split('|').map(s => s.trim());
          if (parts.length === 1) {
            rawYear = parts[0];
          } else if (parts.length === 2) {
            rawYear = parts[0];
            rawTitle = parts[1];
          } else if (parts.length === 3) {
            if (/age|era|epoch|period|century|convergence|dynasty|bce/i.test(parts[1])) {
              rawYear = parts[0];
              rawEra = parts[1];
              rawTitle = parts[2];
            } else {
              rawYear = parts[0];
              rawTitle = parts[1];
              rawDesc = parts[2];
            }
          } else if (parts.length >= 4) {
            rawYear = parts[0];
            rawEra = parts[1];
            rawTitle = parts[2];
            rawDesc = parts.slice(3).join(' | ');
          }
        }
        if (fm['title']) rawTitle = fm['title'];
        if (fm['description']) rawDesc = fm['description'];
        if (!rawEra) rawEra = _inferEra(rawYear);

        parsed.push({
          id: `note-evt-fm-${note.id}-${matchIdx}`,
          year: rawYear,
          era: rawEra,
          title: rawTitle,
          description: rawDesc,
          noteId: note.id,
          noteTitle: note.title,
          category: note.category,
          source: 'note',
          isNoteEvent: true,
          createdAt: note.createdAt
        });
      }

      // 2. @timeline: and @event: syntax
      timelineRegex.lastIndex = 0;
      let match;
      while ((match = timelineRegex.exec(bodyWithoutFm)) !== null) {
        matchIdx++;
        const content = match[1].trim();
        const parts = content.split('|').map(s => s.trim());
        let rawYear = 'Unknown Date';
        let rawEra = '';
        let rawTitle = note.title;
        let rawDesc = `Recorded in [[${note.title}]]`;

        if (parts.length === 1) {
          rawYear = parts[0];
        } else if (parts.length === 2) {
          rawYear = parts[0];
          rawTitle = parts[1];
        } else if (parts.length === 3) {
          if (/age|era|epoch|period|century|convergence|dynasty|bce/i.test(parts[1])) {
            rawYear = parts[0];
            rawEra = parts[1];
            rawTitle = parts[2];
          } else {
            rawYear = parts[0];
            rawTitle = parts[1];
            rawDesc = parts[2];
          }
        } else if (parts.length >= 4) {
          rawYear = parts[0];
          rawEra = parts[1];
          rawTitle = parts[2];
          rawDesc = parts.slice(3).join(' | ');
        }

        if (!rawEra) rawEra = _inferEra(rawYear);

        parsed.push({
          id: `note-evt-${note.id}-${matchIdx}`,
          year: rawYear || 'Unknown Date',
          era: rawEra || _inferEra(rawYear),
          title: rawTitle || note.title,
          description: rawDesc || `Recorded in [[${note.title}]]`,
          noteId: note.id,
          noteTitle: note.title,
          category: note.category,
          source: 'note',
          isNoteEvent: true,
          createdAt: note.createdAt
        });
      }

      // 3. Inline timeline hashtag #timeline/Year-X
      inlineTagRegex.lastIndex = 0;
      let tagMatch;
      while ((tagMatch = inlineTagRegex.exec(bodyWithoutFm)) !== null) {
        matchIdx++;
        const tagValue = tagMatch[1].replace(/[-_]/g, ' ').trim();
        parsed.push({
          id: `note-evt-tag-${note.id}-${matchIdx}`,
          year: tagValue,
          era: _inferEra(tagValue),
          title: note.title,
          description: `Timeline marker #${tagMatch[0]} in [[${note.title}]]`,
          noteId: note.id,
          noteTitle: note.title,
          category: note.category,
          source: 'note',
          isNoteEvent: true,
          createdAt: note.createdAt
        });
      }
    }
    return parsed;
  }

  function getAllTimelineEvents() {
    const manual = getTimelineEvents().map(e => Object.assign({}, e, { source: 'manual' }));
    const fromNotes = scanNotesForEvents();
    const all = [...manual, ...fromNotes];

    all.sort((a, b) => {
      const numA = _parseYearNumber(a.year);
      const numB = _parseYearNumber(b.year);
      if (numA !== numB) return numA - numB;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

    return all;
  }

  // ── Deep Worldbuilding: Character Relationship Matrix & Codex ──

  function getCharacters() {
    try {
      const raw = localStorage.getItem(CHARACTERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function _saveCharacters(chars) {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(chars));
  }

  function saveCharacter(char) {
    const chars = getCharacters();
    if (!char.id) {
      char.id = 'char-' + _uid();
      char.createdAt = Date.now();
      chars.push(char);
    } else {
      const idx = chars.findIndex(c => c.id === char.id);
      if (idx !== -1) {
        chars[idx] = Object.assign({}, chars[idx], char, { updatedAt: Date.now() });
      } else {
        char.createdAt = char.createdAt || Date.now();
        chars.push(char);
      }
    }
    _saveCharacters(chars);
    return char;
  }

  function deleteCharacter(id) {
    const chars = getCharacters().filter(c => c.id !== id);
    _saveCharacters(chars);
    const rels = getRelationships().filter(r => r.sourceId !== id && r.targetId !== id);
    _saveRelationships(rels);
  }

  function getRelationships() {
    try {
      const raw = localStorage.getItem(RELATIONSHIPS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function _saveRelationships(rels) {
    localStorage.setItem(RELATIONSHIPS_KEY, JSON.stringify(rels));
  }

  function saveRelationship(rel) {
    const rels = getRelationships();
    if (!rel.id) {
      rel.id = 'rel-' + _uid();
      rel.createdAt = Date.now();
      rels.push(rel);
    } else {
      const idx = rels.findIndex(r => r.id === rel.id);
      if (idx !== -1) {
        rels[idx] = Object.assign({}, rels[idx], rel, { updatedAt: Date.now() });
      } else {
        rel.createdAt = rel.createdAt || Date.now();
        rels.push(rel);
      }
    }
    _saveRelationships(rels);
    return rel;
  }

  function deleteRelationship(id) {
    const rels = getRelationships().filter(r => r.id !== id);
    _saveRelationships(rels);
  }

  function _slugify(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
  }

  function scanNotesForCharacters(providedNotes) {
    const notes = providedNotes || getAllNotes();
    const charsFromNotes = [];
    const relsFromNotes = [];

    const charRegex = /@character:\s*([^\n]+)/gi;
    const relRegex = /(?:@relationship|@rel):\s*([^\n]+)/gi;

    for (const note of notes) {
      const tags = (note.tags || '').toLowerCase();
      const fullBody = note.body || '';
      const { frontmatter: fm, bodyWithoutFm } = _parseFrontmatter(fullBody);

      let explicitCharsInNote = [];

      charRegex.lastIndex = 0;
      let match;
      while ((match = charRegex.exec(bodyWithoutFm)) !== null) {
        const parts = match[1].split('|').map(s => s.trim());
        const name = parts[0] || note.title;
        const archetype = parts[1] || 'Ally';
        const faction = parts[2] || 'Independent';
        const bio = parts.slice(3).join(' | ') || '';
        const charObj = {
          id: 'note-char-' + _slugify(name),
          name,
          archetype,
          faction,
          bio,
          noteId: note.id,
          source: 'note',
          createdAt: note.createdAt
        };
        charsFromNotes.push(charObj);
        explicitCharsInNote.push(charObj);
      }

      // Frontmatter or tag character detection
      const isFmChar = fm['type'] === 'character' || fm['character'] === 'true' || !!fm['archetype'] || !!fm['role'];
      const hasCharTag = tags.includes('character') || tags.includes('#character') || fullBody.includes('#character');
      const hasArchetypeTag = tags.includes('protagonist') || tags.includes('antagonist') || tags.includes('mentor') || tags.includes('rival') || tags.includes('ally');

      // Note represents a character only if explicitly tagged or specified in frontmatter
      if (explicitCharsInNote.length === 0 && (isFmChar || hasCharTag || hasArchetypeTag)) {
        let archetype = fm['archetype'] || 'Ally';
        if (!fm['archetype']) {
          if (tags.includes('protagonist') || /protagonist/i.test(bodyWithoutFm)) archetype = 'Protagonist';
          else if (tags.includes('antagonist') || /antagonist/i.test(bodyWithoutFm)) archetype = 'Antagonist';
          else if (tags.includes('mentor') || /mentor/i.test(bodyWithoutFm)) archetype = 'Mentor';
          else if (tags.includes('rival') || /rival/i.test(bodyWithoutFm)) archetype = 'Rival';
        }

        let faction = fm['faction'] || fm['allegiance'] || 'Independent';
        if (!fm['faction'] && !fm['allegiance']) {
          const factionMatch = bodyWithoutFm.match(/(?:faction|allegiance|order|fellowship):\s*([^\n]+)/i);
          if (factionMatch) faction = factionMatch[1].trim();
        }

        const charObj = {
          id: 'note-char-' + _slugify(note.title),
          name: note.title,
          archetype,
          faction,
          role: fm['role'] || '',
          bio: fm['bio'] || bodyWithoutFm.replace(/^[#\s*>-]+/gm, '').slice(0, 140).trim(),
          noteId: note.id,
          source: 'note',
          createdAt: note.createdAt
        };
        charsFromNotes.push(charObj);
        explicitCharsInNote.push(charObj);
      }

      // Parse relationships
      relRegex.lastIndex = 0;
      let rMatch;
      let relIdx = 0;
      while ((rMatch = relRegex.exec(bodyWithoutFm)) !== null) {
        relIdx++;
        const line = rMatch[1].trim();
        const parts = line.split('|').map(s => s.trim());
        let sourceName = explicitCharsInNote.length > 0 ? explicitCharsInNote[0].name : note.title;
        let targetName = '';
        let relType = 'Allied with';
        let relDesc = '';

        // Check if syntax has -> e.g. "Vespera -> Corvus" or "[[Vespera]] -> [[Corvus]]"
        const arrowMatch = parts[0].match(/(?:\[\[([^\]]+)\]\]|([^->]+))\s*->\s*(?:\[\[([^\]]+)\]\]|(.+))/);
        if (arrowMatch) {
          sourceName = (arrowMatch[1] || arrowMatch[2] || '').trim();
          targetName = (arrowMatch[3] || arrowMatch[4] || '').trim();
          relType = parts[1] || 'Allied with';
          relDesc = parts.slice(2).join(' | ');
        } else {
          // Syntax: "[[Target]] | Type | Description" or "Target | Type | Description"
          const cleanTarget = parts[0].replace(/^\[\[/, '').replace(/\]\]$/, '').trim();
          targetName = cleanTarget;
          relType = parts[1] || 'Allied with';
          relDesc = parts.slice(2).join(' | ');
        }

        if (targetName) {
          relsFromNotes.push({
            id: `note-rel-${note.id}-${relIdx}-${_slugify(targetName)}`,
            sourceName,
            targetName,
            type: relType,
            description: relDesc,
            noteId: note.id,
            source: 'note'
          });
        }
      }
    }

    const result = charsFromNotes;
    result.characters = charsFromNotes;
    result.relationships = relsFromNotes;
    return result;
  }

  function getAllCharacters() {
    const manual = getCharacters();
    const { characters: fromNotes } = scanNotesForCharacters();
    const map = new Map();

    for (const c of fromNotes) {
      map.set(c.name.trim().toLowerCase(), c);
    }
    for (const c of manual) {
      map.set(c.name.trim().toLowerCase(), c);
    }

    return Array.from(map.values());
  }

  function getAllRelationships() {
    const manual = getRelationships();
    const { relationships: fromNotes } = scanNotesForCharacters();
    const chars = getAllCharacters();
    const charNameMap = new Map();
    chars.forEach(c => {
      charNameMap.set(c.name.trim().toLowerCase(), c.id);
      charNameMap.set(_slugify(c.name), c.id);
    });

    const parsedNoteRels = [];
    for (const r of fromNotes) {
      const sId = charNameMap.get((r.sourceName || '').trim().toLowerCase()) || charNameMap.get(_slugify(r.sourceName));
      const tId = charNameMap.get((r.targetName || '').trim().toLowerCase()) || charNameMap.get(_slugify(r.targetName));
      if (sId && tId && sId !== tId) {
        parsedNoteRels.push({
          id: r.id,
          sourceId: sId,
          targetId: tId,
          type: r.type,
          description: r.description,
          source: 'note'
        });
      }
    }

    const map = new Map();
    for (const r of parsedNoteRels) {
      map.set(`${r.sourceId}->${r.targetId}`, r);
    }
    for (const r of manual) {
      map.set(`${r.sourceId}->${r.targetId}`, r);
    }

    return Array.from(map.values());
  }

  // ── Export / Import ──

  function exportJSON() {
    const data = {
      version: 2,
      appName: 'Lord Spey',
      exportedAt: new Date().toISOString(),
      notes: getAllNotes(),
      mapPins: getAllMapPins(),
      timelineEvents: getTimelineEvents(),
      characters: getCharacters(),
      relationships: getRelationships()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    if (typeof document !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lordspey-vault-${_datestamp()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
    return jsonStr;
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

    if (typeof document !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTitle = (note.title || 'note').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      a.href = url;
      a.download = `${safeTitle}.md`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
    return content;
  }

  function importJSON(file) {
    if (typeof file === 'string' || (file && typeof file === 'object' && typeof file.slice !== 'function' && !file.name)) {
      try {
        const data = typeof file === 'string' ? JSON.parse(file) : file;
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

        if (data.mapPins && Array.isArray(data.mapPins)) {
          _saveMapPins(data.mapPins);
        }
        if (data.timelineEvents && Array.isArray(data.timelineEvents)) {
          _saveTimelineEvents(data.timelineEvents);
        }
        if (data.characters && Array.isArray(data.characters)) {
          _saveCharacters(data.characters);
        }
        if (data.relationships && Array.isArray(data.relationships)) {
          _saveRelationships(data.relationships);
        }

        const p = Promise.resolve({ success: true, added });
        p.success = true;
        p.added = added;
        return p;
      } catch (err) {
        const p = Promise.reject(err);
        p.success = false;
        return p;
      }
    }
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

          if (data.mapPins && Array.isArray(data.mapPins)) {
            _saveMapPins(data.mapPins);
          }
          if (data.timelineEvents && Array.isArray(data.timelineEvents)) {
            _saveTimelineEvents(data.timelineEvents);
          }
          if (data.characters && Array.isArray(data.characters)) {
            _saveCharacters(data.characters);
          }
          if (data.relationships && Array.isArray(data.relationships)) {
            _saveRelationships(data.relationships);
          }

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
    saveNote,
    updateNote,
    deleteNote,
    clearAllNotes,
    clearVault: clearAllNotes,
    loadStarterVault,
    searchNotes,
    getNotesByCategory,
    getBacklinks,
    getSettings,
    saveSetting,
    exportJSON,
    exportMarkdown,
    importJSON,
    // Map Pins
    getAllMapPins,
    getMapPins: getAllMapPins,
    getMapPin,
    saveMapPin,
    deleteMapPin,
    getCustomMapImage,
    saveCustomMapImage,
    clearCustomMapImage,
    // Timeline
    getTimelineEvents,
    saveTimelineEvent,
    deleteTimelineEvent,
    getAllTimelineEvents,
    scanNotesForEvents,
    // Character Codex & Relationships
    getCharacters,
    saveCharacter,
    deleteCharacter,
    getRelationships,
    saveRelationship,
    deleteRelationship,
    getAllCharacters,
    getAllRelationships,
    scanNotesForCharacters,
    scanNotesForRelationships: (notes) => scanNotesForCharacters(notes).relationships,
  };
})();
