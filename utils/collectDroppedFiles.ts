const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function readDir(entry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
  return new Promise((resolve) => {
    const reader = entry.createReader();
    const results: FileSystemEntry[] = [];

    const readBatch = () => {
      reader.readEntries((entries) => {
        if (entries.length === 0) {
          resolve(results);
          return;
        }
        results.push(...entries);
        readBatch();
      });
    };

    readBatch();
  });
}

function entryToFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}

async function traverseEntry(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    const file = await entryToFile(entry as FileSystemFileEntry);
    if (ALLOWED_MIME_TYPES.includes(file.type)) return [file];
    return [];
  }

  if (entry.isDirectory) {
    const children = await readDir(entry as FileSystemDirectoryEntry);
    const nested = await Promise.all(children.map(traverseEntry));
    return nested.flat();
  }

  return [];
}

export async function collectDroppedFiles(dataTransfer: DataTransfer): Promise<File[]> {
  const items = Array.from(dataTransfer.items);
  const hasEntryApi = items.length > 0 && typeof items[0].webkitGetAsEntry === "function";

  if (!hasEntryApi) {
    return Array.from(dataTransfer.files).filter((f) => ALLOWED_MIME_TYPES.includes(f.type));
  }

  const entries = items.map((item) => item.webkitGetAsEntry()).filter(Boolean) as FileSystemEntry[];
  const nested = await Promise.all(entries.map(traverseEntry));
  return nested.flat();
}
