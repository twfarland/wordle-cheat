import fs from "fs";
import readline from "readline";
import { fromWords } from "yodawg";

export async function* lines(
  filename: string,
  predicate: (line: string) => boolean
) {
  const input = fs.createReadStream(filename);
  const reader = readline.createInterface({
    input,
    crlfDelay: Infinity,
  });

  for await (const line of reader) {
    if (predicate(line)) {
      yield line;
    }
  }
}

export function fromDictionary(
  filename: string,
  predicate: (line: string) => boolean
) {
  return fromWords(lines(filename, predicate));
}
