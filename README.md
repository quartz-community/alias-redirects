# @quartz-community/alias-redirects

Generates HTML redirect pages for frontmatter aliases, so old URLs redirect to the canonical page.

## Installation

```bash
npx quartz plugin add github:quartz-community/alias-redirects
```

## Usage

```ts
// quartz.config.ts
import * as ExternalPlugin from "./.quartz/plugins";

const config: QuartzConfig = {
  plugins: {
    emitters: [ExternalPlugin.AliasRedirects()],
  },
};
```

## Configuration

This plugin has no configuration options.

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/) for more information.

## License

MIT
