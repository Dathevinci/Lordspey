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

  // ── Project Metadata & Statistics ──

  function getProjectTitle() {
    const s = getSettings();
    if (s && s.projectTitle && s.projectTitle.trim()) {
      return s.projectTitle.trim();
    }
    const notes = getAllNotes();
    const chapter = notes.find(n => n.category === 'chapter');
    if (chapter && chapter.title && chapter.title.trim()) {
      return chapter.title.trim();
    }
    if (notes.length > 0 && notes[0].title && notes[0].title.trim()) {
      return notes[0].title.trim();
    }
    return 'Lord Spey Manuscript';
  }

  function getWorkspaceStats() {
    const rawNotes = getAllNotes();
    const notes = rawNotes.filter(n => n && typeof n === 'object');
    const mapPins = getAllMapPins().filter(p => p && typeof p === 'object');
    const timelineEvents = getTimelineEvents().filter(e => e && typeof e === 'object');
    const characters = getCharacters().filter(c => c && typeof c === 'object');
    const relationships = getRelationships().filter(r => r && typeof r === 'object');
    const noteCounts = { chapter: 0, lore: 0, world: 0, draft: 0, total: notes.length };
    let wordCount = 0;
    for (const n of notes) {
      if (n.category && noteCounts[n.category] !== undefined) {
        noteCounts[n.category]++;
      }
      if (typeof n.body === 'string' && n.body.trim()) {
        wordCount += n.body.trim().split(/\s+/).length;
      }
    }
    return {
      totalNotes: notes.length,
      chapters: noteCounts.chapter,
      lore: noteCounts.lore,
      world: noteCounts.world,
      drafts: noteCounts.draft,
      wordCount,
      noteCounts,
      mapPins: mapPins.length,
      timelineEvents: timelineEvents.length,
      characters: characters.length,
      relationships: relationships.length,
      hasCustomMap: !!getCustomMapImage()
    };
  }

  // ── Backup Protection ──
  const BACKUP_KEY = 'lordspey_vault_backup';

  function createBackup() {
    const snapshot = {
      timestamp: new Date().toISOString(),
      notes: getAllNotes(),
      mapPins: getAllMapPins(),
      customMapImage: getCustomMapImage(),
      timelineEvents: getTimelineEvents(),
      characters: getCharacters(),
      relationships: getRelationships(),
      settings: getSettings()
    };
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(snapshot));
    } catch (e) {
      console.warn('Unable to persist backup snapshot to localStorage:', e);
    }
    return snapshot;
  }

  function getVaultBackup() {
    try {
      const raw = localStorage.getItem(BACKUP_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function restoreVaultBackup() {
    const b = getVaultBackup();
    if (!b) return false;
    return importSpeyPackage(b, 'replace', false);
  }

  // ── Export / Import ──

  function exportSpeyPackage(options = {}) {
    const stats = getWorkspaceStats();
    const rawTitle = (options.projectTitle && typeof options.projectTitle === 'string' && options.projectTitle.trim()) || getProjectTitle();
    const projectTitle = typeof rawTitle === 'string' ? rawTitle.trim() : 'Lord Spey Manuscript';
    const safeBase = projectTitle
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .trim();
    const fileName = (safeBase || 'lord-spey-manuscript') + '.spey';

    const pkg = {
      format: 'lord-spey-package',
      version: 1,
      appName: 'Lord Spey',
      exportedAt: new Date().toISOString(),
      projectName: projectTitle,
      title: projectTitle,
      stats: {
        totalNotes: stats.totalNotes,
        chapters: stats.chapters,
        lore: stats.lore,
        world: stats.world,
        drafts: stats.drafts,
        wordCount: stats.wordCount,
        mapPins: stats.mapPins,
        timelineEvents: stats.timelineEvents,
        characters: stats.characters,
        relationships: stats.relationships
      },
      noteCounts: stats.noteCounts,
      wordCount: stats.wordCount,
      notes: getAllNotes(),
      mapPins: getAllMapPins(),
      customMapImage: getCustomMapImage(),
      timelineEvents: getTimelineEvents(),
      characters: getCharacters(),
      relationships: getRelationships(),
      settings: getSettings()
    };

    const jsonStr = JSON.stringify(pkg, null, 2);

    if (typeof document !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const mimeType = options.mimeType || 'application/x-lord-spey';
      const blob = new Blob([jsonStr], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    return pkg;
  }

  function validateSpeyPackage(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Data is not an object' };
    }
    if (data.format === 'lord-spey-package') {
      if (!data.version || typeof data.version !== 'number') {
        return { valid: false, error: 'Invalid or missing package version' };
      }
      if (!Array.isArray(data.notes)) {
        return { valid: false, error: 'Package notes must be an array' };
      }
      return { valid: true, isSpey: true, data };
    }
    // Backward compatibility with generic vault JSON
    if (Array.isArray(data.notes)) {
      return { valid: true, isSpey: false, data };
    }
    if (Array.isArray(data)) {
      return { valid: true, isSpey: false, data: { notes: data } };
    }
    return { valid: false, error: 'Unrecognized format: Expected Lord Spey package (.spey) or vault JSON' };
  }

  function parseSpeyPackage(raw) {
    let data;
    if (typeof raw === 'string') {
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error('Invalid JSON format: unable to parse project package');
      }
    } else if (raw && typeof raw === 'object') {
      data = raw;
    } else {
      throw new Error('Invalid input: expected JSON string or project package object');
    }

    const val = validateSpeyPackage(data);
    if (!val.valid) {
      throw new Error(val.error);
    }
    const d = val.data;
    const rawNotes = Array.isArray(d.notes) ? d.notes : [];
    const notes = rawNotes.filter(n => n && typeof n === 'object');
    const mapPins = Array.isArray(d.mapPins) ? d.mapPins.filter(p => p && typeof p === 'object') : [];
    const timelineEvents = Array.isArray(d.timelineEvents) ? d.timelineEvents.filter(e => e && typeof e === 'object') : [];
    const characters = Array.isArray(d.characters) ? d.characters.filter(c => c && typeof c === 'object') : [];
    const relationships = Array.isArray(d.relationships) ? d.relationships.filter(r => r && typeof r === 'object') : [];

    let wordCount = 0;
    if (typeof d.wordCount === 'number') {
      wordCount = d.wordCount;
    } else if (d.stats && typeof d.stats.wordCount === 'number') {
      wordCount = d.stats.wordCount;
    } else {
      for (const n of notes) {
        if (typeof n.body === 'string' && n.body.trim()) {
          wordCount += n.body.trim().split(/\s+/).length;
        }
      }
    }

    let chapters = 0;
    let lore = 0;
    let world = 0;
    let drafts = 0;
    for (const n of notes) {
      if (n.category === 'chapter') chapters++;
      else if (n.category === 'lore') lore++;
      else if (n.category === 'world') world++;
      else if (n.category === 'draft') drafts++;
    }

    const firstChap = notes.find(n => n.category === 'chapter');
    const firstNote = notes[0];
    const title = (typeof d.projectName === 'string' && d.projectName.trim()) ||
      (typeof d.title === 'string' && d.title.trim()) ||
      (firstChap && typeof firstChap.title === 'string' && firstChap.title.trim()) ||
      (firstNote && typeof firstNote.title === 'string' && firstNote.title.trim()) ||
      'Lord Spey Project';

    return {
      projectName: title,
      title,
      totalNotes: notes.length,
      chapters,
      lore,
      world,
      drafts,
      wordCount,
      mapPinsCount: mapPins.length,
      timelineEventsCount: timelineEvents.length,
      charactersCount: characters.length,
      relationshipsCount: relationships.length,
      hasCustomMap: typeof d.customMapImage === 'string' && !!d.customMapImage,
      isSpey: !!val.isSpey,
      raw: d
    };
  }

  function importSpeyPackage(packageInput, mode = 'replace', performBackup = true) {
    const parsed = parseSpeyPackage(packageInput);
    const d = parsed.raw;

    if (mode === 'replace') {
      if (performBackup) {
        createBackup();
      }
      clearAllNotes();
      _saveMapPins([]);
      clearCustomMapImage();
      _saveTimelineEvents([]);
      _saveCharacters([]);
      _saveRelationships([]);

      const rawNotes = Array.isArray(d.notes) ? d.notes : [];
      const sanitizedNotes = rawNotes
        .filter(n => n && typeof n === 'object')
        .map(n => ({
          id: n.id || _uid(),
          title: typeof n.title === 'string' ? n.title : 'Untitled',
          category: typeof n.category === 'string' ? n.category : 'draft',
          tags: typeof n.tags === 'string' ? n.tags : '',
          body: typeof n.body === 'string' ? n.body : '',
          createdAt: n.createdAt || Date.now(),
          updatedAt: n.updatedAt || Date.now()
        }));
      _saveAll(sanitizedNotes);

      if (Array.isArray(d.mapPins)) {
        _saveMapPins(d.mapPins.filter(p => p && typeof p === 'object').map(p => ({
          id: p.id || _uid(),
          title: typeof p.title === 'string' ? p.title : 'Pin',
          category: typeof p.category === 'string' ? p.category : 'world',
          x: typeof p.x === 'number' ? p.x : 50,
          y: typeof p.y === 'number' ? p.y : 50,
          description: typeof p.description === 'string' ? p.description : '',
          noteId: p.noteId || null
        })));
      }
      if (typeof d.customMapImage === 'string' && d.customMapImage) {
        saveCustomMapImage(d.customMapImage);
      }
      if (Array.isArray(d.timelineEvents)) {
        _saveTimelineEvents(d.timelineEvents.filter(e => e && typeof e === 'object').map(e => ({
          id: e.id || _uid(),
          title: typeof e.title === 'string' ? e.title : 'Milestone',
          year: typeof e.year === 'string' ? e.year : '',
          era: typeof e.era === 'string' ? e.era : '',
          category: typeof e.category === 'string' ? e.category : 'lore',
          description: typeof e.description === 'string' ? e.description : '',
          noteId: e.noteId || null
        })));
      }
      if (Array.isArray(d.characters)) {
        _saveCharacters(d.characters.filter(c => c && typeof c === 'object').map(c => ({
          id: c.id || _uid(),
          name: typeof c.name === 'string' ? c.name : 'Unknown',
          archetype: typeof c.archetype === 'string' ? c.archetype : 'Protagonist',
          faction: typeof c.faction === 'string' ? c.faction : '',
          role: typeof c.role === 'string' ? c.role : '',
          bio: typeof c.bio === 'string' ? c.bio : '',
          noteId: c.noteId || null
        })));
      }
      if (Array.isArray(d.relationships)) {
        _saveRelationships(d.relationships.filter(r => r && typeof r === 'object').map(r => ({
          id: r.id || _uid(),
          sourceId: r.sourceId || null,
          sourceName: r.sourceName || '',
          targetId: r.targetId || null,
          targetName: r.targetName || '',
          type: r.type || 'Allied with',
          description: typeof r.description === 'string' ? r.description : ''
        })));
      }
      if (d.settings && typeof d.settings === 'object') {
        const currentSettings = getSettings();
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...currentSettings, ...d.settings }));
      }
      return {
        success: true,
        mode: 'replace',
        notesCount: sanitizedNotes.length,
        summary: parsed
      };
    } else {
      // mode === 'merge'
      const existingNotes = getAllNotes().filter(n => n && typeof n === 'object');
      const existingIds = new Set(existingNotes.map(n => n.id));
      const noteIdMap = {};
      let addedNotes = 0;
      const rawNotes = Array.isArray(d.notes) ? d.notes : [];
      const incomingNotes = rawNotes.filter(n => n && typeof n === 'object');

      for (const note of incomingNotes) {
        const safeNote = {
          id: note.id || _uid(),
          title: typeof note.title === 'string' ? note.title : 'Untitled',
          category: typeof note.category === 'string' ? note.category : 'draft',
          tags: typeof note.tags === 'string' ? note.tags : '',
          body: typeof note.body === 'string' ? note.body : '',
          createdAt: note.createdAt || Date.now(),
          updatedAt: note.updatedAt || Date.now()
        };

        if (!existingIds.has(safeNote.id)) {
          existingNotes.push(safeNote);
          existingIds.add(safeNote.id);
          addedNotes++;
        } else {
          // Collision: generate new ID and track mapping
          const newId = _uid();
          if (note.id) noteIdMap[note.id] = newId;
          const clone = { ...safeNote, id: newId };
          existingNotes.push(clone);
          existingIds.add(clone.id);
          addedNotes++;
        }
      }
      _saveAll(existingNotes);

      // Merge map pins with collision remapping & noteId link repair
      const existingPins = getAllMapPins().filter(p => p && typeof p === 'object');
      const pinIds = new Set(existingPins.map(p => p.id));
      if (Array.isArray(d.mapPins)) {
        for (const p of d.mapPins) {
          if (!p || typeof p !== 'object') continue;
          let pinClone = {
            id: p.id || _uid(),
            title: typeof p.title === 'string' ? p.title : 'Pin',
            category: typeof p.category === 'string' ? p.category : 'world',
            x: typeof p.x === 'number' ? p.x : 50,
            y: typeof p.y === 'number' ? p.y : 50,
            description: typeof p.description === 'string' ? p.description : '',
            noteId: p.noteId || null
          };
          if (pinIds.has(pinClone.id)) {
            pinClone.id = _uid();
          }
          pinIds.add(pinClone.id);
          if (pinClone.noteId && noteIdMap[pinClone.noteId]) {
            pinClone.noteId = noteIdMap[pinClone.noteId];
          }
          existingPins.push(pinClone);
        }
        _saveMapPins(existingPins);
      }

      // Merge custom map image if current doesn't have one
      if (!getCustomMapImage() && typeof d.customMapImage === 'string' && d.customMapImage) {
        saveCustomMapImage(d.customMapImage);
      }

      // Merge timeline events with collision remapping & noteId link repair
      const existingEvents = getTimelineEvents().filter(e => e && typeof e === 'object');
      const eventIds = new Set(existingEvents.map(e => e.id));
      if (Array.isArray(d.timelineEvents)) {
        for (const ev of d.timelineEvents) {
          if (!ev || typeof ev !== 'object') continue;
          let evClone = {
            id: ev.id || _uid(),
            title: typeof ev.title === 'string' ? ev.title : 'Milestone',
            year: typeof ev.year === 'string' ? ev.year : '',
            era: typeof ev.era === 'string' ? ev.era : '',
            category: typeof ev.category === 'string' ? ev.category : 'lore',
            description: typeof ev.description === 'string' ? ev.description : '',
            noteId: ev.noteId || null
          };
          if (eventIds.has(evClone.id)) {
            evClone.id = _uid();
          }
          eventIds.add(evClone.id);
          if (evClone.noteId && noteIdMap[evClone.noteId]) {
            evClone.noteId = noteIdMap[evClone.noteId];
          }
          existingEvents.push(evClone);
        }
        _saveTimelineEvents(existingEvents);
      }

      // Merge characters with collision remapping & noteId link repair
      const existingChars = getCharacters().filter(c => c && typeof c === 'object');
      const charIds = new Set(existingChars.map(c => c.id));
      const charIdMap = {};
      if (Array.isArray(d.characters)) {
        for (const ch of d.characters) {
          if (!ch || typeof ch !== 'object') continue;
          let chClone = {
            id: ch.id || _uid(),
            name: typeof ch.name === 'string' ? ch.name : 'Unknown',
            archetype: typeof ch.archetype === 'string' ? ch.archetype : 'Protagonist',
            faction: typeof ch.faction === 'string' ? ch.faction : '',
            role: typeof ch.role === 'string' ? ch.role : '',
            bio: typeof ch.bio === 'string' ? ch.bio : '',
            noteId: ch.noteId || null
          };
          const trimmedName = chClone.name.trim().toLowerCase();
          const existingCharMatch = existingChars.find(c => (c.name || '').trim().toLowerCase() === trimmedName);
          if (existingCharMatch) {
            if (ch.id) charIdMap[ch.id] = existingCharMatch.id;
          } else {
            if (charIds.has(chClone.id)) {
              const newId = _uid();
              if (ch.id) charIdMap[ch.id] = newId;
              chClone.id = newId;
            }
            charIds.add(chClone.id);
            if (chClone.noteId && noteIdMap[chClone.noteId]) {
              chClone.noteId = noteIdMap[chClone.noteId];
            }
            existingChars.push(chClone);
          }
        }
        _saveCharacters(existingChars);
      }

      // Merge relationships with remapped character IDs
      const existingRels = getRelationships().filter(r => r && typeof r === 'object');
      const relKeys = new Set(existingRels.map(r => `${r.sourceId || r.sourceName}->${r.targetId || r.targetName}`));
      const relIds = new Set(existingRels.map(r => r.id));
      if (Array.isArray(d.relationships)) {
        for (const r of d.relationships) {
          if (!r || typeof r !== 'object') continue;
          let relClone = {
            id: r.id || _uid(),
            sourceId: r.sourceId || null,
            sourceName: r.sourceName || '',
            targetId: r.targetId || null,
            targetName: r.targetName || '',
            type: r.type || 'Allied with',
            description: typeof r.description === 'string' ? r.description : ''
          };
          if (relClone.sourceId && charIdMap[relClone.sourceId]) {
            relClone.sourceId = charIdMap[relClone.sourceId];
          }
          if (relClone.targetId && charIdMap[relClone.targetId]) {
            relClone.targetId = charIdMap[relClone.targetId];
          }
          const k = `${relClone.sourceId || relClone.sourceName}->${relClone.targetId || relClone.targetName}`;
          if (!relKeys.has(k)) {
            if (relIds.has(relClone.id)) {
              relClone.id = _uid();
            }
            relIds.add(relClone.id);
            relKeys.add(k);
            existingRels.push(relClone);
          }
        }
        _saveRelationships(existingRels);
      }

      return {
        success: true,
        mode: 'merge',
        addedNotes,
        summary: parsed
      };
    }
  }

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
        const parsed = parseSpeyPackage(file);
        const res = importSpeyPackage(parsed.raw, 'merge', false);
        const p = Promise.resolve({ success: true, added: res.addedNotes !== undefined ? res.addedNotes : res.notesCount });
        p.success = true;
        p.added = res.addedNotes !== undefined ? res.addedNotes : res.notesCount;
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
          const parsed = parseSpeyPackage(reader.result);
          const res = importSpeyPackage(parsed.raw, 'merge', false);
          resolve(res.addedNotes !== undefined ? res.addedNotes : res.notesCount);
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
    getProjectTitle,
    getWorkspaceStats,
    exportJSON,
    exportMarkdown,
    importJSON,
    // .spey Package Architecture & Backup
    exportSpeyPackage,
    exportSpey: exportSpeyPackage,
    validateSpeyPackage,
    parseSpeyPackage,
    importSpeyPackage,
    importSpey: importSpeyPackage,
    createBackup,
    getVaultBackup,
    restoreVaultBackup,
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
