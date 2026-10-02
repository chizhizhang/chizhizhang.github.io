# Research code library

The public page is https://chizhizhang.github.io/src/.
Project records are maintained in projects.json. Add a new download archive to
this directory and add its project record to that file. The page loads the
registry automatically; no HTML changes are needed for another project.

Required record fields: id (public topic slug), referenceNumber, authors, venue,
referenceDetails, title, short, journal, status, area, file,
description, includes (array), data, commands (array), language, bytes,
sha256 and updated. article is optional.

Retain published archive URLs when updating the library. Use new versioned
filenames when the content changes. Verify the ZIP opens, the README matches
its contents and the download works before adding an entry. Do not include
manuscripts, peer-review correspondence, credentials or restricted source
measurements in a code release. The project-specific data statements describe
what is included and what is required for complete reproduction.

GitHub Pages downloads do not replace DOI-issuing archival deposits. An archive
DOI can be added to an entry as the optional doi field when verified.
