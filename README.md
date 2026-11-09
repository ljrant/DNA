# DNA Builder Lab

An interactive, browser-based molecular biology learning game for constructing DNA from phosphate, sugar, and nitrogenous base components. This first playable release includes a drag-and-drop molecular bench, nucleotide assembly, strand construction, complementary pairing, a rotatable B-DNA visualization, and challenges.

## Run locally

Requires **Node.js 20+**, but no third-party dependencies or build tooling.

```bash
npm run dev
```

Open [http://localhost:4173](http://localhost:4173) in a modern browser.

Run the biological-rule tests with:

```bash
npm test
```

The site consists of static files (`index.html`, `styles.css`, `app.mjs`, and `dna-core.mjs`) and can also be hosted on **GitHub Pages**. In repository settings, select **Pages → Build and deployment → Deploy from a branch → main / (root)** after merging the feature branch. GitHub Pages will host the site over HTTPS without requiring Node.js on the student's computer.

## How to play

1. **Select or drag** deoxyribose, phosphate, and a DNA base (A, T, C, or G) from the left palette onto the molecular bench.
2. **Connect** components by dragging them close together. Alternatively click the first component and then the second. Bases attach at sugar position 1′; phosphates at 5′. Incorrect connections display an explanation.
3. Click **Collect completed nucleotide** to put it in the nucleotide tray.
4. Add your collected nucleotides to the **top 5′ → 3′** or **bottom 3′ → 5′** strand. Tap a nucleotide in a strand to return it to the tray. You can also drag units from the tray to a strand.
5. Build a complementary strand, then choose **Verify & join strands**. A–T pairs have two hydrogen bonds; C–G pairs have three. Once correct, select **Explore 3D helix** and drag to rotate.
6. Select a challenge from the mode bar. **Repair** gives you a preloaded base-pair mismatch to fix. Teacher tools allow a custom top-strand target sequence.

**Controls:** Undo/redo, zoom, delete selected, clear bench, save, export JSON. Progress and constructions are saved locally in the same browser using localStorage. The JSON export can be used for classroom backups.

## Scientific model and limitations

- DNA uses **deoxyribose**, phosphate, and one of A, T, C, G. Ribose and uracil are available solely for comparing DNA and RNA; they cannot make a standard DNA nucleotide in this first release.
- A base is linked at the sugar **1′ position** (purines through N9 and pyrimidines through N1); the phosphate is modeled at **5′**. Chains represent **3′–5′ phosphodiester linkages**.
- Complementary double-stranded DNA is **antiparallel**. The top is displayed 5′→3′ and the bottom 3′→5′, from left to right.
- The 3D projection uses the idealized parameters of right-handed **B-form DNA**: approximately **10.5 base pairs/turn** and **0.34 nm rise/base pair**. It is a pedagogical projection, **not** an atomistic force-field simulation.
- Assembling simplified monophosphates in this game is **not** a claim that cellular DNA is synthesized by spontaneously joining free monophosphates. Real DNA synthesis requires enzymes and activated nucleoside triphosphates.
- The app intentionally validates conceptual connection rules rather than modeling bond energies, ionic states, or all sugar ring atoms. It does **not** simulate DNA replication, transcription, or translation yet. The molecular-rule module is separate to support those later features.

## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | Lab layout and controls |
| `styles.css` | Responsive, high-contrast visual design |
| `app.mjs` | Interaction state, challenges, SVG workspace, 3D projection |
| `dna-core.mjs` | Testable DNA chemistry constraints and duplex rules |
| `tests/dna-core.test.mjs` | Scientific-rule unit tests |
| `server.mjs` | Optional dependency-free development server |

## Roadmap

1. More precise sugar and base molecular diagrams with explicit 2′ and 3′ sites and attachment validation.
2. Click-to-reorder strand nucleotides and richer guided learning activities.
3. DNA replication with DNA polymerase, helicase, primers, and leading/lagging strands.
4. RNA transcription (including ribose and uracil), then translation with codons and amino acids.
5. Teacher assignments, anonymized progress export, and accessibility refinements.

## License

No license has been selected. All rights remain with the repository owner until a license is added.
