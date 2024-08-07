import fs from 'fs';
import * as crypto from 'crypto';

export async function createRandomFile(filePath: string, fileSize: number): Promise<void> {
  const fileStream = fs.createWriteStream(filePath);
  const chunkSize = 1024 * 1024; // 1MB
  const totalChunks = Math.ceil(fileSize / chunkSize);
  
  for (let i = 0; i < totalChunks; i++) {
    const buffer = crypto.randomBytes(chunkSize);
    fileStream.write(buffer);
  }
  
  fileStream.end();
  await new Promise<void>((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
}
