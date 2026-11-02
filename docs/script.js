document.addEventListener('DOMContentLoaded', (event) => {
    // Bar colors of Figure 2 of the paper (one pair per country), the opacity is the |polarity score|
    const COLORS = {
        USA: { positive: '0, 100, 0', negative: '181, 72, 128' },
        India: { positive: '0, 0, 255', negative: '255, 0, 0' }
    };
    const FLAGS = { USA: 'img/flag-us.svg', India: 'img/flag-in.svg' };
    const COUNTRY_NAMES = { USA: 'United States', India: 'India' };
    const DEFAULT_START = '2018-01-01';
    const DEFAULT_END = '2023-12-31';

    // Background photos of the hero, all freely licensed on Wikimedia Commons (credits are shown in the hero and the README)
    const CC_BY_SA_4 = ['CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0'];
    const CC_BY_SA_3 = ['CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0'];
    const CC_BY_SA_2 = ['CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0'];
    const CC_BY_4 = ['CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0'];
    const CC_BY_2 = ['CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0'];
    const CC0 = ['CC0', 'https://creativecommons.org/publicdomain/zero/1.0'];
    const PUBLIC_DOMAIN = ['Public domain', null];
    const PHOTOS = {
        usCapitolDusk: { src: 'img/photos/us-capitol-dusk.jpg', caption: 'US Capitol at dusk', author: 'Architect of the Capitol', license: PUBLIC_DOMAIN, page: 'https://commons.wikimedia.org/wiki/File:Capitol_at_Dusk_View_from_Library_of_Congress_Jefferson_Building_(14144445175).jpg' },
        inParliamentDawn: { src: 'img/photos/in-parliament-dawn.jpg', caption: 'Sansad Bhavan at dawn', author: 'Daderot', license: PUBLIC_DOMAIN, page: 'https://commons.wikimedia.org/wiki/File:Sansad_Bhavan_IMG_2152.JPG' },
        usCapitolWest: { src: 'img/photos/us-capitol-west.jpg', caption: 'US Capitol, west front', author: 'Architect of the Capitol', license: PUBLIC_DOMAIN, page: 'https://commons.wikimedia.org/wiki/File:United_States_Capitol_-_west_front.jpg' },
        inSansad: { src: 'img/photos/in-sansad.jpg', caption: 'Sansad Bhavan', author: 'David Castor', license: PUBLIC_DOMAIN, page: 'https://commons.wikimedia.org/wiki/File:Sansad_Bhavan-1.jpg' },
        usCapitolDuskEast: { src: 'img/photos/us-capitol-dusk-east.jpg', caption: 'US Capitol, east side, at dusk', author: 'Rhododendrites', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:Capitol_at_dusk_(87785p)2.jpg' },
        inSansadVijayChowk: { src: 'img/photos/in-sansad-vijay-chowk.jpg', caption: 'Sansad Bhavan from Vijay Chowk', author: 'Nikhilb239', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:Sansad_Bhavan,_New_Delhi.jpg' },
        usCapitolDusk2: { src: 'img/photos/us-capitol-dusk-2.jpg', caption: 'US Capitol at dusk', author: 'Martin Falbisoner', license: CC_BY_SA_3, page: 'https://commons.wikimedia.org/wiki/File:Capitol_at_Dusk.JPG' },
        inElectionQueue: { src: 'img/photos/in-election-2019-queue.jpg', caption: 'Voters in a queue, Jaydev constituency, Odisha', author: 'Soumendra Kumar Sahoo', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:2019_elections_in_Jaydev_constituency,_Odisha.jpg' },
        inElectionBooth: { src: 'img/photos/in-election-2019-booth.jpg', caption: 'Voters at a polling booth, Jaydev constituency, Odisha', author: 'Soumendra Kumar Sahoo', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:2019_election_in_Jaydev_constituency,_Odisha.jpg' },
        inCaaShaheenWomen: { src: 'img/photos/in-caa-shaheen-women.jpg', caption: 'Women at the Shaheen Bagh sit-in', author: 'DiplomatTesterMan', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:Ladies_of_Shaheen_Bagh.jpg' },
        inCaaJamiaPolice: { src: 'img/photos/in-caa-jamia-police.jpg', caption: 'Jamia students stopped by the police, 15 Dec 2019', author: 'DiplomatTesterMan', license: CC_BY_SA_4, cropped: true, page: 'https://commons.wikimedia.org/wiki/File:JMI_students_stopped_by_police_from_proceeding_any_further_during_a_CAB_protest.jpg' },
        inCaaJamiaLibrary: { src: 'img/photos/in-caa-jamia-library.jpg', caption: 'Jamia library after the police entered it on 15 Dec 2019', author: 'Hghulam49', license: CC_BY_4, page: 'https://commons.wikimedia.org/wiki/File:Attack_on_JMI%27s_Library_-_Chairs_and_Books_scattered_in_reading_hall_03.jpg' },
        inCaaDelhiRiots: { src: 'img/photos/in-caa-delhi-riots.jpg', position: 'center 70%', caption: 'Burnt cars in Shiv Vihar after the North East Delhi riots of Feb 2020', author: 'Banswalhemant', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:Delhi_Riots_2020_(1).jpg' },
        usFloydMarch: { src: 'img/photos/us-floyd-march.jpg', caption: 'Black Lives Matter march, Summit, New Jersey', author: 'Tomwsulcer', license: CC0, page: 'https://commons.wikimedia.org/wiki/File:Protest_march_Summit_New_Jersey_Black_Lives_Matter_June_2_2020_1_of_12.jpg' },
        usFloydMemorial: { src: 'img/photos/us-floyd-memorial.jpg', caption: 'George Floyd Memorial, Minneapolis', author: 'Chad Davis', license: CC_BY_2, page: 'https://commons.wikimedia.org/wiki/File:George_Floyd_Memorial,_South_Minneapolis_(49974111851).jpg' },
        usFloydBlmPlaza: { src: 'img/photos/us-floyd-blm-plaza.jpg', caption: 'Black Lives Matter Plaza, Washington, DC', author: 'Ted Eytan', license: CC_BY_SA_2, page: 'https://commons.wikimedia.org/wiki/File:2020.06.09_Black_Lives_Matter_Plaza,_Washington,_DC_USA_161_36014.jpg' },
        usFloydDesMoines: { src: 'img/photos/us-floyd-des-moines.jpg', caption: 'Peaceful protest in Des Moines', author: 'Phil Roeder', license: CC_BY_2, page: 'https://commons.wikimedia.org/wiki/File:Big_Crowd,_Peaceful_Protest_in_Des_Moines_-_49965779466.jpg' },
        usVoteLine2020: { src: 'img/photos/us-2020-vote-line.jpg', caption: 'In line to vote, New Orleans', author: 'Bart Everson', license: CC_BY_2, cropped: true, page: 'https://commons.wikimedia.org/wiki/File:In_Line_to_Vote-_Inside_-_New_Orleans_2020-10-21.jpg' },
        usDropBoxFlag: { src: 'img/photos/us-2020-drop-box.jpg', caption: 'Ballot drop box, Anacortes, Washington', author: 'Cliffordsnow', license: CC_BY_SA_4, cropped: true, page: 'https://commons.wikimedia.org/wiki/File:Ballot_Drop_Box.jpg' },
        usDropBoxOfficial: { src: 'img/photos/us-2020-drop-box-official.jpg', caption: 'Official ballot drop box, Manassas, Virginia', author: 'Bryan Alexander', license: CC_BY_2, cropped: true, page: 'https://commons.wikimedia.org/wiki/File:Voting_box_2020_(50563402257).jpg' },
        inFarmersWaterCannon: { src: 'img/photos/in-farmers-water-cannon.jpg', caption: 'Police water cannon at a roadblock near Sangrur, 26 Nov 2020', author: 'Randeep Maddoke', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:2020_Indian_farmers%27_protest_-_Roadblock.jpg' },
        inFarmersPolice: { src: 'img/photos/in-farmers-police.jpg', caption: 'Police lines, 26 Nov 2020', author: 'Randeep Maddoke', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:2020_Indian_farmers%27_protest_-_behind_the_police.jpg' },
        inFarmersLangar: { src: 'img/photos/in-farmers-langar.jpg', caption: 'Langar: women making rotis for the protesters', author: 'Ravan Khosa', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:Women_making_rotis_for_langar_at_the_Indian_Farmers%27_Protest.jpg' },
        inFarmersRepublicDay: { src: 'img/photos/in-farmers-republic-day.jpg', filter: 'grayscale(0.3) contrast(1.5) brightness(0.85)', caption: 'Republic Day 2021: clashes at Nangloi, Delhi', author: 'Akshit Sharma', license: CC_BY_SA_4, page: 'https://commons.wikimedia.org/wiki/File:Farmers_Republic_Day_2.jpg' },
        usCapitolDome: { src: 'img/photos/us-capitol-dome.jpg', caption: 'US Capitol dome', author: 'Amandareis95', license: CC_BY_SA_4, cropped: true, page: 'https://commons.wikimedia.org/wiki/File:The_United_States_Capitol_in_Washington_D.C.jpg' },
        usCapitolNight: { src: 'img/photos/us-capitol-night.jpg', caption: 'US Capitol at night', author: 'peakfocus.agency', license: CC_BY_4, page: 'https://commons.wikimedia.org/wiki/File:The_dome_of_the_United_States_Capitol_building.jpg' },
        inSansad2: { src: 'img/photos/in-sansad-2.jpg', caption: 'Sansad Bhavan', author: 'David Castor', license: PUBLIC_DOMAIN, page: 'https://commons.wikimedia.org/wiki/File:Sansad_Bhavan-2.jpg' },
        usVoting2022: { src: 'img/photos/us-2022-voting.jpg', caption: 'Voting on Election Day, Des Moines', author: 'Phil Roeder', license: CC_BY_2, page: 'https://commons.wikimedia.org/wiki/File:Election_Day_2022_(52487248620).jpg' },
        usBooths2022: { src: 'img/photos/us-2022-booths.jpg', caption: 'Voting booths, Des Moines', author: 'Phil Roeder', license: CC_BY_2, page: 'https://commons.wikimedia.org/wiki/File:Election_Day_2022_(52486778706).jpg' },
        usBoothChild2022: { src: 'img/photos/us-2022-booth-child.jpg', caption: 'Voting with a child, Des Moines', author: 'Phil Roeder', license: CC_BY_2, page: 'https://commons.wikimedia.org/wiki/File:Election_Day_2022_(52487247690).jpg' },
        usVoters2022: { src: 'img/photos/us-2022-voters.jpg', caption: 'Voters at a polling place, Des Moines', author: 'Phil Roeder', license: CC_BY_2, page: 'https://commons.wikimedia.org/wiki/File:Election_Day_2022_(52487060769).jpg' }
    };

    // Shortcuts for the date range: major political events of both countries (in chronological order).
    // Each one has its own hero look: theme (colors in style.css), a slideshow of background photos, title and lead text.
    // The first entry is the default look, also used for any custom date range.
    const EVENTS = [
        {
            label: 'All years', start: DEFAULT_START, end: DEFAULT_END, theme: 'all', slides: [[PHOTOS.usCapitolDusk, PHOTOS.inParliamentDawn], [PHOTOS.usCapitolWest, PHOTOS.inSansad], [PHOTOS.usCapitolDuskEast, PHOTOS.inSansadVijayChowk], [PHOTOS.usCapitolNight, PHOTOS.inSansad2]]
            // title, lead and eyebrow are read from index.html
        },
        {
            label: 'Midterms 2018', country: 'USA', start: '2018-08-01', end: '2018-11-30', note: 'election on 6 Nov 2018',
            theme: 'us-congress', slides: [[PHOTOS.usCapitolWest], [PHOTOS.usCapitolDusk2], [PHOTOS.usCapitolDome], [PHOTOS.usCapitolNight]], title: 'US Midterm Elections 2018',
            lead: 'On 6 November 2018, Americans elected all 435 members of the House of Representatives and 35 senators. See how each fact-checker portrayed the parties and politicians around the campaign.'
        },
        {
            label: 'Election 2019', country: 'India', start: '2019-03-10', end: '2019-05-23', note: 'Lok Sabha general election, from the announcement to the results',
            theme: 'in-election', slides: [[PHOTOS.inElectionQueue], [PHOTOS.inElectionBooth], [PHOTOS.inSansadVijayChowk], [PHOTOS.inSansad2]], title: 'Indian General Election 2019',
            lead: 'Around 900 million eligible voters elected the 17th Lok Sabha in seven phases between 11 April and 19 May 2019. See how each fact-checker portrayed the parties and leaders around the campaign.'
        },
        {
            label: 'CAA Protests', country: 'India', start: '2019-12-11', end: '2020-03-24', note: 'from the passing of the Act to the COVID-19 lockdown',
            theme: 'in-caa', slides: [[PHOTOS.inCaaShaheenWomen], [PHOTOS.inCaaJamiaPolice], [PHOTOS.inCaaJamiaLibrary], [PHOTOS.inCaaDelhiRiots]], title: 'Citizenship (Amendment) Act Protests',
            lead: 'Protests and counter-rallies spread across India after the Citizenship (Amendment) Act was passed in December 2019, including a sit-in led by women at Shaheen Bagh, Delhi, that lasted over three months. Riots in North East Delhi in February 2020 left 53 people dead.'
        },
        {
            label: 'George Floyd Protests', country: 'USA', start: '2020-05-26', end: '2020-07-31', note: 'from the first protests to the end of July',
            theme: 'us-protest', slides: [[PHOTOS.usFloydMarch], [PHOTOS.usFloydMemorial], [PHOTOS.usFloydBlmPlaza], [PHOTOS.usFloydDesMoines]], title: 'George Floyd Protests 2020',
            lead: 'After George Floyd was killed by a Minneapolis police officer on 25 May 2020, protests against police brutality and racism spread across the United States. See how each fact-checker portrayed the political entities involved.'
        },
        {
            label: 'Election 2020', country: 'USA', start: '2020-08-17', end: '2021-01-20', note: 'presidential election, from the party conventions to the inauguration',
            theme: 'us-presidential', slides: [[PHOTOS.usVoteLine2020], [PHOTOS.usDropBoxFlag], [PHOTOS.usDropBoxOfficial], [PHOTOS.usCapitolDuskEast]], title: 'US Presidential Election 2020',
            lead: 'Americans voted for their president on 3 November 2020, with record turnout during the COVID-19 pandemic, and rioters stormed the US Capitol on 6 January 2021 as Congress met to certify the result. See how each fact-checker portrayed the candidates and parties.'
        },
        {
            label: "Farmers' Protest", country: 'India', start: '2020-11-26', end: '2021-12-11', note: "from the 'Delhi Chalo' march to the end of the protest",
            theme: 'in-farmers', slides: [[PHOTOS.inFarmersWaterCannon], [PHOTOS.inFarmersLangar], [PHOTOS.inFarmersPolice], [PHOTOS.inFarmersRepublicDay]], title: 'Farmers’ Protest 2020–\u206021', // word joiner: no line break inside 2020–21
            lead: "Farmers, mainly from Punjab, Haryana and Uttar Pradesh, faced water cannons on their march to Delhi and camped at its borders for over a year against three farm laws. Their Republic Day 2021 tractor parade ended in clashes with the police, and Parliament repealed the laws in November 2021."
        },
        {
            label: 'Midterms 2022', country: 'USA', start: '2022-08-01', end: '2022-11-30', note: 'election on 8 Nov 2022',
            theme: 'us-congress', slides: [[PHOTOS.usBooths2022], [PHOTOS.usBoothChild2022], [PHOTOS.usVoting2022], [PHOTOS.usVoters2022]], title: 'US Midterm Elections 2022',
            lead: 'On 8 November 2022, Americans elected all 435 members of the House of Representatives and 35 senators. See how each fact-checker portrayed the parties and politicians around the campaign.'
        }
    ];
    EVENTS[0].title = document.getElementById('hero-title').innerHTML;
    EVENTS[0].lead = document.getElementById('hero-lead').textContent;
    EVENTS[0].eyebrow = document.getElementById('hero-eyebrow').innerHTML;

    // Plot styling
    const INK = '#1d2433';
    const MUTED = '#5b6475';
    const LINE = '#d5dae3';
    const GRID = '#edf0f5';

    let orgs = [];

    function barColors(values, country) {
        return values.map((v) => (v > 0
            ? `rgba(${COLORS[country].positive}, ${v})`
            : `rgba(${COLORS[country].negative}, ${Math.abs(v)})`));
    }

    function formatDate(s) {
        return new Date(s + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    /**
     * Draws the six stacked bar charts (one per organization), like Figure 2 of the paper
     */
    function drawPlot(plotData, topEnNo) {
        const narrow = document.getElementById('plot').clientWidth < 600;
        const panelHeight = topEnNo * 22 + 16;
        const gap = 30; // Includes the space for the organization name above each panel
        const countryGap = 50; // Extra space between the USA and India organizations
        const margin = { l: narrow ? 130 : 190, r: 12, t: 24, b: 52 };

        const gaps = orgs.slice(0, -1).map((org, i) => (org.country !== orgs[i + 1].country ? countryGap : gap));
        const plotHeight = orgs.length * panelHeight + gaps.reduce((a, b) => a + b, 0);

        const traces = [];
        const layout = {
            height: plotHeight + margin.t + margin.b,
            margin: margin,
            font: { family: 'Inter, Arial, sans-serif', size: narrow ? 11 : 13, color: INK },
            paper_bgcolor: '#fff',
            plot_bgcolor: '#fff',
            showlegend: false,
            hovermode: 'closest',
            hoverlabel: { bgcolor: '#fff', bordercolor: LINE, font: { family: 'Inter, Arial, sans-serif', size: 13, color: INK } },
            annotations: []
        };

        let top = plotHeight;
        orgs.forEach((org, i) => {
            const n = i + 1;
            const xName = n === 1 ? 'x' : 'x' + n;
            const yName = n === 1 ? 'y' : 'y' + n;
            const isLast = n === orgs.length;

            // Reversed so the first entity is drawn at the top
            const data = plotData[i].slice().reverse();
            const values = data.map((d) => d.ps);

            traces.push({
                type: 'bar',
                orientation: 'h',
                x: values,
                y: data.map((d, j) => j),
                width: 0.72,
                xaxis: xName,
                yaxis: yName,
                marker: { color: barColors(values, org.country), cornerradius: 3 },
                customdata: data.map((d) => [d.label, d.positive, d.negative, d.neutral]),
                hovertemplate: '<b>%{customdata[0]}</b> · ' + org.name + '<br>Polarity Score: <b>%{x:.2f}</b><br>'
                    + 'Positive: %{customdata[1]} · Negative: %{customdata[2]} · Neutral: %{customdata[3]}'
                    + '<extra></extra>'
            });

            const bottom = top - panelHeight;
            layout[(n === 1 ? 'xaxis' : 'xaxis' + n)] = {
                anchor: yName,
                matches: n === 1 ? undefined : 'x',
                range: [-1.05, 1.05],
                tickvals: [-1, -0.5, 0, 0.5, 1],
                ticktext: ['−1', '−0.5', '0', '0.5', '1'],
                tickfont: { color: MUTED },
                showticklabels: isLast,
                title: isLast ? { text: 'Polarity Score', font: { size: 13, color: MUTED }, standoff: 8 } : undefined,
                showgrid: true, gridcolor: GRID,
                zeroline: true, zerolinecolor: INK, zerolinewidth: 1,
                showline: true, mirror: true, linecolor: LINE,
                fixedrange: true
            };
            layout[(n === 1 ? 'yaxis' : 'yaxis' + n)] = {
                domain: [bottom / plotHeight, top / plotHeight],
                anchor: xName,
                range: [-0.6, Math.max(data.length, 1) - 0.4],
                tickvals: data.map((d, j) => j),
                ticktext: data.map((d) => d.label),
                ticks: 'outside', ticklen: 6, tickcolor: 'rgba(0, 0, 0, 0)',
                showgrid: false,
                zeroline: false,
                showline: true, mirror: true, linecolor: LINE,
                automargin: false,
                fixedrange: true
            };
            top = bottom - (gaps[i] || 0);

            layout.annotations.push({
                text: '<b>' + org.name + '</b>',
                xref: xName + ' domain', yref: yName + ' domain', x: 0, y: 1, yshift: 2,
                xanchor: 'left', yanchor: 'bottom', showarrow: false,
                font: { size: 13, color: INK }
            });
            if (data.length === 0) {
                layout.annotations.push({
                    text: 'No articles in this date range',
                    xref: xName + ' domain', yref: yName + ' domain', x: 0.5, y: 0.5,
                    showarrow: false, font: { size: 12, color: MUTED }
                });
            }
        });

        Plotly.react('plot', traces, layout, {
            responsive: true,
            displaylogo: false,
            modeBarButtons: [['toImage']],
            toImageButtonOptions: { filename: 'fc-polarity-score', scale: 2 }
        });
    }

    /**
     * Lists the plotted values in a table, so they can be read without hovering
     */
    function drawTable(plotData) {
        let html = '<table><thead><tr><th>Entity</th><th class="num">Polarity Score</th><th class="num">Positive</th>'
            + '<th class="num">Negative</th><th class="num">Neutral</th><th class="num">Mentions</th></tr></thead><tbody>';
        orgs.forEach((org, i) => {
            html += `<tr class="org-row"><td colspan="6"><img src="${FLAGS[org.country]}" class="flag" alt="">${escapeHtml(org.name)}</td></tr>`;
            if (plotData[i].length === 0) {
                html += '<tr><td colspan="6">No articles in this date range</td></tr>';
            }
            plotData[i].forEach((d) => {
                html += `<tr><td>${escapeHtml(d.label)}</td><td class="num">${d.ps.toFixed(2)}</td><td class="num">${d.positive}</td>`
                    + `<td class="num">${d.negative}</td><td class="num">${d.neutral}</td><td class="num">${d.positive + d.negative + d.neutral}</td></tr>`;
            });
        });
        document.getElementById('plot-table').innerHTML = html + '</tbody></table>';
    }

    function drawEventChips() {
        const chips = document.getElementById('event-chips');
        EVENTS.forEach((ev) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'event-chip';
            chip.title = formatDate(ev.start) + ' – ' + formatDate(ev.end) + (ev.note ? ' (' + ev.note + ')' : '');
            chip.innerHTML = (ev.country ? `<img src="${FLAGS[ev.country]}" class="flag" alt="">` : '') + escapeHtml(ev.label);
            const preload = () => ev.slides[0].forEach((photo) => { new Image().src = photo.src; });
            chip.addEventListener('pointerenter', preload, { once: true });
            chip.addEventListener('focus', preload, { once: true });
            chip.addEventListener('click', () => {
                $('#start-date-input').val(ev.start);
                $('#end-date-input').val(ev.end);
                requestPlotUpdate();
            });
            ev.chip = chip;
            chips.appendChild(chip);
        });
    }

    let heroEvent = EVENTS[0];
    let slideIndex = 0;
    let slideTimer = null;
    const SLIDE_SECONDS = 7;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Changes the hero (colors, slideshow, title and text) and the header line to the given key event, or to the default look
     */
    function applyTheme(ev) {
        ev = ev || EVENTS[0];
        if (ev === heroEvent) return;
        heroEvent = ev;
        document.body.dataset.theme = ev.theme;
        document.body.dataset.country = ev.country || 'both';

        // Fade the text out, swap it once the first photo of the event is loaded, and fade it back in (the photos crossfade)
        $('.hero-swap, #hero-eyebrow').addClass('fading');
        const firstSlide = buildSlide(ev.slides[0]);
        Promise.all([slideLoaded(firstSlide), new Promise((resolve) => setTimeout(resolve, 250))]).then(() => {
            if (heroEvent !== ev) return; // Another event was picked meanwhile
            $('#hero-eyebrow').html(ev.eyebrow || `<span class="nowrap"><img src="${FLAGS[ev.country]}" class="flag" alt=""> ${COUNTRY_NAMES[ev.country]}</span>`
                + `<span class="sep">&middot;</span><span class="nowrap">${formatDate(ev.start)} &ndash; ${formatDate(ev.end)}</span>`);
            if (ev.eyebrow) $('#hero-title').html(ev.title); else $('#hero-title').text(ev.title);
            $('#hero-lead').text(ev.lead);
            drawDots();
            showSlide(0, firstSlide);
            $('.hero-swap, #hero-eyebrow').removeClass('fading');
        });
    }

    function photoElement(photo) {
        const img = new Image();
        img.src = photo.src;
        img.alt = '';
        if (photo.position) img.style.objectPosition = photo.position;
        if (photo.filter) img.style.filter = photo.filter; // e.g. more contrast for a hazy photo
        return img;
    }

    function buildSlide(photos) {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        photos.forEach((photo) => slide.appendChild(photoElement(photo)));
        return slide;
    }

    function slideLoaded(slide) {
        return Promise.all([...slide.querySelectorAll('img')].map((img) => img.decode().catch(() => {})));
    }

    /**
     * Crossfades to slide i of the current event (the slide element can be built and loaded beforehand)
     */
    function showSlide(i, slide) {
        const ev = heroEvent;
        slide = slide || buildSlide(ev.slides[i]);
        slideLoaded(slide).then(() => {
            if (heroEvent !== ev) return;
            slideIndex = i;
            const container = document.getElementById('hero-photo');
            const old = [...container.querySelectorAll('.hero-slide')].filter((el) => el !== slide);
            container.appendChild(slide);
            slide.getBoundingClientRect(); // Starts the opacity transition from 0
            slide.classList.add('active');
            old.forEach((el) => {
                el.classList.remove('active');
                setTimeout(() => el.remove(), 1300);
            });
            const credit = $('#hero-credit').addClass('fading');
            setTimeout(() => {
                if (heroEvent === ev && slideIndex === i) credit.html(photoCredits(ev.slides[i])).removeClass('fading');
            }, 600);
            document.querySelectorAll('#hero-dots button').forEach((dot, j) => { dot.classList.toggle('active', j === i); });
            ev.slides[(i + 1) % ev.slides.length].forEach((photo) => { new Image().src = photo.src; }); // Preloads the next slide
            restartSlideshow();
        });
    }

    function restartSlideshow() {
        clearTimeout(slideTimer);
        if (reducedMotion || document.hidden || heroEvent.slides.length < 2) return;
        slideTimer = setTimeout(() => showSlide((slideIndex + 1) % heroEvent.slides.length), SLIDE_SECONDS * 1000);
    }

    function drawDots() {
        const dots = document.getElementById('hero-dots');
        dots.innerHTML = '';
        if (heroEvent.slides.length < 2) return;
        heroEvent.slides.forEach((slide, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Photo ${i + 1} of ${heroEvent.slides.length}`);
            dot.addEventListener('click', () => { if (i !== slideIndex) showSlide(i); });
            dots.appendChild(dot);
        });
    }

    function photoCredits(photos) {
        const caption = photos.length === 1 ? `<span class="hero-caption">${escapeHtml(photos[0].caption)}</span> · ` : '';
        return caption + (photos.length > 1 ? 'Photos: ' : 'Photo: ') + photos.map((photo) => {
            const [license, licenseUrl] = photo.license;
            return `<a href="${photo.page}" target="_blank">${escapeHtml(photo.author)}</a>${photo.cropped ? ' (cropped)' : ''}, `
                + (licenseUrl ? `<a href="${licenseUrl}" target="_blank">${license}</a>` : license.toLowerCase());
        }).join(' · ');
    }

    // The slideshow waits while the page is not visible
    document.addEventListener('visibilitychange', restartSlideshow);

    function requestPlotUpdate() {
        let orderInput = document.getElementById('order-input').value;
        let integerInput = parseInt(document.getElementById('integer-input').value, 10);
        let startDateInput = document.getElementById('start-date-input').value;
        let endDateInput = document.getElementById('end-date-input').value;

        if (!startDateInput || !endDateInput || new Date(startDateInput) > new Date(endDateInput)) {
            $('#error-message').text('Resetting date range to default as start date must be less than end date.').show();
            $('#start-date-input').val(DEFAULT_START);
            $('#end-date-input').val(DEFAULT_END);
            startDateInput = DEFAULT_START;
            endDateInput = DEFAULT_END;
        } else {
            $('#error-message').hide();
        }

        const selected = EVENTS.find((ev) => ev.start === startDateInput && ev.end === endDateInput);
        EVENTS.forEach((ev) => ev.chip.classList.toggle('active', ev === selected));
        applyTheme(selected);

        $('#plot-title').text('Polarity Score of the top ' + integerInput + ' most frequent political entities');
        $('#plot-subtitle').text((selected && selected.country ? selected.title + ' · ' : '')
            + formatDate(startDateInput) + ' – ' + formatDate(endDateInput) + ' · ' + orderInput + ' order');

        const plotData = orgs.map((org) => Polarity.getPlotData(org, orderInput, integerInput, startDateInput, endDateInput));
        drawPlot(plotData, integerInput);
        drawTable(plotData);
    }

    // The data is loaded once, after that every plot update happens in the browser
    fetch('data/polarity_data.json')
        .then((response) => {
            if (!response.ok) throw new Error(response.status + ' ' + response.statusText);
            return response.json();
        })
        .then((json) => {
            orgs = json.orgs;
            $('#loading-message').hide();
            drawEventChips();
            drawDots();
            showSlide(0, document.querySelector('#hero-photo .hero-slide'));

            // Initial plot update
            requestPlotUpdate();

            document.getElementById('order-input').addEventListener('change', requestPlotUpdate);
            document.getElementById('integer-input').addEventListener('change', requestPlotUpdate);
            document.getElementById('start-date-input').addEventListener('change', requestPlotUpdate);
            document.getElementById('end-date-input').addEventListener('change', requestPlotUpdate);

            // Redraw on resize, as the label space and font size depend on the width
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(requestPlotUpdate, 200);
            });
        })
        .catch((error) => {
            $('#loading-message').hide();
            $('#error-message').text('Could not load the data (' + error.message + '). If you opened this file directly, serve the docs/ folder over HTTP instead.').show();
        });
});
