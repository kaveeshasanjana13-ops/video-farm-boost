// vite-plugin-version.ts
// Generates version.json and injects VITE_APP_VERSION + VITE_APP_SEMVER at build time.
//
// version.json shape:
//   { "hash": "a1b2c3d4e5", "semver": "1.0.0", "major": 1, "buildTime": "..." }
//
// - hash    → unique per deploy (auto-reload trigger for minor/patch changes)
// - semver  → from package.json "version" field
// - major   → if this number increases, users MUST update from Play Store
import { Plugin } from 'vite';
import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { createHash } from 'crypto';

export function versionPlugin(): Plugin {
  const buildTime = new Date().toISOString();
  const hash = createHash('md5').update(buildTime).digest('hex').slice(0, 10);

  // Read semver from package.json
  let semver = '1.0.0';
  try {
    const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'));
    semver = pkg.version || '1.0.0';
  } catch {
    console.warn('⚠️ Could not read version from package.json, defaulting to 1.0.0');
  }

  const major = parseInt(semver.split('.')[0], 10);

  return {
    name: 'version-plugin',
    config(_, { command }) {
      if (command === 'build') {
        return {
          define: {
            'import.meta.env.VITE_APP_VERSION': JSON.stringify(hash),
            'import.meta.env.VITE_APP_SEMVER': JSON.stringify(semver),
            'import.meta.env.VITE_APP_MAJOR': JSON.stringify(String(major)),
          },
        };
      }
    },
    closeBundle() {
      const versionData = JSON.stringify({ hash, semver, major, buildTime }, null, 2);
      const outputPath = resolve(process.cwd(), 'dist', 'version.json');
      try {
        writeFileSync(outputPath, versionData, 'utf-8');
        console.log(`\n✅ version.json: ${semver} (hash: ${hash}) built at ${buildTime}`);
      } catch (err) {
        console.warn('⚠️ Could not write version.json:', err);
      }
    },
  };
}
