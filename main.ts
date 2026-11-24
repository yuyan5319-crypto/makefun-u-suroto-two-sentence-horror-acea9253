// Two-Sentence Horror — a make.fun bounty entry.
//
// The story: a phone that quietly files away photographs its owner
// never took, and the newest one was taken from inside the bedroom.

import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Exactly two sentences, 157 characters. The second sentence turns the
// first: the photos are not a glitch, they are taken from the foot of
// the owner's own bed, tonight, while they sleep.
const STORY =
  "My phone keeps sorting photos I never took into an album called 'Us'. " +
  "The latest is timestamped tonight, taken from the foot of my bed, and I'm asleep in it.";

const MAX_CHARS = 400;

// Count sentences the way a reader would: split on sentence-ending
// punctuation and drop the empty pieces. "Us'." ends sentence one;
// the final period ends sentence two.
function sentenceCount(text: string): number {
  return text.split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
}

function outputPath(): string {
  // Where the entry goes: /output in the grading sandbox, or a local
  // fallback when run by hand. MAKEFUN_OUTPUT_DIR, when set, names a
  // directory, never a file.
  const candidates = [process.env.MAKEFUN_OUTPUT_DIR, "/output", "output"];
  for (const dir of candidates) {
    if (dir && existsSync(dir) && statSync(dir).isDirectory()) {
      return join(dir, "entry.txt");
    }
  }
  mkdirSync("output", { recursive: true });
  return join("output", "entry.txt");
}

function main(): number {
  const story = STORY.trim();
  if (!story) {
    console.error("error: story is empty");
    return 1;
  }
  if (story.length > MAX_CHARS) {
    console.error(
      `error: story is ${story.length} chars, over the ${MAX_CHARS} limit`,
    );
    return 1;
  }
  if (sentenceCount(story) !== 2) {
    console.error(
      `error: story has ${sentenceCount(story)} sentences, expected exactly 2`,
    );
    return 1;
  }
  const path = outputPath();
  writeFileSync(path, story, "utf-8");
  console.log(`wrote ${story.length} chars to ${path}`);
  console.log(story);
  return 0;
}

process.exit(main());
