// Minimal declaration for the 'glob' module used in scan-client-bundle.ts
declare module 'glob' {
  interface GlobOptions {
    cwd?: string;
    absolute?: boolean;
    [key: string]: unknown;
  }
  function glob(
    pattern: string,
    options: GlobOptions,
    callback: (err: NodeJS.ErrnoException | null, matches: string[]) => void
  ): void;
  export = glob;
}
