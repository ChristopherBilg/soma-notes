import { assertEquals } from "$std/testing/asserts.ts";
import { getNgrams } from "../helpers/notes.ts";

Deno.test("ngram calculations per note should not exceed a specified time", () => {
  const noteString = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
  const maxNgramLength = noteString.split(' ').length;
  const simulatedNoteCount = 20000;
  
  const timeStart = performance.now();
  
  for (let i = 0; i < simulatedNoteCount; i++) {
    for (let ngramLength = 1; ngramLength <= maxNgramLength; ngramLength++) {
      getNgrams(noteString, ngramLength);
    }
  }

  const timeEnd = performance.now();
  const timeElapsed = timeEnd - timeStart;
  
  console.log(`Length of max ngram in string: ${maxNgramLength}`)
  console.log(`Time elapsed: ${timeElapsed}ms`);
  console.log(`Simlated Note Count: ${simulatedNoteCount}`);
  console.log(`Average time per simulated note: ${timeElapsed / simulatedNoteCount}ms`);
  console.log(`Average time per ngram: ${timeElapsed / (simulatedNoteCount * maxNgramLength)}ms`);

  const expectedMaxTimePerNote = 0.06;
  const actualTimePerNote = timeElapsed / simulatedNoteCount;
  assertEquals(actualTimePerNote < expectedMaxTimePerNote, true, `Expected ngram calculation time per note to be less than ${expectedMaxTimePerNote}ms, but was ${actualTimePerNote}ms`);
});
