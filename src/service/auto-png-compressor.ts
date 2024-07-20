import chokidar, { FSWatcher } from 'chokidar';
import { exec } from 'child_process';
import path from 'path';
import { unlink } from 'fs';
import { getFileSizeInKB } from '../lib/file-util.js';

class AutoPngCompressor {
  private watchedDir: string;
  private compressionLevel: string;
  private watcher: FSWatcher | null;

  constructor(watchedDir: string, compressionLevel: string) {
    this.watchedDir = watchedDir;
    this.compressionLevel = compressionLevel;
    this.watcher = null;
  }

  public isFileStable(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      let prevSize = -1;
      let currSize = parseFloat(getFileSizeInKB(filePath));

      const checkInterval = setInterval(() => {
        prevSize = currSize;
        currSize = parseFloat(getFileSizeInKB(filePath));

        if (prevSize === currSize) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 1000);
    });
  }

  public async processFile(filePath: string): Promise<void> {
    const fileName = path.basename(filePath);
    if (path.extname(filePath).toLowerCase() === '.png' && !filePath.includes('compr')) {
      const fileSize = getFileSizeInKB(filePath);
      console.log(`Processing file: ${fileName} (Size: ${fileSize} KB)`);

      const isStable = await this.isFileStable(filePath);
      if (isStable) {
        const outputFilePath = `${filePath.replace('.png', '')}_compr.png`;
        const outputFileName = path.basename(outputFilePath);

        const { default: pngquant } = await import('pngquant-bin');

        exec(`${pngquant} --force --quality=${this.compressionLevel} --output="${outputFilePath}" "${filePath}"`, (err, stdout, stderr) => {
          if (err) {
            console.error(`Error processing file ${fileName}:`, stderr);
          } else {
            const compressedFileSize = getFileSizeInKB(outputFilePath);
            console.log(`Compressed and renamed: ${outputFileName} (Original Size: ${fileSize} KB, Compressed Size: ${compressedFileSize} KB)`);
            unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`Error deleting original file ${fileName}:`, unlinkErr);
              } else {
                console.log(`Deleted original file: ${fileName}`);
              }
            });
          }
        });
      } else {
        console.log(`File ${fileName} is not stable yet. Skipping processing.`);
      }
    }
  }

  public startWatching(): void {
    this.watcher = chokidar.watch(this.watchedDir, {
      ignored: /[\/\\]\./,
      persistent: true,
    });

    this.watcher.on('add', (filePath) => this.processFile(filePath));
  }
}

export default AutoPngCompressor;
