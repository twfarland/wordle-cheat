import { Dawg, Word, State } from "yodawg";

export function wordleSuggestions(
  dawg: Dawg,
  eliminated: Set<string>,
  yellows: Array<Set<string>>,
  greens: Array<string>
): Set<string> {
  const found = new Set<string>();

  function testChar(index: number, char: string) {
    return (
      !eliminated.has(char) && // grey constraint
      (!greens[index] || greens[index] === char) && // green constraint
      !yellows[index].has(char)
    ); // yellow constraint
  }

  function testWord(word: Word) {
    // check that all yellows appear in word
    for (const y of yellows) {
      for (const c of y) {
        if (word.indexOf(c) === -1) {
          return false;
        }
      }
    }
    return true;
  }

  function search(index: number, matched: Word, state: State): void {
    if (dawg.final.has(state) && testWord(matched)) {
      // must be at least 1 of each yellow in word
      found.add(matched.join(""));
    }
    const children = dawg.transitions.get(state);
    if (children !== undefined) {
      for (const [char, child] of children) {
        if (testChar(index, char)) {
          search(index + 1, [...matched, char], child);
        }
      }
    }
  }

  search(0, [], Number(dawg.start));

  return found;
}
