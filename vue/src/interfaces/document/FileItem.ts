interface FileItem {
  id: number;
  file: Array<File> | undefined;
  langs: Array<string> | null;
}

export type { FileItem };
