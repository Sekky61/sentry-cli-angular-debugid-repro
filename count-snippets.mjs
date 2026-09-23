import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];

for (const name of readdirSync(dir).filter(file => file.endsWith('.js'))) {
  const snippets = readFileSync(join(dir, name), 'utf8').split('_sentryDebugIds[').length - 1;

  console.log(`${join(dir, name)}: ${snippets} _sentryDebugIds snippet(s)`);
}
