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
      id: 'demo-chap-prologue',
      title: 'Prologue: The Veil of Embers',
      category: 'chapter',
      tags: 'act-1, prologue, manuscript, convergence',
      body: `# Prologue: The Veil of Embers

The obsidian bell in the celestial spire tolled midnight, shivering across the frozen crags of [[The Ashen Vale]] like a dying pulse.

Vespera pulled her wool mantle tight against the piercing alpine wind. Far below, in the shadows of [[The Obsidian Gate]], torches flickered as the sentinels prepared for the convergence.

— Keep your gaze upon the third star, Vespera, — muttered [[Lord Commander Corvus]], his hand resting lightly upon the pommel of his veilblade. — The sky does not forgive hesitation.

— The seals have held for five centuries, Commander, — she replied softly, her fingers tracing the brass casing of [[The Star Astrolabe]]. — Why would tonight be any different?

— Because tonight, ==the third star bleeds crimson across the snow==.

* * *

> [!NOTE]
> The convergence occurs once every half-millennium, when the twin celestial moons align directly over the zenith of [[The Obsidian Spire & Gate]].

Corvus unrolled a weathered parchment upon the stone balustrade, pointing with a gloved finger toward the planetary alignments[^1]:

| Celestial Sphere | Orbital Alignment | Ascendant Influence |
| :--- | :---: | ---: |
| The Obsidian Moon | 45° Zenith | Wards of [[The Obsidian Gate]] |
| The Blood Comet | 12° Nadir | Seismo-arcana in [[The Ashen Vale]] |
| The Primordial Star | Absolute Apex | Catalyst of the Veil Seal |

— We thought ~~the ancient treaties will protect us~~ from external greed, — Corvus spat into the howling wind. — But [[High Inquisitor Malakor]] does not honor treaties written by scholars. His vanguard left [[The Sunken Bastion]] before dusk.

Vespera turned the central dial of the astrolabe. A sharp click resonated through the metal—the first ward had begun to dissolve.

* * *

> [!QUOTE]
> *"When the veil thins to silk, those who hunger for fire shall feast upon the ashes of our citadel."*
> — Chrono-Archive Codex, Year 120

Tonight's vigil demanded three non-negotiable objectives:
- [x] Ascend to the High Observatory of [[The Obsidian Spire & Gate]]
- [x] Calibrate [[The Star Astrolabe]] against the midnight alignment
- [ ] Safeguard the archive ciphers before the Iron Tribunal arrives

[^1]: Recorded in the astronomical scrolls deciphered by [[Scholar Lyra]] during the Year 340 celestial survey.`,
      createdAt: Date.now() - 86400000 * 4,
      updatedAt: Date.now() - 86400000 * 4,
    },
    {
      id: 'demo-chap-1',
      title: 'Chapter I: The Obsidian Gate',
      category: 'chapter',
      tags: 'act-1, chapter-1, manuscript, infiltration',
      body: `# Chapter I: The Obsidian Gate

The iron-reinforced portcullis shivered as a concussive shockwave rippled through the subterranean tunnels of [[The Ashen Vale]].

— Bar the secondary gates! — shouted [[Lord Commander Corvus]], his voice cutting through the panic echoing down the arched stone corridors. — [[The Order of Lore]] will not yield this sanctuary while breath remains in our lungs!

Vespera sprinted past the scriptorium, clutching [[The Star Astrolabe]] close against her ribs. The brass rings were burning hot, humming with harmonic resonance as the celestial seal began its unraveling.

> [!WARNING]
> High Inquisitor Malakor's siege engines have breached the outer perimeter wall of [[The Obsidian Spire & Gate]]. Inquisitorial skirmishers are within the lower ramparts.

She reached the threshold of the Grand Vault. [[Scholar Lyra]] was frantically gathering illuminated parchment folios into leather travel cases.

— Lyra! Have you decoded the final quadrant? — Vespera gasped, leaning against the cold stone lintel.

— Almost, — Lyra answered without looking up, her quill scratching fiercely across the vellum[^1]. — The cipher requires three separate harmonics. Corvus holds the iron key, but the astrological vector points straight toward [[The Sunken Bastion]]!

— We can ~~surrender the celestial archives~~ to spare the initiates, — whispered a frightened novice, cowering beneath the stone shelves.

— We surrender nothing, — Lyra snapped fiercely. — ==Our sacred oath to the stars is non-negotiable==!

* * *

| Garrison Defense Sector | Commander | Defensive Status |
| :--- | :--- | :--- |
| Upper Celestial Apex | [[Scholar Lyra]] | Intact (Archive evacuation underway) |
| Obsidian Gate Arch | [[Lord Commander Corvus]] | Engaged with [[High Inquisitor Malakor]] |
| Lower Subterranean Sluice | Sentinel Cohort IV | Compromised (Hostiles advancing) |

* * *

From the parapet above, the horn of the Iron Tribunal blared—a low, mournful drone that rattled the stained glass windows.

— Go, Vespera! — Lyra pleaded, shoving the cipher scroll into Vespera's satchel. — If [[High Inquisitor Malakor]] claims the astrolabe, the entire valley will burn in celestial fire. You must take the mountain trail toward [[The Ashen Vale]]!

Vespera hesitated for a fraction of a heartbeat, then gripped her cloak and turned toward the shadowed escape tunnel.

[^1]: The decipherment uses the dual-alphabet transcription established in [[Story Beats & Master Arc]].`,
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'demo-lore-order',
      title: 'The Order of Lore',
      category: 'lore',
      tags: 'faction, monastics, archives, veil-keepers',
      body: `# The Order of Lore

An ancient monastic fellowship established in Year 120, dedicated to safeguarding forbidden celestial knowledge, astro-arcana, and cosmic chronicles.

> [!NOTE]
> Headquartered at [[The Obsidian Spire & Gate]] high above [[The Ashen Vale]], the Order operates as neutral custodians of cosmic history.

---

### Sacred Hierarchy & Offices

| Title / Rank | Bearer | Primary Responsibility |
| :--- | :--- | :--- |
| Lord Commander | [[Lord Commander Corvus]] | Guardian of the Citadel & Master of Veilblades |
| Chief Astromancer | [[Scholar Lyra]] | Stellar cartography, ciphers & seal prognostication |
| Acolyte of the Veil | [[Vespera]] | Field recovery & custodian of [[The Star Astrolabe]] |

### Core Tenets

1. **The Inviolable Word** — Truth must be transcribed and preserved, regardless of the empire it threatens or unseats.
2. **The Vigil of the Veil** — Monitor celestial anomalies from the heights; intervene only when the cosmic seals weaken.
3. **The Silent Custody** — No celestial relic, specifically [[The Star Astrolabe]], may ever be wielded as an offensive weapon of conquest.

### Historical Conflicts
- **The Iron Schism (Year 312)** — Former brother [[High Inquisitor Malakor]] fractured the fellowship, departing to establish the militaristic Iron Tribunal at [[The Sunken Bastion]].
- **The Midnight Convergence (Year 342)** — Chronicled in [[Prologue: The Veil of Embers]] and [[Chapter I: The Obsidian Gate]].`,
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'demo-lore-astrolabe',
      title: 'The Star Astrolabe',
      category: 'lore',
      tags: 'artifact, relic, celestial, magic',
      body: `# The Star Astrolabe

A masterwork brass and obsidian instrument forged during the First Age of Foundations, capable of reading and manipulating the celestial wards that bind the Veil.

> [!QUOTE]
> *"To hold the astrolabe is to feel the heartbeat of stars long dead."*
> — [[Scholar Lyra]], *Treatise on Astro-Resonance*

---

### Mechanical & Arcane Properties

- **Nested Concentric Rings**: Seven rings of blackened bronze, engraved with astronomical runes that align with stellar coordinates.
- **Resonance Core**: Contains a sliver of meteorite harvested from the impact crater in [[The Ashen Vale]].
- **Cipher Decryption**: Automatically aligns with [[The Obsidian Spire & Gate]] to project real-time celestial coordinates.

### Current Custody & Conflict

| Attribute | Detail |
| :--- | :--- |
| **Current Bearer** | [[Vespera]] (Acolyte of [[The Order of Lore]]) |
| **Primary Threat** | [[High Inquisitor Malakor]], seeking to weaponize its celestial harmonics |
| **Key Narrative Role** | Featured prominently in [[Prologue: The Veil of Embers]] and [[Chapter I: The Obsidian Gate]] |

* * *

> [!WARNING]
> If all seven rings align without the counterbalance key held by [[Lord Commander Corvus]], the resulting harmonic wave could shatter the geological foundations of the entire valley.`,
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'demo-world-vale',
      title: 'The Ashen Vale',
      category: 'world',
      tags: 'geography, region, highlands, basin',
      body: `# The Ashen Vale

A rugged highland basin situated at the convergence of three mountain ranges, shrouded in perpetual twilight and geothermal mist.

---

### Regional Geography & Topography

The Vale sits at an altitude of 3,200 paces, surrounded by jagged basalt cliffs. Volcanic vents release mineral-rich vapors that produce a constant silvery haze across the tundra.

\`\`\`
       [The Obsidian Spire & Gate] (North Peak)
                     |
            (The Alpine Switchbacks)
                     |
              [The Ashen Vale Basin]
             /                      \\
            /                        \\
[The Sunken Bastion] (West)    [The Bleeding Chasm] (East)
\`\`\`

### Key Landmarks & Outposts

| Landmark | Coordinates / Sector | Primary Occupants |
| :--- | :--- | :--- |
| [[The Obsidian Spire & Gate]] | Northern Crags | [[The Order of Lore]], [[Lord Commander Corvus]] |
| [[The Sunken Bastion]] | Western Gorge | Iron Tribunal, [[High Inquisitor Malakor]] |
| **The Bleeding Chasm** | Eastern Fissures | Wild geomantic spirits & mineral prospectors |

### Narrative Significance
The Vale serves as the central theater of operations across [[Prologue: The Veil of Embers]], [[Chapter I: The Obsidian Gate]], and future journeys planned in [[Story Beats & Master Arc]].`,
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'demo-world-spire',
      title: 'The Obsidian Spire & Gate',
      category: 'world',
      tags: 'fortress, architecture, observatory, landmark',
      body: `# The Obsidian Spire & Gate

A towering mountain fortress carved directly from a single monolith of volcanic glass, serving as the high seat of [[The Order of Lore]].

---

### Bastion Architecture

The structure spans nine tiers divided across three vertical defensive zones:

| Level | Sector | Function & Personnel |
| :--- | :--- | :--- |
| **Apex (Tier 7–9)** | High Celestial Observatory | Astrolabe chamber, stellar telescopes, [[Scholar Lyra]] |
| **Mid-Barrows (Tier 4–6)** | The Grand Scriptorium & Scriptorium Vaults | Ancient manuscripts, archive monks, [[Vespera]] |
| **Ramparts (Tier 1–3)** | [[The Obsidian Gate]] & Outer Barbican | Defensive portcullis, curtain walls, [[Lord Commander Corvus]] |

* * *

> [!NOTE]
> The outer gate is reinforced with anti-arcane iron bands that can withstand direct seismic shocks from the geothermal fissures of [[The Ashen Vale]].

### Recent Events
Under active siege by [[High Inquisitor Malakor]] during the events of [[Chapter I: The Obsidian Gate]].`,
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'demo-world-bastion',
      title: 'The Sunken Bastion',
      category: 'world',
      tags: 'ruins, subterranean, inquisition, outpost',
      body: `# The Sunken Bastion

An ancient subterranean stronghold carved into the western gorge of [[The Ashen Vale]], currently occupied by the Iron Inquisition.

---

### Strategic Importance

Constructed centuries before the founding of [[The Order of Lore]], this sunken fortress is buried beneath three strata of solid granite, making it invulnerable to aerial bombardment and astronomical divinations.

> [!DANGER]
> The Bastion houses Malakor's siege engines, alchemical laboratories, and interrogation cells.

### Key Figures & Operations

- **Commanding Officer**: [[High Inquisitor Malakor]]
- **Mission Directive**: Locate and seize [[The Star Astrolabe]] from [[Vespera]]
- **Vanguard Status**: Deployed troops toward [[The Obsidian Spire & Gate]] as depicted in [[Prologue: The Veil of Embers]]

* * *

### Secret Passages
Historical notes in [[World Secrets & Codex Notes]] suggest a forgotten aqueduct connects the lower dungeons directly to the subterranean sluice of [[The Obsidian Gate]].`,
      createdAt: Date.now() - 86400000 * 1,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'demo-draft-master',
      title: 'Story Beats & Master Arc',
      category: 'draft',
      tags: 'outline, story-structure, pacing, checklist',
      body: `# Story Beats & Master Arc

Working outline and structural roadmap for the manuscript.

---

### Act I: The Convergence Broken
- [x] **Scene 1 (Prologue)**: Introduce [[Vespera]] and [[Lord Commander Corvus]] atop the spire. Establish the midnight omen in [[Prologue: The Veil of Embers]].
- [x] **Scene 2 (Chapter 1)**: Siege begins. Inquisitorial breach at [[The Obsidian Gate]]. Vespera flees with [[The Star Astrolabe]] in [[Chapter I: The Obsidian Gate]].
- [ ] **Scene 3 (Chapter 2)**: The perilous descent into the misty tundra of [[The Ashen Vale]].
- [ ] **Scene 4 (Chapter 3)**: Ambush at the mountain switchbacks by Inquisitor skirmishers.

### Act II: The Shattered Citadel
- [ ] **Midpoint Turn**: Vespera discovers that [[High Inquisitor Malakor]] and Corvus share a blood covenant.
- [ ] Infiltration of [[The Sunken Bastion]] to rescue captured scholars from [[The Order of Lore]].
- [ ] Astrological breakthrough deciphered by [[Scholar Lyra]].

* * *

> [!TIP]
> **Pacing Goal:** Maintain tense, claustrophobic atmosphere during subterranean chapters before opening out onto the sweeping frozen vistas of the Vale.`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: 'demo-draft-secrets',
      title: 'World Secrets & Codex Notes',
      category: 'draft',
      tags: 'brainstorm, secrets, spoilers, lore-notes',
      body: `# World Secrets & Codex Notes

Confidential author reference sheet for character backstories, plot twists, psychological profiles, and hidden lore connections.

---

### The Malakor–Corvus Schism
- [[High Inquisitor Malakor]] (Alias: *The Cleansing Flame*) and [[Lord Commander Corvus]] (Alias: *The Iron Shield of Lore*) were inducted into [[The Order of Lore]] on the exact same winter solstice in Year 290.
- Malakor did not abandon the Order out of malice; he believed that passive monastic observation would allow the celestial seals to burn away the mortal realm.
- Corvus continues to wear an iron ring that mirrors Malakor's insignia.

### The Astrolabe's True Nature
- [[The Star Astrolabe]] is not merely a tracking compass; it is the physical ignition key for the celestial wards sealing the primordial chasm beneath [[The Ashen Vale]].
- If [[Vespera]] (Alias: *The Starbound Acolyte*) aligns the final ring, the veil does not close—it releases the stored celestial energy into whoever holds the brass cylinder.
- [[Scholar Lyra]] (Alias: *The Star Weaver*) knows this secret, but conceals it from Vespera to prevent panic during the convergence.

---

### Cast Dossiers & Psychological Profiles

| Character | Alias | Archetype & Faction | Core Psychological Drive |
| :--- | :--- | :--- | :--- |
| [[Vespera]] | The Starbound Acolyte | Protagonist · [[The Order of Lore]] | Hyper-vigilant, intellectually driven; burdened by monastic duty yet determined to prevent apocalypse. |
| [[Lord Commander Corvus]] | The Iron Shield of Lore | Mentor · [[The Order of Lore]] | Stoic defender haunted by the Iron Schism; bound by a blood vow to protect Vespera and the citadel. |
| [[High Inquisitor Malakor]] | The Cleansing Flame | Antagonist · The Iron Inquisition | Fanatically pragmatic utilitarian; believes unbinding primordial wards will cleanse mortal corruption. |
| [[Scholar Lyra]] | The Star Weaver | Ally · [[The Order of Lore]] | Inquisitive, remarkably serene under siege; decodes astronomical ciphers with meticulous precision. |

* * *

> [!NOTE]
> Review [[Story Beats & Master Arc]] to ensure these reveals are seeded with subtle foreshadowing in early dialogues.`,
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
      terrain: 'Alpine Mountain Pass',
      description: 'Mountain pass fortress where the Convergence occurs under the midnight vigil.',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'pin-spire',
      x: 52.0,
      y: 24.8,
      noteId: 'demo-world-spire',
      title: 'The Obsidian Spire & Observatory',
      category: 'world',
      terrain: 'Volcanic Monolith & Spire',
      description: 'Nine-tiered volcanic monolith housing the celestial astrolabe chambers.',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'pin-order',
      x: 64.2,
      y: 53.6,
      noteId: 'demo-lore-order',
      title: 'The Order of Lore Citadel',
      category: 'lore',
      terrain: 'Monastic Basalt Crags',
      description: 'Ancient monastic citadel safeguarding forbidden manuscripts and cosmic history.',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'pin-vale',
      x: 37.8,
      y: 67.4,
      noteId: 'demo-world-vale',
      title: 'The Ashen Vale Basin',
      category: 'world',
      terrain: 'Geothermal Highland Basin',
      description: 'Twilight highland territory shrouded in perpetual geothermal mist.',
      createdAt: Date.now() - 86400000 * 1
    },
    {
      id: 'pin-bastion',
      x: 24.5,
      y: 41.0,
      noteId: 'demo-world-bastion',
      title: 'The Sunken Bastion',
      category: 'world',
      terrain: 'Subterranean Gorge',
      description: 'Subterranean fortress occupied by High Inquisitor Malakor and the Iron Tribunal.',
      createdAt: Date.now() - 86400000 * 1
    },
    {
      id: 'pin-chasm',
      x: 78.2,
      y: 72.5,
      noteId: 'demo-world-vale',
      title: 'The Bleeding Chasm',
      category: 'world',
      terrain: 'Volcanic Radiant Fissure',
      description: 'Geothermal fissure glowing with ruby celestial radiance at midnight.',
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
      noteId: 'demo-lore-order',
      category: 'lore',
      createdAt: Date.now() - 86400000 * 4
    },
    {
      id: 'evt-2',
      year: 'Year 240',
      era: 'Era of the Moons',
      title: 'Construction of the High Spire',
      description: 'The Order completes the celestial observatory overlooking The Ashen Vale.',
      noteId: 'demo-world-spire',
      category: 'world',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'evt-3',
      year: 'Year 312',
      era: 'The Iron Schism',
      title: 'Fracture of the Iron Tribunal',
      description: 'High Inquisitor Malakor breaks from the Order and fortifies The Sunken Bastion.',
      noteId: 'demo-world-bastion',
      category: 'world',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'evt-4',
      year: 'Year 342',
      era: 'The Convergence',
      title: 'The Bleeding Sky Omen',
      description: 'The third star bleeds into the veil; the midnight vigil begins atop the spire.',
      noteId: 'demo-chap-prologue',
      category: 'chapter',
      createdAt: Date.now() - 86400000 * 1
    },
    {
      id: 'evt-5',
      year: 'Year 342 (Winter)',
      era: 'The Convergence',
      title: 'Breach of the Obsidian Gate',
      description: 'Inquisitorial vanguard attacks the lower ramparts; Vespera escapes with the astrolabe.',
      noteId: 'demo-chap-1',
      category: 'chapter',
      createdAt: Date.now()
    }
  ];

  const STARTER_CHARACTERS = [
    {
      id: 'char-vespera',
      name: 'Vespera',
      aliases: 'The Starbound Acolyte',
      archetype: 'Protagonist',
      faction: 'The Order of Lore',
      role: 'Acolyte of the Veil',
      status: 'Active',
      noteId: 'demo-chap-prologue',
      psychProfile: 'Hyper-vigilant, intellectually driven, burdened by inherited monastic duty yet resilient.',
      bio: 'Alias: "The Starbound Acolyte". Bearer of the nocturnal astrolabe. Psychological Profile: Hyper-vigilant, intellectually driven; burdened by sacred monastic duty yet determined to prevent celestial catastrophe.',
      createdAt: Date.now() - 86400000 * 4
    },
    {
      id: 'char-corvus',
      name: 'Lord Commander Corvus',
      aliases: 'The Iron Shield of Lore',
      archetype: 'Mentor',
      faction: 'The Order of Lore',
      role: 'Master of the Veilblades',
      status: 'Active',
      noteId: 'demo-lore-order',
      psychProfile: 'Stoic, fiercely protective, haunted by the Iron Schism and defection of his former comrade.',
      bio: 'Alias: "The Iron Shield of Lore". Master of Veilblades. Psychological Profile: Stoic defender haunted by the Iron Schism; bound by a blood vow to protect Vespera and the archives.',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'char-malakor',
      name: 'High Inquisitor Malakor',
      aliases: 'The Cleansing Flame',
      archetype: 'Antagonist',
      faction: 'The Iron Inquisition',
      role: 'Grand Inquisitor of the Sunken Bastion',
      status: 'Hostile',
      noteId: 'demo-world-bastion',
      psychProfile: 'Fanatically utilitarian extremist; convinced that cosmic destruction is necessary purification.',
      bio: 'Alias: "The Cleansing Flame". Grand Inquisitor. Psychological Profile: Fanatical utilitarian who broke from the Order; believes celestial unbinding is necessary to purge mortal corruption.',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'char-lyra',
      name: 'Scholar Lyra',
      aliases: 'The Star Weaver',
      archetype: 'Ally',
      faction: 'The Order of Lore',
      role: 'Chief Astromancer',
      status: 'Active',
      noteId: 'demo-lore-astrolabe',
      psychProfile: 'Methodical, deeply curious, composed under extreme pressure and siege conditions.',
      bio: 'Alias: "The Star Weaver". Chief Astromancer. Psychological Profile: Methodical, curious, and remarkably calm under siege; decodes ancient glyphs and astrolabe harmonics under extreme pressure.',
      createdAt: Date.now() - 86400000 * 1
    }
  ];

  const STARTER_RELATIONSHIPS = [
    {
      id: 'rel-1',
      sourceId: 'char-vespera',
      targetId: 'char-corvus',
      type: 'Mentor to',
      description: 'Corvus trained Vespera in defensive arts and safeguarding the astrolabe.',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'rel-2',
      sourceId: 'char-corvus',
      targetId: 'char-malakor',
      type: 'Nemesis of',
      description: 'Former comrades separated during the Iron Schism over custody of cosmic relics.',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'rel-3',
      sourceId: 'char-lyra',
      targetId: 'char-vespera',
      type: 'Allied with',
      description: 'Lyra decodes stellar glyphs and provides navigational ciphers for Vespera.',
      createdAt: Date.now() - 86400000 * 1
    },
    {
      id: 'rel-4',
      sourceId: 'char-malakor',
      targetId: 'char-vespera',
      type: 'Pursues',
      description: 'Commands inquisitorial vanguard to capture Vespera and seize the astrolabe.',
      createdAt: Date.now()
    },
    {
      id: 'rel-5',
      sourceId: 'char-corvus',
      targetId: 'char-lyra',
      type: 'Advises',
      description: 'Coordinates citadel garrison defenses in concert with stellar astrological forecasts.',
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
    const notes = getAllNotes();

    // 1. Exact title match
    const exact = notes.find(n => (n.title || '').trim().toLowerCase() === clean);
    if (exact) return exact;

    // 2. Subtitle / prefix match after colon (e.g. "Chapter I: The Obsidian Gate" matches "The Obsidian Gate")
    const afterColon = notes.find(n => {
      const parts = (n.title || '').split(':').map(p => p.trim().toLowerCase());
      return parts.length > 1 && parts.some(p => p === clean);
    });
    if (afterColon) return afterColon;

    // 3. Match character in Codex linked to an existing note
    try {
      const chars = getAllCharacters();
      const char = chars.find(c => (c.name || '').trim().toLowerCase() === clean);
      if (char && char.noteId) {
        const charNote = notes.find(n => n.id === char.noteId);
        if (charNote) return charNote;
      }
    } catch {
      // Ignore
    }

    return null;
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
    const colonIdx = cleanTarget.indexOf(':');
    const cleanSubtitle = colonIdx !== -1 ? cleanTarget.substring(colonIdx + 1).trim() : null;

    // Also match characters associated with this note
    const associatedCharNames = [];
    try {
      const currentNote = findNoteByTitle(targetTitle);
      if (currentNote) {
        const chars = getAllCharacters();
        chars.forEach(c => {
          if (c.noteId === currentNote.id && c.name) {
            associatedCharNames.push(c.name.trim().toLowerCase());
          }
        });
      }
    } catch {
      // Ignore
    }

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
        const link = match[1].trim().toLowerCase();
        if (link === cleanTarget || (cleanSubtitle && link === cleanSubtitle) || associatedCharNames.includes(link)) {
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
