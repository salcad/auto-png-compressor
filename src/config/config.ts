import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  console.error(`Error: .env file not found at ${envFilePath}. Exiting...`);
  process.exit(1); 
}

interface Config {
  WATCHED_DIR: string;
  COMPRESSION_LEVEL: string;
}

const config: Config = {
  WATCHED_DIR: process.env.WATCHED_DIR || '/default/path',
  COMPRESSION_LEVEL: process.env.COMPRESSION_LEVEL || '50-70',
};

export default config;
