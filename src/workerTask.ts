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

const s3 = new S3({
  accessKeyId: 'dssssKIARKJW72YGLPVQF2A3',
  secretAccessKey: 'FFICq6Lh8qXP5DdvwY6wsx4vwddd/BM2p2mcgKEFQ+9',
  region: 'us-west-2',
});

async function createAndUploadFile(task: TaskMessage) {
  const { id, fileSize, s3Destination } = task;
  const filePath = join(__dirname, `${id}.bin`);
  const fileContent = randomBytes(fileSize * 1024 * 1024); // fileSize in MB

  console.log(`Starting creation of file ${id} of size ${fileSize} MB`);

  await writeFile(filePath, fileContent);

  console.log(`File ${id} created. Starting upload to S3`);

  const start = performance.now();
  await s3.upload({
    Bucket: s3Destination,
    Key: `${id}.bin`,
    Body: fileContent
  }).promise();
  const end = performance.now();

  const timeToCopy = (end - start) / 1000; // in seconds
  const rateOfCopy = (fileSize * 8) / timeToCopy; // in Mbps
  const totalSize = fileSize; // in MB

  console.log(`File ${id} uploaded in ${timeToCopy.toFixed(2)} seconds at a rate of ${rateOfCopy.toFixed(2)} Mbps`);

  return { timeToCopy, rateOfCopy, totalSize };
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


// import { getChannel } from './rabbitMQ';
// import { S3 } from 'aws-sdk';
// import { randomBytes } from 'crypto';
// import { writeFile } from 'fs/promises';
// import { join } from 'path';
// import { performance } from 'perf_hooks';

// interface TaskMessage {
//   id: string;
//   fileSize: number;
//   s3Destination: string;
// }

// const s3 = new S3();

// async function createAndUploadFile(task: TaskMessage) {
//   const { id, fileSize, s3Destination } = task;
//   const filePath = join(__dirname, `${id}.bin`);
//   const fileContent = randomBytes(fileSize * 1024 * 1024); // fileSize in MB

//   await writeFile(filePath, fileContent);

//   const start = performance.now();
//   await s3.upload({
//     Bucket: s3Destination,
//     Key: `${id}.bin`,
//     Body: fileContent
//   }).promise();
//   const end = performance.now();

//   console.log(`File ${id} uploaded in ${(end - start) / 1000} seconds`);
// }

// export async function startWorker() {
//   const channel = getChannel();
//   channel.consume('MakeAndCopyFileQueue', async (msg) => {
//     if (msg) {
//       const task: TaskMessage = JSON.parse(msg.content.toString());
//       await createAndUploadFile(task);
//       channel.ack(msg);
//     }
//   });

//   console.log('Worker started');
// }
