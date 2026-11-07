---
"@quartz-community/alias-redirects": patch
---

Skip aliases and permalinks that point to the page's own path (or to another existing page) instead of overwriting the page with a redirect to itself, which caused an infinite redirect loop. A warning is logged when an alias collides with another page (jackyzha0/quartz#2590).
