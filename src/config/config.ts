import dotenv from 'dotenv';

dotenv.config();

interface Config {
  WATCHED_DIR: string;
  COMPRESSION_LEVEL: string;
}

const config: Config = {
  WATCHED_DIR: process.env.WATCHED_DIR || '/default/path',
  COMPRESSION_LEVEL: process.env.COMPRESSION_LEVEL || '50-70',
};

export default config;
