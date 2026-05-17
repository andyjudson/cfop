import { CubeScramble } from '@andyjudson/cubify';

const MAX = 3;
const cache: string[] = [];
let filling = false;

async function fill() {
  if (filling) return;
  filling = true;
  try {
    while (cache.length < MAX) {
      cache.push(await CubeScramble.wca());
    }
  } finally {
    filling = false;
  }
}

export function warmUp(): void {
  fill();
}

export async function nextScramble(): Promise<string> {
  if (cache.length > 0) {
    const s = cache.shift()!;
    fill();
    return s;
  }
  const s = await CubeScramble.wca();
  fill();
  return s;
}
