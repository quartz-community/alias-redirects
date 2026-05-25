import path from "node:path";
import fs from "node:fs/promises";
import type { QuartzEmitterPlugin, BuildCtx, FilePath, FullSlug } from "@quartz-community/types";
import { joinSegments } from "@quartz-community/types";
import { simplifySlug, resolveRelative, isRelativeURL } from "@quartz-community/utils";
import type { VFile } from "vfile";

// Maximum file name length for cross-platform compatibility
// Windows MAX_PATH is 260, leaving room for output directory and extension
const MAX_FILENAME_LENGTH = 200;

// Characters that are invalid in file names on Windows (and problematic elsewhere)
// Windows reserved characters: < > : " / \ | ? *
const INVALID_FILENAME_CHARS = /[<>:"/\\|?*]/g;

/**
 * Sanitizes a string to be safe for use as a file name.
 * Replaces invalid file system characters with hyphens and truncates if too long.
 */
function sanitizeFilename(filename: string): string {
  // Replace invalid characters with hyphens
  let sanitized = filename.replace(INVALID_FILENAME_CHARS, "-");
  // Truncate if too long to avoid exceeding OS path limits
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    sanitized = sanitized.slice(0, MAX_FILENAME_LENGTH);
  }
  return sanitized;
}

const write = async (
  ctx: BuildCtx,
  slug: FullSlug,
  ext: string,
  content: string,
): Promise<FilePath> => {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext) as FilePath;
  const dir = path.dirname(pathToPage);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pathToPage, content);
  return pathToPage;
};

async function* processFile(ctx: BuildCtx, file: VFile) {
  const ogSlug = simplifySlug(file.data.slug! as FullSlug);

  for (const aliasTarget of ((file.data as Record<string, unknown>).aliases as string[]) ?? []) {
    const rawAliasTarget = isRelativeURL(aliasTarget)
      ? path.normalize(path.join(ogSlug, "..", aliasTarget))
      : aliasTarget;

    // Sanitize the alias to make it safe for use as a file name
    const aliasTargetSlug = sanitizeFilename(rawAliasTarget) as FullSlug;

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
        `,
    );
  }
}

export const AliasRedirects: QuartzEmitterPlugin = () => ({
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
  },
});
