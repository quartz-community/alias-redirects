# @quartz-community/alias-redirects

Generates HTML redirect pages for frontmatter aliases and case-preserving URLs, so old URLs redirect to the canonical page.

- **Aliases**: `aliases` / `alias` frontmatter entries become redirect pages. A relative alias (`./old`, `../x`) is resolved against the page's folder. An alias that is another page's address (or the page's own) is skipped with a warning, so a redirect never replaces a page.
- **Permalinks**: a note with a `permalink` is published at its permalink, and its file path becomes a redirect to it.
- **Case redirects**: URLs whose casing changed due to v5's lowercase slug normalization (e.g. `/Diary/My-Note` → `/diary/my-note`) get a redirect page. This is skipped automatically on case-insensitive filesystems.

## Installation

```bash
npx quartz plugin add @quartz-community/alias-redirects
```

It is already included (and enabled) in the default `quartz.config.yaml`.

## Usage

```yaml title="quartz.config.yaml"
plugins:
  - source: "@quartz-community/alias-redirects"
    enabled: true
```

## Configuration

| Option                | Type      | Default | Description                                                                                             |
| --------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `enableCaseRedirects` | `boolean` | `true`  | Automatically generate redirect pages for URLs that changed casing due to v5's lowercase normalization. |

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/plugins/AliasRedirects) for more information.

## License

MIT
