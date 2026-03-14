import path from 'path';
import fs from 'fs/promises';
import { joinSegments } from '@quartz-community/types';
import { simplifySlug, isRelativeURL, resolveRelative } from '@quartz-community/utils';

// src/emitter.ts
var write = async (ctx, slug, ext, content) => {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext);
  const dir = path.dirname(pathToPage);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pathToPage, content);
  return pathToPage;
};
async function* processFile(ctx, file) {
  const ogSlug = simplifySlug(file.data.slug);
  for (const aliasTarget of file.data.aliases ?? []) {
    const aliasTargetSlug = isRelativeURL(aliasTarget) ? path.normalize(path.join(ogSlug, "..", aliasTarget)) : aliasTarget;
    const redirUrl = resolveRelative(aliasTargetSlug, ogSlug);
    yield write(
      ctx,
      aliasTargetSlug,
      ".html",
      `
        <!DOCTYPE html>
        <html lang="en-us">
        <head>
        <title>${ogSlug}</title>
        <link rel="canonical" href="${redirUrl}">
        <meta name="robots" content="noindex">
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${redirUrl}">
        </head>
        </html>
        `
    );
  }
}
var AliasRedirects = () => ({
  name: "AliasRedirects",
  async *emit(ctx, content) {
    for (const [_tree, file] of content) {
      yield* processFile(ctx, file);
    }
  },
  async *partialEmit(ctx, _content, _resources, changeEvents) {
    for (const changeEvent of changeEvents) {
      if (!changeEvent.file) continue;
      if (changeEvent.type === "add" || changeEvent.type === "change") {
        yield* processFile(ctx, changeEvent.file);
      }
    }
  }
});

export { AliasRedirects };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map