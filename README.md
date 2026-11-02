<div align="center">
 <h1> Interective Polarity Score Plot </h1>
  <a href="https://arxiv.org/abs/2407.19498">
    <img align="center" src="https://img.shields.io/badge/arXiv-2407.19498-b31b1b?logo=arxiv&logoColor=white" alt="arXiv" height="26"/>
  </a>
 <!--   <a href="https://arxiv.org/abs/2407.19498"> (Preprint) </a> -->
  <a href="https://github.com/sahajps/FC-Bias">
    <img align="center" src="https://img.shields.io/badge/GitHub-FC--Bias-181717?logo=github&logoColor=white" alt="GitHub" height="26"/>
  </a>
  <!--   <a href="https://github.com/sahajps/FC-Bias"> (Data & Code) </a> -->
</div>


This project is an additional part of the paper "Independent fact-checking organizations exhibit a departure from political neutrality" by Singh et al. (2024). 

In the paper, `Figure 2` shows the extent of neutrality (−1 ≤ P S ≤ 1) for the top-k = 5 most frequent political entities per fact-checking organization. PolitiFact, Snopes, and Check Your Fact are in the USA. Alt News, OpIndia, and Boom are based in India. Polarity Score (PS) establishes “how” the coverage of the political entities in the fake news leads to a positive, negative, or neutral image of the entity, impacting the reader’s perception. A higher neutrality is observed if PS ≈ 0. Meanwhile, a score closer to -1 (1) highlights a more pessimistic/critical (positive/promoting) tone.

## Why This Project?

In the paper, the Propensity Score (PS) is shown only for the top 5 entities and is presented year-wise. However, a reader might be more interested in examining the neutrality of fact-checking media during specific events (e.g., the farmers' protest in India). Researchers often face space constraints in papers, limiting the ability to present various permutations and combinations of figures. Therefore, I came up with the idea to create a tool that allows our readers to explore more.

## Live Website
The tool is hosted on GitHub Pages: https://sahajps.github.io/FC-Bias-Explorer/

It is a static website (`docs/`): the Polarity Scores are computed and the plot is drawn in the browser, so no server is needed. The earlier Flask version of this tool is kept under the tag [v1](https://github.com/sahajps/FC-Bias-Explorer/tree/v1).

## Setup (For user)
1. Clone the repository.
 ```sh
   git clone https://github.com/sahajps/FC-Bias-Explorer
   cd FC-Bias-Explorer
 ```
2. Serve the `docs/` folder:
 ```sh
   python3 -m http.server -d docs 8000
 ```
3. Open `127.0.0.1:8000/` in your web browser. (Opening `docs/index.html` directly as a file does not work as the browser blocks loading the data.)

## Maintenance (For developer)
#### Website (GitHub Pages)
- `docs/` is the website served by GitHub Pages (Settings → Pages → Deploy from a branch → `main` and `/docs`), no build step is needed.
- `docs/polarity.js` computes the Polarity Scores (a JavaScript port of `returnplot.py` from [v1](https://github.com/sahajps/FC-Bias-Explorer/tree/v1)); `docs/script.js` handles the inputs, the key events (dates, texts and photo slideshows) and the plot.
- `docs/data/polarity_data.json` is generated from `data/Topic Sentiment Data/*.json`. Re-generate it whenever that data changes (needs `pandas`):
 ```sh
   pip install -r requirements.txt
   python3 scripts/build_static_data.py
 ```
- Test the Polarity Scores against the cached results (needs Node.js 18+):
 ```sh
   node tests/test_static_site.js
 ```
- More details: [data](https://github.com/sahajps/FC-Bias-Explorer/blob/main/data/README.md), [tests](https://github.com/sahajps/FC-Bias-Explorer/blob/main/tests/README.md) and [photo credits](https://github.com/sahajps/FC-Bias-Explorer/blob/main/docs/img/photos/README.md).

## Cite
If you find the website or data useful (this or root github for paper), do cite!! This must ring a bell. 🔔
```sh
   @article{singh2024independent,
      title={Independent fact-checking organizations exhibit a departure from political neutrality},
      author={Singh, Sahajpreet and Masud, Sarah and Chakraborty, Tanmoy},
      journal={arXiv preprint arXiv:2407.19498},
      year={2024}
   }
```
