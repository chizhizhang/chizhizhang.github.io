# Datasets and research code

Public page: https://chizhizhang.github.io/src/

## Adding future entries

The live catalog is generated from projects.json. The datasets and projects
arrays are independent. Upload a new archive to src/ and add its record to the
appropriate array. No HTML, CSS or JavaScript changes are needed for a new entry.
Update the top-level updated date and the entry's ISO updated date.

Counts, newest-first ordering, categories, search and Show more controls update
automatically. Dataset search and code search are independent. Additional
datasets appear in batches of six and code packages in batches of ten.

Dataset records use: id, title, category, format, description, sampleCount,
sampleLabel, tags (array), file, bytes, sha256, coverage, structure (array),
fields (array of name/description pairs), citation (text/journal/doi), article,
dataType, provenance, usage, attribution (name/url pairs), and updated.
Reuse an existing dataset record as the template.

Code records use the existing projects schema. Duplicate a code record and
replace its publication, archive, contents and run instructions.

index.html contains a static fallback of the current catalog. code-library.js
loads the registry and renders current and future entries using shared templates.
The page remains readable if JavaScript is unavailable. code-library.css handles
the responsive two-section layout.

## Current datasets

VCSEL_795_Dataset.zip contains 62 final CSV trajectories.
VCSEL_894_Dataset.zip contains 45 final CSV trajectories.
BLD_455_Dataset.zip contains 20 final CSV trajectories, sampled every 0.5 h
from 0 to 500 h. The optical-power unit is W, drive current is A, and
wavelength/bandwidth units are nm. Non-crossing lifetimes are right censored.
Each archive contains only final CSVs in its own English-named dataset folder.
The dataset cards provide the English descriptions, variable definitions,
and the associated article's IEEE citation. All three are explicitly labeled
pseudo data based on original measurements, for testing and benchmarking
under simulated conditions only. Source attribution is visible on each card.
The 455 nm dataset cites the published RESS article on Segmental Viterbi estimation
(doi: 10.1016/j.ress.2026.113615).

The five existing research-code archives retain their URLs and byte contents.
Verify archive contents, counts, checksums, citations, downloads and mobile
layout when publishing. Do not include source measurements, manuscripts,
correspondence or credentials in a release.
