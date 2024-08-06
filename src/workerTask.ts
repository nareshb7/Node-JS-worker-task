import { getChannel } from './rabbitMQ';
import { S3 } from 'aws-sdk';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { performance } from 'perf_hooks';

interface TaskMessage {
  id: string;
  fileSize: number;
  s3Destination: string;
}

const s3 = new S3();

async function createAndUploadFile(task: TaskMessage) {
  const { id, fileSize, s3Destination } = task;
  const filePath = join(__dirname, `${id}.bin`);
  const fileContent = randomBytes(fileSize * 1024 * 1024); // fileSize in MB

  await writeFile(filePath, fileContent);

  const start = performance.now();
  await s3.upload({
    Bucket: s3Destination,
    Key: `${id}.bin`,
    Body: fileContent
  }).promise();
  const end = performance.now();

  console.log(`File ${id} uploaded in ${(end - start) / 1000} seconds`);
}

export async function startWorker() {
  const channel = getChannel();
  channel.consume('MakeAndCopyFileQueue', async (msg) => {
    if (msg) {
      const task: TaskMessage = JSON.parse(msg.content.toString());
      await createAndUploadFile(task);
      channel.ack(msg);
    }
  });

  console.log('Worker started');
}
