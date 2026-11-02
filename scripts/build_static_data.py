"""
Builds docs/data/polarity_data.json, the compact data file used by the static (GitHub Pages) site.

Usage (from the repo root):
    python3 scripts/build_static_data.py

Re-run it whenever the files in data/Topic Sentiment Data/ change.
"""
import json
from datetime import datetime
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / 'data' / 'Topic Sentiment Data'
OUT_FILE = ROOT / 'docs' / 'data' / 'polarity_data.json'

# Organizations in plot order (first three are from the USA, the rest from India)
map_org_name = {'checkyourfact': 'Check Your Fact', 'politifact': 'PolitiFact', 'snopes': 'Snopes', 'altnews': 'Alt News', 'boomlive': 'Boom', 'opindia': 'OpIndia'}
org_names = list(map_org_name)

# Any other (malformed) sentiment value gets code 3: the entity still counts as present but
# the sentiment is ignored, exactly like sent_count() in returnplot.py of v1
SENTIMENT_CODES = {'positive': 0, 'negative': 1, 'neutral': 2}


def map_en_name(s):
    """
    Returns the entity in display form (as map_en_name() in returnplot.py of v1), eg.: narendra modi: Narendra Modi and aap: AAP
    """
    if(s in ['bjp', 'aap', 'tmc', 'goi', 'rss']):
        return s.upper()

    return s.title()


def build_org(f):
    """
    Returns the compact data of one media house.

    Args:
        f (str): Media house name

    Returns:
        dic: {
            key, name, country,
            entities: raw entity names (in order of first appearance),
            labels: entity names in display form,
            rows: one list per article [yyyymmdd, code, code, ...] where code = entity_index*4 + sentiment_code
        }
    """
    df = pd.read_json(SRC_DIR / (f + '.json'))

    entities = []
    entity_index = {}
    rows = []
    # Articles are kept in the order pandas reads them (as the v1 Flask app did), so ties in
    # frequency are broken the same way in the browser
    for day, month, year, dic in zip(df.date_day, df.date_month, df.date_year, df.sentiments):
        if not dic:
            continue

        date_obj = datetime.strptime(f"{day} {month} {year}", '%d %B %Y')
        row = [int(date_obj.strftime('%Y%m%d'))]
        for k in dic:
            if k not in entity_index:
                entity_index[k] = len(entities)
                entities.append(k)
            row.append(entity_index[k] * 4 + SENTIMENT_CODES.get(dic[k], 3))
        rows.append(row)

    return {
        'key': f,
        'name': map_org_name[f],
        'country': 'USA' if f in org_names[:3] else 'India',
        'entities': entities,
        'labels': [map_en_name(k) for k in entities],
        'rows': rows,
    }


def main():
    data = {'orgs': [build_org(f) for f in org_names]}

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_FILE, 'w', encoding='utf-8') as out:
        json.dump(data, out, ensure_ascii=False, separators=(',', ':'))

    for org in data['orgs']:
        print(f"{org['name']}: {len(org['rows'])} articles, {len(org['entities'])} entities")
    print(f"Written {OUT_FILE.relative_to(ROOT)} ({OUT_FILE.stat().st_size / 1024:.0f} KB)")


if __name__ == '__main__':
    main()
