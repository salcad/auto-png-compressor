import config from './config/config.js';
import AutoPngCompressor from './service/auto-png-compressor.js';

const { WATCHED_DIR, COMPRESSION_LEVEL } = config;

class Main {
  static run(): void {
    const autoPngCompressor = new AutoPngCompressor(WATCHED_DIR, COMPRESSION_LEVEL);
    autoPngCompressor.startWatching();
  }
}

Main.run();
