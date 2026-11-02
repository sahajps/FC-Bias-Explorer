/**
 * Verifies the static site's JavaScript port (docs/polarity.js) against the cached results in data/Test Case(s)
 * (date-range: Jan 1st, 2018 To Dec 31st, 2023, top-entities: 5, order: Frequency-based)
 *
 * Run from the repo root: node tests/test_static_site.js
 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const Polarity = require(path.join(ROOT, 'docs', 'polarity.js'));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'data', 'polarity_data.json'), 'utf-8'));

for (const org of data.orgs) {
    test('plot data of ' + org.key + ' matches the cached test case', () => {
        const cached = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'Test Case(s)', org.key + '.json'), 'utf-8'));
        const plotData = Polarity.getPlotData(org, 'Frequency', 5, '2018-01-01', '2023-12-31');

        assert.deepStrictEqual(plotData.map((d) => d.key), Object.keys(cached));
        for (const d of plotData) {
            // Cached results are round-off to two decimal places !!
            assert.ok(Math.abs(d.ps - cached[d.key]) <= 0.005 + 1e-9, `${d.key}: ${d.ps} vs cached ${cached[d.key]}`);
        }
    });
}
