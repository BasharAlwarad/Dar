import { readdir, writeFile } from 'fs/promises';

const directoryPath = new URL('./svg', import.meta.url);

async function generateExports() {
  try {
    const files = await readdir(directoryPath);
    const svgFiles = files.filter((file) => file.endsWith('.svg'));

    const exports = svgFiles
      .map(
        (file) =>
          `export {default as ${file.replace(
            '.svg',
            ''
          )} } from './svg/${file}';`
      )
      .join('\n');

    await writeFile(new URL('./index.js', directoryPath), exports);
    console.log('✅ index.js file generated successfully!');
  } catch (error) {
    console.error('❌ Error generating index.js:', error);
  }
}

generateExports();
