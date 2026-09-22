/* ═══════════════════════════════════════════════
   Lord Spey — Author's Workspace Controller
   Wires up UI, Living Galaxy Cosmos Graph,
   Live Split View, Outline Navigator, Word Goal Tracker,
   Fantasy Name Forge, and Obsidian Wiki-links
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM refs ──
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  const sidebar         = $('#sidebar');
  const sidebarToggle   = $('#sidebar-toggle');
  const sidebarExpand   = $('#sidebar-expand');
  const sidebarBackdrop = $('#sidebar-backdrop');
  const searchInput     = $('#search-input');
  const logoHome        = $('#logo-home');
  const btnTutorialSidebar = $('#btn-tutorial-sidebar');

  // Cinematic Intro Splash
  const introSplash     = $('#intro-splash');
  const introSkipBtn    = $('#intro-skip-btn');
  const menuEmblem      = $('#menu-emblem');

  // Main Menu & Editor
  const mainMenu          = $('#main-menu');
  const menuBtnTutorial   = $('#menu-btn-tutorial');
  const menuBtnGraph      = $('#menu-btn-graph');
  const menuBtnSwitcher   = $('#menu-btn-switcher');
  const menuBtnSample     = $('#menu-btn-sample');
  const menuRecentSection = $('#menu-recent-section');
  const menuRecentGrid    = $('#menu-recent-grid');

  const editorArea      = $('#editor-area');
  const editorBodyWrap  = $('#editor-body-wrap');
  const btnBackMenu     = $('#btn-back-menu');
  const noteTitle       = $('#note-title');
  const noteTags        = $('#note-tags');
  const noteCategory    = $('#note-category');
  const noteBody        = $('#note-body');
  const notePreview     = $('#note-preview');
  const wordCount       = $('#word-count');
  const readingTime     = $('#reading-time');
  const saveStatus      = $('#save-status');

  // Author Features
  const btnSplit        = $('#btn-split');
  const btnOutline      = $('#btn-outline');
  const outlineDrawer   = $('#outline-drawer');
  const outlineList     = $('#outline-list');
  const btnCloseOutline = $('#btn-close-outline');

  const metaGoal        = $('#meta-goal');
  const goalProgress    = $('#goal-progress');
  const goalFill        = $('#goal-fill');
  const goalModal       = $('#goal-modal');
  const inputWordGoal   = $('#input-word-goal');
  const inputSprintMin  = $('#input-sprint-minutes');
  const btnSaveGoal     = $('#btn-save-goal');
  const btnCancelGoal   = $('#btn-cancel-goal');
  const btnSprint       = $('#btn-sprint');
  const sprintTimerText = $('#sprint-timer-text');

  // Interactive Tutorial Tour
  const tutorialOverlay    = $('#tutorial-overlay');
  const tutorialStepBadge  = $('#tutorial-step-badge');
  const tutorialCategoryTag= $('#tutorial-category-tag');
  const btnSkipTutorialTop = $('#btn-skip-tutorial-top');
  const tutorialIconBox    = $('#tutorial-icon-box');
  const tutorialTitle      = $('#tutorial-title');
  const tutorialDesc       = $('#tutorial-desc');
  const tutorialFeatures   = $('#tutorial-features');
  const tutorialTip        = $('#tutorial-tip');
  const tutorialDots       = $('#tutorial-dots');
  const btnTutorialSkip    = $('#btn-tutorial-skip');
  const btnTutorialPrev    = $('#btn-tutorial-prev');
  const btnTutorialNext    = $('#btn-tutorial-next');

  const btnNewNote      = $('#btn-new-note');
  const btnPreview      = $('#btn-preview');
  const btnDelete       = $('#btn-delete');
  const btnZen          = $('#btn-zen');
  const btnExportMd     = $('#btn-export-md');
  const btnExport       = $('#btn-export');
  const btnImport       = $('#btn-import');
  const importFile      = $('#import-file');

  // .spey Project Package & Settings DOM refs
  const btnExportSpeySidebar = $('#btn-export-spey');
  const btnOpenSpeySidebar   = $('#btn-open-spey');
  const btnProjectSettingsSidebar = $('#btn-project-settings');

  const dashboardBtnExportSpey = $('#dashboard-btn-export-spey');
  const dashboardBtnOpenSpey   = $('#dashboard-btn-open-spey');
  const menuBtnExportSpey      = $('#menu-btn-export-spey');
  const menuBtnOpenSpey        = $('#menu-btn-open-spey');
  const menuBtnProjectSettings = $('#menu-btn-project-settings');

  const speyImportModal        = $('#spey-import-modal');
  const btnImportModalClose    = $('#btn-import-modal-close');
  const speyImportProjName     = $('#spey-import-proj-name');
  const speyImportFormatTag    = $('#spey-import-format-tag');
  const speyStatChapters       = $('#spey-stat-chapters');
  const speyStatWords          = $('#spey-stat-words');
  const speyStatLore           = $('#spey-stat-lore');
  const speyStatPins           = $('#spey-stat-pins');
  const speyBreakdownDetails   = $('#spey-breakdown-details');
  const btnImportCancel        = $('#btn-import-cancel');
  const btnImportMerge         = $('#btn-import-merge');
  const btnImportReplace       = $('#btn-import-replace');

  const projectSettingsModal   = $('#project-settings-modal');
  const btnCloseProjectSettings = $('#btn-close-project-settings');
  const settingProjectTitle    = $('#setting-project-title');
  const settingProjectAuthor   = $('#setting-project-author');
  const settingsStatsGrid      = $('#settings-stats-grid');
  const settingsBtnExportSpey  = $('#settings-btn-export-spey');
  const settingsBtnExportJson  = $('#settings-btn-export-json');
  const settingsBtnBackupVault = $('#settings-btn-backup-vault');
  const btnSaveProjectSettings = $('#btn-save-project-settings');

  const speyDropzone           = $('#spey-dropzone');

  if (speyImportModal && speyImportModal.classList) speyImportModal.classList.add('hidden');
  if (projectSettingsModal && projectSettingsModal.classList) projectSettingsModal.classList.add('hidden');
  if (speyDropzone && speyDropzone.classList) speyDropzone.classList.add('hidden');

  // Find & Replace
  const btnFindToggle   = $('#btn-find-toggle');
  const findReplaceBar  = $('#find-replace-bar');
  const findInput       = $('#find-input');
  const replaceInput    = $('#replace-input');
  const findCounter     = $('#find-counter');
  const btnFindPrev     = $('#btn-find-prev');
  const btnFindNext     = $('#btn-find-next');
  const btnFindCase     = $('#btn-find-case');
  const btnReplaceOne   = $('#btn-replace-one');
  const btnReplaceAll   = $('#btn-replace-all');
  const btnFindClose    = $('#btn-find-close');

  // Author Typography & Writing Mode
  const editorFontSelect = $('#editor-font-select');
  const btnFontDec       = $('#btn-font-dec');
  const btnFontInc       = $('#btn-font-inc');
  const fontSizeVal      = $('#font-size-val');
  const btnLineSpacing   = $('#btn-line-spacing');
  const lineSpacingVal   = $('#line-spacing-val');
  const btnTypewriter    = $('#btn-typewriter');

  // Manuscript Metrics Modal
  const btnMetrics         = $('#btn-metrics');
  const metricsModal       = $('#metrics-modal');
  const btnCloseMetrics    = $('#btn-close-metrics');
  const btnMetricsDone     = $('#btn-metrics-done');
  const statWords          = $('#stat-words');
  const statCharsSpaces    = $('#stat-chars-spaces');
  const statCharsNoSpaces  = $('#stat-chars-nospaces');
  const statParagraphs     = $('#stat-paragraphs');
  const statSentences      = $('#stat-sentences');
  const statAvgWordsSent   = $('#stat-avg-words-sentence');
  const statReadTime       = $('#stat-read-time');
  const statSpeakTime      = $('#stat-speak-time');
  const statReadingLevel   = $('#stat-reading-level');
  const statReadingBadge   = $('#stat-reading-badge');
  const selectionStatsWrap = $('#selection-stats-wrap');
  const statSelWords       = $('#stat-sel-words');
  const statSelChars       = $('#stat-sel-chars');

  // Backlinks
  const backlinksPanel   = $('#backlinks-panel');
  const backlinksHeader  = $('#backlinks-toggle-header');
  const backlinksCount   = $('#backlinks-count');
  const backlinksList    = $('#backlinks-list');

  // Modals
  const modalOverlay     = $('#modal-overlay');
  const modalTitle       = $('#modal-note-title');
  const modalCategory    = $('#modal-note-category');
  const modalCreate      = $('#modal-create');
  const modalCancel      = $('#modal-cancel');

  const deleteOverlay    = $('#delete-overlay');
  const deleteConfirm    = $('#delete-confirm');
  const deleteCancel     = $('#delete-cancel');

  // Wiki Create Modal
  const wikicreateModal   = $('#wikicreate-modal');
  const wikicreateTarget  = $('#wikicreate-target');
  const wikicreateCategory= $('#wikicreate-category');
  const wikicreateConfirm = $('#wikicreate-confirm');
  const wikicreateCancel  = $('#wikicreate-cancel');

  // Quick Switcher
  const btnQuickSwitcher = $('#btn-quick-switcher');
  const switcherModal    = $('#switcher-modal');
  const switcherInput    = $('#switcher-input');
  const switcherResults  = $('#switcher-results');

  // Cosmos Galaxy View
  const btnGraphView        = $('#btn-graph-view');
  const graphModal          = $('#graph-modal');
  const btnCloseGraph       = $('#btn-close-graph');
  const graphCanvas         = $('#graph-canvas');
  const graphNodeCount      = $('#graph-node-count');
  const graphEdgeCount      = $('#graph-edge-count');
  const galaxyEmptyPrompt   = $('#galaxy-empty-prompt');
  const galaxyBtnCreateFirst= $('#galaxy-btn-create-first');
  const galaxyBtnLoadDemo   = $('#galaxy-btn-load-demo');
  const graphLocationHud    = $('#graph-location-hud');
  const hudCategoryDot      = $('#hud-category-dot');
  const hudCategoryName     = $('#hud-category-name');
  const hudSubBranch        = $('#hud-sub-branch');
  const hudNodeTitle        = $('#hud-node-title');
  const hudConnectionsCount = $('#hud-connections-count');
  const hudActionHint       = $('#hud-action-hint');

  // World Map & Pin Codex
  const btnMapView          = $('#btn-map-view');
  const menuBtnMap          = $('#menu-btn-map');
  const dashboardBtnMap     = $('#dashboard-btn-map');
  const btnToolbarMap       = $('#btn-toolbar-map');
  const mapModal            = $('#map-modal');
  const btnCloseMap         = $('#btn-close-map');
  const mapViewport         = $('#map-viewport');
  const mapStage            = $('#map-stage');
  const mapCanvas           = $('#map-canvas');
  let mapCustomImg          = $('#map-custom-img');
  const mapPinsContainer    = $('#map-pins-container');
  const mapPinCount         = $('#map-pin-count');
  const mapCoordsIndicator  = $('#map-coords-indicator');
  const mapPinSearch        = $('#map-pin-search');
  const btnMapDropPin       = $('#btn-map-drop-pin');
  const btnMapCancelDrop    = $('#btn-map-cancel-drop');
  const mapPlacementHint    = $('#map-placement-hint');
  const mapFileInput        = $('#map-file-input');
  const btnMapResetImg      = $('#btn-map-reset-img');
  const btnMapZoomIn        = $('#btn-map-zoom-in');
  const btnMapZoomOut       = $('#btn-map-zoom-out');
  const btnMapZoomReset     = $('#btn-map-zoom-reset');
  const mapPinPreview       = $('#map-pin-preview');
  const mapPreviewBadge     = $('#map-preview-badge');
  const mapPreviewCoords    = $('#map-preview-coords');
  const btnMapPreviewClose  = $('#btn-map-preview-close');
  const mapPreviewTitle     = $('#map-preview-title');
  const mapPreviewDesc      = $('#map-preview-desc');
  const btnMapOpenNote      = $('#btn-map-open-note');
  const btnMapDeletePin     = $('#btn-map-delete-pin');
  const mapPinModal         = $('#map-pin-modal');
  const mapModalNoteSelect  = $('#map-modal-note-select');
  const mapModalPinTitle    = $('#map-modal-pin-title');
  const mapModalPinCategory = $('#map-modal-pin-category');
  const mapModalPinDesc     = $('#map-modal-pin-desc');
  const btnMapPinCancel     = $('#btn-map-pin-cancel');
  const btnMapPinSave       = $('#btn-map-pin-save');
  const btnMapTutorial      = $('#btn-map-tutorial');
  const mapTutorialModal    = $('#map-tutorial-modal');
  const btnCloseMapTutorial = $('#btn-close-map-tutorial');
  const btnDismissMapTutorial = $('#btn-dismiss-map-tutorial');

  // Chronology & Event Timeline
  const btnTimelineView       = $('#btn-timeline-view');
  const menuBtnTimeline       = $('#menu-btn-timeline');
  const dashboardBtnTimeline  = $('#dashboard-btn-timeline');
  const btnToolbarTimeline    = $('#btn-toolbar-timeline');
  const timelineModal         = $('#timeline-modal');
  const btnCloseTimeline      = $('#btn-close-timeline');
  const timelineEventCount    = $('#timeline-event-count');
  const timelineSearch        = $('#timeline-search');
  const btnTimelineModeRail   = $('#btn-timeline-mode-rail');
  const btnTimelineModeStream = $('#btn-timeline-mode-stream');
  const timelineRailView      = $('#timeline-rail-view');
  const timelineStreamView    = $('#timeline-stream-view');
  const timelineRailEras      = $('#timeline-rail-eras');
  const timelineRailTrack     = $('#timeline-rail-track');
  const timelineStreamContainer = $('#timeline-stream-container');
  const timelineEmptyPrompt   = $('#timeline-empty-prompt');
  const btnTimelineAdd        = $('#btn-timeline-add');
  const btnTimelineEmptyAdd   = $('#btn-timeline-empty-add');
  const timelineEventModal    = $('#timeline-event-modal');
  const timelineInputYear     = $('#timeline-input-year');
  const timelineInputEra      = $('#timeline-input-era');
  const timelineInputTitle    = $('#timeline-input-title');
  const timelineInputNote     = $('#timeline-input-note');
  const timelineInputCategory = $('#timeline-input-category');
  const timelineInputDesc     = $('#timeline-input-desc');
  const btnTimelineEventCancel= $('#btn-timeline-event-cancel');
  const btnTimelineEventSave  = $('#btn-timeline-event-save');
  const btnTimelineTutorial   = $('#btn-timeline-tutorial');
  const timelineTutorialModal = $('#timeline-tutorial-modal');
  const btnCloseTimelineTutorial = $('#btn-close-timeline-tutorial');
  const btnDismissTimelineTutorial = $('#btn-dismiss-timeline-tutorial');

  // Character Codex & Relationship Web
  const btnCodexView          = $('#btn-codex-view');
  const menuBtnCodex          = $('#menu-btn-codex');
  const dashboardBtnCodex     = $('#dashboard-btn-codex');
  const btnToolbarCodex       = $('#btn-toolbar-codex');
  const codexModal            = $('#codex-modal');
  const btnCloseCodex         = $('#btn-close-codex');
  const codexCharacterCount   = $('#codex-character-count');
  const codexRelCount         = $('#codex-rel-count');
  const codexSearch           = $('#codex-search');
  const btnCodexModeCards     = $('#btn-codex-mode-cards');
  const btnCodexModeWeb       = $('#btn-codex-mode-web');
  const codexCardsView        = $('#codex-cards-view');
  const codexWebView          = $('#codex-web-view');
  const codexGrid             = $('#codex-grid');
  const codexWebCanvas        = $('#codex-web-canvas');
  const codexCharPreview      = $('#codex-char-preview') || $('#codex-web-inspector');
  const codexWebInspector     = codexCharPreview;
  const btnInspectorClose     = $('#btn-inspector-close');
  const inspectorArchetypeBadge = $('#inspector-archetype-badge');
  const inspectorName         = $('#inspector-name');
  const inspectorFaction      = $('#inspector-faction');
  const inspectorBio          = $('#inspector-bio');
  const inspectorRelsList     = $('#inspector-rels-list');
  const btnInspectorOpenNote  = $('#btn-inspector-open-note');
  const codexEmptyPrompt      = $('#codex-empty-prompt');
  const btnCodexAddChar       = $('#btn-codex-add-char');
  const btnCodexEmptyAdd      = $('#btn-codex-empty-add');
  const btnCodexAddRel        = $('#btn-codex-add-rel');
  const codexCharModal        = $('#codex-char-modal');
  const codexInputName        = $('#codex-input-name');
  const codexInputArchetype   = $('#codex-input-archetype');
  const codexInputFaction     = $('#codex-input-faction');
  const codexInputRole        = $('#codex-input-role');
  const codexInputNote        = $('#codex-input-note');
  const codexInputBio         = $('#codex-input-bio');
  const btnCodexCharCancel    = $('#btn-codex-char-cancel');
  const btnCodexCharSave      = $('#btn-codex-char-save');
  const codexRelModal         = $('#codex-rel-modal');
  const codexRelSource        = $('#codex-rel-source');
  const codexRelType          = $('#codex-rel-type');
  const codexRelTarget        = $('#codex-rel-target');
  const codexRelDesc          = $('#codex-rel-desc');
  const btnCodexRelCancel     = $('#btn-codex-rel-cancel');
  const btnCodexRelSave       = $('#btn-codex-rel-save');
  const btnCodexTutorial      = $('#btn-codex-tutorial');
  const codexTutorialModal    = $('#codex-tutorial-modal');
  const btnCloseCodexTutorial = $('#btn-close-codex-tutorial');
  const btnDismissCodexTutorial = $('#btn-dismiss-codex-tutorial');

  const categories = ['chapter', 'lore', 'world', 'draft'];

  let activeNoteId      = null;
  let saveTimer         = null;
  let previewMode       = false;
  let splitMode         = false;
  let zenMode           = false;
  let pendingWikiTarget = '';
  let switcherIndex     = 0;
  let switcherItems     = [];

  // Word Goal & Sprint State
  let targetWordGoal    = 500;
  let sprintDurationSec = 20 * 60;
  let sprintRemaining   = 20 * 60;
  let sprintTimerId     = null;
  let isSprintRunning   = false;

  // Tutorial state
  let currentTutorialStep = 0;

  // Author Typography & Writing Mode State
  let currentEditorFont   = (typeof localStorage !== 'undefined' && localStorage.getItem('lordspey_editor_font')) || "'Lora', Georgia, serif";
  let currentFontSize     = (typeof localStorage !== 'undefined' && parseInt(localStorage.getItem('lordspey_editor_font_size'), 10)) || 15;
  let currentLineHeight   = (typeof localStorage !== 'undefined' && parseFloat(localStorage.getItem('lordspey_editor_line_spacing'))) || 1.8;
  let typewriterMode      = typeof localStorage !== 'undefined' && localStorage.getItem('lordspey_typewriter_mode') === 'true';

  // Find & Replace State
  let findMatches         = [];
  let findCurrentIndex    = -1;
  let findMatchCase       = false;

  // Intro Splash State
  let introTimer              = null;
  let dismissTimer            = null;
  let isIntroActive           = true;
  let isInitialTutorialHandled = false;

  // ── Init ──
  init();

  function init() {
    renderSidebar();
    applyTypographySettings();
    applyTypewriterState();
    bindEvents();
    initGalaxyEngine();
    initWorldbuildingSystems();

    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
    }

    showMainMenu();

    // Auto-dismiss intro splash after cinematic star animation
    if (introSplash && !introSplash.classList.contains('hidden')) {
      if (introSplash.classList) introSplash.classList.add('intro-animating');
      introTimer = setTimeout(dismissIntroSplash, 2500);
    } else {
      isIntroActive = false;
      // Launch tutorial on first visit
      if (!isInitialTutorialHandled && typeof localStorage !== 'undefined' && !localStorage.getItem('lordspey_tutorial_seen')) {
        isInitialTutorialHandled = true;
        setTimeout(() => openTutorial(0), 400);
      }
    }
  }

  // ── Cinematic Intro Splash Screen ──
  function dismissIntroSplash() {
    if (!introSplash) return;
    if (introTimer) {
      clearTimeout(introTimer);
      introTimer = null;
    }
    // If already in the middle of fading out, fast-dismiss immediately on second trigger
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
      if (introSplash.classList) {
        introSplash.classList.remove('intro-animating', 'intro-fade-out');
        introSplash.classList.add('hidden');
      }
      if (typeof introSplash.setAttribute === 'function') {
        introSplash.setAttribute('aria-hidden', 'true');
      }
      if (!isInitialTutorialHandled) {
        isInitialTutorialHandled = true;
        if (typeof localStorage !== 'undefined' && !localStorage.getItem('lordspey_tutorial_seen')) {
          setTimeout(() => openTutorial(0), 300);
        }
      }
      return;
    }

    isIntroActive = false;
    if (introSplash.classList) {
      introSplash.classList.add('intro-fade-out');
    }
    dismissTimer = setTimeout(() => {
      dismissTimer = null;
      if (introSplash.classList) {
        introSplash.classList.remove('intro-animating', 'intro-fade-out');
        introSplash.classList.add('hidden');
      }
      if (typeof introSplash.setAttribute === 'function') {
        introSplash.setAttribute('aria-hidden', 'true');
      }

      // Launch tutorial strictly on initial app launch first visit
      if (!isInitialTutorialHandled) {
        isInitialTutorialHandled = true;
        if (typeof localStorage !== 'undefined' && !localStorage.getItem('lordspey_tutorial_seen')) {
          setTimeout(() => openTutorial(0), 300);
        }
      }
    }, 650);
  }

  function playIntroSplash() {
    if (!introSplash) return;
    if (introTimer) {
      clearTimeout(introTimer);
      introTimer = null;
    }
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }

    isIntroActive = true;
    if (introSplash.classList) {
      introSplash.classList.remove('hidden', 'intro-fade-out', 'intro-animating');
    }
    if (typeof introSplash.setAttribute === 'function') {
      introSplash.setAttribute('aria-hidden', 'false');
    }

    // Force DOM reflow to cleanly restart all CSS keyframe animations
    if (typeof introSplash.offsetWidth !== 'undefined') {
      void introSplash.offsetWidth;
    }
    if (introSplash.classList) {
      introSplash.classList.add('intro-animating');
    }

    introTimer = setTimeout(dismissIntroSplash, 2500);
  }

  // ── Main Menu / Dashboard ──
  function showMainMenu() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
      saveNow();
    }
    activeNoteId = null;
    mainMenu.classList.remove('hidden');
    editorArea.classList.add('hidden');
    outlineDrawer.classList.add('hidden');
    $$('.nav-link').forEach(l => l.classList.remove('active'));
    renderMainMenuRecent();
  }

  function showEditor() {
    mainMenu.classList.add('hidden');
    editorArea.classList.remove('hidden');
  }

  function renderMainMenuRecent() {
    const all = Storage.getAllNotes();
    if (all.length === 0) {
      menuRecentSection.classList.add('hidden');
      menuRecentGrid.innerHTML = '';
      return;
    }

    menuRecentSection.classList.remove('hidden');
    const sorted = [...all].sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)).slice(0, 6);

    menuRecentGrid.innerHTML = sorted.map(n => `
      <div class="menu-recent-card" data-id="${n.id}" role="button" tabindex="0" title="Open ${escText(n.title || 'Untitled')}">
        <div class="menu-recent-header">
          <span class="menu-recent-card-title">${escText(n.title || 'Untitled')}</span>
          <span class="badge badge-${n.category || 'draft'}">${n.category || 'draft'}</span>
        </div>
        <div class="menu-recent-card-preview">${escText((n.body || '').replace(/^[#\s*>-]+/gm, '').slice(0, 65) || 'Empty document')}</div>
      </div>
    `).join('');

    $$('.menu-recent-card', menuRecentGrid).forEach(card => {
      card.addEventListener('click', () => {
        openNote(card.dataset.id);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openNote(card.dataset.id);
        }
      });
    });
  }

  // ── Sidebar rendering ──
  function renderSidebar(filter = '') {
    const notes = filter ? Storage.searchNotes(filter) : Storage.getAllNotes();

    for (const cat of categories) {
      const list = $(`#list-${cat}`);
      const countEl = $(`.note-count[data-count="${cat}"]`);
      const filtered = notes.filter(n => n.category === cat);

      filtered.sort((a, b) => b.updatedAt - a.updatedAt);
      if (countEl) countEl.textContent = filtered.length;

      if (!list) continue;

      if (filtered.length === 0) {
        if (!filter) {
          const suggestions = {
            chapter: { text: 'No chapters yet', action: 'Draft opening scene' },
            lore: { text: 'No lore entries', action: 'Record lore or faction' },
            world: { text: 'No locations yet', action: 'Chart realm or landmark' },
            draft: { text: 'No drafts yet', action: 'Capture quick idea' }
          };
          const sug = suggestions[cat] || { text: 'No documents yet', action: 'New document' };
          list.innerHTML = `
            <li class="nav-empty-state">
              <span class="nav-empty-label">${sug.text}</span>
              <button class="nav-empty-btn" data-category="${cat}" title="${sug.action}">+ ${sug.action}</button>
            </li>
          `;
        } else {
          list.innerHTML = `
            <li class="nav-empty-state">
              <span class="nav-empty-label">No matches in ${cat}</span>
            </li>
          `;
        }
      } else {
        list.innerHTML = filtered.map(n => `
          <li class="nav-item">
            <div class="nav-link ${n.id === activeNoteId ? 'active' : ''}" data-id="${n.id}">
              <span class="nav-link-dot"></span>
              <span class="nav-link-title">${escText(n.title || 'Untitled')}</span>
            </div>
          </li>
        `).join('');
      }
    }
  }

  // ── Event bindings ──
  function bindEvents() {
    logoHome.addEventListener('click', showMainMenu);
    btnBackMenu.addEventListener('click', showMainMenu);

    // Intro splash & replay events
    if (introSkipBtn) {
      introSkipBtn.addEventListener('click', e => {
        e.stopPropagation();
        dismissIntroSplash();
      });
    }
    if (introSplash) {
      introSplash.addEventListener('click', dismissIntroSplash);
    }
    if (menuEmblem) {
      menuEmblem.addEventListener('click', playIntroSplash);
      menuEmblem.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playIntroSplash();
        }
      });
    }

    // Main menu cards
    $$('.menu-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.dataset.action;
        let cat = 'draft', defaultTitle = 'Untitled';
        if (action === 'new-chapter') { cat = 'chapter'; defaultTitle = 'Untitled Chapter'; }
        if (action === 'new-lore')    { cat = 'lore';    defaultTitle = 'Untitled Lore'; }
        if (action === 'new-world')   { cat = 'world';   defaultTitle = 'Untitled Realm'; }
        if (action === 'new-draft')   { cat = 'draft';   defaultTitle = 'Untitled Draft'; }

        const note = Storage.createNote({
          title: defaultTitle,
          category: cat,
          body: `# ${defaultTitle}\n\n`,
        });
        renderSidebar();
        openNote(note.id);
        toast(`Created new ${cat}`, 'success');
        setTimeout(() => {
          noteTitle.focus();
          noteTitle.select();
        }, 100);
      });
    });

    // Secondary actions in Main Menu
    menuBtnTutorial.addEventListener('click', () => openTutorial(0));
    menuBtnGraph.addEventListener('click', openGraphView);
    menuBtnSwitcher.addEventListener('click', openQuickSwitcher);
    menuBtnSample.addEventListener('click', () => {
      Storage.loadStarterVault();
      renderSidebar();
      renderMainMenuRecent();
      toast('Loaded sample vault', 'success');
    });

    // Sidebar actions
    btnTutorialSidebar.addEventListener('click', () => openTutorial(0));
    sidebarToggle.addEventListener('click', () => sidebar.classList.add('collapsed'));
    sidebarExpand.addEventListener('click', () => sidebar.classList.remove('collapsed'));
    sidebarBackdrop.addEventListener('click', () => sidebar.classList.add('collapsed'));

    // Android Hardware & Gesture Back Button Support
    window.handleAndroidBack = handleBackOrEscape;
    document.addEventListener('backbutton', handleBackOrEscape);

    $$('.nav-section-header').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });

    $$('.sidebar-nav').forEach(nav => {
      nav.addEventListener('click', e => {
        const emptyBtn = e.target.closest('.nav-empty-btn');
        if (emptyBtn) {
          const cat = emptyBtn.dataset.category || 'draft';
          let defaultTitle = 'Untitled';
          if (cat === 'chapter') defaultTitle = 'Untitled Chapter';
          if (cat === 'lore')    defaultTitle = 'Untitled Lore';
          if (cat === 'world')   defaultTitle = 'Untitled Realm';
          if (cat === 'draft')   defaultTitle = 'Untitled Draft';

          const note = Storage.createNote({
            title: defaultTitle,
            category: cat,
            body: `# ${defaultTitle}\n\n`,
          });
          renderSidebar();
          openNote(note.id);
          if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
          }
          toast(`Created new ${cat}`, 'success');
          setTimeout(() => {
            if (noteTitle) {
              noteTitle.focus();
              noteTitle.select();
            }
          }, 100);
          return;
        }

        const link = e.target.closest('.nav-link');
        if (!link) return;
        openNote(link.dataset.id);
        if (window.innerWidth <= 768) {
          sidebar.classList.add('collapsed');
        }
      });
    });

    searchInput.addEventListener('input', () => {
      renderSidebar(searchInput.value.trim());
    });

    // New note modal
    btnNewNote.addEventListener('click', openNewNoteModal);
    modalCancel.addEventListener('click', closeNewNoteModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeNewNoteModal(); });
    modalCreate.addEventListener('click', createNoteFromModal);
    modalTitle.addEventListener('keydown', e => { if (e.key === 'Enter') createNoteFromModal(); });

    // Delete note
    btnDelete.addEventListener('click', () => deleteOverlay.classList.remove('hidden'));
    deleteCancel.addEventListener('click', () => deleteOverlay.classList.add('hidden'));
    deleteOverlay.addEventListener('click', e => { if (e.target === deleteOverlay) deleteOverlay.classList.add('hidden'); });
    deleteConfirm.addEventListener('click', deleteActiveNote);

    // Reading & Split mode toggles
    btnPreview.addEventListener('click', togglePreview);
    btnSplit.addEventListener('click', toggleSplitView);

    // Outline Navigator
    btnOutline.addEventListener('click', toggleOutline);
    btnCloseOutline.addEventListener('click', () => outlineDrawer.classList.add('hidden'));

    // Goal Tracker & Sprint Timer
    metaGoal.addEventListener('click', openGoalModal);
    btnCancelGoal.addEventListener('click', () => goalModal.classList.add('hidden'));
    goalModal.addEventListener('click', e => { if (e.target === goalModal) goalModal.classList.add('hidden'); });
    btnSaveGoal.addEventListener('click', saveGoalSettings);
    btnSprint.addEventListener('click', toggleSprintTimer);

    // Interactive Tutorial Tour
    btnSkipTutorialTop.addEventListener('click', skipTutorial);
    btnTutorialSkip.addEventListener('click', skipTutorial);
    btnTutorialPrev.addEventListener('click', prevTutorialStep);
    btnTutorialNext.addEventListener('click', nextTutorialStep);
    tutorialOverlay.addEventListener('click', e => {
      if (e.target === tutorialOverlay) closeTutorial();
    });

    // Zen Mode
    btnZen.addEventListener('click', toggleZenMode);

    // Export single note as Markdown
    btnExportMd.addEventListener('click', () => {
      if (!activeNoteId) return;
      Storage.exportMarkdown(activeNoteId);
      toast('Exported note as Markdown (.md)', 'success');
    });

    // Vault Export & Import
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        Storage.exportJSON();
        toast('Vault exported successfully', 'success');
      });
    }
    if (btnImport) {
      btnImport.addEventListener('click', handleOpenSpeyFilePicker);
    }

    // .spey Project Actions
    if (btnExportSpeySidebar) btnExportSpeySidebar.addEventListener('click', handleExportSpey);
    if (btnOpenSpeySidebar) btnOpenSpeySidebar.addEventListener('click', handleOpenSpeyFilePicker);
    if (btnProjectSettingsSidebar) btnProjectSettingsSidebar.addEventListener('click', openProjectSettingsModal);

    if (dashboardBtnExportSpey) dashboardBtnExportSpey.addEventListener('click', handleExportSpey);
    if (dashboardBtnOpenSpey) dashboardBtnOpenSpey.addEventListener('click', handleOpenSpeyFilePicker);
    if (menuBtnExportSpey) menuBtnExportSpey.addEventListener('click', handleExportSpey);
    if (menuBtnOpenSpey) menuBtnOpenSpey.addEventListener('click', handleOpenSpeyFilePicker);
    if (menuBtnProjectSettings) menuBtnProjectSettings.addEventListener('click', openProjectSettingsModal);

    // Spey Import Confirmation Modal
    if (btnImportModalClose) btnImportModalClose.addEventListener('click', closeSpeyImportModal);
    if (btnImportCancel) btnImportCancel.addEventListener('click', closeSpeyImportModal);
    if (btnImportReplace) btnImportReplace.addEventListener('click', executeImportReplace);
    if (btnImportMerge) btnImportMerge.addEventListener('click', executeImportMerge);
    if (speyImportModal) {
      speyImportModal.addEventListener('click', e => {
        if (e.target === speyImportModal) closeSpeyImportModal();
      });
    }

    // Project Settings Modal
    if (btnCloseProjectSettings) btnCloseProjectSettings.addEventListener('click', closeProjectSettingsModal);
    if (btnSaveProjectSettings) btnSaveProjectSettings.addEventListener('click', saveProjectSettings);
    if (settingsBtnExportSpey) settingsBtnExportSpey.addEventListener('click', handleExportSpey);
    if (settingsBtnExportJson) {
      settingsBtnExportJson.addEventListener('click', () => {
        Storage.exportJSON();
        toast('Vault exported as JSON', 'success');
      });
    }
    if (settingsBtnBackupVault) {
      settingsBtnBackupVault.addEventListener('click', () => {
        Storage.createBackup();
        toast('Vault snapshot archived in storage', 'success');
      });
    }
    if (projectSettingsModal) {
      projectSettingsModal.addEventListener('click', e => {
        if (e.target === projectSettingsModal) closeProjectSettingsModal();
      });
    }

    // File Input Handler (Processes .spey & .json with confirmation modal)
    if (importFile) {
      importFile.addEventListener('change', () => {
        if (!importFile.files || !importFile.files.length) return;
        const file = importFile.files[0];
        processIncomingSpeyFile(file, file.name);
        importFile.value = '';
      });
    }

    // Drag-and-drop setup
    setupDragAndDrop();

    // Desktop IPC / process file handler
    if (typeof window !== 'undefined') {
      window.__handleOpenedSpeyFile = function(payload) {
        if (!payload || !payload.content) return;
        try {
          processIncomingSpeyFile(payload.content, payload.fileName || 'bundle.spey');
        } catch (e) {
          console.error('Error opening spey payload:', e);
        }
      };

      if (window.__PENDING_SPEY_PAYLOAD__) {
        const p = window.__PENDING_SPEY_PAYLOAD__;
        window.__PENDING_SPEY_PAYLOAD__ = null;
        window.__handleOpenedSpeyFile(p);
      }
    }

    // Editor inputs → auto-save & metrics & outline
    noteTitle.addEventListener('input', scheduleSave);
    noteBody.addEventListener('input', () => {
      updateMetrics();
      scheduleSave();
      if (splitMode) {
        notePreview.innerHTML = Markdown.render(noteBody.value);
      }
      if (!outlineDrawer.classList.contains('hidden')) {
        renderOutline();
      }
      if (findReplaceBar && !findReplaceBar.classList.contains('hidden')) {
        performFind(true);
      }
      if (typewriterMode) {
        keepTypewriterCentered();
      }
    });
    noteTags.addEventListener('input', scheduleSave);
    noteCategory.addEventListener('change', () => {
      saveNow();
      renderSidebar(searchInput.value.trim());
      updateBacklinks();
    });

    // Format bar actions
    $$('.fmt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action) {
          applyFormat(btn.dataset.action);
        }
      });
    });

    // Typography & View Controls
    if (editorFontSelect) {
      editorFontSelect.addEventListener('change', () => {
        currentEditorFont = editorFontSelect.value;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('lordspey_editor_font', currentEditorFont);
        }
        applyTypographySettings();
      });
    }
    if (btnFontDec) {
      btnFontDec.addEventListener('click', () => {
        currentFontSize = Math.max(12, currentFontSize - 1);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('lordspey_editor_font_size', String(currentFontSize));
        }
        applyTypographySettings();
      });
    }
    if (btnFontInc) {
      btnFontInc.addEventListener('click', () => {
        currentFontSize = Math.min(28, currentFontSize + 1);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('lordspey_editor_font_size', String(currentFontSize));
        }
        applyTypographySettings();
      });
    }
    if (btnLineSpacing) {
      btnLineSpacing.addEventListener('click', () => {
        const LINE_SPACINGS = [1.5, 1.8, 2.1];
        const rounded = Math.round(currentLineHeight * 10) / 10;
        const idx = LINE_SPACINGS.indexOf(rounded);
        currentLineHeight = LINE_SPACINGS[(idx + 1) % LINE_SPACINGS.length] || 1.8;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('lordspey_editor_line_spacing', String(currentLineHeight));
        }
        applyTypographySettings();
      });
    }
    if (btnTypewriter) {
      btnTypewriter.addEventListener('click', toggleTypewriterMode);
    }

    // In-Editor Find & Replace Controls
    if (btnFindToggle) {
      btnFindToggle.addEventListener('click', () => {
        if (findReplaceBar && findReplaceBar.classList.contains('hidden')) {
          openFindBar(false);
        } else {
          closeFindBar();
        }
      });
    }
    if (btnFindClose) {
      btnFindClose.addEventListener('click', closeFindBar);
    }
    if (findInput) {
      findInput.addEventListener('input', () => performFind(false));
      findInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (e.shiftKey) findPrev();
          else findNext();
        } else if (e.key === 'Escape') {
          closeFindBar();
        }
      });
    }
    if (replaceInput) {
      replaceInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          replaceOne();
        } else if (e.key === 'Escape') {
          closeFindBar();
        }
      });
    }
    if (btnFindPrev) btnFindPrev.addEventListener('click', findPrev);
    if (btnFindNext) btnFindNext.addEventListener('click', findNext);
    if (btnFindCase) {
      btnFindCase.addEventListener('click', () => {
        findMatchCase = !findMatchCase;
        btnFindCase.classList.toggle('active', findMatchCase);
        performFind(false);
      });
    }
    if (btnReplaceOne) btnReplaceOne.addEventListener('click', replaceOne);
    if (btnReplaceAll) btnReplaceAll.addEventListener('click', replaceAll);

    // Manuscript Statistics Modal Triggers
    if (btnMetrics) btnMetrics.addEventListener('click', openMetricsModal);
    if (wordCount) wordCount.addEventListener('click', openMetricsModal);
    if (readingTime) readingTime.addEventListener('click', openMetricsModal);
    if (btnCloseMetrics) btnCloseMetrics.addEventListener('click', closeMetricsModal);
    if (btnMetricsDone) btnMetricsDone.addEventListener('click', closeMetricsModal);
    if (metricsModal) {
      metricsModal.addEventListener('click', e => {
        if (e.target === metricsModal) closeMetricsModal();
      });
    }

    // Cursor movement for typewriter centering & selection stats
    noteBody.addEventListener('keyup', () => {
      if (typewriterMode) keepTypewriterCentered();
    });
    noteBody.addEventListener('mouseup', () => {
      if (typewriterMode) keepTypewriterCentered();
      if (metricsModal && !metricsModal.classList.contains('hidden')) {
        renderDetailedMetrics();
      }
    });
    noteBody.addEventListener('click', () => {
      if (typewriterMode) keepTypewriterCentered();
    });

    // Backlinks toggle
    backlinksHeader.addEventListener('click', () => {
      backlinksPanel.classList.toggle('collapsed');
    });

    // Wiki-link clicks inside preview & backlinks panel
    if (document && document.addEventListener) {
      document.addEventListener('click', e => {
      const wikiLink = e.target.closest('.wiki-link');
      if (wikiLink) {
        e.preventDefault();
        handleWikiLinkClick(wikiLink.dataset.wiki);
        return;
      }
      const backlinkCard = e.target.closest('.backlink-card');
      if (backlinkCard) {
        e.preventDefault();
        openNote(backlinkCard.dataset.id);
        return;
      }
      const calloutHeader = e.target.closest('.callout[data-folded] .callout-header');
      if (calloutHeader) {
        const callout = calloutHeader.closest('.callout');
        if (callout) {
          const isFolded = callout.getAttribute('data-folded') === 'true';
          callout.setAttribute('data-folded', String(!isFolded));
          return;
        }
      }
    });
  }

    // Wiki create modal buttons
    wikicreateCancel.addEventListener('click', closeWikiCreateModal);
    wikicreateModal.addEventListener('click', e => { if (e.target === wikicreateModal) closeWikiCreateModal(); });
    wikicreateConfirm.addEventListener('click', confirmWikiCreate);

    // Quick Switcher triggers
    btnQuickSwitcher.addEventListener('click', openQuickSwitcher);
    switcherModal.addEventListener('click', e => { if (e.target === switcherModal) closeQuickSwitcher(); });
    switcherInput.addEventListener('input', filterSwitcher);
    switcherInput.addEventListener('keydown', handleSwitcherKeydown);

    // Galaxy Cosmos triggers
    btnGraphView.addEventListener('click', openGraphView);
    btnCloseGraph.addEventListener('click', closeGraphView);
    graphModal.addEventListener('click', e => { if (e.target === graphModal) closeGraphView(); });
    galaxyBtnCreateFirst.addEventListener('click', () => {
      closeGraphView();
      const n = Storage.createNote({ title: 'Chapter I', category: 'chapter', body: '# Chapter I\n\n' });
      renderSidebar();
      openNote(n.id);
    });
    galaxyBtnLoadDemo.addEventListener('click', () => {
      Storage.loadStarterVault();
      renderSidebar();
      buildGalaxyData();
      toast('Loaded sample vault', 'success');
    });

    // Deep Worldbuilding View Triggers
    if (btnMapView) btnMapView.addEventListener('click', openMapView);
    if (menuBtnMap) menuBtnMap.addEventListener('click', openMapView);
    if (dashboardBtnMap) dashboardBtnMap.addEventListener('click', openMapView);
    if (btnToolbarMap) btnToolbarMap.addEventListener('click', openMapView);
    if (btnCloseMap) btnCloseMap.addEventListener('click', closeMapView);
    if (mapModal) mapModal.addEventListener('click', e => { if (e.target === mapModal) closeMapView(); });

    if (btnTimelineView) btnTimelineView.addEventListener('click', openTimelineView);
    if (menuBtnTimeline) menuBtnTimeline.addEventListener('click', openTimelineView);
    if (dashboardBtnTimeline) dashboardBtnTimeline.addEventListener('click', openTimelineView);
    if (btnToolbarTimeline) btnToolbarTimeline.addEventListener('click', openTimelineView);
    if (btnCloseTimeline) btnCloseTimeline.addEventListener('click', closeTimelineView);
    if (timelineModal) timelineModal.addEventListener('click', e => { if (e.target === timelineModal) closeTimelineView(); });

    if (btnCodexView) btnCodexView.addEventListener('click', openCodexView);
    if (menuBtnCodex) menuBtnCodex.addEventListener('click', openCodexView);
    if (dashboardBtnCodex) dashboardBtnCodex.addEventListener('click', openCodexView);
    if (btnToolbarCodex) btnToolbarCodex.addEventListener('click', openCodexView);
    if (btnCloseCodex) btnCloseCodex.addEventListener('click', closeCodexView);
    if (codexModal) codexModal.addEventListener('click', e => { if (e.target === codexModal) closeCodexView(); });

    // Worldbuilding Feature Tutorial Triggers
    if (btnMapTutorial) btnMapTutorial.addEventListener('click', () => openWorldbuildingTutorial('map'));
    if (btnCloseMapTutorial) btnCloseMapTutorial.addEventListener('click', () => closeWorldbuildingTutorial('map'));
    if (btnDismissMapTutorial) btnDismissMapTutorial.addEventListener('click', () => closeWorldbuildingTutorial('map'));
    if (mapTutorialModal) mapTutorialModal.addEventListener('click', e => { if (e.target === mapTutorialModal) closeWorldbuildingTutorial('map'); });

    if (btnTimelineTutorial) btnTimelineTutorial.addEventListener('click', () => openWorldbuildingTutorial('timeline'));
    if (btnCloseTimelineTutorial) btnCloseTimelineTutorial.addEventListener('click', () => closeWorldbuildingTutorial('timeline'));
    if (btnDismissTimelineTutorial) btnDismissTimelineTutorial.addEventListener('click', () => closeWorldbuildingTutorial('timeline'));
    if (timelineTutorialModal) timelineTutorialModal.addEventListener('click', e => { if (e.target === timelineTutorialModal) closeWorldbuildingTutorial('timeline'); });

    if (btnCodexTutorial) btnCodexTutorial.addEventListener('click', () => openWorldbuildingTutorial('codex'));
    if (btnCloseCodexTutorial) btnCloseCodexTutorial.addEventListener('click', () => closeWorldbuildingTutorial('codex'));
    if (btnDismissCodexTutorial) btnDismissCodexTutorial.addEventListener('click', () => closeWorldbuildingTutorial('codex'));
    if (codexTutorialModal) codexTutorialModal.addEventListener('click', e => { if (e.target === codexTutorialModal) closeWorldbuildingTutorial('codex'); });

    // Copyable syntax cheat sheet code snippets
    $$('.copyable-code').forEach(el => {
      el.addEventListener('click', () => {
        const text = el.textContent.trim();
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            toast('Cheat sheet syntax copied to clipboard', 'info');
          }).catch(() => {});
        } else {
          toast('Syntax copied', 'info');
        }
      });
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', handleGlobalShortcuts);

    // Tab key inside textarea
    noteBody.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = noteBody.selectionStart;
        const end = noteBody.selectionEnd;
        noteBody.value = noteBody.value.substring(0, start) + '  ' + noteBody.value.substring(end);
        noteBody.selectionStart = noteBody.selectionEnd = start + 2;
        scheduleSave();
      }
    });
  }

  // ── Note operations ──
  function openNote(id) {
    const note = Storage.getNote(id);
    if (!note) return;

    activeNoteId = id;
    noteTitle.value = note.title;
    noteTags.value = note.tags || '';
    noteCategory.value = note.category;
    noteBody.value = note.body;

    updateMetrics();
    showEditor();
    renderSidebar(searchInput.value.trim());
    updateBacklinks();
    Storage.saveSetting('lastOpenNote', id);

    if (previewMode || splitMode) {
      notePreview.innerHTML = Markdown.render(note.body);
    }

    if (typewriterMode) {
      setTimeout(keepTypewriterCentered, 50);
    }
    if (findReplaceBar && !findReplaceBar.classList.contains('hidden')) {
      performFind(true);
    }
  }

  function createNoteFromModal() {
    const title = modalTitle.value.trim() || 'Untitled';
    const category = modalCategory.value;
    const note = Storage.createNote({ title, category, body: `# ${title}\n\n` });
    closeNewNoteModal();
    renderSidebar();
    openNote(note.id);
    toast('Document created', 'success');
  }

  function deleteActiveNote() {
    if (!activeNoteId) return;
    Storage.deleteNote(activeNoteId);
    deleteOverlay.classList.add('hidden');
    activeNoteId = null;

    showMainMenu();
    renderSidebar(searchInput.value.trim());
    toast('Document deleted', 'info');
  }

  // ── Auto-save ──
  function scheduleSave() {
    saveStatus.textContent = 'Saving…';
    saveStatus.className = 'meta-info save-status saving';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 350);
  }

  function saveNow() {
    if (!activeNoteId) return;
    Storage.updateNote(activeNoteId, {
      title: noteTitle.value,
      body: noteBody.value,
      tags: noteTags.value,
      category: noteCategory.value,
    });
    saveStatus.textContent = 'Saved';
    saveStatus.className = 'meta-info save-status saved';
    renderSidebar(searchInput.value.trim());
    updateBacklinks();
    if (previewMode || splitMode) {
      notePreview.innerHTML = Markdown.render(noteBody.value);
    }
  }

  // ── Live Split-View Mode ──
  function toggleSplitView() {
    splitMode = !splitMode;
    if (splitMode) {
      previewMode = false;
      btnPreview.classList.remove('active');
      editorBodyWrap.classList.add('split-mode');
      noteBody.classList.remove('hidden');
      notePreview.classList.remove('hidden');
      notePreview.innerHTML = Markdown.render(noteBody.value);
      btnSplit.classList.add('active');
      toast('Live Split-View enabled', 'info');
    } else {
      editorBodyWrap.classList.remove('split-mode');
      notePreview.classList.add('hidden');
      btnSplit.classList.remove('active');
      toast('Split-View closed', 'info');
    }
  }

  // ── Reading Preview Mode ──
  function togglePreview() {
    if (splitMode) {
      editorBodyWrap.classList.remove('split-mode');
      splitMode = false;
      btnSplit.classList.remove('active');
    }
    previewMode = !previewMode;
    if (previewMode) {
      notePreview.innerHTML = Markdown.render(noteBody.value);
      noteBody.classList.add('hidden');
      notePreview.classList.remove('hidden');
      btnPreview.classList.add('active');
    } else {
      noteBody.classList.remove('hidden');
      notePreview.classList.add('hidden');
      btnPreview.classList.remove('active');
    }
  }

  // ── Document Outline / Scene Jump ──
  function toggleOutline() {
    outlineDrawer.classList.toggle('hidden');
    if (!outlineDrawer.classList.contains('hidden')) {
      renderOutline();
      btnOutline.classList.add('active');
    } else {
      btnOutline.classList.remove('active');
    }
  }

  function renderOutline() {
    const text = noteBody.value;
    const lines = text.split('\n');
    const headings = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        headings.push({
          level: match[1].length,
          title: match[2].trim(),
          lineIndex: index,
        });
      } else if (/^\s*(?:\*\s*){3,}\s*$/.test(line) && /\s/.test(line.trim())) {
        headings.push({
          level: 4,
          title: '✦ Scene Break',
          lineIndex: index,
          isScene: true,
        });
      }
    });

    if (headings.length === 0) {
      outlineList.innerHTML = `<li style="padding: 14px; text-align: center; color: var(--text-faint); font-size: 0.75rem;">No headings yet. Use # Heading or * * * to structure scenes.</li>`;
      return;
    }

    outlineList.innerHTML = headings.map(h => `
      <li class="outline-item depth-${h.level} ${h.isScene ? 'is-scene' : ''}" data-line="${h.lineIndex}">
        ${escText(h.title)}
      </li>
    `).join('');

    $$('.outline-item', outlineList).forEach(item => {
      item.addEventListener('click', () => {
        const line = parseInt(item.dataset.line, 10);
        jumpToLine(line);
      });
    });
  }

  function jumpToLine(lineIndex) {
    const lines = noteBody.value.split('\n');
    let charOffset = 0;
    for (let i = 0; i < lineIndex; i++) {
      charOffset += lines[i].length + 1;
    }
    noteBody.focus();
    noteBody.setSelectionRange(charOffset, charOffset + (lines[lineIndex] || '').length);

    // Scroll to position
    const lineHeight = 25;
    noteBody.scrollTop = Math.max(0, lineIndex * lineHeight - 100);
  }

  // ── Word Goal Tracker & Sprint Timer ──
  function openGoalModal() {
    inputWordGoal.value = targetWordGoal;
    inputSprintMin.value = Math.round(sprintDurationSec / 60);
    goalModal.classList.remove('hidden');
  }

  function saveGoalSettings() {
    targetWordGoal = Math.max(50, parseInt(inputWordGoal.value, 10) || 500);
    sprintDurationSec = Math.max(60, (parseInt(inputSprintMin.value, 10) || 20) * 60);
    sprintRemaining = sprintDurationSec;
    goalModal.classList.add('hidden');
    updateMetrics();
    updateSprintText();
    toast(`Target set to ${targetWordGoal} words`, 'info');
  }

  function toggleSprintTimer() {
    if (isSprintRunning) {
      clearInterval(sprintTimerId);
      isSprintRunning = false;
      btnSprint.classList.remove('active');
      toast('Sprint paused', 'info');
    } else {
      isSprintRunning = true;
      btnSprint.classList.add('active');
      sprintTimerText.classList.remove('hidden');
      sprintTimerId = setInterval(onSprintTick, 1000);
      toast('Writing sprint started (20 min)', 'info');
    }
  }

  function onSprintTick() {
    sprintRemaining--;
    updateSprintText();
    if (sprintRemaining <= 0) {
      clearInterval(sprintTimerId);
      isSprintRunning = false;
      sprintRemaining = sprintDurationSec;
      btnSprint.classList.remove('active');
      toast('Writing sprint complete!', 'success');
    }
  }

  function updateSprintText() {
    const mins = Math.floor(sprintRemaining / 60);
    const secs = sprintRemaining % 60;
    sprintTimerText.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateMetrics() {
    const text = noteBody.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const mins = Math.max(1, Math.ceil(words / 200));

    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    readingTime.textContent = words > 0 ? `~${mins} min read` : '0 min read';

    // Goal Meter Progress
    const percent = Math.min(100, Math.round((words / targetWordGoal) * 100));
    goalProgress.textContent = `${words} / ${targetWordGoal}w (${percent}%)`;
    goalFill.style.width = `${percent}%`;

    // Refresh Detailed Manuscript Stats if modal is open
    if (metricsModal && !metricsModal.classList.contains('hidden')) {
      renderDetailedMetrics();
    }
  }

  // ═══════════════════════════════════════════════
  // .spey Native Project Bundle & Settings Controller
  // ═══════════════════════════════════════════════

  let pendingSpeyData = null;
  let isSpeyImportModalOpen = false;
  let isProjectSettingsModalOpen = false;

  function handleExportSpey() {
    const pkg = Storage.exportSpeyPackage();
    const title = pkg.projectName || 'Project';
    toast(`Exported "${title}.spey" successfully`, 'success');
  }

  function handleOpenSpeyFilePicker() {
    if (importFile) {
      importFile.click();
    }
  }

  function processIncomingSpeyFile(fileOrString, fileName = '') {
    try {
      if (typeof fileOrString === 'string' || (fileOrString && typeof fileOrString === 'object' && !fileOrString.name && typeof fileOrString.slice !== 'function')) {
        const parsed = Storage.parseSpeyPackage(fileOrString);
        pendingSpeyData = parsed;
        openSpeyImportModal(parsed);
      } else if (fileOrString && (fileOrString instanceof Blob || typeof fileOrString.slice === 'function')) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = Storage.parseSpeyPackage(reader.result);
            pendingSpeyData = parsed;
            openSpeyImportModal(parsed);
          } catch (err) {
            toast('Failed to parse file: ' + (err.message || 'invalid format'), 'error');
          }
        };
        reader.onerror = () => toast('Failed to read file', 'error');
        reader.readAsText(fileOrString);
      }
    } catch (err) {
      toast('Invalid project bundle: ' + (err.message || 'unrecognized package'), 'error');
    }
  }

  function openSpeyImportModal(summary) {
    if (!speyImportModal) return;
    isSpeyImportModalOpen = true;
    if (speyImportProjName) speyImportProjName.textContent = summary.projectName || 'Lord Spey Manuscript';
    if (speyImportFormatTag) speyImportFormatTag.textContent = summary.isSpey ? 'Native .spey Bundle · Version 1' : 'Vault JSON Backup';
    if (speyStatChapters) speyStatChapters.textContent = String(summary.chapters || 0);
    if (speyStatWords) speyStatWords.textContent = (summary.wordCount || 0).toLocaleString();
    if (speyStatLore) speyStatLore.textContent = String(summary.lore || 0);
    if (speyStatPins) speyStatPins.textContent = String(summary.mapPinsCount || 0);

    if (speyBreakdownDetails) {
      speyBreakdownDetails.innerHTML = `
        <div class="spey-breakdown-item"><strong>${summary.totalNotes || 0}</strong> total documents</div>
        <div class="spey-breakdown-item"><strong>${summary.world || 0}</strong> world realms</div>
        <div class="spey-breakdown-item"><strong>${summary.drafts || 0}</strong> drafts/outlines</div>
        <div class="spey-breakdown-item"><strong>${summary.timelineEventsCount || 0}</strong> chronology events</div>
        <div class="spey-breakdown-item"><strong>${summary.charactersCount || 0}</strong> character dossiers</div>
        <div class="spey-breakdown-item"><strong>${summary.relationshipsCount || 0}</strong> relationship bonds</div>
        ${summary.hasCustomMap ? '<div class="spey-breakdown-item">✦ <strong>Custom Cartography Map</strong> included</div>' : ''}
      `;
    }

    speyImportModal.classList.remove('hidden');
  }

  function closeSpeyImportModal() {
    isSpeyImportModalOpen = false;
    if (speyImportModal) speyImportModal.classList.add('hidden');
    pendingSpeyData = null;
  }

  function executeImportReplace() {
    if (!pendingSpeyData) return;
    try {
      const res = Storage.importSpeyPackage(pendingSpeyData.raw, 'replace', true);
      toast(`Project "${pendingSpeyData.projectName}" loaded (vault safely archived)`, 'success');
      closeSpeyImportModal();
      refreshWorkspaceAfterImport();
    } catch (err) {
      toast('Import failed: ' + (err.message || 'unable to load package'), 'error');
    }
  }

  function executeImportMerge() {
    if (!pendingSpeyData) return;
    try {
      const res = Storage.importSpeyPackage(pendingSpeyData.raw, 'merge', false);
      toast(`Merged ${res.addedNotes} item(s) into existing workspace`, 'success');
      closeSpeyImportModal();
      refreshWorkspaceAfterImport();
    } catch (err) {
      toast('Merge failed: ' + (err.message || 'unable to merge package'), 'error');
    }
  }

  function refreshWorkspaceAfterImport() {
    renderSidebar();
    renderMainMenuRecent();
    const all = Storage.getAllNotes();
    if (all.length > 0) {
      const firstChap = all.find(n => n.category === 'chapter') || all[0];
      openNote(firstChap.id);
    } else {
      showMainMenu();
    }
  }

  function openProjectSettingsModal() {
    if (!projectSettingsModal) return;
    isProjectSettingsModalOpen = true;
    const settings = Storage.getSettings();
    if (settingProjectTitle) {
      settingProjectTitle.value = settings.projectTitle || Storage.getProjectTitle();
    }
    if (settingProjectAuthor) {
      settingProjectAuthor.value = settings.projectAuthor || 'Lord Spey';
    }
    renderProjectSettingsStats();
    projectSettingsModal.classList.remove('hidden');
  }

  function renderProjectSettingsStats() {
    if (!settingsStatsGrid) return;
    const stats = Storage.getWorkspaceStats();
    settingsStatsGrid.innerHTML = `
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.chapters}</div>
        <div class="settings-stat-lbl">Chapters</div>
      </div>
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.wordCount.toLocaleString()}</div>
        <div class="settings-stat-lbl">Words</div>
      </div>
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.lore}</div>
        <div class="settings-stat-lbl">Lore Notes</div>
      </div>
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.world}</div>
        <div class="settings-stat-lbl">World Notes</div>
      </div>
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.drafts}</div>
        <div class="settings-stat-lbl">Drafts</div>
      </div>
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.mapPins}</div>
        <div class="settings-stat-lbl">Map Pins</div>
      </div>
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.timelineEvents}</div>
        <div class="settings-stat-lbl">Chronology</div>
      </div>
      <div class="settings-stat-box">
        <div class="settings-stat-val">${stats.characters}</div>
        <div class="settings-stat-lbl">Characters</div>
      </div>
    `;
  }

  function saveProjectSettings() {
    if (settingProjectTitle) {
      Storage.saveSetting('projectTitle', settingProjectTitle.value.trim());
    }
    if (settingProjectAuthor) {
      Storage.saveSetting('projectAuthor', settingProjectAuthor.value.trim());
    }
    toast('Project settings saved', 'success');
    closeProjectSettingsModal();
  }

  function closeProjectSettingsModal() {
    isProjectSettingsModalOpen = false;
    if (projectSettingsModal) projectSettingsModal.classList.add('hidden');
  }

  function setupDragAndDrop() {
    if (typeof window === 'undefined') return;

    let dragCounter = 0;

    window.addEventListener('dragenter', e => {
      if (e.dataTransfer && e.dataTransfer.types && (e.dataTransfer.types.includes ? e.dataTransfer.types.includes('Files') : true)) {
        e.preventDefault();
        dragCounter++;
        if (speyDropzone) {
          speyDropzone.classList.remove('hidden');
          speyDropzone.classList.add('active');
        }
      }
    });

    window.addEventListener('dragover', e => {
      if (e.dataTransfer && e.dataTransfer.types && (e.dataTransfer.types.includes ? e.dataTransfer.types.includes('Files') : true)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }
    });

    window.addEventListener('dragleave', e => {
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        if (speyDropzone) {
          speyDropzone.classList.remove('active');
          speyDropzone.classList.add('hidden');
        }
      }
    });

    window.addEventListener('drop', e => {
      e.preventDefault();
      dragCounter = 0;
      if (speyDropzone) {
        speyDropzone.classList.remove('active');
        speyDropzone.classList.add('hidden');
      }

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const lowerName = (file.name || '').toLowerCase();
        if (lowerName.endsWith('.spey') || lowerName.endsWith('.json')) {
          processIncomingSpeyFile(file, file.name);
        } else {
          toast('Please drop a .spey project bundle or .json file', 'info');
        }
      }
    });
  }

  // Expose methods for testing and integration
  if (typeof window !== 'undefined') {
    window.processIncomingSpeyFile = processIncomingSpeyFile;
    window.openProjectSettingsModal = openProjectSettingsModal;
    window.closeProjectSettingsModal = closeProjectSettingsModal;
    window.openSpeyImportModal = openSpeyImportModal;
    window.closeSpeyImportModal = closeSpeyImportModal;
    window.handleExportSpey = handleExportSpey;
    window.executeImportReplace = executeImportReplace;
    window.executeImportMerge = executeImportMerge;
  }

  // ═══════════════════════════════════════════════
  // Interactive Step-by-Step Tutorial Tour Engine
  // ═══════════════════════════════════════════════
  const TUTORIAL_STEPS = [
    {
      step: '1 of 6',
      category: 'Overview',
      icon: '✦',
      title: 'Welcome to Lord Spey',
      desc: 'Lord Spey is your minimal, local-first workspace designed specifically for authors, novelists, and worldbuilders. Inspired by Obsidian, it lets you draft chapters, organize manuscript lore, and interconnect your story universe.',
      features: [
        { icon: '✦', text: '<strong>Clean Black & Red Aesthetic:</strong> Crafted to maximize focus and eliminate eye strain during long writing sessions.' },
        { icon: '✦', text: '<strong>100% Private & Local:</strong> Your notes and worldbuilding lore stay safely stored in your browser with zero sign-up required.' },
        { icon: '✦', text: '<strong>Instant Navigation:</strong> Click any category in the sidebar, or return to the main dashboard anytime by clicking the logo.' }
      ],
      tip: 'You can replay this walkthrough at any time by clicking the guide icon (?) in the sidebar or the button on the dashboard.'
    },
    {
      step: '2 of 6',
      category: 'Vault Structure',
      icon: '🗂',
      title: 'Four Dedicated Categories',
      desc: 'Organize your entire writing universe across four purpose-built categories in the sidebar and dashboard:',
      features: [
        { icon: '📖', text: '<strong>Chapters:</strong> Draft full manuscript scenes, dialogue, and story prose.' },
        { icon: '📜', text: '<strong>Lore:</strong> Define characters, factions, magic systems, relics, and historical lore.' },
        { icon: '🗺️', text: '<strong>World Building:</strong> Outline continents, realms, citadels, geographies, and cultures.' },
        { icon: '📝', text: '<strong>Drafts:</strong> Quick notes, brainstorms, scene beat sheets, and raw story ideas.' }
      ],
      tip: 'Click any category card on the dashboard or "+ New Note" in the sidebar to create an entry.'
    },
    {
      step: '3 of 6',
      category: 'Obsidian Wiki-Links',
      icon: '🔗',
      title: 'Obsidian-Style Wiki-Links',
      desc: 'Cross-reference people, places, and story events seamlessly inside your prose using double square brackets:',
      features: [
        { icon: '[[ ]]', text: '<strong>Standard Link:</strong> Type <code>[[The High Citadel]]</code> to link directly to that note.' },
        { icon: '[[ | ]]', text: '<strong>Custom Alias:</strong> Type <code>[[The High Citadel|The Fortress]]</code> to display custom label text.' },
        { icon: '✦', text: '<strong>Auto-Create on Click:</strong> Clicking a link to a note that does not exist yet prompts you to create it immediately.' },
        { icon: '✦', text: '<strong>Linked Mentions:</strong> The panel at the bottom of every note automatically reveals all backlinks pointing to it.' }
      ],
      tip: 'Use the [[ ]] button in the editor formatting bar to quickly insert a wiki-link at your cursor position.'
    },
    {
      step: '4 of 6',
      category: 'Visual Cosmos',
      icon: '🌌',
      title: 'Interactive Galaxy Graph',
      desc: 'Visualize your stories, lore entries, and chapters as an interconnected galaxy of stars:',
      features: [
        { icon: '✦', text: '<strong>Star Nodes:</strong> Every document shines as a star color-coded by category (red for chapters, orange for lore, purple for world, slate for drafts).' },
        { icon: '✦', text: '<strong>Luminous Links:</strong> Wiki-links between your notes form glowing constellation connections.' },
        { icon: '✦', text: '<strong>Interactive Controls:</strong> Drag nodes to rearrange, scroll to zoom in/out, and click any star to jump into editing.' }
      ],
      tip: 'Open the Galaxy Graph at any time by pressing <kbd>Ctrl+G</kbd> or clicking the graph icon in the sidebar.'
    },
    {
      step: '5 of 6',
      category: 'Author Toolkit',
      icon: '✍️',
      title: 'Focused Author Writing Tools',
      desc: 'Powerful drafting tools designed to keep you in a state of creative flow without leaving your keyboard:',
      features: [
        { icon: '✦', text: '<strong>Live Split View (<kbd>Ctrl+\\</kbd>):</strong> Edit Markdown on the left and see real-time rendered typography on the right.' },
        { icon: '✦', text: '<strong>Document Outline (<kbd>Alt+O</kbd>):</strong> Live scene outline drawer generated from your markdown headings (# H1, ## H2, ### H3).' },
        { icon: '✦', text: '<strong>Word Target & Sprint:</strong> Set session word goals (e.g. 500w) and trigger timed 20-minute sprints with live progress tracking.' },
        { icon: '✦', text: '<strong>Zen Mode (<kbd>Ctrl+Shift+F</kbd>):</strong> Collapses all sidebars and chrome for an immersive, distraction-free writing environment.' }
      ],
      tip: 'Click the word count meter in the editor toolbar to adjust your session goal or launch a sprint.'
    },
    {
      step: '6 of 6',
      category: 'Shortcuts & Backups',
      icon: '⚡',
      title: 'Speed, Search & Vault Backups',
      desc: 'Quickly find what you need and safeguard your writing across devices:',
      features: [
        { icon: '✦', text: '<strong>Quick Switcher (<kbd>Ctrl+K</kbd> or <kbd>Ctrl+O</kbd>):</strong> Search and open any note instantly by title or category.' },
        { icon: '✦', text: '<strong>Export Markdown (<kbd>.md</kbd>):</strong> Export your current note as a clean Markdown file with one click.' },
        { icon: '✦', text: '<strong>Vault Backup & Restore:</strong> Export your entire library as a single JSON file or import existing vaults using the sidebar footer icons.' }
      ],
      tip: 'You are all set! Click "Get Started" below to begin writing in your workspace.'
    }
  ];

  function openTutorial(step = 0) {
    currentTutorialStep = Math.max(0, Math.min(step, TUTORIAL_STEPS.length - 1));
    renderTutorialStep(currentTutorialStep);
    tutorialOverlay.classList.remove('hidden');
  }

  function closeTutorial() {
    tutorialOverlay.classList.add('hidden');
  }

  function skipTutorial() {
    localStorage.setItem('lordspey_tutorial_seen', 'true');
    closeTutorial();
    toast('Tutorial completed. Access it anytime via the top guide icon.', 'info');
  }

  function nextTutorialStep() {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
      currentTutorialStep++;
      renderTutorialStep(currentTutorialStep);
    } else {
      skipTutorial();
    }
  }

  function prevTutorialStep() {
    if (currentTutorialStep > 0) {
      currentTutorialStep--;
      renderTutorialStep(currentTutorialStep);
    }
  }

  function renderTutorialStep(index) {
    const data = TUTORIAL_STEPS[index];
    if (!data) return;

    tutorialStepBadge.textContent = `Step ${data.step}`;
    tutorialCategoryTag.textContent = data.category;
    tutorialIconBox.textContent = data.icon;
    tutorialTitle.textContent = data.title;
    tutorialDesc.textContent = data.desc;

    tutorialFeatures.innerHTML = data.features.map(f => `
      <div class="tutorial-feature-row">
        <span class="tutorial-feature-icon">${f.icon}</span>
        <div class="tutorial-feature-text">${f.text}</div>
      </div>
    `).join('');

    tutorialTip.innerHTML = `<strong>Pro Tip:</strong> ${data.tip}`;

    // Render navigation dots
    tutorialDots.innerHTML = TUTORIAL_STEPS.map((_, i) => `
      <span class="tutorial-dot${i === index ? ' active' : ''}" data-step="${i}" title="Go to step ${i + 1}"></span>
    `).join('');

    $$('.tutorial-dot', tutorialDots).forEach(dot => {
      dot.addEventListener('click', () => {
        currentTutorialStep = parseInt(dot.dataset.step, 10);
        renderTutorialStep(currentTutorialStep);
      });
    });

    // Update buttons
    btnTutorialPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
    btnTutorialNext.textContent = index === TUTORIAL_STEPS.length - 1 ? 'Get Started ✦' : 'Next →';
  }

  function insertTextAtCursor(text) {
    if (!activeNoteId || previewMode) return;
    const ta = noteBody;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + text + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    ta.focus();
    updateMetrics();
    scheduleSave();
  }

  // ── Wiki-Link Navigation & Creation ──
  function handleWikiLinkClick(targetTitle) {
    if (!targetTitle) return;
    const existing = Storage.findNoteByTitle(targetTitle);
    if (existing) {
      openNote(existing.id);
      toast(`Opened [[${existing.title}]]`, 'info');
    } else {
      pendingWikiTarget = targetTitle;
      wikicreateTarget.textContent = targetTitle;
      wikicreateModal.classList.remove('hidden');
    }
  }

  function confirmWikiCreate() {
    if (!pendingWikiTarget) return;
    const title = pendingWikiTarget.trim();
    const cat = wikicreateCategory.value;
    const note = Storage.createNote({
      title,
      category: cat,
      body: `# ${title}\n\nLinked from [[${Storage.getNote(activeNoteId)?.title || 'another note'}]].\n\n`,
    });
    closeWikiCreateModal();
    renderSidebar();
    openNote(note.id);
    toast(`Created [[${title}]]`, 'success');
  }

  function closeWikiCreateModal() {
    wikicreateModal.classList.add('hidden');
    pendingWikiTarget = '';
  }

  // ── Backlinks / Mentions ──
  function updateBacklinks() {
    if (!activeNoteId) {
      backlinksList.innerHTML = '';
      backlinksCount.textContent = '0';
      return;
    }
    const current = Storage.getNote(activeNoteId);
    if (!current) return;

    const backlinks = Storage.getBacklinks(current.title);
    backlinksCount.textContent = backlinks.length;

    if (backlinks.length === 0) {
      backlinksList.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 8px 0; color: var(--text-faint); font-size: 0.8rem; font-style: italic;">
          No other documents reference [[${escText(current.title)}]] yet. Type [[${escText(current.title)}]] in another document to link them.
        </div>
      `;
      return;
    }

    const titleLower = current.title.trim().toLowerCase();

    backlinksList.innerHTML = backlinks.map(b => {
      const body = b.body || '';
      let snippet = '';
      const idx = body.toLowerCase().indexOf(titleLower);
      if (idx !== -1) {
        const start = Math.max(0, idx - 45);
        const end = Math.min(body.length, idx + titleLower.length + 55);
        snippet = (start > 0 ? '…' : '') +
          escText(body.substring(start, idx)) +
          `<mark>${escText(body.substring(idx, idx + titleLower.length))}</mark>` +
          escText(body.substring(idx + titleLower.length, end)) +
          (end < body.length ? '…' : '');
      } else {
        snippet = escText(body.slice(0, 100)) + '…';
      }

      return `
        <div class="backlink-card" data-id="${b.id}">
          <div class="backlink-card-header">
            <span class="backlink-card-title">${escText(b.title || 'Untitled')}</span>
            <span class="badge badge-${b.category}">${b.category}</span>
          </div>
          <div class="backlink-snippet">${snippet}</div>
        </div>
      `;
    }).join('');
  }

  // ── Zen / Focus Mode ──
  function toggleZenMode() {
    zenMode = !zenMode;
    document.body.classList.toggle('zen-mode', zenMode);
    btnZen.classList.toggle('active', zenMode);
    toast(zenMode ? 'Focus Mode enabled' : 'Focus Mode exited', 'info');
  }

  // ── Format bar ──
  function applyFormat(action) {
    if (!action || previewMode) return;
    const ta = noteBody;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = ta.value.substring(start, end);

    let before = '', after = '', insert = '';

    switch (action) {
      case 'bold':          before = '**'; after = '**'; insert = sel || 'bold text'; break;
      case 'italic':        before = '*';  after = '*';  insert = sel || 'italic text'; break;
      case 'strike':        before = '~~'; after = '~~'; insert = sel || 'strikethrough text'; break;
      case 'highlight':     before = '=='; after = '=='; insert = sel || 'highlighted text'; break;
      case 'heading':       before = '## '; insert = sel || 'Heading'; break;
      case 'wikilink':      before = '[['; after = ']]'; insert = sel || 'Note Title'; break;
      case 'task':          before = '- [ ] '; insert = sel || 'Draft task'; break;
      case 'quote':         before = '> ';  insert = sel || 'Quote'; break;
      case 'callout':       before = '> [!NOTE]\n> '; insert = sel || 'Important scene detail'; break;
      case 'ul':            before = '- ';  insert = sel || 'List item'; break;
      case 'ol':            before = '1. '; insert = sel || 'List item'; break;
      case 'code':          before = '`';  after = '`';  insert = sel || 'code'; break;
      case 'link':          before = '['; after = '](url)'; insert = sel || 'link text'; break;
      case 'table':
        before = '\n\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Data | Data | Data |\n| Data | Data | Data |\n\n';
        insert = '';
        break;
      case 'footnote': {
        const existingNums = [...ta.value.matchAll(/\[\^(\d+)\]/g)].map(m => parseInt(m[1], 10));
        const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
        const refTag = `[^${nextNum}]`;
        const defText = sel || 'Footnote description';
        const defTag = `\n\n[^${nextNum}]: ${defText}`;

        const textBefore = ta.value.substring(0, start);
        const textAfter = ta.value.substring(end);
        ta.value = textBefore + refTag + textAfter + defTag;
        ta.selectionStart = start + refTag.length;
        ta.selectionEnd = start + refTag.length;
        ta.focus();
        updateMetrics();
        scheduleSave();
        if (splitMode) {
          notePreview.innerHTML = Markdown.render(noteBody.value);
        }
        return;
      }
      case 'divider':       before = '\n---\n'; insert = ''; break;
      case 'scene':         before = '\n\n* * *\n\n'; insert = ''; break;
      // Smart Typography & Dialogue
      case 'dialogue-dash': before = '— '; insert = sel || ''; break;
      case 'smart-quotes':  before = '“'; after = '”'; insert = sel || ''; break;
      case 'single-quotes': before = '‘'; after = '’'; insert = sel || ''; break;
      case 'ellipsis':      before = '…'; insert = sel || ''; break;
    }

    const replacement = before + insert + (after || '');
    ta.value = ta.value.substring(0, start) + replacement + ta.value.substring(end);
    ta.selectionStart = start + before.length;
    ta.selectionEnd = start + before.length + insert.length;
    ta.focus();
    updateMetrics();
    scheduleSave();
    if (splitMode) {
      notePreview.innerHTML = Markdown.render(noteBody.value);
    }
  }

  // ── Quick Switcher (Ctrl+K / Ctrl+O) ──
  function openQuickSwitcher() {
    switcherModal.classList.remove('hidden');
    switcherInput.value = '';
    filterSwitcher();
    setTimeout(() => switcherInput.focus(), 80);
  }

  function closeQuickSwitcher() {
    switcherModal.classList.add('hidden');
  }

  function filterSwitcher() {
    const q = switcherInput.value.trim().toLowerCase();
    const all = Storage.getAllNotes();
    switcherItems = q ? all.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.category || '').toLowerCase().includes(q) ||
      (n.tags || '').toLowerCase().includes(q)
    ) : all;

    switcherIndex = 0;
    renderSwitcherResults();
  }

  function renderSwitcherResults() {
    if (switcherItems.length === 0) {
      switcherResults.innerHTML = `<li style="padding: 18px; text-align: center; color: var(--text-faint); font-size: 0.85rem;">No matching documents found</li>`;
      return;
    }

    switcherResults.innerHTML = switcherItems.map((n, i) => `
      <li class="switcher-item ${i === switcherIndex ? 'selected' : ''}" data-id="${n.id}">
        <div class="switcher-item-left">
          <span class="switcher-item-title">${escText(n.title || 'Untitled')}</span>
          <span class="switcher-item-preview">${escText((n.body || '').replace(/^[#\s*>-]+/gm, '').slice(0, 70))}</span>
        </div>
        <span class="badge badge-${n.category}">${n.category}</span>
      </li>
    `).join('');

    $$('.switcher-item', switcherResults).forEach(item => {
      item.addEventListener('click', () => {
        openNote(item.dataset.id);
        closeQuickSwitcher();
      });
    });
  }

  function handleSwitcherKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (switcherItems.length > 0) {
        switcherIndex = (switcherIndex + 1) % switcherItems.length;
        renderSwitcherResults();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (switcherItems.length > 0) {
        switcherIndex = (switcherIndex - 1 + switcherItems.length) % switcherItems.length;
        renderSwitcherResults();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (switcherItems.length > 0 && switcherItems[switcherIndex]) {
        openNote(switcherItems[switcherIndex].id);
        closeQuickSwitcher();
      }
    } else if (e.key === 'Escape') {
      closeQuickSwitcher();
    }
  }

  // ── Keyboard shortcuts ──
  function handleGlobalShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'o')) {
      e.preventDefault();
      openQuickSwitcher();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      openGraphView();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm' && !e.shiftKey) {
      e.preventDefault();
      openMapView();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
      e.preventDefault();
      openTimelineView();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      openCodexView();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
      e.preventDefault();
      toggleSplitView();
      return;
    }

    if (e.altKey && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      toggleOutline();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggleZenMode();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      if (activeNoteId) togglePreview();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && activeNoteId && !previewMode) {
      e.preventDefault();
      applyFormat('bold');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i' && activeNoteId && !previewMode) {
      e.preventDefault();
      applyFormat('italic');
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && !e.shiftKey) {
      if (activeNoteId && !previewMode) {
        e.preventDefault();
        openFindBar(false);
        return;
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
      if (activeNoteId && !previewMode) {
        e.preventDefault();
        openFindBar(true);
        return;
      }
    }

    if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') || (e.altKey && e.key.toLowerCase() === 'm')) {
      if (activeNoteId) {
        e.preventDefault();
        openMetricsModal();
        return;
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (activeNoteId) saveNow();
      return;
    }

    // Allow skipping intro with Esc, Space, or Enter
    if (introSplash && !introSplash.classList.contains('hidden')) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        dismissIntroSplash();
        return;
      }
    }

    if (!tutorialOverlay.classList.contains('hidden')) {
      if (e.key === 'ArrowRight') { nextTutorialStep(); return; }
      if (e.key === 'ArrowLeft') { prevTutorialStep(); return; }
      if (e.key === 'Escape') { closeTutorial(); return; }
    }

    if (e.key === 'Escape') {
      handleBackOrEscape();
    }
  }

  function handleBackOrEscape() {
    if (introSplash && !introSplash.classList.contains('hidden')) {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
        dismissTimer = null;
        if (introSplash.classList) {
          introSplash.classList.remove('intro-animating', 'intro-fade-out');
          introSplash.classList.add('hidden');
        }
        if (typeof introSplash.setAttribute === 'function') {
          introSplash.setAttribute('aria-hidden', 'true');
        }
      } else {
        dismissIntroSplash();
      }
      return true;
    }
    if (tutorialOverlay && !tutorialOverlay.classList.contains('hidden')) {
      closeTutorial();
      return true;
    }
    if (isSpeyImportModalOpen && speyImportModal && !speyImportModal.classList.contains('hidden')) {
      closeSpeyImportModal();
      return true;
    }
    if (isProjectSettingsModalOpen && projectSettingsModal && !projectSettingsModal.classList.contains('hidden')) {
      closeProjectSettingsModal();
      return true;
    }
    if (findReplaceBar && !findReplaceBar.classList.contains('hidden')) {
      closeFindBar();
      return true;
    }
    if (metricsModal && !metricsModal.classList.contains('hidden')) {
      closeMetricsModal();
      return true;
    }
    if (switcherModal && !switcherModal.classList.contains('hidden')) {
      closeQuickSwitcher();
      return true;
    }
    if (graphModal && !graphModal.classList.contains('hidden')) {
      closeGraphView();
      return true;
    }
    if (mapPinPreview && !mapPinPreview.classList.contains('hidden')) {
      mapPinPreview.classList.add('hidden');
      mapPinPreview.style.display = 'none';
      return true;
    }
    if (codexCharPreview && !codexCharPreview.classList.contains('hidden')) {
      codexCharPreview.classList.add('hidden');
      codexCharPreview.style.display = 'none';
      return true;
    }
    if (isMapPlacementMode) {
      isMapPlacementMode = false;
      updateMapPlacementUI();
      return true;
    }
    if (mapTutorialModal && !mapTutorialModal.classList.contains('hidden')) {
      mapTutorialModal.classList.add('hidden');
      return true;
    }
    if (timelineTutorialModal && !timelineTutorialModal.classList.contains('hidden')) {
      timelineTutorialModal.classList.add('hidden');
      return true;
    }
    if (codexTutorialModal && !codexTutorialModal.classList.contains('hidden')) {
      codexTutorialModal.classList.add('hidden');
      return true;
    }
    if (mapPinModal && !mapPinModal.classList.contains('hidden')) {
      mapPinModal.classList.add('hidden');
      return true;
    }
    if (timelineEventModal && !timelineEventModal.classList.contains('hidden')) {
      timelineEventModal.classList.add('hidden');
      return true;
    }
    if (codexCharModal && !codexCharModal.classList.contains('hidden')) {
      codexCharModal.classList.add('hidden');
      return true;
    }
    if (codexRelModal && !codexRelModal.classList.contains('hidden')) {
      codexRelModal.classList.add('hidden');
      return true;
    }
    if (mapModal && !mapModal.classList.contains('hidden')) {
      closeMapView();
      return true;
    }
    if (timelineModal && !timelineModal.classList.contains('hidden')) {
      closeTimelineView();
      return true;
    }
    if (codexModal && !codexModal.classList.contains('hidden')) {
      closeCodexView();
      return true;
    }
    if (goalModal && !goalModal.classList.contains('hidden')) {
      goalModal.classList.add('hidden');
      return true;
    }
    if (outlineDrawer && !outlineDrawer.classList.contains('hidden')) {
      outlineDrawer.classList.add('hidden');
      return true;
    }
    if (wikicreateModal && !wikicreateModal.classList.contains('hidden')) {
      closeWikiCreateModal();
      return true;
    }
    if (modalOverlay && !modalOverlay.classList.contains('hidden')) {
      closeNewNoteModal();
      return true;
    }
    if (deleteOverlay && !deleteOverlay.classList.contains('hidden')) {
      deleteOverlay.classList.add('hidden');
      return true;
    }
    if (window.innerWidth <= 768 && sidebar && !sidebar.classList.contains('collapsed')) {
      sidebar.classList.add('collapsed');
      return true;
    }
    if (editorArea && !editorArea.classList.contains('hidden')) {
      showMainMenu();
      return true;
    }
    return false;
  }

  function openNewNoteModal() {
    modalTitle.value = '';
    modalCategory.value = 'draft';
    modalOverlay.classList.remove('hidden');
    setTimeout(() => modalTitle.focus(), 100);
  }

  function closeNewNoteModal() {
    modalOverlay.classList.add('hidden');
  }

  // ── Author Typography & Writing Functions ──
  function applyTypographySettings() {
    const rootEl = document.documentElement || document.body;
    if (rootEl && rootEl.style && rootEl.style.setProperty) {
      rootEl.style.setProperty('--editor-font', currentEditorFont);
      rootEl.style.setProperty('--editor-font-size', `${currentFontSize}px`);
      rootEl.style.setProperty('--editor-line-height', String(currentLineHeight));
    }
    if (editorFontSelect) editorFontSelect.value = currentEditorFont;
    if (fontSizeVal) fontSizeVal.textContent = `${currentFontSize}px`;
    if (lineSpacingVal) lineSpacingVal.textContent = `↕ ${currentLineHeight}`;
  }

  function applyTypewriterState() {
    if (btnTypewriter && btnTypewriter.classList) {
      btnTypewriter.classList.toggle('active', typewriterMode);
    }
    if (noteBody && noteBody.classList) {
      noteBody.classList.toggle('typewriter-mode', typewriterMode);
    }
  }

  function toggleTypewriterMode() {
    typewriterMode = !typewriterMode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lordspey_typewriter_mode', String(typewriterMode));
    }
    applyTypewriterState();
    toast(typewriterMode ? 'Typewriter Scrolling: ON (Centered)' : 'Typewriter Scrolling: OFF', 'info');
    if (typewriterMode) {
      keepTypewriterCentered();
    }
  }

  let caretMirrorEl = null;
  function getCaretCoordinates(textarea, position) {
    if (typeof window === 'undefined' || !window.getComputedStyle) {
      return { top: 0, height: 24 };
    }
    if (!caretMirrorEl) {
      caretMirrorEl = document.createElement('div');
      caretMirrorEl.id = 'caret-mirror';
      caretMirrorEl.style.cssText = 'position:absolute;visibility:hidden;top:0;left:0;pointer-events:none;white-space:pre-wrap;word-wrap:break-word;overflow:hidden;';
      document.body.appendChild(caretMirrorEl);
    }
    const cs = window.getComputedStyle(textarea);
    caretMirrorEl.style.width = (textarea.clientWidth || 800) + 'px';
    caretMirrorEl.style.fontFamily = cs.fontFamily || 'inherit';
    caretMirrorEl.style.fontSize = cs.fontSize || '15px';
    caretMirrorEl.style.lineHeight = cs.lineHeight || '1.8';
    caretMirrorEl.style.paddingLeft = cs.paddingLeft || '32px';
    caretMirrorEl.style.paddingRight = cs.paddingRight || '32px';
    caretMirrorEl.style.paddingTop = cs.paddingTop || '20px';
    caretMirrorEl.style.paddingBottom = cs.paddingBottom || '40px';
    caretMirrorEl.style.boxSizing = cs.boxSizing || 'border-box';

    const textBefore = textarea.value.substring(0, position);
    caretMirrorEl.textContent = textBefore;
    const marker = document.createElement('span');
    marker.textContent = textarea.value.substring(position, position + 1) || '|';
    caretMirrorEl.appendChild(marker);
    return {
      top: marker.offsetTop || 0,
      height: marker.offsetHeight || 24
    };
  }

  let typewriterRaf = null;
  function keepTypewriterCentered() {
    if (!typewriterMode || !activeNoteId || previewMode) return;
    if (typeof requestAnimationFrame === 'function') {
      if (typewriterRaf && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(typewriterRaf);
      }
      typewriterRaf = requestAnimationFrame(() => {
        const caret = getCaretCoordinates(noteBody, noteBody.selectionStart || 0);
        const viewHeight = noteBody.clientHeight || 500;
        const targetScroll = caret.top - (viewHeight / 2) + (caret.height / 2);
        noteBody.scrollTop = Math.max(0, targetScroll);
      });
    }
  }

  // ── Find & Replace Functions ──
  function openFindBar(replaceMode = false) {
    if (!activeNoteId || previewMode) return;
    if (findReplaceBar) findReplaceBar.classList.remove('hidden');
    if (btnFindToggle) btnFindToggle.classList.add('active');

    const selStart = noteBody.selectionStart || 0;
    const selEnd = noteBody.selectionEnd || 0;
    if (selEnd > selStart) {
      const selectedText = noteBody.value.substring(selStart, selEnd);
      if (selectedText && !selectedText.includes('\n') && selectedText.length < 80 && findInput) {
        findInput.value = selectedText;
      }
    }

    if (replaceMode && replaceInput) {
      replaceInput.focus();
      replaceInput.select();
    } else if (findInput) {
      findInput.focus();
      findInput.select();
    }

    performFind();
  }

  function closeFindBar() {
    if (findReplaceBar) findReplaceBar.classList.add('hidden');
    if (btnFindToggle) btnFindToggle.classList.remove('active');
    findMatches = [];
    findCurrentIndex = -1;
    if (findCounter) findCounter.textContent = '0/0';
    noteBody.focus();
  }

  function performFind(preserveIndex = false) {
    if (!findInput) return;
    const query = findInput.value;
    if (!query) {
      findMatches = [];
      findCurrentIndex = -1;
      if (findCounter) findCounter.textContent = '0/0';
      return;
    }

    const text = noteBody.value;
    const flags = findMatchCase ? 'g' : 'gi';
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex;
    try {
      regex = new RegExp(escapedQuery, flags);
    } catch {
      return;
    }

    findMatches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      findMatches.push({
        start: match.index,
        end: match.index + match[0].length
      });
      if (regex.lastIndex === match.index) {
        regex.lastIndex++;
      }
    }

    if (findMatches.length === 0) {
      findCurrentIndex = -1;
      if (findCounter) findCounter.textContent = '0/0';
      return;
    }

    if (!preserveIndex || findCurrentIndex < 0 || findCurrentIndex >= findMatches.length) {
      const cursor = noteBody.selectionStart || 0;
      const nextIdx = findMatches.findIndex(m => m.start >= cursor);
      findCurrentIndex = nextIdx !== -1 ? nextIdx : 0;
    }

    updateFindCounterAndHighlight();
  }

  function updateFindCounterAndHighlight() {
    if (findMatches.length === 0 || findCurrentIndex < 0) {
      if (findCounter) findCounter.textContent = '0/0';
      return;
    }

    if (findCounter) {
      findCounter.textContent = `${findCurrentIndex + 1}/${findMatches.length}`;
    }
    const target = findMatches[findCurrentIndex];
    if (target) {
      noteBody.focus();
      noteBody.setSelectionRange(target.start, target.end);
      scrollMatchIntoView(target.start);
    }
  }

  function scrollMatchIntoView(charIndex) {
    const textBefore = noteBody.value.substring(0, charIndex);
    const lineIndex = textBefore.split('\n').length - 1;
    const approxLineHeight = 26;
    noteBody.scrollTop = Math.max(0, lineIndex * approxLineHeight - 120);
  }

  function findNext() {
    if (findMatches.length === 0) {
      performFind(false);
      return;
    }
    findCurrentIndex = (findCurrentIndex + 1) % findMatches.length;
    updateFindCounterAndHighlight();
  }

  function findPrev() {
    if (findMatches.length === 0) {
      performFind(false);
      return;
    }
    findCurrentIndex = (findCurrentIndex - 1 + findMatches.length) % findMatches.length;
    updateFindCounterAndHighlight();
  }

  function replaceOne() {
    if (!activeNoteId || previewMode || !replaceInput) return;
    if (findMatches.length === 0 || findCurrentIndex < 0) {
      performFind(false);
      if (findMatches.length === 0) return;
    }

    const currentMatch = findMatches[findCurrentIndex];
    if (!currentMatch) return;
    const replacement = replaceInput.value || '';
    const before = noteBody.value.substring(0, currentMatch.start);
    const after = noteBody.value.substring(currentMatch.end);

    noteBody.value = before + replacement + after;
    scheduleSave();
    updateMetrics();
    if (splitMode) {
      notePreview.innerHTML = Markdown.render(noteBody.value);
    }
    if (!outlineDrawer.classList.contains('hidden')) {
      renderOutline();
    }

    performFind(true);
  }

  function replaceAll() {
    if (!activeNoteId || previewMode || !findInput || !replaceInput) return;
    const query = findInput.value;
    if (!query) return;

    performFind(false);
    if (findMatches.length === 0) return;

    const flags = findMatchCase ? 'g' : 'gi';
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regex;
    try {
      regex = new RegExp(escapedQuery, flags);
    } catch {
      return;
    }
    const replacement = replaceInput.value || '';
    let replacedCount = 0;

    noteBody.value = noteBody.value.replace(regex, () => {
      replacedCount++;
      return replacement;
    });

    scheduleSave();
    updateMetrics();
    if (splitMode) {
      notePreview.innerHTML = Markdown.render(noteBody.value);
    }
    if (!outlineDrawer.classList.contains('hidden')) {
      renderOutline();
    }
    performFind(false);
    toast(`Replaced ${replacedCount} occurrence${replacedCount !== 1 ? 's' : ''}`, 'success');
  }

  // ── Manuscript Statistics Functions ──
  function openMetricsModal() {
    if (!activeNoteId) return;
    if (metricsModal) metricsModal.classList.remove('hidden');
    renderDetailedMetrics();
  }

  function closeMetricsModal() {
    if (metricsModal) metricsModal.classList.add('hidden');
  }

  function countSyllablesInWord(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return 0;
    if (word.length <= 3) return 1;

    let count = 0;
    // Count syllabic consonant + le (e.g. lit-tle, cas-tle, ta-ble)
    if (/[^aeiouy]le$/.test(word)) {
      count++;
      word = word.replace(/le$/, '');
    }
    // Silent -e
    word = word.replace(/([^aeiouy])e$/, '$1');
    // -ed suffix
    word = word.replace(/([^td])ed$/, '$1');
    // -es suffix
    word = word.replace(/([^szx]|[^cs]h)es$/, '$1');

    const vowelMatches = word.match(/[aeiouy]{1,2}/g);
    if (vowelMatches) count += vowelMatches.length;

    return Math.max(1, count);
  }

  function renderDetailedMetrics() {
    const text = noteBody.value || '';
    const trimmed = text.trim();
    const wordsArr = trimmed ? trimmed.split(/\s+/) : [];
    const totalWords = wordsArr.length;
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s+/g, '').length;

    const paragraphsArr = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const totalParagraphs = paragraphsArr.length;

    const sentencesArr = text.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
    const totalSentences = sentencesArr.length || (totalWords > 0 ? 1 : 0);

    const avgWordsPerSent = totalSentences > 0 ? (totalWords / totalSentences).toFixed(1) : '0';

    let readTimeStr = '0 min';
    if (totalWords > 0) {
      if (totalWords < 200) {
        const secs = Math.max(1, Math.round((totalWords / 200) * 60));
        readTimeStr = `${secs} sec`;
      } else {
        const mins = Math.floor(totalWords / 200);
        const remSecs = Math.round(((totalWords % 200) / 200) * 60);
        readTimeStr = remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins} min`;
      }
    }

    let speakTimeStr = '0 min';
    if (totalWords > 0) {
      const spkMins = Math.max(1, Math.ceil(totalWords / 130));
      speakTimeStr = `~${spkMins} min`;
    }

    let readingLevelStr = '—';
    let gradeBadgeStr = '— (min 10 words)';

    if (totalWords >= 10 && totalSentences > 0) {
      let totalSyllables = 0;
      for (const w of wordsArr) {
        totalSyllables += countSyllablesInWord(w);
      }
      const asl = totalWords / totalSentences;
      const asw = totalSyllables / totalWords;
      const fleschEase = Math.round(206.835 - (1.015 * asl) - (84.6 * asw));
      const grade = Math.round((0.39 * asl) + (11.8 * asw) - 15.59);
      const clampedGrade = Math.max(1, Math.min(16, grade));

      let gradeDesc = 'Grade ' + clampedGrade;
      if (clampedGrade <= 6) gradeDesc += ' (Easy)';
      else if (clampedGrade <= 8) gradeDesc += ' (Standard Fiction)';
      else if (clampedGrade <= 12) gradeDesc += ' (Advanced)';
      else gradeDesc += ' (Academic)';

      readingLevelStr = `Score ${Math.max(0, Math.min(100, fleschEase))} / 100`;
      gradeBadgeStr = gradeDesc;
    }

    if (statWords) statWords.textContent = totalWords.toLocaleString();
    if (statCharsSpaces) statCharsSpaces.textContent = charsWithSpaces.toLocaleString();
    if (statCharsNoSpaces) statCharsNoSpaces.textContent = charsWithoutSpaces.toLocaleString();
    if (statParagraphs) statParagraphs.textContent = totalParagraphs.toLocaleString();
    if (statSentences) statSentences.textContent = totalSentences.toLocaleString();
    if (statAvgWordsSent) statAvgWordsSent.textContent = avgWordsPerSent;
    if (statReadTime) statReadTime.textContent = readTimeStr;
    if (statSpeakTime) statSpeakTime.textContent = speakTimeStr;
    if (statReadingLevel) statReadingLevel.textContent = readingLevelStr;
    if (statReadingBadge) statReadingBadge.textContent = gradeBadgeStr;

    // Selection stats
    const selStart = noteBody.selectionStart || 0;
    const selEnd = noteBody.selectionEnd || 0;
    if (selectionStatsWrap && statSelWords && statSelChars) {
      if (selEnd > selStart) {
        const selText = noteBody.value.substring(selStart, selEnd);
        const selWords = selText.trim() ? selText.trim().split(/\s+/).length : 0;
        const selChars = selText.length;
        selectionStatsWrap.classList.remove('hidden');
        statSelWords.textContent = `${selWords} word${selWords !== 1 ? 's' : ''}`;
        statSelChars.textContent = `${selChars} character${selChars !== 1 ? 's' : ''}`;
      } else {
        selectionStatsWrap.classList.add('hidden');
      }
    }
  }

  function escText(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toast(message, type = 'info') {
    const container = $('#toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'toastOut 200ms ease forwards';
      setTimeout(() => el.remove(), 200);
    }, 2400);
  }

  // ═══════════════════════════════════════════════
  // Living Galaxy Cosmos Simulation Engine
  // ═══════════════════════════════════════════════
  let graphAnimationId = null;
  let graphFilter = 'all';
  let graphNodes = [];
  let graphEdges = [];
  let isDraggingNode = false;
  let draggedNode = null;
  let hoveredNode = null;
  let camera = { x: 0, y: 0, zoom: 1 };
  let targetCamera = { x: 0, y: 0, zoom: 1 };
  let panInertia = { x: 0, y: 0 };
  let panLast = { x: 0, y: 0 };
  let lastPanMoveTime = 0;
  let isPanning = false;
  let panStart = { x: 0, y: 0 };
  let lastDragPos = { x: 0, y: 0 };
  let dragVelocity = { x: 0, y: 0 };
  let galaxyTime = 0;

  // Background stars for the cosmic galaxy effect
  const bgStars = [];
  for (let i = 0; i < 180; i++) {
    bgStars.push({
      x: (Math.random() - 0.5) * 2400,
      y: (Math.random() - 0.5) * 2400,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Dynamic ambient stardust particles drifting fluidly through deep cosmic space
  const cosmicDust = [];
  for (let i = 0; i < 80; i++) {
    const isEmber = i % 3 === 0;
    const isViolet = i % 3 === 1;
    cosmicDust.push({
      x: (Math.random() - 0.5) * 2600,
      y: (Math.random() - 0.5) * 2600,
      vx: (Math.random() - 0.5) * 0.35 + (Math.random() > 0.5 ? 0.14 : -0.14),
      vy: (Math.random() - 0.5) * 0.35 + (Math.random() > 0.5 ? 0.11 : -0.11),
      radius: Math.random() * 1.8 + 0.6,
      baseAlpha: Math.random() * 0.45 + 0.15,
      pulseRate: Math.random() * 0.025 + 0.01,
      phase: Math.random() * Math.PI * 2,
      colorType: isEmber ? 'crimson' : isViolet ? 'violet' : 'white',
    });
  }

  // Periodic starlight photon streak / shooting star
  const shootingStar = {
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    length: 0,
    alpha: 0,
    life: 0,
    maxLife: 50,
    nextSpawn: 160,
  };

  function getCategoryRgba(cat, alpha) {
    const map = {
      chapter: `rgba(239, 68, 68, ${alpha})`,
      lore: `rgba(249, 115, 22, ${alpha})`,
      world: `rgba(168, 85, 247, ${alpha})`,
      draft: `rgba(148, 163, 184, ${alpha})`,
    };
    return map[cat] || `rgba(239, 68, 68, ${alpha})`;
  }

  const CATEGORY_META = {
    chapter: {
      key: 'chapter',
      name: 'Chapters',
      color: '#ef4444',
      halo: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.45)',
      core: '#ffffff',
      icon: '✦',
      angle: -3 * Math.PI / 4,
    },
    lore: {
      key: 'lore',
      name: 'Lore',
      color: '#f97316',
      halo: '#f97316',
      glow: 'rgba(249, 115, 22, 0.45)',
      core: '#ffffff',
      icon: '✦',
      angle: -Math.PI / 4,
    },
    world: {
      key: 'world',
      name: 'World Building',
      color: '#a855f7',
      halo: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.45)',
      core: '#ffffff',
      icon: '✦',
      angle: Math.PI / 4,
    },
    draft: {
      key: 'draft',
      name: 'Drafts',
      color: '#94a3b8',
      halo: '#94a3b8',
      glow: 'rgba(148, 163, 184, 0.45)',
      core: '#ffffff',
      icon: '✦',
      angle: 3 * Math.PI / 4,
    },
  };

  let dragStartPos = null;
  let didDrag = false;

  function drawRoundRect(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  }

  function setGraphCategoryFilter(filterVal) {
    graphFilter = filterVal;
    $$('.filter-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.filter === graphFilter);
    });
    buildGalaxyData();
  }

  let activeHudNode = null;
  let isMouseOverHud = false;

  function formatBranchName(rawTag, category, title) {
    if (rawTag && typeof rawTag === 'string') {
      const trimmed = rawTag.trim().replace(/^#+/, '');
      if (trimmed) {
        return trimmed
          .split(/[-_]+/)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      }
    }

    if (title && typeof title === 'string') {
      const match = title.match(/^(act\s+[0-9ivxlcdm]+|chapter\s+[0-9ivxlcdm]+|prologue|epilogue|interlude|part\s+[0-9ivxlcdm]+)/i);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
    }

    const DEFAULTS = {
      chapter: 'Manuscript',
      lore: 'Codex',
      world: 'Geography',
      draft: 'Outlines',
    };
    return DEFAULTS[category] || 'Main';
  }

  function initGalaxyEngine() {
    $$('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        setGraphCategoryFilter(pill.dataset.filter);
      });
    });

    window.addEventListener('resize', () => {
      if (!graphModal.classList.contains('hidden')) resizeCanvas();
    });

    if (graphLocationHud) {
      graphLocationHud.addEventListener('mouseenter', () => {
        isMouseOverHud = true;
      });
      graphLocationHud.addEventListener('mouseleave', () => {
        isMouseOverHud = false;
        if (!hoveredNode) {
          graphLocationHud.classList.add('hidden');
        }
      });
      graphLocationHud.addEventListener('click', () => {
        if (!activeHudNode) return;
        if (!activeHudNode.isHub && activeHudNode.id) {
          const titleStr = activeHudNode.title;
          openNote(activeHudNode.id);
          closeGraphView();
          toast(`Opened "${titleStr}"`, 'success');
          setTimeout(() => { if (noteBody) noteBody.focus(); }, 100);
        } else if (activeHudNode.isHub) {
          const catNotes = Storage.getAllNotes().filter(n => n.category === activeHudNode.category);
          if (catNotes.length > 0) {
            const titleStr = catNotes[0].title;
            openNote(catNotes[0].id);
            closeGraphView();
            toast(`Opened "${titleStr}"`, 'success');
            setTimeout(() => { if (noteBody) noteBody.focus(); }, 100);
          } else {
            setGraphCategoryFilter(activeHudNode.category);
          }
        }
      });
    }

    graphCanvas.addEventListener('mousedown', onCanvasMouseDown);
    window.addEventListener('mousemove', onCanvasMouseMove);
    window.addEventListener('mouseup', onCanvasMouseUp);
    graphCanvas.addEventListener('touchstart', onCanvasTouchStart, { passive: true });
    window.addEventListener('touchmove', onCanvasTouchMove, { passive: true });
    window.addEventListener('touchend', onCanvasTouchEnd);
    graphCanvas.addEventListener('wheel', onCanvasWheel, { passive: false });
  }

  function openGraphView() {
    graphModal.classList.remove('hidden');
    camera = { x: 0, y: 0, zoom: 1 };
    targetCamera = { x: 0, y: 0, zoom: 1 };
    panInertia = { x: 0, y: 0 };
    panLast = { x: 0, y: 0 };
    resizeCanvas();
    buildGalaxyData();
    startGalaxySimulation();
    if (graphLocationHud) graphLocationHud.classList.add('hidden');
  }

  function closeGraphView() {
    graphModal.classList.add('hidden');
    if (graphAnimationId) {
      cancelAnimationFrame(graphAnimationId);
      graphAnimationId = null;
    }
    if (graphLocationHud) graphLocationHud.classList.add('hidden');
    hoveredNode = null;
    draggedNode = null;
    activeHudNode = null;
    isMouseOverHud = false;
    isDraggingNode = false;
    isPanning = false;
    dragStartPos = null;
    didDrag = false;
    panInertia = { x: 0, y: 0 };
  }

  function resizeCanvas() {
    const rect = graphCanvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    graphCanvas.width = rect.width * dpr;
    graphCanvas.height = rect.height * dpr;
    graphCanvas.style.width = rect.width + 'px';
    graphCanvas.style.height = rect.height + 'px';
  }

  function updateLocationHud(node) {
    if (!graphLocationHud) return;
    if (!node) {
      if (!isMouseOverHud) {
        graphLocationHud.classList.add('hidden');
      }
      return;
    }

    activeHudNode = node;
    const meta = CATEGORY_META[node.category] || CATEGORY_META.chapter;
    graphLocationHud.classList.remove('hidden');

    if (node.isHub) {
      if (hudCategoryDot) hudCategoryDot.style.background = meta.color;
      if (hudCategoryName) hudCategoryName.textContent = meta.name.toUpperCase();
      if (hudSubBranch) hudSubBranch.textContent = 'BRANCH CLUSTER';
      if (hudNodeTitle) hudNodeTitle.textContent = `${meta.name} Hub`;
      const catNotes = Storage.getAllNotes().filter(n => n.category === node.category);
      if (hudConnectionsCount) {
        const itemType = node.category === 'chapter' ? (node.nodeCount === 1 ? 'chapter' : 'chapters')
          : node.category === 'lore' ? (node.nodeCount === 1 ? 'entry' : 'entries')
          : node.category === 'world' ? (node.nodeCount === 1 ? 'entry' : 'entries')
          : (node.nodeCount === 1 ? 'draft' : 'drafts');
        hudConnectionsCount.textContent = `${node.nodeCount} ${itemType} in hierarchy`;
      }
      if (hudActionHint) {
        if (catNotes.length > 0) {
          hudActionHint.textContent = `✦ Click to open "${catNotes[0].title}" or isolate`;
        } else {
          hudActionHint.textContent = graphFilter === node.category ? 'Click to show all categories' : 'Click to isolate this category';
        }
      }
    } else {
      if (hudCategoryDot) hudCategoryDot.style.background = meta.color;
      if (hudCategoryName) hudCategoryName.textContent = meta.name.toUpperCase();
      if (hudSubBranch) hudSubBranch.textContent = node.subBranch || 'Main';
      if (hudNodeTitle) hudNodeTitle.textContent = node.title || 'Untitled';
      const wikiLinks = graphEdges.filter(e => e.isWiki && (e.source === node || e.target === node)).length;
      if (hudConnectionsCount) {
        hudConnectionsCount.textContent = `${wikiLinks} wiki connection${wikiLinks === 1 ? '' : 's'} · ${node.subBranch}`;
      }
      if (hudActionHint) {
        hudActionHint.textContent = '✦ Click to open in editor';
      }
    }
  }

  function buildGalaxyData() {
    const allNotes = Storage.getAllNotes();
    const filtered = graphFilter === 'all'
      ? allNotes
      : allNotes.filter(n => n.category === graphFilter);

    if (filtered.length === 0) {
      galaxyEmptyPrompt.classList.remove('hidden');
      graphNodes = [];
      graphEdges = [];
      graphNodeCount.textContent = '0 notes';
      graphEdgeCount.textContent = '0 links';
      if (graphLocationHud) graphLocationHud.classList.add('hidden');
      return;
    } else {
      galaxyEmptyPrompt.classList.add('hidden');
    }

    const dpr = window.devicePixelRatio || 1;
    const w = graphCanvas.width / dpr;
    const h = graphCanvas.height / dpr;
    const centerX = w / 2;
    const centerY = h / 2;

    const titleToNode = new Map();
    const hubMap = new Map();

    // Determine active categories to render hubs for
    let catsToCreate;
    if (graphFilter === 'all') {
      const active = categories.filter(c => allNotes.some(n => n.category === c));
      catsToCreate = active.length > 0 ? active : categories;
    } else {
      catsToCreate = [graphFilter];
    }

    const hubDist = Math.max(160, Math.min(w, h) * 0.28);

    // 1. Create Category Hub Nodes
    const hubNodes = catsToCreate.map(cat => {
      const meta = CATEGORY_META[cat] || CATEGORY_META.chapter;
      const catNotes = filtered.filter(n => n.category === cat);
      let hx, hy;
      if (graphFilter === 'all') {
        hx = centerX + Math.cos(meta.angle) * hubDist;
        hy = centerY + Math.sin(meta.angle) * hubDist;
      } else {
        hx = centerX;
        hy = centerY;
      }

      const hub = {
        id: 'hub-' + cat,
        isHub: true,
        category: cat,
        title: meta.name,
        x: hx,
        y: hy,
        targetX: hx,
        targetY: hy,
        vx: 0,
        vy: 0,
        radius: graphFilter === 'all' ? 24 : 28,
        hoverProgress: 0,
        connections: 0,
        nodeCount: catNotes.length,
        pulseOffset: Math.random() * Math.PI * 2,
      };
      hubMap.set(cat, hub);
      return hub;
    });

    // 2. Create Note Nodes (Sub-branches)
    const noteNodes = [];
    for (const cat of catsToCreate) {
      const meta = CATEGORY_META[cat] || CATEGORY_META.chapter;
      const catNotes = filtered.filter(n => n.category === cat);
      const hub = hubMap.get(cat);
      const totalInCat = catNotes.length;

      // Group and sort notes so identical sub-branches stay clustered together
      const processedNotes = catNotes.map(n => {
        const primaryTag = (n.tags || '').split(',').map(s => s.trim()).filter(Boolean)[0];
        const subBranch = formatBranchName(primaryTag, n.category, n.title);
        return { note: n, subBranch };
      }).sort((a, b) => a.subBranch.localeCompare(b.subBranch));

      processedNotes.forEach(({ note: n, subBranch }, i) => {
        let nx, ny;
        if (graphFilter === 'all') {
          const fanSpread = Math.min(Math.PI * 0.9, 0.45 * (totalInCat - 1) + 0.35);
          const angleStep = totalInCat > 1 ? fanSpread / (totalInCat - 1) : 0;
          const startAngle = meta.angle - fanSpread / 2;
          const angle = totalInCat === 1 ? meta.angle : startAngle + i * angleStep;
          const shell = Math.floor(i / 6);
          const dist = 90 + (i % 3) * 35 + shell * 30;
          nx = hub.x + Math.cos(angle) * dist;
          ny = hub.y + Math.sin(angle) * dist;
        } else {
          const angle = totalInCat > 0 ? (i / totalInCat) * Math.PI * 2 : 0;
          const shell = Math.floor(i / 8);
          const dist = 120 + (i % 3) * 40 + shell * 35;
          nx = centerX + Math.cos(angle) * dist;
          ny = centerY + Math.sin(angle) * dist;
        }

        const noteNode = {
          id: n.id,
          isHub: false,
          title: n.title || 'Untitled',
          category: n.category,
          subBranch: subBranch,
          tags: n.tags || '',
          body: n.body || '',
          hubRef: hub,
          x: nx,
          y: ny,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: 11,
          hoverProgress: 0,
          connections: 0,
          pulseOffset: Math.random() * Math.PI * 2,
          hitWidth: Math.max(90, (n.title || '').length * 7.5),
        };

        titleToNode.set((n.title || '').trim().toLowerCase(), noteNode);
        noteNodes.push(noteNode);
      });
    }

    graphNodes = [...hubNodes, ...noteNodes];

    // 3. Create Edges: Category Sub-branch Hierarchy + Wiki Cross-links
    graphEdges = [];

    // Category hierarchy sub-branches
    for (const n of noteNodes) {
      if (n.hubRef) {
        graphEdges.push({
          source: n.hubRef,
          target: n,
          isHierarchy: true,
          isWiki: false,
          category: n.category,
          flowProgress: Math.random(),
        });
        n.hubRef.connections++;
        n.connections++;
      }
    }

    // Wiki cross-links
    for (const n of noteNodes) {
      const targets = Markdown.extractWikiLinks(n.body || '');
      for (const t of targets) {
        const targetNode = titleToNode.get(t.trim().toLowerCase());
        if (targetNode && targetNode !== n) {
          const already = graphEdges.some(e =>
            e.isWiki &&
            ((e.source === n && e.target === targetNode) ||
             (e.source === targetNode && e.target === n))
          );
          if (!already) {
            graphEdges.push({
              source: n,
              target: targetNode,
              isHierarchy: false,
              isWiki: true,
              photonPulse: Math.random(),
            });
            n.connections++;
            targetNode.connections++;
          }
        }
      }
    }

    // 4. Calculate dynamic radii based on connectivity
    for (const node of graphNodes) {
      if (node.isHub) {
        node.radius = Math.min(30, 22 + (node.nodeCount || 0) * 1.5);
      } else {
        node.radius = Math.min(18, 9 + (node.connections || 0) * 1.5);
      }
    }

    const wikiCount = graphEdges.filter(e => e.isWiki).length;
    const branchCount = graphEdges.filter(e => e.isHierarchy).length;
    graphNodeCount.textContent = `${noteNodes.length} note${noteNodes.length === 1 ? '' : 's'}`;
    graphEdgeCount.textContent = `${branchCount} sub-branch${branchCount === 1 ? '' : 'es'} · ${wikiCount} wiki link${wikiCount === 1 ? '' : 's'}`;
  }

  function startGalaxySimulation() {
    if (graphAnimationId) cancelAnimationFrame(graphAnimationId);

    function loop() {
      galaxyTime += 0.02;
      simulateGalaxyPhysics();
      drawLivingGalaxy();
      graphAnimationId = requestAnimationFrame(loop);
    }
    graphAnimationId = requestAnimationFrame(loop);
  }

  function simulateGalaxyPhysics() {
    const dpr = window.devicePixelRatio || 1;
    const centerX = (graphCanvas.width / dpr) / 2;
    const centerY = (graphCanvas.height / dpr) / 2;

    // Node repulsion with softening parameter to prevent jitter
    for (let i = 0; i < graphNodes.length; i++) {
      for (let j = i + 1; j < graphNodes.length; j++) {
        const n1 = graphNodes[i];
        const n2 = graphNodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq) || 0.001;
        const maxRepulse = (n1.isHub || n2.isHub) ? 360 : 260;
        if (dist < maxRepulse) {
          const strength = (n1.isHub && n2.isHub) ? 5500 : (n1.isHub || n2.isHub) ? 3200 : 1800;
          const force = strength / (distSq + 400);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (n1 !== draggedNode) { n1.vx -= fx; n1.vy -= fy; }
          if (n2 !== draggedNode) { n2.vx += fx; n2.vy += fy; }
        }
      }
    }

    // Spring attraction with critical damper along hierarchy branches & wiki edges
    for (const edge of graphEdges) {
      const dx = edge.target.x - edge.source.x;
      const dy = edge.target.y - edge.source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let restLength, k;
      if (edge.isHierarchy) {
        restLength = 105;
        k = 0.038;
        edge.flowProgress = ((edge.flowProgress || 0) + 0.008) % 1;
      } else {
        restLength = 135;
        k = 0.026;
        edge.photonPulse = ((edge.photonPulse || 0) + 0.010) % 1;
      }

      const delta = dist - restLength;
      const relVx = edge.target.vx - edge.source.vx;
      const relVy = edge.target.vy - edge.source.vy;
      const damping = ((relVx * dx + relVy * dy) / dist) * 0.05;
      const totalForce = delta * k + damping;

      const fx = (dx / dist) * totalForce;
      const fy = (dy / dist) * totalForce;

      if (edge.source !== draggedNode) { edge.source.vx += fx; edge.source.vy += fy; }
      if (edge.target !== draggedNode) { edge.target.vx -= fx; edge.target.vy -= fy; }
    }

    // Anchoring, harmonic orbital drift, velocity damping & clamping
    const MAX_VELOCITY = 5.5;
    for (const n of graphNodes) {
      if (n === draggedNode) continue;
      if (n.isHub) {
        // Category Hubs anchor gently toward designated coordinates
        const hdx = n.targetX - n.x;
        const hdy = n.targetY - n.y;
        n.vx += hdx * 0.028;
        n.vy += hdy * 0.028;

        // Subtle cosmic drift for living feel
        const hubDrift = galaxyTime * 0.6 + (n.pulseOffset || 0);
        n.vx += Math.cos(hubDrift) * 0.012;
        n.vy += Math.sin(hubDrift) * 0.012;
      } else {
        // Inward pull toward galactic core
        const cdx = centerX - n.x;
        const cdy = centerY - n.y;
        n.vx += cdx * 0.0028;
        n.vy += cdy * 0.0028;

        // Gentle orbital swirl around category hub
        if (n.hubRef) {
          const bdx = n.hubRef.x - n.x;
          const bdy = n.hubRef.y - n.y;
          n.vx += -bdy * 0.00028;
          n.vy += bdx * 0.00028;
        }

        // Harmonic floating oscillation
        const floatAngle = galaxyTime * 0.9 + (n.pulseOffset || 0);
        n.vx += Math.cos(floatAngle) * 0.02;
        n.vy += Math.sin(floatAngle) * 0.02;
      }

      n.vx *= 0.88;
      n.vy *= 0.88;

      // Clamp velocity to prevent numerical instability
      n.vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, n.vx));
      n.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, n.vy));

      n.x += n.vx;
      n.y += n.vy;

      // Smooth hover factor interpolation (fluid node expansion)
      n.hoverProgress = n.hoverProgress || 0;
      const targetHover = (n === hoveredNode || n.id === activeNoteId) ? 1.0 : 0.0;
      n.hoverProgress += (targetHover - n.hoverProgress) * 0.20;
    }

    // Update shooting star streak
    if (!shootingStar.active) {
      shootingStar.nextSpawn--;
      if (shootingStar.nextSpawn <= 0) {
        shootingStar.active = true;
        shootingStar.life = 0;
        shootingStar.maxLife = Math.floor(Math.random() * 30 + 35);
        shootingStar.x = (Math.random() - 0.5) * 1600;
        shootingStar.y = (Math.random() - 0.5) * 1200 - 300;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 8 + 9;
        shootingStar.vx = Math.cos(angle) * speed;
        shootingStar.vy = Math.sin(angle) * speed;
        shootingStar.length = Math.random() * 60 + 50;
        shootingStar.alpha = 0;
      }
    } else {
      shootingStar.life++;
      shootingStar.x += shootingStar.vx;
      shootingStar.y += shootingStar.vy;
      const progress = shootingStar.life / shootingStar.maxLife;
      shootingStar.alpha = Math.sin(progress * Math.PI) * 0.75;
      if (shootingStar.life >= shootingStar.maxLife) {
        shootingStar.active = false;
        shootingStar.nextSpawn = Math.floor(Math.random() * 250 + 200);
      }
    }

    // Dynamic drifting stardust particles simulation
    for (const dust of cosmicDust) {
      dust.x += dust.vx;
      dust.y += dust.vy;
      if (dust.x < -1400) dust.x = 1400;
      if (dust.x > 1400) dust.x = -1400;
      if (dust.y < -1400) dust.y = 1400;
      if (dust.y > 1400) dust.y = -1400;
    }

    // Smooth Camera Lerp & Pan Inertia
    if (!isPanning) {
      if (Math.abs(panInertia.x) > 0.05 || Math.abs(panInertia.y) > 0.05) {
        targetCamera.x += panInertia.x;
        targetCamera.y += panInertia.y;
        panInertia.x *= 0.90;
        panInertia.y *= 0.90;
      }
      camera.x += (targetCamera.x - camera.x) * 0.15;
      camera.y += (targetCamera.y - camera.y) * 0.15;
      camera.zoom += (targetCamera.zoom - camera.zoom) * 0.15;
    }
  }

  function drawLivingGalaxy() {
    const dpr = window.devicePixelRatio || 1;
    const ctx = graphCanvas.getContext('2d');
    const w = graphCanvas.width / dpr;
    const h = graphCanvas.height / dpr;

    ctx.save();
    ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
    ctx.scale(dpr, dpr);

    // 1. Cosmic Starfield, Nebula & Stardust Backdrop
    ctx.save();
    ctx.translate(camera.x * 0.2 + w / 2, camera.y * 0.2 + h / 2);
    ctx.scale(camera.zoom * 0.8, camera.zoom * 0.8);

    const nebPulse = Math.sin(galaxyTime * 0.8) * 16;
    const nebulaGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 520 + nebPulse);
    nebulaGrad.addColorStop(0, 'rgba(220, 38, 38, 0.13)');
    nebulaGrad.addColorStop(0.35, 'rgba(168, 85, 247, 0.08)');
    nebulaGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.04)');
    nebulaGrad.addColorStop(1, 'rgba(8, 8, 12, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 520 + nebPulse, 0, Math.PI * 2);
    ctx.fill();

    // Twinkling stars
    for (const star of bgStars) {
      const twinkle = Math.sin(galaxyTime * star.twinkleSpeed * 50 + star.phase);
      const curAlpha = Math.max(0.1, star.alpha + twinkle * 0.3);
      ctx.fillStyle = `rgba(255, 255, 255, ${curAlpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dynamic drifting stardust particles with fluid motion trails
    for (const dust of cosmicDust) {
      const pulse = Math.sin(galaxyTime * dust.pulseRate * 60 + dust.phase);
      const alpha = Math.max(0.08, dust.baseAlpha + pulse * 0.15);

      let colorRgba = `rgba(255, 255, 255, ${alpha})`;
      let trailRgba = `rgba(255, 255, 255, ${alpha * 0.35})`;
      if (dust.colorType === 'crimson') {
        colorRgba = `rgba(239, 68, 68, ${alpha * 0.95})`;
        trailRgba = `rgba(239, 68, 68, ${alpha * 0.35})`;
      } else if (dust.colorType === 'violet') {
        colorRgba = `rgba(168, 85, 247, ${alpha * 0.9})`;
        trailRgba = `rgba(168, 85, 247, ${alpha * 0.3})`;
      }

      // Gentle stardust particle trail
      ctx.beginPath();
      ctx.moveTo(dust.x - dust.vx * 14, dust.y - dust.vy * 14);
      ctx.lineTo(dust.x, dust.y);
      ctx.strokeStyle = trailRgba;
      ctx.lineWidth = Math.max(0.6, dust.radius * 0.8);
      ctx.stroke();

      // Particle head
      ctx.fillStyle = colorRgba;
      ctx.beginPath();
      ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shooting star / cosmic photon streak with glowing tail
    if (shootingStar.active && shootingStar.alpha > 0.01) {
      ctx.save();
      const tailX = shootingStar.x - (shootingStar.vx / 12) * shootingStar.length;
      const tailY = shootingStar.y - (shootingStar.vy / 12) * shootingStar.length;

      // Outer luminous streak
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(shootingStar.x, shootingStar.y);
      ctx.strokeStyle = `rgba(239, 68, 68, ${shootingStar.alpha * 0.45})`;
      ctx.lineWidth = 3.2;
      ctx.stroke();

      // Inner white beam
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(shootingStar.x, shootingStar.y);
      ctx.strokeStyle = `rgba(255, 245, 245, ${shootingStar.alpha * 0.9})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Head starlight
      ctx.beginPath();
      ctx.arc(shootingStar.x, shootingStar.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, shootingStar.alpha * 1.3)})`;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    // 2. Camera Transform for graph elements
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    const centerX = w / 2;
    const centerY = h / 2;

    // Core Radiant Flare
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 160);
    const corePulse = Math.sin(galaxyTime * 2) * 0.04 + 0.12;
    coreGrad.addColorStop(0, `rgba(239, 68, 68, ${corePulse + 0.08})`);
    coreGrad.addColorStop(0.4, `rgba(249, 115, 22, ${corePulse})`);
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 160, 0, Math.PI * 2);
    ctx.fill();

    // Galactic Accretion Rings (Dual rings with subtle counter-rotation)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(galaxyTime * 0.15);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.lineWidth = 1.1;
    ctx.setLineDash([8, 14]);
    ctx.beginPath();
    ctx.ellipse(0, 0, 180, 75, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(-galaxyTime * 0.22);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
    ctx.lineWidth = 0.9;
    ctx.setLineDash([6, 18]);
    ctx.beginPath();
    ctx.ellipse(0, 0, 240, 100, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Draw Category Sub-branch Hierarchy Edges
    for (const e of graphEdges) {
      if (!e.isHierarchy) continue;
      const meta = CATEGORY_META[e.category] || CATEGORY_META.chapter;
      const isConnected = hoveredNode && (
        e.source === hoveredNode ||
        e.target === hoveredNode ||
        (hoveredNode.isHub && hoveredNode.category === e.category)
      );

      // Hierarchy link line with subtle energy flow pulse
      const edgePulse = Math.sin(galaxyTime * 2.5 + (e.flowProgress || 0) * Math.PI * 2) * 0.15 + 0.85;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(e.source.x, e.source.y);
      ctx.lineTo(e.target.x, e.target.y);
      ctx.strokeStyle = isConnected ? meta.halo : meta.glow;
      ctx.lineWidth = isConnected ? 2.6 : 1.3 * edgePulse;
      if (isConnected) {
        ctx.shadowColor = meta.halo;
        ctx.shadowBlur = 8;
      }
      ctx.stroke();
      ctx.restore();

      // Fluid dual photon stream along the branch with accurate category colors
      const p1 = e.flowProgress || 0;
      const p2 = (p1 + 0.5) % 1;

      const drawPhoton = (prog) => {
        const pAlpha = Math.sin(prog * Math.PI);
        if (pAlpha <= 0.01) return;

        const fx = e.source.x + (e.target.x - e.source.x) * prog;
        const fy = e.source.y + (e.target.y - e.source.y) * prog;

        // Tail trail
        const trailProg = Math.max(0, prog - 0.06);
        const tx = e.source.x + (e.target.x - e.source.x) * trailProg;
        const ty = e.source.y + (e.target.y - e.source.y) * trailProg;

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(fx, fy);
        ctx.strokeStyle = isConnected
          ? `rgba(255, 255, 255, ${pAlpha * 0.95})`
          : getCategoryRgba(e.category, pAlpha * 0.85);
        ctx.lineWidth = isConnected ? 2.6 : 1.8;
        ctx.stroke();

        // Photon head
        ctx.beginPath();
        ctx.arc(fx, fy, isConnected ? 3.0 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? '#ffffff' : meta.halo;
        ctx.fill();
      };

      drawPhoton(p1);
      drawPhoton(p2);
    }

    // 4. Draw Wiki-link Cross Connections
    for (const e of graphEdges) {
      if (!e.isWiki) continue;
      const isConnected = hoveredNode && (e.source === hoveredNode || e.target === hoveredNode);

      // Constellation line with animated dash offset
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(e.source.x, e.source.y);
      ctx.lineTo(e.target.x, e.target.y);
      ctx.strokeStyle = isConnected
        ? 'rgba(255, 255, 255, 0.95)'
        : 'rgba(239, 68, 68, 0.28)';
      ctx.lineWidth = isConnected ? 2.4 : 1.2;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -galaxyTime * 16;
      if (isConnected) {
        ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
        ctx.shadowBlur = 9;
      }
      ctx.stroke();
      ctx.restore();

      // Dual traveling photon pulses
      const wp1 = e.photonPulse || 0;
      const wp2 = (wp1 + 0.5) % 1;

      const drawWikiPhoton = (prog) => {
        const pAlpha = Math.sin(prog * Math.PI);
        if (pAlpha <= 0.01) return;

        const px = e.source.x + (e.target.x - e.source.x) * prog;
        const py = e.source.y + (e.target.y - e.source.y) * prog;

        // Tail
        const trailProg = Math.max(0, prog - 0.06);
        const tx = e.source.x + (e.target.x - e.source.x) * trailProg;
        const ty = e.source.y + (e.target.y - e.source.y) * trailProg;

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = isConnected
          ? `rgba(255, 255, 255, ${pAlpha * 0.92})`
          : `rgba(248, 113, 113, ${pAlpha * 0.75})`;
        ctx.lineWidth = isConnected ? 2.8 : 1.8;
        ctx.stroke();

        // Photon head
        ctx.beginPath();
        ctx.arc(px, py, isConnected ? 3.4 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? '#ffffff' : 'rgba(248, 113, 113, 0.95)';
        ctx.fill();
      };

      drawWikiPhoton(wp1);
      drawWikiPhoton(wp2);
    }

    // 5. Draw Category Hub Nodes
    for (const n of graphNodes) {
      if (!n.isHub) continue;
      const meta = CATEGORY_META[n.category] || CATEGORY_META.chapter;
      const isHovered = n === hoveredNode;

      // Outer animated dashed orbital halo with dynamic rotation & breathing
      ctx.save();
      ctx.beginPath();
      const ringPulse = Math.sin(galaxyTime * 2.2 + n.pulseOffset) * 2.5;
      const hubHaloR = n.radius + 8 + ringPulse + (n.hoverProgress || 0) * 4;
      ctx.arc(n.x, n.y, hubHaloR, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered ? '#ffffff' : meta.halo;
      ctx.lineWidth = isHovered ? 2.2 : 1.3;
      ctx.setLineDash([4, 5]);
      ctx.lineDashOffset = -galaxyTime * 14;
      ctx.stroke();
      ctx.restore();

      // Atmospheric Coronal Shockwaves / Multi-wave Breathing
      for (let wIdx = 0; wIdx < 2; wIdx++) {
        const wavePhase = (galaxyTime * 0.35 + n.pulseOffset + wIdx * 0.5) % 1;
        const waveRadius = n.radius + 6 + wavePhase * 26;
        const waveAlpha = Math.sin(wavePhase * Math.PI) * 0.32;
        if (waveAlpha > 0.02) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(n.x, n.y, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isHovered
            ? `rgba(255, 255, 255, ${waveAlpha * 1.1})`
            : getCategoryRgba(n.category, waveAlpha);
          ctx.lineWidth = 1.0;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Corona radiant flare
      const coronaRadius = n.radius * 2.9 + Math.sin(galaxyTime * 1.8 + n.pulseOffset) * 3;
      const corona = ctx.createRadialGradient(n.x, n.y, n.radius * 0.35, n.x, n.y, coronaRadius);
      corona.addColorStop(0, meta.glow);
      corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(n.x, n.y, coronaRadius, 0, Math.PI * 2);
      ctx.fill();

      // Solid central core
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? meta.halo : 'rgba(20, 20, 26, 0.96)';
      ctx.fill();
      ctx.strokeStyle = meta.halo;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Hub icon symbol
      ctx.fillStyle = isHovered ? '#ffffff' : meta.halo;
      ctx.font = '600 13px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(meta.icon || '✦', n.x, n.y);

      // Hub Category Title Badge
      const titleText = `✦ ${meta.name.toUpperCase()}`;
      const countLabel = meta.key === 'chapter' ? (n.nodeCount === 1 ? '1 chapter' : `${n.nodeCount} chapters`)
        : meta.key === 'lore' ? (n.nodeCount === 1 ? '1 lore entry' : `${n.nodeCount} lore entries`)
        : meta.key === 'world' ? (n.nodeCount === 1 ? '1 location' : `${n.nodeCount} locations`)
        : (n.nodeCount === 1 ? '1 draft' : `${n.nodeCount} drafts`);

      ctx.font = '700 11px "Cinzel", serif';
      const textWidth = ctx.measureText(titleText).width;
      const pillW = Math.max(textWidth + 24, 90);
      n.hitWidth = pillW;
      const pillH = 22;
      const pillX = n.x - pillW / 2;
      const pillY = n.y + n.radius + 10;

      ctx.fillStyle = 'rgba(12, 12, 16, 0.92)';
      ctx.strokeStyle = isHovered ? '#ffffff' : meta.halo;
      ctx.lineWidth = 1;
      ctx.beginPath();
      drawRoundRect(ctx, pillX, pillY, pillW, pillH, 11);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHovered ? '#ffffff' : meta.halo;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(titleText, n.x, pillY + pillH / 2);

      // Sub-text count
      ctx.font = '500 9px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(161, 161, 170, 0.9)';
      ctx.fillText(countLabel, n.x, pillY + pillH + 11);
    }

    // 6. Draw Note Nodes (Chapters, Lore, World, Drafts)
    for (const n of graphNodes) {
      if (n.isHub) continue;
      const meta = CATEGORY_META[n.category] || CATEGORY_META.chapter;
      const isHovered = n === hoveredNode;
      const isCurrentActive = n.id === activeNoteId;

      // Atmospheric breathing
      const bPhase = galaxyTime * 2.8 + n.pulseOffset;
      const breathing = (Math.sin(bPhase) * 0.7 + Math.sin(bPhase * 0.5) * 0.3) * 2.2;
      const baseR = n.radius + (n.hoverProgress || 0) * 3.5;

      // Corona Flare
      const coronaR = Math.max((baseR * 2.6 + breathing) * (1 + (n.hoverProgress || 0) * 0.25), baseR * 0.35 + 2);
      const corona = ctx.createRadialGradient(n.x, n.y, baseR * 0.35, n.x, n.y, coronaR);
      corona.addColorStop(0, meta.glow);
      corona.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = corona;
      ctx.beginPath();
      ctx.arc(n.x, n.y, coronaR, 0, Math.PI * 2);
      ctx.fill();

      // Gentle radiant coronal pulse ring for connected nodes
      const starWavePhase = (galaxyTime * 0.4 + n.pulseOffset) % 1;
      const starWaveAlpha = Math.sin(starWavePhase * Math.PI) * (0.15 + (n.hoverProgress || 0) * 0.35);
      if (starWaveAlpha > 0.02) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseR + 3 + starWavePhase * 14, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered || isCurrentActive
          ? `rgba(255, 255, 255, ${starWaveAlpha})`
          : getCategoryRgba(n.category, starWaveAlpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Radiant pulse ring on hover
      if ((n.hoverProgress || 0) > 0.1) {
        const hoverWaveR = baseR + 5 + (1 - n.hoverProgress) * 6;
        ctx.beginPath();
        ctx.arc(n.x, n.y, hoverWaveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${n.hoverProgress * 0.45})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Outer Ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, baseR + 2, 0, Math.PI * 2);
      ctx.strokeStyle = isHovered || isCurrentActive ? '#ffffff' : meta.halo;
      ctx.lineWidth = isHovered || isCurrentActive ? 2.5 : 1.4;
      ctx.stroke();

      // Star Center
      ctx.beginPath();
      ctx.arc(n.x, n.y, baseR, 0, Math.PI * 2);
      ctx.fillStyle = isHovered || isCurrentActive ? '#ffffff' : meta.halo;
      ctx.fill();

      // Pure White Starlight Core
      ctx.beginPath();
      ctx.arc(n.x, n.y, baseR * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Note Title Label
      ctx.font = `${isHovered ? '600' : '400'} 11px "Cinzel", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const displayTitle = n.title.length > 28 ? n.title.slice(0, 26) + '…' : n.title;
      const titleW = ctx.measureText(displayTitle).width;

      // Drop shadow backing for crisp legibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
      ctx.fillText(displayTitle, n.x + 1, n.y + baseR + 10);

      ctx.fillStyle = isHovered || isCurrentActive ? '#ffffff' : 'rgba(244, 244, 246, 0.9)';
      ctx.fillText(displayTitle, n.x, n.y + baseR + 9);

      // Sub-branch Location Badge (e.g. "Chapters › Act 1")
      const branchLabel = `${meta.name} › ${n.subBranch}`;
      ctx.font = '500 9px "Inter", sans-serif';
      const bWidth = ctx.measureText(branchLabel).width;
      const bPillW = bWidth + 14;
      const bPillH = 15;
      const bPillX = n.x - bPillW / 2;
      const bPillY = n.y + baseR + 24;

      n.hitWidth = Math.max(titleW, bPillW);

      ctx.fillStyle = 'rgba(15, 15, 20, 0.88)';
      ctx.strokeStyle = isHovered ? meta.halo : 'rgba(80, 80, 95, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      drawRoundRect(ctx, bPillX, bPillY, bPillW, bPillH, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHovered ? meta.halo : 'rgba(161, 161, 170, 0.85)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(branchLabel, n.x, bPillY + bPillH / 2);
    }

    ctx.restore();
  }

  function getTransformedMousePos(e) {
    const rect = graphCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - camera.x) / camera.zoom;
    const worldY = (mouseY - camera.y) / camera.zoom;
    return { worldX, worldY, mouseX, mouseY };
  }

  function findNodeAt(worldX, worldY) {
    const zoom = camera.zoom || 1;
    const extraTol = Math.max(0, (14 / zoom) - 10);

    // 1. Check note nodes first so they have click priority over hubs
    for (let i = graphNodes.length - 1; i >= 0; i--) {
      const n = graphNodes[i];
      if (n.isHub) continue;

      const dx = worldX - n.x;
      const dy = worldY - n.y;
      const hitR = n.radius + 14 + extraTol;

      // Circle hit test
      if (dx * dx + dy * dy <= hitR * hitR) {
        return n;
      }

      // Title & Sub-branch Badge hit-box directly beneath note center
      const labelW = Math.max(90, (n.hitWidth || 100));
      const halfW = labelW / 2 + 12 + extraTol;
      const topY = n.y;
      const bottomY = n.y + n.radius + 46 + extraTol;
      if (Math.abs(dx) <= halfW && worldY >= topY && worldY <= bottomY) {
        return n;
      }
    }

    // 2. Check category hub nodes
    for (let i = graphNodes.length - 1; i >= 0; i--) {
      const n = graphNodes[i];
      if (!n.isHub) continue;

      const dx = worldX - n.x;
      const dy = worldY - n.y;
      const hitR = n.radius + 16 + extraTol;

      // Circle hit test
      if (dx * dx + dy * dy <= hitR * hitR) {
        return n;
      }

      // Hub Category Badge hit-box below hub
      const badgeW = Math.max(110, (n.hitWidth || 120));
      const halfW = badgeW / 2 + 14 + extraTol;
      const topY = n.y;
      const bottomY = n.y + n.radius + 54 + extraTol;
      if (Math.abs(dx) <= halfW && worldY >= topY && worldY <= bottomY) {
        return n;
      }
    }

    return null;
  }

  function onCanvasMouseDown(e) {
    const { worldX, worldY, mouseX, mouseY } = getTransformedMousePos(e);
    const node = findNodeAt(worldX, worldY);
    dragStartPos = { x: mouseX, y: mouseY };
    didDrag = false;
    lastDragPos = { x: worldX, y: worldY };
    dragVelocity = { x: 0, y: 0 };

    if (node) {
      isDraggingNode = true;
      draggedNode = node;
    } else {
      isPanning = true;
      panStart = { x: mouseX - camera.x, y: mouseY - camera.y };
      panLast = { x: mouseX, y: mouseY };
      panInertia = { x: 0, y: 0 };
      lastPanMoveTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    }
  }

  function onCanvasMouseMove(e) {
    if (graphModal.classList.contains('hidden')) return;
    const { worldX, worldY, mouseX, mouseY } = getTransformedMousePos(e);

    if (dragStartPos) {
      const dist = Math.hypot(mouseX - dragStartPos.x, mouseY - dragStartPos.y);
      if (dist > 8) {
        didDrag = true;
      }
    }

    if (isDraggingNode && draggedNode) {
      dragVelocity = {
        x: worldX - (lastDragPos.x !== undefined ? lastDragPos.x : worldX),
        y: worldY - (lastDragPos.y !== undefined ? lastDragPos.y : worldY),
      };
      lastDragPos = { x: worldX, y: worldY };
      draggedNode.x = worldX;
      draggedNode.y = worldY;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
      if (draggedNode.isHub) {
        draggedNode.targetX = worldX;
        draggedNode.targetY = worldY;
      }
      return;
    }

    if (isPanning) {
      const curX = mouseX - panStart.x;
      const curY = mouseY - panStart.y;
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const rawVx = mouseX - panLast.x;
      const rawVy = mouseY - panLast.y;
      panInertia = {
        x: Math.max(-25, Math.min(25, rawVx)),
        y: Math.max(-25, Math.min(25, rawVy)),
      };
      panLast = { x: mouseX, y: mouseY };
      lastPanMoveTime = now;
      camera.x = curX;
      camera.y = curY;
      targetCamera.x = curX;
      targetCamera.y = curY;
      return;
    }

    const hit = findNodeAt(worldX, worldY);
    hoveredNode = hit;
    graphCanvas.style.cursor = hit ? 'pointer' : 'default';
    updateLocationHud(hit);
  }

  function onCanvasMouseUp(e) {
    if (graphModal.classList.contains('hidden')) return;

    if (isPanning) {
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      if (now - lastPanMoveTime > 60) {
        panInertia = { x: 0, y: 0 };
      }
    }

    if (draggedNode && didDrag) {
      draggedNode.vx = Math.max(-3.5, Math.min(3.5, dragVelocity.x * 0.45));
      draggedNode.vy = Math.max(-3.5, Math.min(3.5, dragVelocity.y * 0.45));
    }

    if (draggedNode && !didDrag) {
      // Direct click on node!
      if (draggedNode.isHub) {
        // If already isolated to this category, open the first note/chapter in this category!
        if (graphFilter === draggedNode.category) {
          const catNotes = Storage.getAllNotes().filter(n => n.category === draggedNode.category);
          if (catNotes.length > 0) {
            openNote(catNotes[0].id);
            closeGraphView();
            toast(`Opened "${catNotes[0].title}"`, 'success');
            setTimeout(() => {
              if (noteBody) noteBody.focus();
            }, 100);
            return;
          }
        }
        // Otherwise isolate this category branch in the graph
        setGraphCategoryFilter(draggedNode.category);
        toast(`Focused ${CATEGORY_META[draggedNode.category].name} branch`, 'info');
      } else if (draggedNode.id) {
        // Clicked a note or chapter!
        const noteId = draggedNode.id;
        const noteTitleStr = draggedNode.title;
        openNote(noteId);
        closeGraphView();
        toast(`Opened "${noteTitleStr}"`, 'success');
        setTimeout(() => {
          if (noteBody) noteBody.focus();
        }, 100);
      }
    }

    isDraggingNode = false;
    draggedNode = null;
    isPanning = false;
    dragStartPos = null;
    didDrag = false;
  }

  let touchStartDist = 0;
  let touchStartZoom = 1;

  function onCanvasTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      onCanvasMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    } else if (e.touches && e.touches.length === 2) {
      isDraggingNode = false;
      draggedNode = null;
      isPanning = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDist = Math.hypot(dx, dy);
      touchStartZoom = camera.zoom;
    }
  }

  function onCanvasTouchMove(e) {
    if (e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      onCanvasMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    } else if (e.touches && e.touches.length === 2 && touchStartDist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const ratio = currentDist / touchStartDist;
      const newZoom = Math.min(3.5, Math.max(0.25, touchStartZoom * ratio));
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = graphCanvas.getBoundingClientRect();
      const canvasMidX = midX - rect.left;
      const canvasMidY = midY - rect.top;

      if (camera.zoom > 0) {
        const zoomDelta = newZoom / camera.zoom;
        camera.x = canvasMidX - (canvasMidX - camera.x) * zoomDelta;
        camera.y = canvasMidY - (canvasMidY - camera.y) * zoomDelta;
        targetCamera.x = camera.x;
        targetCamera.y = camera.y;
      }
      camera.zoom = newZoom;
      targetCamera.zoom = newZoom;
    }
  }

  function onCanvasTouchEnd(e) {
    onCanvasMouseUp(e);
  }

  function onCanvasWheel(e) {
    e.preventDefault();
    const rect = graphCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newTargetZoom = Math.min(3.5, Math.max(0.25, targetCamera.zoom * zoomFactor));

    targetCamera.x = mouseX - (mouseX - targetCamera.x) * (newTargetZoom / targetCamera.zoom);
    targetCamera.y = mouseY - (mouseY - targetCamera.y) * (newTargetZoom / targetCamera.zoom);
    targetCamera.zoom = newTargetZoom;
  }

  // ═══════════════════════════════════════════════
  // DEEP WORLDBUILDING & LORE SYSTEMS (OBSIDIAN PLUS)
  // ═══════════════════════════════════════════════

  // State
  let mapCamera = { x: 0, y: 0, zoom: 1 };
  let mapFilter = 'all';
  let isMapPlacementMode = false;
  let isMapPanning = false;
  let mapPanStart = { x: 0, y: 0 };
  let mapDraggedPin = null;
  let mapDragDidMove = false;
  let mapDragStartX = 0;
  let mapDragStartY = 0;
  let mapTouchDist = 0;
  let mapTouchZoom = 1;
  let pendingPinClick = { x: 50, y: 50 };

  let timelineMode = 'rail'; // 'rail' or 'stream'
  let timelineFilter = 'all';
  let timelineStepWidth = 320;
  let isTimelinePanning = false;
  let timelinePanStartX = 0;
  let timelineScrollStart = 0;
  let timelineTouchDist = 0;
  let timelineTouchStartStep = 320;
  let timelineDidPan = false;

  let codexMode = 'cards'; // 'cards' or 'web'
  let codexFilter = 'all';
  let hoveredCharId = null;
  let codexWebCamera = { x: 0, y: 0, zoom: 1 };
  let codexNodePositions = new Map();
  let isCodexPanning = false;
  let codexPanStart = { x: 0, y: 0 };
  let codexDraggedNode = null;
  let codexTouchDist = 0;
  let codexTouchStartZoom = 1;
  let codexDidDrag = false;
  let codexDragStartScreen = { x: 0, y: 0 };

  function initWorldbuildingSystems() {
    initMapControls();
    initTimelineControls();
    initCodexControls();
  }

  // ── 1. Interactive World Map & Pin Codex ──

  function initMapControls() {
    if (btnMapView) btnMapView.addEventListener('click', openMapView);
    if (menuBtnMap) menuBtnMap.addEventListener('click', openMapView);
    if (btnCloseMap) btnCloseMap.addEventListener('click', closeMapView);
    if (mapModal) mapModal.addEventListener('click', e => { if (e.target === mapModal) closeMapView(); });

    // Filter pills
    $$('.filter-pill[data-map-filter]').forEach(pill => {
      pill.addEventListener('click', () => {
        $$('.filter-pill[data-map-filter]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        mapFilter = pill.dataset.mapFilter;
        renderMapPins();
      });
    });

    if (mapPinSearch) {
      mapPinSearch.addEventListener('input', () => renderMapPins());
    }

    if (btnMapDropPin) {
      btnMapDropPin.addEventListener('click', () => {
        isMapPlacementMode = !isMapPlacementMode;
        updateMapPlacementUI();
      });
    }

    if (btnMapCancelDrop) {
      btnMapCancelDrop.addEventListener('click', () => {
        isMapPlacementMode = false;
        updateMapPlacementUI();
      });
    }

    if (btnMapResetImg) {
      btnMapResetImg.addEventListener('click', () => {
        Storage.clearCustomMapImage();
        clearMapImageElement();
        renderDefaultMap();
        toast('Reset to default cartography map', 'info');
      });
    }

    if (mapFileInput) {
      mapFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const rawData = reader.result;
          if (typeof Image !== 'undefined' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
            const img = new Image();
            img.onload = () => {
              const maxDim = 1920;
              let w = img.width || 1600;
              let h = img.height || 1000;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext ? canvas.getContext('2d') : null;
              let compressed = rawData;
              if (ctx && typeof canvas.toDataURL === 'function') {
                ctx.drawImage(img, 0, 0, w, h);
                try {
                  compressed = canvas.toDataURL('image/jpeg', 0.82) || rawData;
                } catch {
                  compressed = rawData;
                }
              }
              const saved = Storage.saveCustomMapImage(compressed);
              loadMapImage(compressed);
              if (saved !== false) {
                toast('Custom map image loaded', 'success');
              } else {
                toast('Map image loaded for session (storage quota full)', 'warning');
              }
            };
            img.onerror = () => {
              Storage.saveCustomMapImage(rawData);
              loadMapImage(rawData);
              toast('Custom map image loaded', 'success');
            };
            img.src = rawData;
          } else {
            Storage.saveCustomMapImage(rawData);
            loadMapImage(rawData);
            toast('Custom map image loaded', 'success');
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Zoom controls
    if (btnMapZoomIn) btnMapZoomIn.addEventListener('click', () => zoomMap(1.2));
    if (btnMapZoomOut) btnMapZoomOut.addEventListener('click', () => zoomMap(0.8));
    if (btnMapZoomReset) btnMapZoomReset.addEventListener('click', () => resetMapCamera());

    // Preview actions
    if (btnMapPreviewClose) {
      btnMapPreviewClose.addEventListener('click', () => {
        if (mapPinPreview) {
          mapPinPreview.classList.add('hidden');
          mapPinPreview.style.display = 'none';
        }
      });
    }

    // Modal Pin creation
    if (btnMapPinCancel) {
      btnMapPinCancel.addEventListener('click', () => {
        if (mapPinModal) mapPinModal.classList.add('hidden');
      });
    }
    if (btnMapPinSave) {
      btnMapPinSave.addEventListener('click', savePinFromModal);
    }

    // Map viewport pan & click interactions
    if (mapViewport) {
      mapViewport.addEventListener('mousedown', onMapMouseDown);
      mapViewport.addEventListener('click', (e) => {
        if (isMapPlacementMode) {
          handleMapDropClick(e);
        }
      });
      mapViewport.addEventListener('dblclick', (e) => {
        handleMapDropClick(e);
      });
      window.addEventListener('mousemove', onMapMouseMove);
      window.addEventListener('mouseup', onMapMouseUp);
      mapViewport.addEventListener('wheel', onMapWheel, { passive: false });

      // Touch events for mobile
      mapViewport.addEventListener('touchstart', onMapTouchStart, { passive: false });
      window.addEventListener('touchmove', onMapTouchMove, { passive: false });
      window.addEventListener('touchend', onMapTouchEnd);
    }
  }

  function updateMapPlacementUI() {
    if (!mapViewport) return;
    if (isMapPlacementMode) {
      mapViewport.classList.add('placement-active');
      if (mapPlacementHint) mapPlacementHint.classList.remove('hidden');
      if (btnMapDropPin) btnMapDropPin.classList.add('active');
    } else {
      mapViewport.classList.remove('placement-active');
      if (mapPlacementHint) mapPlacementHint.classList.add('hidden');
      if (btnMapDropPin) btnMapDropPin.classList.remove('active');
    }
  }

  function openWorldbuildingTutorial(type) {
    if (type === 'map' && mapTutorialModal) {
      mapTutorialModal.classList.remove('hidden');
    } else if (type === 'timeline' && timelineTutorialModal) {
      timelineTutorialModal.classList.remove('hidden');
    } else if (type === 'codex' && codexTutorialModal) {
      codexTutorialModal.classList.remove('hidden');
    }
  }

  function closeWorldbuildingTutorial(type) {
    if (type === 'map' && mapTutorialModal) {
      mapTutorialModal.classList.add('hidden');
    } else if (type === 'timeline' && timelineTutorialModal) {
      timelineTutorialModal.classList.add('hidden');
    } else if (type === 'codex' && codexTutorialModal) {
      codexTutorialModal.classList.add('hidden');
    }
  }

  function clearMapImageElement() {
    const img = $('#map-custom-img') || mapCustomImg;
    if (img) {
      if (typeof img.remove === 'function') {
        img.remove();
      } else {
        img.classList.add('hidden');
        img.style.display = 'none';
        if (typeof img.removeAttribute === 'function') {
          img.removeAttribute('src');
        } else {
          img.src = '';
        }
      }
    }
    mapCustomImg = null;
    if (mapCanvas) {
      mapCanvas.classList.remove('hidden');
      mapCanvas.style.display = 'block';
    }
  }

  function openMapView() {
    if (!mapModal) return;
    mapModal.classList.remove('hidden');
    isMapPlacementMode = false;
    updateMapPlacementUI();
    if (mapPinPreview) {
      mapPinPreview.classList.add('hidden');
      mapPinPreview.style.display = 'none';
    }

    resetMapCamera();

    const customImg = Storage.getCustomMapImage();
    if (customImg && typeof customImg === 'string' && customImg.trim().length > 0) {
      loadMapImage(customImg);
    } else {
      clearMapImageElement();
      renderDefaultMap();
    }

    renderMapPins();
  }

  function closeMapView() {
    if (!mapModal) return;
    mapModal.classList.add('hidden');
    if (mapPinModal) mapPinModal.classList.add('hidden');
    if (mapPinPreview) {
      mapPinPreview.classList.add('hidden');
      mapPinPreview.style.display = 'none';
    }
    if (mapTutorialModal) mapTutorialModal.classList.add('hidden');
    isMapPlacementMode = false;
    updateMapPlacementUI();
  }

  function resetMapCamera() {
    if (!mapViewport || !mapStage) return;
    const vpRect = mapViewport.getBoundingClientRect ? mapViewport.getBoundingClientRect() : { width: 1000, height: 700 };
    const scale = Math.min((vpRect.width - 40) / 1600, (vpRect.height - 40) / 1000, 1);
    mapCamera.zoom = Math.max(0.3, scale);
    mapCamera.x = (vpRect.width - 1600 * mapCamera.zoom) / 2;
    mapCamera.y = (vpRect.height - 1000 * mapCamera.zoom) / 2;
    applyMapTransform();
  }

  function zoomMap(factor) {
    if (!mapViewport) return;
    const vpRect = mapViewport.getBoundingClientRect ? mapViewport.getBoundingClientRect() : { width: 1000, height: 700 };
    const midX = vpRect.width / 2;
    const midY = vpRect.height / 2;
    const newZoom = Math.min(3.5, Math.max(0.2, mapCamera.zoom * factor));
    const zoomRatio = newZoom / mapCamera.zoom;
    mapCamera.x = midX - (midX - mapCamera.x) * zoomRatio;
    mapCamera.y = midY - (midY - mapCamera.y) * zoomRatio;
    mapCamera.zoom = newZoom;
    applyMapTransform();
  }

  function applyMapTransform() {
    if (!mapStage) return;
    mapStage.style.transform = `translate(${mapCamera.x}px, ${mapCamera.y}px) scale(${mapCamera.zoom})`;
  }

  function loadMapImage(dataUrl) {
    if (!mapStage || !mapCanvas) return;
    mapCanvas.classList.add('hidden');
    mapCanvas.style.display = 'none';

    let img = $('#map-custom-img') || mapCustomImg;
    if (!img) {
      if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
        img = document.createElement('img');
        img.id = 'map-custom-img';
        img.className = 'map-custom-img';
        img.alt = 'Custom World Map';
        if (mapPinsContainer && mapPinsContainer.parentNode === mapStage) {
          mapStage.insertBefore(img, mapPinsContainer);
        } else {
          mapStage.appendChild(img);
        }
      }
    }
    if (img) {
      img.src = dataUrl;
      img.style.display = 'block';
      img.classList.remove('hidden');
      mapCustomImg = img;
    }
  }

  function renderDefaultMap() {
    if (!mapCanvas || typeof mapCanvas.getContext !== 'function') return;
    const ctx = mapCanvas.getContext('2d');
    if (!ctx) return;

    const w = 1600;
    const h = 1000;
    mapCanvas.width = w;
    mapCanvas.height = h;

    // Background cosmic ocean
    if (ctx.createRadialGradient) {
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 900);
      bgGrad.addColorStop(0, '#0a0d16');
      bgGrad.addColorStop(0.6, '#06070c');
      bgGrad.addColorStop(1, '#020306');
      ctx.fillStyle = bgGrad;
    } else {
      ctx.fillStyle = '#06070c';
    }
    ctx.fillRect(0, 0, w, h);

    // Coordinate grid lines
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.07)';
    ctx.lineWidth = 1;
    if (ctx.setLineDash) ctx.setLineDash([4, 6]);

    for (let x = 160; x < w; x += 160) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 100; y < h; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    if (ctx.setLineDash) ctx.setLineDash([]);

    // Outer border
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 2;
    if (ctx.strokeRect) ctx.strokeRect(20, 20, w - 40, h - 40);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    if (ctx.strokeRect) ctx.strokeRect(28, 28, w - 56, h - 56);

    // Decorative corner diamond runes
    const corners = [[20, 20], [w - 20, 20], [20, h - 20], [w - 20, h - 20]];
    ctx.fillStyle = '#ef4444';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Western Continent: The Ashen Highlands
    if (ctx.save) ctx.save();
    ctx.fillStyle = '#12141e';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(140, 320);
    if (ctx.bezierCurveTo) {
      ctx.bezierCurveTo(220, 180, 480, 160, 560, 280);
      ctx.bezierCurveTo(620, 360, 680, 440, 640, 560);
      ctx.bezierCurveTo(580, 680, 520, 840, 340, 860);
      ctx.bezierCurveTo(180, 870, 120, 720, 180, 580);
      ctx.bezierCurveTo(200, 520, 120, 420, 140, 320);
    } else {
      ctx.lineTo(560, 280);
      ctx.lineTo(640, 560);
      ctx.lineTo(340, 860);
      ctx.lineTo(180, 580);
    }
    if (ctx.closePath) ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (ctx.restore) ctx.restore();

    // Eastern Continent: The Starfall Expanse
    if (ctx.save) ctx.save();
    ctx.fillStyle = '#11131c';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(960, 240);
    if (ctx.bezierCurveTo) {
      ctx.bezierCurveTo(1120, 140, 1380, 160, 1460, 300);
      ctx.bezierCurveTo(1520, 420, 1480, 640, 1380, 740);
      ctx.bezierCurveTo(1240, 840, 1040, 780, 940, 660);
      ctx.bezierCurveTo(860, 540, 840, 340, 960, 240);
    } else {
      ctx.lineTo(1460, 300);
      ctx.lineTo(1380, 740);
      ctx.lineTo(940, 660);
    }
    if (ctx.closePath) ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (ctx.restore) ctx.restore();

    // Central Mountain Divide (The Obsidian Ridge)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const ridgePoints = [
      [360, 260], [420, 240], [480, 280], [530, 330],
      [570, 410], [600, 490], [580, 570], [520, 640],
      [440, 720], [380, 760]
    ];
    ridgePoints.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      ctx.moveTo(px, py);
      ctx.lineTo(px - 6, py + 12);
      ctx.moveTo(px, py);
      ctx.lineTo(px + 6, py + 12);
    });
    ctx.stroke();

    // The Bleeding Chasm (crimson rift)
    if (ctx.save) ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(600, 510);
    ctx.lineTo(650, 560);
    ctx.lineTo(630, 610);
    ctx.lineTo(710, 680);
    ctx.lineTo(760, 720);
    ctx.stroke();
    if (ctx.restore) ctx.restore();

    // Southern Archipelago
    const islands = [
      [720, 820, 28], [790, 860, 22], [850, 840, 18], [680, 890, 14]
    ];
    ctx.fillStyle = '#141724';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1.5;
    islands.forEach(([ix, iy, r]) => {
      ctx.beginPath();
      ctx.arc(ix, iy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Compass Rose / Astrolabe at (1440, 850)
    const astrolabeX = 1440;
    const astrolabeY = 850;
    if (ctx.save) ctx.save();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(astrolabeX, astrolabeY, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(astrolabeX, astrolabeY, 44, 0, Math.PI * 2);
    ctx.stroke();

    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      const len = a % 2 === 0 ? 50 : 32;
      ctx.fillStyle = a % 2 === 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(astrolabeX, astrolabeY);
      ctx.lineTo(astrolabeX + Math.cos(angle - 0.15) * 14, astrolabeY + Math.sin(angle - 0.15) * 14);
      ctx.lineTo(astrolabeX + Math.cos(angle) * len, astrolabeY + Math.sin(angle) * len);
      ctx.lineTo(astrolabeX + Math.cos(angle + 0.15) * 14, astrolabeY + Math.sin(angle + 0.15) * 14);
      if (ctx.closePath) ctx.closePath();
      ctx.fill();
    }

    if (typeof ctx.fillText === 'function') {
      ctx.font = "bold 13px 'Cinzel', serif";
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', astrolabeX, astrolabeY - 66);
      ctx.fillText('S', astrolabeX, astrolabeY + 66);
      ctx.fillText('E', astrolabeX + 66, astrolabeY);
      ctx.fillText('W', astrolabeX - 66, astrolabeY);

      // Geographical Titles
      ctx.font = "14px 'Cinzel', serif";
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('THE ASHEN HIGHLANDS', 370, 390);
      ctx.fillText('THE OBSIDIAN GATE PASS', 560, 470);
      ctx.fillText('THE STARFALL EXPANSE', 1180, 480);
      ctx.fillText('THE TWILIGHT SEA', 800, 360);
      ctx.font = "11px 'Cinzel', serif";
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.fillText('THE BLEEDING CHASM', 720, 620);
      ctx.fillText('SUNLESS ARCHIPELAGO', 780, 920);
    }
    if (ctx.restore) ctx.restore();
  }

  function renderMapPins() {
    if (!mapPinsContainer) return;
    mapPinsContainer.innerHTML = '';

    const allPins = Storage.getAllMapPins();
    const query = mapPinSearch ? mapPinSearch.value.trim().toLowerCase() : '';

    const filtered = allPins.filter(pin => {
      if (mapFilter !== 'all' && pin.category !== mapFilter) return false;
      if (query && !(pin.title || '').toLowerCase().includes(query) && !(pin.description || '').toLowerCase().includes(query)) return false;
      return true;
    });

    if (mapPinCount) {
      mapPinCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'pin' : 'pins'}`;
    }

    filtered.forEach(pin => {
      const pinEl = document.createElement('div');
      pinEl.className = 'map-pin';
      pinEl.dataset.id = pin.id;
      pinEl.dataset.category = pin.category || 'world';
      pinEl.style.left = `${pin.x}%`;
      pinEl.style.top = `${pin.y}%`;

      pinEl.innerHTML = `
        <div class="map-pin-head">
          <div class="map-pin-pulse"></div>
          <div class="map-pin-dot"></div>
        </div>
        <div class="map-pin-label">${escText(pin.title || 'Landmark')}</div>
      `;

      pinEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mapDragDidMove) return;
        showPinPreview(pin);
      });

      pinEl.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        mapDraggedPin = pin;
        mapDragDidMove = false;
        mapDragStartX = e.clientX;
        mapDragStartY = e.clientY;
        pinEl.classList.add('dragging');
      });

      pinEl.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          e.stopPropagation();
          mapDraggedPin = pin;
          mapDragDidMove = false;
          mapDragStartX = e.touches[0].clientX;
          mapDragStartY = e.touches[0].clientY;
          pinEl.classList.add('dragging');
        }
      }, { passive: false });

      mapPinsContainer.appendChild(pinEl);
    });
  }

  function showPinPreview(pin) {
    if (!mapPinPreview) return;
    mapPinPreview.style.display = 'block';
    mapPinPreview.classList.remove('hidden');

    if (mapPreviewBadge) {
      mapPreviewBadge.className = `badge badge-${pin.category || 'world'}`;
      mapPreviewBadge.textContent = (pin.category || 'world').toUpperCase();
    }
    if (mapPreviewCoords) {
      mapPreviewCoords.textContent = `${Number(pin.x).toFixed(1)}%, ${Number(pin.y).toFixed(1)}%`;
    }
    if (mapPreviewTitle) {
      mapPreviewTitle.textContent = pin.title || 'Untitled Pin';
    }

    let summaryText = pin.description || '';
    let linkedNote = pin.noteId ? Storage.getNote(pin.noteId) : null;
    if (!linkedNote && pin.title) {
      linkedNote = Storage.findNoteByTitle(pin.title);
    }
    if (linkedNote && linkedNote.body) {
      const plain = linkedNote.body.replace(/^[#\s*>-]+/gm, '').trim();
      summaryText = summaryText ? `${summaryText}\n\n${plain.slice(0, 160)}` : plain.slice(0, 160);
    }
    if (mapPreviewDesc) {
      mapPreviewDesc.textContent = summaryText || 'No detailed note entry yet. Click below to open or create.';
    }

    if (btnMapOpenNote) {
      btnMapOpenNote.onclick = () => {
        closeMapView();
        if (linkedNote) {
          openNote(linkedNote.id);
        } else if (pin.noteId) {
          openNote(pin.noteId);
        } else {
          const newNote = Storage.createNote({
            title: pin.title || 'Untitled Landmark',
            category: pin.category || 'world',
            body: `# ${pin.title || 'Untitled Landmark'}\n\n${pin.description || ''}`
          });
          renderSidebar();
          openNote(newNote.id);
          toast('Created note for pin', 'success');
        }
      };
    }

    mapPinPreview.onclick = (e) => {
      if (e && e.target && typeof e.target.closest === 'function') {
        if (e.target.closest('#btn-map-preview-close') || e.target.closest('#btn-map-delete-pin')) return;
      }
      if (btnMapOpenNote && typeof btnMapOpenNote.onclick === 'function') {
        btnMapOpenNote.onclick();
      }
    };

    if (btnMapDeletePin) {
      btnMapDeletePin.onclick = (e) => {
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        Storage.deleteMapPin(pin.id);
        mapPinPreview.classList.add('hidden');
        mapPinPreview.style.display = 'none';
        renderMapPins();
        toast('Pin deleted', 'info');
      };
    }
  }

  function onMapMouseDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (isMapPlacementMode) {
      return;
    }
    isMapPanning = true;
    mapPanStart = { x: e.clientX - mapCamera.x, y: e.clientY - mapCamera.y };
    if (mapViewport) mapViewport.classList.add('panning');
  }

  function onMapMouseMove(e) {
    if (mapDraggedPin) {
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      const dist = Math.hypot(clientX - mapDragStartX, clientY - mapDragStartY);
      if (dist < 5 && !mapDragDidMove) {
        return;
      }
      mapDragDidMove = true;
      const stageRect = mapStage && mapStage.getBoundingClientRect ? mapStage.getBoundingClientRect() : { left: 0, top: 0, width: 1600, height: 1000 };
      const pctX = Math.max(0, Math.min(100, ((clientX - stageRect.left) / stageRect.width) * 100));
      const pctY = Math.max(0, Math.min(100, ((clientY - stageRect.top) / stageRect.height) * 100));
      mapDraggedPin.x = pctX;
      mapDraggedPin.y = pctY;
      const el = $(`[data-id="${mapDraggedPin.id}"]`, mapPinsContainer);
      if (el) {
        el.style.left = `${pctX}%`;
        el.style.top = `${pctY}%`;
      }
      if (mapCoordsIndicator) {
        mapCoordsIndicator.textContent = `X: ${pctX.toFixed(1)}% · Y: ${pctY.toFixed(1)}%`;
      }
      return;
    }

    if (isMapPanning) {
      mapCamera.x = e.clientX - mapPanStart.x;
      mapCamera.y = e.clientY - mapPanStart.y;
      applyMapTransform();
    }

    if (mapStage && mapCoordsIndicator && mapStage.getBoundingClientRect) {
      const stageRect = mapStage.getBoundingClientRect();
      const pctX = Math.max(0, Math.min(100, ((e.clientX - stageRect.left) / stageRect.width) * 100));
      const pctY = Math.max(0, Math.min(100, ((e.clientY - stageRect.top) / stageRect.height) * 100));
      mapCoordsIndicator.textContent = `X: ${pctX.toFixed(1)}% · Y: ${pctY.toFixed(1)}%`;
    }
  }

  function onMapMouseUp() {
    if (mapDraggedPin) {
      const wasMoved = mapDragDidMove;
      const targetPin = mapDraggedPin;
      if (wasMoved) {
        Storage.saveMapPin(targetPin);
        toast('Pin position updated', 'info');
      }
      const el = $(`[data-id="${targetPin.id}"]`, mapPinsContainer);
      if (el) el.classList.remove('dragging');
      mapDraggedPin = null;
      if (!wasMoved) {
        showPinPreview(targetPin);
      }
      setTimeout(() => { mapDragDidMove = false; }, 100);
    }
    isMapPanning = false;
    if (mapViewport) mapViewport.classList.remove('panning');
  }

  function onMapWheel(e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (!mapViewport) return;
    const vpRect = mapViewport.getBoundingClientRect ? mapViewport.getBoundingClientRect() : { left: 0, top: 0, width: 1000, height: 700 };
    const mouseX = e.clientX - vpRect.left;
    const mouseY = e.clientY - vpRect.top;

    const zoomFactor = e.deltaY < 0 ? 1.14 : 0.88;
    const newZoom = Math.min(3.5, Math.max(0.2, mapCamera.zoom * zoomFactor));

    mapCamera.x = mouseX - (mouseX - mapCamera.x) * (newZoom / mapCamera.zoom);
    mapCamera.y = mouseY - (mouseY - mapCamera.y) * (newZoom / mapCamera.zoom);
    mapCamera.zoom = newZoom;
    applyMapTransform();
  }

  function handleMapDropClick(e) {
    if (!mapStage) return;
    const stageRect = mapStage.getBoundingClientRect ? mapStage.getBoundingClientRect() : { left: 0, top: 0, width: 1600, height: 1000 };
    const pctX = Math.max(0, Math.min(100, ((e.clientX - stageRect.left) / stageRect.width) * 100));
    const pctY = Math.max(0, Math.min(100, ((e.clientY - stageRect.top) / stageRect.height) * 100));

    pendingPinClick = { x: pctX, y: pctY };
    isMapPlacementMode = false;
    updateMapPlacementUI();
    openPinModalWithCoords(pctX, pctY);
  }

  function openPinModalWithCoords(pctX, pctY) {
    if (!mapPinModal) return;
    mapPinModal.classList.remove('hidden');

    if (mapModalNoteSelect) {
      const notes = Storage.getAllNotes();
      mapModalNoteSelect.innerHTML = `<option value="">-- No linked note (standalone pin) --</option>` +
        notes.map(n => `<option value="${n.id}">${escText(n.title)} (${n.category})</option>`).join('');

      mapModalNoteSelect.onchange = () => {
        const selId = mapModalNoteSelect.value;
        const note = Storage.getNote(selId);
        if (note) {
          if (mapModalPinTitle) mapModalPinTitle.value = note.title;
          if (mapModalPinCategory) mapModalPinCategory.value = note.category;
          if (mapModalPinDesc) mapModalPinDesc.value = note.body.replace(/^[#\s*>-]+/gm, '').slice(0, 100).trim();
        }
      };
    }

    if (mapModalPinTitle) mapModalPinTitle.value = '';
    if (mapModalPinDesc) mapModalPinDesc.value = '';
    if (mapModalPinTitle && typeof mapModalPinTitle.focus === 'function') setTimeout(() => mapModalPinTitle.focus(), 100);
  }

  function savePinFromModal() {
    const title = (mapModalPinTitle && mapModalPinTitle.value.trim()) || 'Landmark Pin';
    const noteId = (mapModalNoteSelect && mapModalNoteSelect.value) || null;
    const category = (mapModalPinCategory && mapModalPinCategory.value) || 'world';
    const desc = (mapModalPinDesc && mapModalPinDesc.value.trim()) || '';

    const newPin = {
      x: pendingPinClick.x,
      y: pendingPinClick.y,
      title,
      noteId,
      category,
      description: desc
    };

    Storage.saveMapPin(newPin);
    if (mapPinModal) mapPinModal.classList.add('hidden');
    renderMapPins();
    toast(`Pin "${title}" placed`, 'success');
  }

  function onMapTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      if (isMapPlacementMode) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        handleMapDropClick(e.touches[0]);
        return;
      }
      isMapPanning = true;
      mapPanStart = { x: e.touches[0].clientX - mapCamera.x, y: e.touches[0].clientY - mapCamera.y };
    } else if (e.touches && e.touches.length === 2) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      isMapPanning = false;
      mapTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      mapTouchZoom = mapCamera.zoom;
    }
  }

  function onMapTouchMove(e) {
    if (mapDraggedPin && e.touches && e.touches.length === 1) {
      onMapMouseMove(e.touches[0]);
      return;
    }

    if (isMapPanning && e.touches && e.touches.length === 1) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      mapCamera.x = e.touches[0].clientX - mapPanStart.x;
      mapCamera.y = e.touches[0].clientY - mapPanStart.y;
      applyMapTransform();
    } else if (e.touches && e.touches.length === 2 && mapTouchDist > 0) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      const currentDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const ratio = currentDist / mapTouchDist;
      mapCamera.zoom = Math.min(3.5, Math.max(0.2, mapTouchZoom * ratio));
      applyMapTransform();
    }
  }

  function onMapTouchEnd() {
    onMapMouseUp();
  }

  // ── 2. Chronology & Event Timeline ──

  function initTimelineControls() {
    if (btnTimelineView) btnTimelineView.addEventListener('click', openTimelineView);
    if (menuBtnTimeline) menuBtnTimeline.addEventListener('click', openTimelineView);
    if (btnCloseTimeline) btnCloseTimeline.addEventListener('click', closeTimelineView);
    if (timelineModal) timelineModal.addEventListener('click', e => { if (e.target === timelineModal) closeTimelineView(); });

    if (btnTimelineModeRail) {
      btnTimelineModeRail.addEventListener('click', () => {
        timelineMode = 'rail';
        btnTimelineModeRail.classList.add('active');
        if (btnTimelineModeStream) btnTimelineModeStream.classList.remove('active');
        if (timelineRailView) timelineRailView.classList.remove('hidden');
        if (timelineStreamView) timelineStreamView.classList.add('hidden');
        renderTimeline();
      });
    }
    if (btnTimelineModeStream) {
      btnTimelineModeStream.addEventListener('click', () => {
        timelineMode = 'stream';
        btnTimelineModeStream.classList.add('active');
        if (btnTimelineModeRail) btnTimelineModeRail.classList.remove('active');
        if (timelineRailView) timelineRailView.classList.add('hidden');
        if (timelineStreamView) timelineStreamView.classList.remove('hidden');
        renderTimeline();
      });
    }

    $$('.filter-pill[data-timeline-filter]').forEach(pill => {
      pill.addEventListener('click', () => {
        $$('.filter-pill[data-timeline-filter]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        timelineFilter = pill.dataset.timelineFilter;
        renderTimeline();
      });
    });

    if (timelineSearch) {
      timelineSearch.addEventListener('input', () => renderTimeline());
    }

    if (btnTimelineAdd) {
      btnTimelineAdd.addEventListener('click', openAddTimelineEventModal);
    }
    if (btnTimelineEmptyAdd) {
      btnTimelineEmptyAdd.addEventListener('click', openAddTimelineEventModal);
    }
    if (btnTimelineEventCancel) {
      btnTimelineEventCancel.addEventListener('click', () => {
        if (timelineEventModal) timelineEventModal.classList.add('hidden');
      });
    }
    if (btnTimelineEventSave) {
      btnTimelineEventSave.addEventListener('click', saveTimelineEventFromModal);
    }

    // Touch and mouse pan & pinch-zoom controls on timeline rail
    if (timelineRailView) {
      timelineRailView.addEventListener('touchstart', onTimelineTouchStart, { passive: false });
      window.addEventListener('touchmove', onTimelineTouchMove, { passive: false });
      window.addEventListener('touchend', onTimelineTouchEnd);

      timelineRailView.addEventListener('mousedown', onTimelineMouseDown);
      window.addEventListener('mousemove', onTimelineMouseMove);
      window.addEventListener('mouseup', onTimelineMouseUp);
      timelineRailView.addEventListener('wheel', onTimelineWheel, { passive: false });
    }
  }

  function onTimelineTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      isTimelinePanning = true;
      timelineDidPan = false;
      timelinePanStartX = e.touches[0].clientX;
      timelineScrollStart = timelineRailView ? (timelineRailView.scrollLeft || 0) : 0;
    } else if (e.touches && e.touches.length === 2) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      isTimelinePanning = false;
      timelineTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      timelineTouchStartStep = timelineStepWidth;
    }
  }

  function onTimelineTouchMove(e) {
    if (isTimelinePanning && e.touches && e.touches.length === 1 && timelineRailView) {
      const dx = e.touches[0].clientX - timelinePanStartX;
      if (Math.abs(dx) > 6) {
        timelineDidPan = true;
        if (typeof e.preventDefault === 'function') e.preventDefault();
      }
      timelineRailView.scrollLeft = timelineScrollStart - dx;
    } else if (e.touches && e.touches.length === 2 && timelineTouchDist > 0) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      const curDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const scale = curDist / timelineTouchDist;
      timelineStepWidth = Math.max(180, Math.min(640, Math.round(timelineTouchStartStep * scale)));
      renderTimeline();
    }
  }

  function onTimelineTouchEnd() {
    isTimelinePanning = false;
    setTimeout(() => { timelineDidPan = false; }, 100);
  }

  function onTimelineMouseDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.target && e.target.closest && e.target.closest('.timeline-card-link')) return;
    isTimelinePanning = true;
    timelineDidPan = false;
    timelinePanStartX = e.clientX;
    timelineScrollStart = timelineRailView ? (timelineRailView.scrollLeft || 0) : 0;
  }

  function onTimelineMouseMove(e) {
    if (isTimelinePanning && timelineRailView) {
      const dx = e.clientX - timelinePanStartX;
      if (Math.abs(dx) > 5) timelineDidPan = true;
      timelineRailView.scrollLeft = timelineScrollStart - dx;
    }
  }

  function onTimelineMouseUp() {
    isTimelinePanning = false;
    setTimeout(() => { timelineDidPan = false; }, 100);
  }

  function onTimelineWheel(e) {
    if (e.ctrlKey || e.metaKey) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      timelineStepWidth = Math.max(180, Math.min(640, Math.round(timelineStepWidth * factor)));
      renderTimeline();
    }
  }

  function openTimelineView() {
    if (!timelineModal) return;
    timelineModal.classList.remove('hidden');
    renderTimeline();
  }

  function closeTimelineView() {
    if (!timelineModal) return;
    timelineModal.classList.add('hidden');
    if (timelineEventModal) timelineEventModal.classList.add('hidden');
    if (timelineTutorialModal) timelineTutorialModal.classList.add('hidden');
  }

  function renderTimeline() {
    const allEvents = Storage.getAllTimelineEvents();
    const query = timelineSearch ? timelineSearch.value.trim().toLowerCase() : '';

    const filtered = allEvents.filter(evt => {
      if (timelineFilter !== 'all' && evt.category !== timelineFilter) return false;
      if (query) {
        const text = `${evt.year} ${evt.title} ${evt.description} ${evt.era || ''}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    if (timelineEventCount) {
      timelineEventCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'event' : 'events'}`;
    }

    if (filtered.length === 0) {
      if (timelineEmptyPrompt) timelineEmptyPrompt.classList.remove('hidden');
      if (timelineRailView) timelineRailView.classList.add('hidden');
      if (timelineStreamView) timelineStreamView.classList.add('hidden');
      return;
    }

    if (timelineEmptyPrompt) timelineEmptyPrompt.classList.add('hidden');
    if (timelineMode === 'rail') {
      if (timelineRailView) timelineRailView.classList.remove('hidden');
      if (timelineStreamView) timelineStreamView.classList.add('hidden');
      renderTimelineRail(filtered);
    } else {
      if (timelineRailView) timelineRailView.classList.add('hidden');
      if (timelineStreamView) timelineStreamView.classList.remove('hidden');
      renderTimelineStream(filtered);
    }
  }

  function renderTimelineRail(events) {
    if (!timelineRailTrack || !timelineRailEras) return;
    timelineRailTrack.innerHTML = '';
    timelineRailEras.innerHTML = '';

    const stepWidth = timelineStepWidth;
    const totalWidth = Math.max(1200, (events.length + 1) * stepWidth);
    timelineRailTrack.style.width = `${totalWidth}px`;
    const canvasWrap = $('#timeline-rail-canvas-wrap');
    if (canvasWrap) canvasWrap.style.width = `${totalWidth + 120}px`;

    const erasMap = new Map();
    events.forEach((evt, idx) => {
      const era = evt.era || 'Historical Epoch';
      if (!erasMap.has(era)) {
        erasMap.set(era, { name: era, startIdx: idx, count: 1 });
      } else {
        erasMap.get(era).count++;
      }
    });

    erasMap.forEach(era => {
      const eraChip = document.createElement('div');
      eraChip.className = 'timeline-era-chip';
      eraChip.textContent = `✦ ${era.name}`;
      eraChip.style.left = `${(era.startIdx * stepWidth) + 80}px`;
      timelineRailEras.appendChild(eraChip);
    });

    events.forEach((evt, idx) => {
      const isAbove = idx % 2 === 0;
      const xPos = 80 + (idx * stepWidth);
      const isManual = !evt.isNoteEvent && (!evt.id || !evt.id.startsWith('note-evt-'));
      const delBtnHtml = isManual ? `<button class="btn-del-timeline-evt" title="Delete event" data-id="${evt.id}">✕</button>` : '';

      const card = document.createElement('div');
      card.className = `timeline-node-card ${isAbove ? 'pos-above' : 'pos-below'}`;
      card.style.left = `${xPos}px`;

      card.innerHTML = `
        <div class="timeline-node-bullet"></div>
        <div class="timeline-node-stem"></div>
        <div class="timeline-card-header">
          <span class="timeline-card-year">${escText(evt.year)}</span>
          <span class="badge badge-${evt.category || 'lore'}">${evt.category || 'lore'}</span>
          ${delBtnHtml}
        </div>
        <h4 class="timeline-card-title">${escText(evt.title)}</h4>
        <p class="timeline-card-desc">${escText(evt.description)}</p>
        <div class="timeline-card-link">
          <span>Open Note ↗</span>
        </div>
      `;

      const delBtn = card.querySelector('.btn-del-timeline-evt');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          Storage.deleteTimelineEvent(evt.id);
          renderTimeline();
          toast(`Deleted event "${evt.title}"`, 'info');
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-del-timeline-evt')) return;
        if (timelineDidPan) return;
        closeTimelineView();
        navigateToEventNote(evt);
      });

      timelineRailTrack.appendChild(card);
    });
  }

  function renderTimelineStream(events) {
    if (!timelineStreamContainer) return;
    timelineStreamContainer.innerHTML = '';

    let currentEra = '';
    events.forEach((evt, idx) => {
      const era = evt.era || 'Historical Chronicle';
      if (era !== currentEra) {
        currentEra = era;
        const eraBanner = document.createElement('div');
        eraBanner.className = 'timeline-stream-era-header';
        eraBanner.innerHTML = `<span>✦ ${escText(era)}</span>`;
        timelineStreamContainer.appendChild(eraBanner);
      }

      const isLeft = idx % 2 === 0;
      const isManual = !evt.isNoteEvent && (!evt.id || !evt.id.startsWith('note-evt-'));
      const delBtnHtml = isManual ? `<button class="btn-del-timeline-evt" title="Delete event" data-id="${evt.id}">✕</button>` : '';

      const item = document.createElement('div');
      item.className = `timeline-stream-item ${isLeft ? 'side-left' : 'side-right'}`;

      item.innerHTML = `
        <div class="timeline-stream-dot"></div>
        <div class="timeline-node-card">
          <div class="timeline-card-header">
            <span class="timeline-card-year">${escText(evt.year)}</span>
            <span class="badge badge-${evt.category || 'lore'}">${evt.category || 'lore'}</span>
            ${delBtnHtml}
          </div>
          <h4 class="timeline-card-title">${escText(evt.title)}</h4>
          <p class="timeline-card-desc">${escText(evt.description)}</p>
          <div class="timeline-card-link">
            <span>Open Note ↗</span>
          </div>
        </div>
      `;

      const delBtn = item.querySelector('.btn-del-timeline-evt');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          Storage.deleteTimelineEvent(evt.id);
          renderTimeline();
          toast(`Deleted event "${evt.title}"`, 'info');
        });
      }

      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-del-timeline-evt')) return;
        closeTimelineView();
        navigateToEventNote(evt);
      });

      timelineStreamContainer.appendChild(item);
    });
  }

  function navigateToEventNote(evt) {
    let note = evt.noteId ? Storage.getNote(evt.noteId) : null;
    if (!note && evt.title) {
      note = Storage.findNoteByTitle(evt.title);
    }
    if (!note && evt.noteTitle) {
      note = Storage.findNoteByTitle(evt.noteTitle);
    }
    if (note) {
      openNote(note.id);
    } else {
      const newNote = Storage.createNote({
        title: evt.title,
        category: evt.category || 'lore',
        body: `# ${evt.title}\n\n**Timeline:** ${evt.year} (${evt.era || 'Epoch'})\n\n${evt.description}\n\n`
      });
      renderSidebar();
      openNote(newNote.id);
      toast('Created note for timeline event', 'success');
    }
  }

  function openAddTimelineEventModal() {
    if (!timelineEventModal) return;
    timelineEventModal.classList.remove('hidden');

    if (timelineInputNote) {
      const notes = Storage.getAllNotes();
      timelineInputNote.innerHTML = `<option value="">-- No linked note --</option>` +
        notes.map(n => `<option value="${n.id}">${escText(n.title)} (${n.category})</option>`).join('');
    }

    if (timelineInputYear) timelineInputYear.value = '';
    if (timelineInputEra) timelineInputEra.value = '';
    if (timelineInputTitle) timelineInputTitle.value = '';
    if (timelineInputDesc) timelineInputDesc.value = '';
    if (timelineInputYear && typeof timelineInputYear.focus === 'function') setTimeout(() => timelineInputYear.focus(), 100);
  }

  function saveTimelineEventFromModal() {
    const year = (timelineInputYear && timelineInputYear.value.trim()) || 'Year 1';
    const era = (timelineInputEra && timelineInputEra.value.trim()) || '';
    const title = (timelineInputTitle && timelineInputTitle.value.trim()) || 'Historical Event';
    const noteId = (timelineInputNote && timelineInputNote.value) || null;
    const category = (timelineInputCategory && timelineInputCategory.value) || 'lore';
    const desc = (timelineInputDesc && timelineInputDesc.value.trim()) || '';

    const newEvt = {
      year,
      era,
      title,
      noteId,
      category,
      description: desc
    };

    Storage.saveTimelineEvent(newEvt);
    if (timelineEventModal) timelineEventModal.classList.add('hidden');
    renderTimeline();
    toast(`Event "${title}" recorded`, 'success');
  }

  // ── 3. Character Codex & Relationship Web ──

  let activeCodexNodes = [];
  let lastCodexChars = [];
  let lastCodexRels = [];

  function getCodexWorldCoords(clientX, clientY) {
    const rect = codexWebCanvas && codexWebCanvas.getBoundingClientRect ? codexWebCanvas.getBoundingClientRect() : { left: 0, top: 0, width: 1200, height: 800 };
    const scaleX = 1200 / (rect.width || 1200);
    const scaleY = 800 / (rect.height || 800);
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;
    const worldX = (canvasX - codexWebCamera.x) / (codexWebCamera.zoom || 1);
    const worldY = (canvasY - codexWebCamera.y) / (codexWebCamera.zoom || 1);
    return { canvasX, canvasY, worldX, worldY };
  }

  function onCodexMouseDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const { worldX, worldY } = getCodexWorldCoords(e.clientX, e.clientY);
    codexDragStartScreen = { x: e.clientX, y: e.clientY };
    codexDidDrag = false;
    let hit = null;
    for (const n of activeCodexNodes) {
      if (Math.hypot(n.x - worldX, n.y - worldY) <= n.r) {
        hit = n;
        break;
      }
    }
    if (hit) {
      codexDraggedNode = hit;
    } else {
      isCodexPanning = true;
      codexPanStart = { x: e.clientX - codexWebCamera.x, y: e.clientY - codexWebCamera.y };
    }
  }

  function onCodexMouseMove(e) {
    if (codexDraggedNode) {
      const dist = Math.hypot(e.clientX - codexDragStartScreen.x, e.clientY - codexDragStartScreen.y);
      if (dist > 5) codexDidDrag = true;
      const { worldX, worldY } = getCodexWorldCoords(e.clientX, e.clientY);
      codexDraggedNode.x = worldX;
      codexDraggedNode.y = worldY;
      codexNodePositions.set(codexDraggedNode.char.id, { x: worldX, y: worldY });
      renderCodexWeb(lastCodexChars, lastCodexRels);
      return;
    }
    if (isCodexPanning) {
      const dist = Math.hypot(e.clientX - codexDragStartScreen.x, e.clientY - codexDragStartScreen.y);
      if (dist > 5) codexDidDrag = true;
      codexWebCamera.x = e.clientX - codexPanStart.x;
      codexWebCamera.y = e.clientY - codexPanStart.y;
      renderCodexWeb(lastCodexChars, lastCodexRels);
      return;
    }
    if (codexMode === 'web' && codexWebCanvas && codexModal && !codexModal.classList.contains('hidden')) {
      const { worldX, worldY } = getCodexWorldCoords(e.clientX, e.clientY);
      let hit = null;
      for (const n of activeCodexNodes) {
        if (Math.hypot(n.x - worldX, n.y - worldY) <= n.r) {
          hit = n.char.id;
          break;
        }
      }
      if (hit !== hoveredCharId) {
        hoveredCharId = hit;
        renderCodexWeb(lastCodexChars, lastCodexRels);
      }
    }
  }

  function onCodexMouseUp() {
    if (codexDraggedNode) {
      if (!codexDidDrag) {
        showWebInspector(codexDraggedNode.char, lastCodexRels, lastCodexChars);
      }
      codexDraggedNode = null;
    }
    isCodexPanning = false;
    setTimeout(() => { codexDidDrag = false; }, 100);
  }

  function onCodexWheel(e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    const { canvasX, canvasY } = getCodexWorldCoords(e.clientX, e.clientY);
    const factor = e.deltaY < 0 ? 1.14 : 0.88;
    const newZoom = Math.min(3.0, Math.max(0.3, codexWebCamera.zoom * factor));
    codexWebCamera.x = canvasX - (canvasX - codexWebCamera.x) * (newZoom / codexWebCamera.zoom);
    codexWebCamera.y = canvasY - (canvasY - codexWebCamera.y) * (newZoom / codexWebCamera.zoom);
    codexWebCamera.zoom = newZoom;
    renderCodexWeb(lastCodexChars, lastCodexRels);
  }

  function onCodexTouchStart(e) {
    if (e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      const { worldX, worldY } = getCodexWorldCoords(touch.clientX, touch.clientY);
      codexDragStartScreen = { x: touch.clientX, y: touch.clientY };
      codexDidDrag = false;
      let hit = null;
      for (const n of activeCodexNodes) {
        if (Math.hypot(n.x - worldX, n.y - worldY) <= n.r) {
          hit = n;
          break;
        }
      }
      if (hit) {
        codexDraggedNode = hit;
      } else {
        isCodexPanning = true;
        codexPanStart = { x: touch.clientX - codexWebCamera.x, y: touch.clientY - codexWebCamera.y };
      }
    } else if (e.touches && e.touches.length === 2) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      codexDraggedNode = null;
      isCodexPanning = false;
      codexTouchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      codexTouchStartZoom = codexWebCamera.zoom;
    }
  }

  function onCodexTouchMove(e) {
    if (codexDraggedNode && e.touches && e.touches.length === 1) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      const touch = e.touches[0];
      const dist = Math.hypot(touch.clientX - codexDragStartScreen.x, touch.clientY - codexDragStartScreen.y);
      if (dist > 5) codexDidDrag = true;
      const { worldX, worldY } = getCodexWorldCoords(touch.clientX, touch.clientY);
      codexDraggedNode.x = worldX;
      codexDraggedNode.y = worldY;
      codexNodePositions.set(codexDraggedNode.char.id, { x: worldX, y: worldY });
      renderCodexWeb(lastCodexChars, lastCodexRels);
    } else if (isCodexPanning && e.touches && e.touches.length === 1) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      const touch = e.touches[0];
      const dist = Math.hypot(touch.clientX - codexDragStartScreen.x, touch.clientY - codexDragStartScreen.y);
      if (dist > 5) codexDidDrag = true;
      codexWebCamera.x = touch.clientX - codexPanStart.x;
      codexWebCamera.y = touch.clientY - codexPanStart.y;
      renderCodexWeb(lastCodexChars, lastCodexRels);
    } else if (e.touches && e.touches.length === 2 && codexTouchDist > 0) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      const curDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const ratio = curDist / codexTouchDist;
      codexWebCamera.zoom = Math.min(3.0, Math.max(0.3, codexTouchStartZoom * ratio));
      renderCodexWeb(lastCodexChars, lastCodexRels);
    }
  }

  function onCodexTouchEnd() {
    onCodexMouseUp();
  }

  function initCodexControls() {
    if (btnCodexView) btnCodexView.addEventListener('click', openCodexView);
    if (menuBtnCodex) menuBtnCodex.addEventListener('click', openCodexView);
    if (btnCloseCodex) btnCloseCodex.addEventListener('click', closeCodexView);
    if (codexModal) codexModal.addEventListener('click', e => { if (e.target === codexModal) closeCodexView(); });

    if (btnCodexModeCards) {
      btnCodexModeCards.addEventListener('click', () => {
        codexMode = 'cards';
        btnCodexModeCards.classList.add('active');
        if (btnCodexModeWeb) btnCodexModeWeb.classList.remove('active');
        if (codexCardsView) codexCardsView.classList.remove('hidden');
        if (codexWebView) codexWebView.classList.add('hidden');
        renderCodex();
      });
    }
    if (btnCodexModeCards) {
      btnCodexModeCards.addEventListener('click', () => {
        codexMode = 'cards';
        btnCodexModeCards.classList.add('active');
        if (btnCodexModeWeb) btnCodexModeWeb.classList.remove('active');
        if (codexCardsView) codexCardsView.classList.remove('hidden');
        if (codexWebView) codexWebView.classList.add('hidden');
        if (codexCharPreview) {
          codexCharPreview.classList.add('hidden');
          codexCharPreview.style.display = 'none';
        }
        renderCodex();
      });
    }
    if (btnCodexModeWeb) {
      btnCodexModeWeb.addEventListener('click', () => {
        codexMode = 'web';
        btnCodexModeWeb.classList.add('active');
        if (btnCodexModeCards) btnCodexModeCards.classList.remove('active');
        if (codexCardsView) codexCardsView.classList.add('hidden');
        if (codexWebView) codexWebView.classList.remove('hidden');
        if (codexCharPreview) {
          codexCharPreview.classList.add('hidden');
          codexCharPreview.style.display = 'none';
        }
        renderCodex();
      });
    }

    $$('.filter-pill[data-codex-filter]').forEach(pill => {
      pill.addEventListener('click', () => {
        $$('.filter-pill[data-codex-filter]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        codexFilter = pill.dataset.codexFilter;
        renderCodex();
      });
    });

    if (codexSearch) {
      codexSearch.addEventListener('input', () => renderCodex());
    }

    if (btnCodexAddChar) btnCodexAddChar.addEventListener('click', openAddCharacterModal);
    if (btnCodexEmptyAdd) btnCodexEmptyAdd.addEventListener('click', openAddCharacterModal);
    if (btnCodexAddRel) btnCodexAddRel.addEventListener('click', openAddRelationshipModal);

    if (btnCodexCharCancel) {
      btnCodexCharCancel.addEventListener('click', () => {
        if (codexCharModal) codexCharModal.classList.add('hidden');
      });
    }
    if (btnCodexCharSave) {
      btnCodexCharSave.addEventListener('click', saveCharacterFromModal);
    }

    if (btnCodexRelCancel) {
      btnCodexRelCancel.addEventListener('click', () => {
        if (codexRelModal) codexRelModal.classList.add('hidden');
      });
    }
    if (btnCodexRelSave) {
      btnCodexRelSave.addEventListener('click', saveRelationshipFromModal);
    }

    if (btnInspectorClose) {
      btnInspectorClose.addEventListener('click', () => {
        if (codexCharPreview) {
          codexCharPreview.classList.add('hidden');
          codexCharPreview.style.display = 'none';
        }
      });
    }

    if (codexWebCanvas) {
      codexWebCanvas.addEventListener('mousedown', onCodexMouseDown);
      window.addEventListener('mousemove', onCodexMouseMove);
      window.addEventListener('mouseup', onCodexMouseUp);
      codexWebCanvas.addEventListener('wheel', onCodexWheel, { passive: false });

      codexWebCanvas.addEventListener('touchstart', onCodexTouchStart, { passive: false });
      window.addEventListener('touchmove', onCodexTouchMove, { passive: false });
      window.addEventListener('touchend', onCodexTouchEnd);
    }
  }

  function openCodexView() {
    if (!codexModal) return;
    codexModal.classList.remove('hidden');
    if (codexCharPreview) {
      codexCharPreview.classList.add('hidden');
      codexCharPreview.style.display = 'none';
    }
    renderCodex();
  }

  function closeCodexView() {
    if (!codexModal) return;
    codexModal.classList.add('hidden');
    if (codexCharModal) codexCharModal.classList.add('hidden');
    if (codexRelModal) codexRelModal.classList.add('hidden');
    if (codexCharPreview) {
      codexCharPreview.classList.add('hidden');
      codexCharPreview.style.display = 'none';
    }
    if (codexTutorialModal) codexTutorialModal.classList.add('hidden');
  }

  function renderCodex() {
    const allChars = Storage.getAllCharacters();
    const allRels = Storage.getAllRelationships();
    const query = codexSearch ? codexSearch.value.trim().toLowerCase() : '';

    const filtered = allChars.filter(c => {
      if (codexFilter !== 'all' && c.archetype !== codexFilter) return false;
      if (query) {
        const text = `${c.name} ${c.archetype} ${c.faction || ''} ${c.role || ''} ${c.bio || ''}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    if (codexCharacterCount) {
      codexCharacterCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'character' : 'characters'}`;
    }
    if (codexRelCount) {
      codexRelCount.textContent = `${allRels.length} ${allRels.length === 1 ? 'relationship' : 'relationships'}`;
    }

    if (filtered.length === 0) {
      if (codexEmptyPrompt) codexEmptyPrompt.classList.remove('hidden');
      if (codexCardsView) codexCardsView.classList.add('hidden');
      if (codexWebView) codexWebView.classList.add('hidden');
      if (codexCharPreview) {
        codexCharPreview.classList.add('hidden');
        codexCharPreview.style.display = 'none';
      }
      return;
    }

    if (codexEmptyPrompt) codexEmptyPrompt.classList.add('hidden');
    if (codexMode === 'cards') {
      if (codexCardsView) codexCardsView.classList.remove('hidden');
      if (codexWebView) codexWebView.classList.add('hidden');
      renderCodexCards(filtered, allRels, allChars);
    } else {
      if (codexCardsView) codexCardsView.classList.add('hidden');
      if (codexWebView) codexWebView.classList.remove('hidden');
      renderCodexWeb(filtered, allRels);
    }
  }

  function renderCodexCards(chars, rels, allChars) {
    if (!codexGrid) return;
    codexGrid.innerHTML = '';

    const charMap = new Map();
    allChars.forEach(c => charMap.set(c.id, c));

    chars.forEach(c => {
      const myRels = rels.filter(r => r.sourceId === c.id || r.targetId === c.id);

      const card = document.createElement('div');
      card.className = 'codex-card';
      card.dataset.id = c.id;

      const initial = (c.name || 'C').charAt(0).toUpperCase();

      const relsHtml = myRels.map(r => {
        const otherId = r.sourceId === c.id ? r.targetId : r.sourceId;
        const other = charMap.get(otherId);
        const otherName = other ? other.name : 'Unknown';
        return `<span class="codex-rel-chip"><span class="rel-type">${escText(r.type)}</span> ${escText(otherName)}</span>`;
      }).join('');

      card.innerHTML = `
        <div class="codex-card-top">
          <div class="codex-avatar">${initial}</div>
          <div class="codex-card-meta">
            <h4 class="codex-card-name">${escText(c.name)}</h4>
            <div class="codex-badges">
              <span class="badge-archetype" data-type="${escText(c.archetype || 'Ally')}">${escText(c.archetype || 'Ally')}</span>
              <span class="codex-card-faction">${escText(c.faction || 'Independent')}</span>
            </div>
          </div>
        </div>
        <p class="codex-card-bio">${escText(c.bio || 'No background recorded yet.')}</p>
        ${myRels.length > 0 ? `
          <div class="codex-card-rels">
            <div class="codex-rels-header">Relationships</div>
            <div class="codex-rels-chips">${relsHtml}</div>
          </div>
        ` : ''}
        <div class="codex-card-actions">
          <span class="text-xs text-muted">${escText(c.role || 'Dossier')}</span>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${(!c.source || c.source !== 'note') ? `<button class="btn-del-char" title="Delete character" data-id="${c.id}">✕</button>` : ''}
            <button class="btn btn-xs btn-primary btn-open-dossier">Open Dossier ↗</button>
          </div>
        </div>
      `;

      const delBtn = card.querySelector('.btn-del-char');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          Storage.deleteCharacter(c.id);
          renderCodex();
          toast(`Deleted character "${c.name}"`, 'info');
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-del-char')) return;
        closeCodexView();
        navigateToCharacterNote(c);
      });

      codexGrid.appendChild(card);
    });
  }

  function renderCodexWeb(chars, rels) {
    lastCodexChars = chars || [];
    lastCodexRels = rels || [];

    if (!codexWebCanvas || typeof codexWebCanvas.getContext !== 'function') return;
    const ctx = codexWebCanvas.getContext('2d');
    if (!ctx) return;

    const w = 1200;
    const h = 800;
    codexWebCanvas.width = w;
    codexWebCanvas.height = h;

    if (ctx.clearRect) ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(centerX, centerY) - 120;

    const charNodes = [];
    (chars || []).forEach((c, idx) => {
      let x, y;
      if (codexNodePositions.has(c.id)) {
        const pos = codexNodePositions.get(c.id);
        x = pos.x;
        y = pos.y;
      } else {
        const angle = (idx / (chars.length || 1)) * Math.PI * 2 - Math.PI / 2;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
        codexNodePositions.set(c.id, { x, y });
      }
      charNodes.push({
        char: c,
        x,
        y,
        r: 32
      });
    });
    activeCodexNodes = charNodes;

    if (ctx.save) ctx.save();
    if (ctx.translate) ctx.translate(codexWebCamera.x, codexWebCamera.y);
    if (ctx.scale) ctx.scale(codexWebCamera.zoom, codexWebCamera.zoom);

    const nodeMap = new Map();
    charNodes.forEach(n => nodeMap.set(n.char.id, n));

    (rels || []).forEach(r => {
      const sNode = nodeMap.get(r.sourceId);
      const tNode = nodeMap.get(r.targetId);
      if (!sNode || !tNode) return;

      const isHighlighted = hoveredCharId === r.sourceId || hoveredCharId === r.targetId;
      const isDimmed = hoveredCharId && !isHighlighted;

      if (ctx.save) ctx.save();
      if (isDimmed) {
        ctx.globalAlpha = 0.15;
      } else if (isHighlighted) {
        ctx.globalAlpha = 1;
        ctx.lineWidth = 3;
      } else {
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1.5;
      }

      let color = '#94a3b8';
      const typeLower = (r.type || '').toLowerCase();
      if (typeLower.includes('allied') || typeLower.includes('ally') || typeLower.includes('mentor') || typeLower.includes('pupil')) {
        color = '#10b981';
      } else if (typeLower.includes('rival') || typeLower.includes('enemy')) {
        color = '#ef4444';
      } else if (typeLower.includes('kin') || typeLower.includes('bound')) {
        color = '#a855f7';
      }

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(sNode.x, sNode.y);
      const midX = (sNode.x + tNode.x) / 2 + (sNode.y - tNode.y) * 0.15;
      const midY = (sNode.y + tNode.y) / 2 + (tNode.x - sNode.x) * 0.15;
      if (ctx.quadraticCurveTo) {
        ctx.quadraticCurveTo(midX, midY, tNode.x, tNode.y);
      } else {
        ctx.lineTo(tNode.x, tNode.y);
      }
      ctx.stroke();

      if (!isDimmed && typeof ctx.fillText === 'function') {
        ctx.font = "10px sans-serif";
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(r.type, midX, midY);
      }
      if (ctx.restore) ctx.restore();
    });

    charNodes.forEach(n => {
      const isHovered = hoveredCharId === n.char.id;
      const isDimmed = hoveredCharId && hoveredCharId !== n.char.id;

      if (ctx.save) ctx.save();
      if (isDimmed) ctx.globalAlpha = 0.3;

      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = isHovered ? 20 : 8;

      ctx.fillStyle = '#0f111a';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isHovered ? '#ef4444' : 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      if (typeof ctx.fillText === 'function') {
        ctx.font = "bold 16px 'Cinzel', serif";
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((n.char.name || 'C').charAt(0), n.x, n.y);

        ctx.font = "12px sans-serif";
        ctx.fillStyle = isHovered ? '#fff' : '#cbd5e1';
        ctx.fillText(n.char.name, n.x, n.y + n.r + 16);
      }

      if (ctx.restore) ctx.restore();
    });

    if (ctx.restore) ctx.restore();

    // Preserve mock/test onclick compatibility
    codexWebCanvas.onclick = (e) => {
      if (codexDidDrag) return;
      const { worldX, worldY } = getCodexWorldCoords(e.clientX, e.clientY);
      for (const n of charNodes) {
        if (Math.hypot(n.x - worldX, n.y - worldY) <= n.r) {
          showWebInspector(n.char, rels, chars);
          break;
        }
      }
    };

    codexWebCanvas.onmousemove = (e) => {
      onCodexMouseMove(e);
    };
  }

  function showWebInspector(char, rels, allChars) {
    if (!codexCharPreview) return;
    codexCharPreview.style.display = 'block';
    codexCharPreview.classList.remove('hidden');

    if (inspectorArchetypeBadge) {
      inspectorArchetypeBadge.textContent = char.archetype || 'Ally';
      inspectorArchetypeBadge.dataset.type = char.archetype || 'Ally';
    }
    if (inspectorName) inspectorName.textContent = char.name;
    if (inspectorFaction) inspectorFaction.textContent = `Faction: ${char.faction || 'Independent'} · ${char.role || 'Character'}`;
    if (inspectorBio) inspectorBio.textContent = char.bio || 'No detailed background recorded.';

    const charMap = new Map();
    allChars.forEach(c => charMap.set(c.id, c));

    const myRels = rels.filter(r => r.sourceId === char.id || r.targetId === char.id);
    if (inspectorRelsList) {
      inspectorRelsList.innerHTML = myRels.length > 0 ? myRels.map(r => {
        const otherId = r.sourceId === char.id ? r.targetId : r.sourceId;
        const other = charMap.get(otherId);
        const isManual = !r.id || !r.id.startsWith('note-rel-');
        const delRelBtn = isManual ? `<button class="btn-del-rel" data-rel-id="${r.id}" title="Remove relationship" style="float: right;">✕</button>` : '';
        return `<div class="text-xs" style="margin-bottom: 4px; overflow: hidden;"><strong>${escText(r.type)}:</strong> ${escText(other ? other.name : 'Unknown')} ${delRelBtn}</div>`;
      }).join('') : '<div class="text-xs text-muted">No explicit relationships recorded.</div>';

      inspectorRelsList.querySelectorAll('.btn-del-rel').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const relId = btn.dataset.relId;
          Storage.deleteRelationship(relId);
          renderCodex();
          const updatedChars = Storage.getAllCharacters();
          const updatedRels = Storage.getAllRelationships();
          showWebInspector(char, updatedRels, updatedChars);
          toast('Relationship removed', 'info');
        });
      });
    }

    if (btnInspectorOpenNote) {
      btnInspectorOpenNote.onclick = () => {
        closeCodexView();
        navigateToCharacterNote(char);
      };
    }

    const btnInspectorDeleteChar = $('#btn-inspector-delete-char');
    if (btnInspectorDeleteChar) {
      btnInspectorDeleteChar.onclick = () => {
        Storage.deleteCharacter(char.id);
        if (codexCharPreview) {
          codexCharPreview.classList.add('hidden');
          codexCharPreview.style.display = 'none';
        }
        renderCodex();
        toast(`Deleted character "${char.name}"`, 'info');
      };
    }
  }

  function navigateToCharacterNote(char) {
    let note = char.noteId ? Storage.getNote(char.noteId) : null;
    if (!note && char.name) {
      note = Storage.findNoteByTitle(char.name);
    }
    if (note) {
      openNote(note.id);
    } else {
      const newNote = Storage.createNote({
        title: char.name,
        category: 'lore',
        tags: 'character, ' + (char.archetype || '').toLowerCase(),
        body: `# ${char.name}\n\n**Archetype:** ${char.archetype || 'Ally'}  \n**Faction:** ${char.faction || 'Independent'}  \n**Role:** ${char.role || 'Acolyte'}  \n\n### Character Dossier\n${char.bio || ''}\n\n`
      });
      renderSidebar();
      openNote(newNote.id);
      toast('Created character lore note', 'success');
    }
  }

  function openAddCharacterModal() {
    if (!codexCharModal) return;
    codexCharModal.classList.remove('hidden');

    if (codexInputNote) {
      const notes = Storage.getAllNotes();
      codexInputNote.innerHTML = `<option value="">-- Auto-create new Lore Dossier Note --</option>` +
        notes.map(n => `<option value="${n.id}">${escText(n.title)} (${n.category})</option>`).join('');
    }

    if (codexInputName) codexInputName.value = '';
    if (codexInputFaction) codexInputFaction.value = '';
    if (codexInputRole) codexInputRole.value = '';
    if (codexInputBio) codexInputBio.value = '';
    if (codexInputName && typeof codexInputName.focus === 'function') setTimeout(() => codexInputName.focus(), 100);
  }

  function saveCharacterFromModal() {
    const name = (codexInputName && codexInputName.value.trim()) || 'New Character';
    const archetype = (codexInputArchetype && codexInputArchetype.value) || 'Protagonist';
    const faction = (codexInputFaction && codexInputFaction.value.trim()) || 'Independent';
    const role = (codexInputRole && codexInputRole.value.trim()) || '';
    const bio = (codexInputBio && codexInputBio.value.trim()) || '';
    let noteId = (codexInputNote && codexInputNote.value) || null;

    if (!noteId) {
      const created = Storage.createNote({
        title: name,
        category: 'lore',
        tags: `character, ${archetype.toLowerCase()}`,
        body: `# ${name}\n\n**Archetype:** ${archetype}  \n**Faction:** ${faction}  \n**Role:** ${role}  \n\n### Character Dossier\n${bio}\n\n`
      });
      noteId = created.id;
      renderSidebar();
    }

    Storage.saveCharacter({
      name,
      archetype,
      faction,
      role,
      bio,
      noteId
    });

    if (codexCharModal) codexCharModal.classList.add('hidden');
    renderCodex();
    toast(`Character "${name}" added to codex`, 'success');
  }

  function openAddRelationshipModal() {
    if (!codexRelModal) return;
    const chars = Storage.getAllCharacters();
    if (chars.length < 2) {
      toast('Add at least two characters to the Codex before connecting relationships.', 'info');
      openAddCharacterModal();
      return;
    }

    codexRelModal.classList.remove('hidden');
    if (codexTutorialModal) codexTutorialModal.classList.add('hidden');

    if (codexRelSource) {
      codexRelSource.innerHTML = chars.map(c => `<option value="${c.id}">${escText(c.name)}</option>`).join('');
      codexRelSource.value = chars[0].id;
    }
    if (codexRelTarget) {
      codexRelTarget.innerHTML = chars.map(c => `<option value="${c.id}">${escText(c.name)}</option>`).join('');
      codexRelTarget.value = chars[1].id;
    }
    if (codexRelDesc) codexRelDesc.value = '';
  }

  function saveRelationshipFromModal() {
    const sourceId = codexRelSource && codexRelSource.value;
    const targetId = codexRelTarget && codexRelTarget.value;
    const type = (codexRelType && codexRelType.value) || 'Allied with';
    const desc = (codexRelDesc && codexRelDesc.value.trim()) || '';

    if (!sourceId || !targetId || sourceId === targetId) {
      toast('Please choose two different characters', 'error');
      return;
    }

    Storage.saveRelationship({
      sourceId,
      targetId,
      type,
      description: desc
    });

    if (codexRelModal) codexRelModal.classList.add('hidden');
    renderCodex();
    toast('Relationship established', 'success');
  }

})();
