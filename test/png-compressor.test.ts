import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import AutoPngCompressor from '../src/service/auto-png-compressor';
import * as fileUtils from '../src/lib/file-util';

// Mock fs and child_process
jest.mock('fs');
jest.mock('child_process');

// Mock pngquant-bin to return a mock path
jest.mock('pngquant-bin', () => '/mock/path/to/pngquant');

describe('AutoPngCompressor', () => {
  const WATCHED_DIR = '/mock/path';
  const COMPRESSION_LEVEL = '50-70';
  let autoPngCompressor: AutoPngCompressor;

  beforeEach(() => {
    autoPngCompressor = new AutoPngCompressor(WATCHED_DIR, COMPRESSION_LEVEL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processFile', () => {
    it('should process and compress a PNG file', async () => {
      // Given
      const filePath = '/mock/path/image.png';
      const fileSize = 1024;
      const compressedFilePath = '/mock/path/image_compr.png';

      jest.spyOn(path, 'basename').mockReturnValue('image.png');
      jest.spyOn(path, 'extname').mockReturnValue('.png');
      (fs.statSync as jest.Mock).mockReturnValue({ size: fileSize });
      (fs.unlink as unknown as jest.Mock).mockImplementation((path, callback) => callback(null));
      (exec as unknown as jest.Mock).mockImplementation((cmd, callback) => callback(null, '', ''));
      jest.spyOn(autoPngCompressor, 'isFileStable').mockResolvedValue(true);
      jest.spyOn(fileUtils, 'getFileSizeInKB').mockImplementation((filePath) => {
        return filePath === compressedFilePath ? '512' : '1024';
      });
      console.log = jest.fn();

      // When
      await autoPngCompressor.processFile(filePath);

      // Then
      expect(console.log).toHaveBeenCalledWith('Processing file: image.png (Size: 1024 KB)');
      expect(console.log).toHaveBeenCalledWith('Compressed and renamed: image.png (Original Size: 1024 KB, Compressed Size: 512 KB)');
      expect(console.log).toHaveBeenCalledWith('Deleted original file: image.png');
    });

    it('should skip processing if file is not stable', async () => {
      // Given
      const filePath = '/mock/path/image.png';

      jest.spyOn(path, 'basename').mockReturnValue('image.png');
      jest.spyOn(path, 'extname').mockReturnValue('.png');
      jest.spyOn(autoPngCompressor, 'isFileStable').mockResolvedValue(false);
      jest.spyOn(fileUtils, 'getFileSizeInKB').mockReturnValue('1024');
      console.log = jest.fn();

      // When
      await autoPngCompressor.processFile(filePath);

      // Then
      expect(console.log).toHaveBeenCalledWith('File image.png is not stable yet. Skipping processing.');
    });
  });
});
