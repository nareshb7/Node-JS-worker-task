// import amqp from 'amqplib';
// import { v4 as uuidv4 } from 'uuid';
// import { processTask } from './taskConsumer';

// require('dotenv').config()

// const RABBITMQ_URL = process.env.RABBITMQ_URL || "";
// const QUEUE_NAME = 'file_tasks';

// export async function sendTask(fileCount: number, fileSize: number, s3Destination: string) {
//   console.log("process started....")
//   const connection = await amqp.connect(RABBITMQ_URL);
//   const channel = await connection.createChannel();
//   await channel.assertQueue(QUEUE_NAME);

//   for (let i = 0; i < fileCount; i++) {
//     const task = {
//       fileSize,
//       s3Destination,
//       fileId: uuidv4(),
//     };
//     channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(task)));
//   }

//   console.log(`Sent ${fileCount} tasks`);
//   await processTask()
//   await channel.close();
//   await connection.close();
// }

// sendTask(10, 5 * 1024 * 1024, 'utrllererrr').catch(console.error);
// sendTask(fileCount, fileSize, s3Destination).catch(console.error)

import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { processTask } from "./taskConsumer";

require("dotenv").config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "";
const QUEUE_NAME = "file_tasks";

export async function sendTask(
  fileCount: number,
  fileSize: number,
  s3Destination: string
) {
  console.log("process started....");
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);

  for (let i = 0; i < fileCount; i++) {
    const task = {
      fileSize,
      s3Destination,
      fileId: uuidv4(),
    };
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(task)));
    // tasks.push(new Promise<void>((resolve) => {
    //   channel.consume(QUEUE_NAME, (msg) => {
    //     if (msg) {
    //       channel.ack(msg);
    //       resolve();
    //     }
    //   });
    // }))  
  }

  const start = Date.now();
  // await Promise.all(tasks);
  const logData = await processTask();
  const end = Date.now();

  const timeToCopyAllFiles = (end - start) / 1000;
  const totalSize = fileCount * fileSize;
  const rateOfCopy = totalSize / timeToCopyAllFiles;

  const logEntry = {
    timeToCopyAllFiles,
    rateOfCopy,
    totalSize,
    logData,
  };
  console.log(`Sent ${fileCount} tasks`);
  await channel.close();
  await connection.close();
  return logEntry;
}

// //sendTask(10, 5 * 1024 * 1024, 'utrllererrr').catch(console.error);
// // sendTask(fileCount, fileSize, s3Destination).catch(console.error)
