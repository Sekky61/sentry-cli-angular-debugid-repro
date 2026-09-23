import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];

for (const name of readdirSync(dir)) {
  const path = join(dir, name);

  if (name.endsWith('.js')) {
    writeFileSync(path, readFileSync(path, 'utf8').replace(/^\/\/# debugId=.*\n/m, ''));
  }

  if (name.endsWith('.js.map')) {
    const { debugId, ...map } = JSON.parse(readFileSync(path, 'utf8'));

    writeFileSync(path, JSON.stringify(map));
  }
}
