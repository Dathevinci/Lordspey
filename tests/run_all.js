const path = require('path');
const { spawnSync } = require('child_process');

console.log('================================================================');
console.log('       LORD SPEY — EXECUTING ALL AUTOMATED TEST SUITES          ');
console.log('================================================================\n');

const testSuites = [
  'verify_all.js',
  'test_suite.js',
  'test_graph.js',
  'test_author_features.js',
  'test_extended_markdown.js',
  'test_android.js',
  'test_intro_animation.js',
  'test_deep_worldbuilding.js',
  'test_spey_project.js',
  'test_settings_suite.js',
  'test_settings_dom.js',
  'test_sample_vault_tutorials.js',
  'test_layout_linked_mentions.js',
  'test_feedback_enhancements.js',
  'test_logo_and_updates.js',
  'test_whats_new_dom.js',
  'test_resize_layout_geometry.js',
  'test_new_note_dropdown_fix.js',
  'test_auto_update_detection.js',
  'test_sample_vault_safety.js',
  'test_map_studio.js',
  'test_github_pages_site.js'
];

let passedCount = 0;
let failedSuites = [];

const startTime = Date.now();

for (let i = 0; i < testSuites.length; i++) {
  const suite = testSuites[i];
  const suitePath = path.join(__dirname, suite);
  console.log(`[${i + 1}/${testSuites.length}] Running ${suite}...`);

  const res = spawnSync(process.execPath, [suitePath], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit'
  });

  if (res.status === 0) {
    passedCount++;
  } else {
    failedSuites.push({ suite, code: res.status });
    console.error(`\n❌ Test suite failed: ${suite} (exit code ${res.status})\n`);
  }
}

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedCount}/${testSuites.length} SUITES PASSED in ${totalDuration}s`);
console.log('================================================================');

if (failedSuites.length > 0) {
  console.error(`\nFAILED SUITES (${failedSuites.length}):`);
  failedSuites.forEach(f => console.error(` - ${f.suite} (code ${f.code})`));
  process.exit(1);
} else {
  console.log('✓ All test suites passed successfully (100%)\n');
  process.exit(0);
}
