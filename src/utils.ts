export function extractRelativePath(outputPath: string): string | null {
  const match = outputPath.match(/^s3:\/\/[^/]+\/(.*)/);
  return match ? match[1].replace(/\/$/, '') : null;
}