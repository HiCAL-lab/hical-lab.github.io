# HiCAL — High-Speed Computational Aerodynamics Laboratory

Personalized GitHub Pages site for **HiCAL**, led by **Anirudh Lakshmi Narasimha Prasad**, Assistant Professor in Mechanical & Aerospace Engineering at the University of Colorado Colorado Springs (UCCS).

The site is intentionally **zero-build and zero-framework**: GitHub Pages can serve it directly and routine updates happen in one file.

## Publish on GitHub Pages

1. Create a GitHub account or organization for the lab.
2. Create a **public** repository.
   - For `https://hical-lab.github.io`, create the organization/user `hical-lab` and repository `hical-lab.github.io`.
   - Any repository name also works; GitHub will serve it as a project Pages site.
3. Upload every file in this folder to the repository root.
4. Open **Settings → Pages → Build and deployment**.
5. Choose **Deploy from a branch**, then **main** and **/(root)**.
6. Save. GitHub will show the live address after deployment.

## Routine updates: edit only `site-data.js`

`site-data.js` contains:

- lab statement and affiliation
- Google Scholar / contact links
- four research themes
- selected projects and figure credits
- people
- recent publications
- computation / open-research cards
- recruitment text

You can edit the file directly in GitHub's browser interface. Commit the change and Pages republishes automatically.

## Add your own CFD figure

For the most robust site, put figures you control directly in `assets/` rather than relying on publisher-hosted image URLs.

Example:

1. Export an image as `assets/sbli.jpg`.
2. In the relevant project in `site-data.js` set:

```js
image: "assets/sbli.jpg",
credit: "Prasad et al., paper / conference / year"
```

## Current publication figures

The starter uses representative figures from open-access *Journal of Fluid Mechanics* papers and shows attribution on-image. The corresponding JFM articles are distributed under **CC BY 4.0**, which permits reuse with attribution.

AIAA and other publisher papers are linked from the site, but their figures have not been copied into the package where reuse permission was not clear. If you own the author-generated source figures and have permission to publish them on your lab site, place those files in `assets/` and update the project image paths.

## Add a portrait

Put a portrait in `assets/`, e.g. `assets/anirudh-prasad.jpg`, and change the PI entry in `site-data.js`:

```js
image: "assets/anirudh-prasad.jpg"
```

Without a portrait, the site intentionally uses a CFD-styled `ALNP` monogram.

## Add an email or CV

In `site-data.js`:

```js
email: "your.address@uccs.edu",
cv: "assets/prasad-cv.pdf",
```

If either value is blank, its button is automatically hidden.

## Custom university URL

If UCCS provides a subdomain such as `hical.uccs.edu`, add it in **GitHub → Settings → Pages → Custom domain**, then ask UCCS IT to point the required DNS record to the GitHub Pages site.

## Local preview

From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
