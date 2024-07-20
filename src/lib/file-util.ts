import { statSync } from 'fs';

export const getFileSizeInKB = (filePath: string): string => {
  const stats = statSync(filePath);
  return (stats.size / 1024).toFixed(2);
};
