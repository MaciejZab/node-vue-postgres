interface FileItem {
  id: number;
  file: Array<File> | undefined;
  langs: Array<string> | null;
}
// { name: string; suffix: string }

export type { FileItem };
