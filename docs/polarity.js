/**
 * Polarity score computation for the static (GitHub Pages) site.
 * This is a JavaScript port of top_entities_sorted(), sent_count() and polarity_score()
 * from returnplot.py of the Flask version (tag v1).
 *
 * Works in the browser (window.Polarity) and in Node (require) for tests/test_static_site.js.
 */
(function (root) {
    // Sentiment codes written by scripts/build_static_data.py (3 = malformed value, ignored)
    const SENTIMENTS = ['positive', 'negative', 'neutral'];

    /**
     * Converts a 'YYYY-MM-DD' string into the yyyymmdd integer used in the data file.
     */
    function dateToInt(s) {
        return parseInt(s.replace(/-/g, ''), 10);
    }

    /**
     * Returns the polarity score (-1 to 1) for an entity's sentiment counts.
     */
    function polarityScore(d) {
        const T = d.positive + d.negative + d.neutral;
        return T === 0 ? 0 : (d.positive - d.negative) / T;
    }

    /**
     * Given a media house's data and a date filter, returns its entities with sentiment counts
     * in descending order of their frequency.
     *
     * Args:
     *     org (object): One entry of polarity_data.json's "orgs" list
     *     startInt, endInt (number): Date range (inclusive) as yyyymmdd integers
     *
     * Returns:
     *     list: [{key, label, positive, negative, neutral}, ...]
     */
    function topEntitiesSorted(org, startInt, endInt) {
        // A Map keeps insertion order, like the Python dict, so ties sort the same way
        const counts = new Map();
        for (const row of org.rows) {
            if (row[0] < startInt || row[0] > endInt) continue;

            for (let i = 1; i < row.length; i++) {
                const entity = row[i] >> 2;
                const sentiment = SENTIMENTS[row[i] & 3];
                if (!counts.has(entity)) {
                    counts.set(entity, { key: org.entities[entity], label: org.labels[entity], positive: 0, negative: 0, neutral: 0 });
                }
                if (sentiment) counts.get(entity)[sentiment] += 1;
            }
        }

        const total = (d) => d.positive + d.negative + d.neutral;
        return Array.from(counts.values()).sort((a, b) => total(b) - total(a)); // Array sort is stable
    }

    /**
     * Returns the plot data of one media house in top-to-bottom order.
     *
     * Args:
     *     org (object): One entry of polarity_data.json's "orgs" list
     *     order (string): 'Alphabetic' or 'Frequency'
     *     topEnNo (number): Number of top entities
     *     startDate, endDate (string): Date range (inclusive) in 'YYYY-MM-DD' format
     *
     * Returns:
     *     list: [{key, label, ps, positive, negative, neutral}, ...]
     */
    function getPlotData(org, order, topEnNo, startDate, endDate) {
        const top = topEntitiesSorted(org, dateToInt(startDate), dateToInt(endDate)).slice(0, topEnNo);
        top.forEach((d) => { d.ps = polarityScore(d); });

        if (order === 'Alphabetic') {
            top.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
        }

        return top;
    }

    const Polarity = { dateToInt, polarityScore, topEntitiesSorted, getPlotData };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Polarity;
    } else {
        root.Polarity = Polarity;
    }
})(this);
