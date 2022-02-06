import readline from "readline";
import { fromDictionary } from "./dictionary";
import { wordleSuggestions } from "./wordle";

const isUpperCase = (s: string) => /[A-Z]+/.test(s);
const isLowerCase = (s: string) => /[a-z]+/.test(s);

async function main(dictionary: string) {
  const LENGTH = 5;
  const start = Date.now();
  console.log(`building dictionary of ${LENGTH} character words...`);
  const dawg = await fromDictionary(
    dictionary,
    (line) => line.length === LENGTH
  );
  console.log(`built in ${Date.now() - start} ms`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const eliminated = new Set<string>();
  const yellows = [0, 1, 2, 3, 4].map(() => new Set<string>());
  const greens = ["", "", "", "", ""];

  function update(eliminate: string, pattern: string) {
    for (const c of eliminate) {
      eliminated.add(c);
    }
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      if (isUpperCase(p)) {
        greens[i] = p;
        yellows[i].delete(p);
      } else if (isLowerCase(p)) {
        yellows[i].add(p.toUpperCase());
      }
    }
  }

  function ask() {
    rl.question("Enter letters to eliminate:", (eliminate) => {
      rl.question(
        "Enter last guess pattern (lowercase = yellow, uppercase = green, * = grey):",
        (pattern) => {
          update(eliminate, pattern.slice(0, 5));

          for (const suggestion of wordleSuggestions(
            dawg,
            eliminated,
            yellows,
            greens
          )) {
            console.log(suggestion);
          }

          ask();
        }
      );
    });
  }

  ask();
}

main(process.argv[2]);
