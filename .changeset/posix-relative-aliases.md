---
"@quartz-community/alias-redirects": patch
---

Relative aliases (`./old`, `../x`) redirect to the right page on Windows. Their target was built with the OS path functions, so on Windows `notes/page` with the alias `./old` got the slug `notes\old`, and the redirect pointed one folder too deep (`/notes/notes/page`). Slugs are now joined with `/` on every OS.
