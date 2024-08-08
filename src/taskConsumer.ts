import amqp from 'amqplib';
import { createRandomFile } from './fileUtils';
import { uploadFileToS3 } from './s3Utils';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';
require('dotenv').config()

const RABBITMQ_URL = process.env.RABBITMQ_URL || "";
const QUEUE_NAME = 'file_tasks';
const TEMP_DIR = os.tmpdir(); // Get the system's temporary directory

export const logData: any[] = [];


export async function processTask() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg) {
      const task = JSON.parse(msg.content.toString());
      const fileName = `file-${Date.now()}-${Math.random()}.txt`;
      const { fileSize, s3Destination, fileId } = task;

      const filePath = path.join(TEMP_DIR, `${fileId}.tmp`);

      // Log start time
      const startTime = Date.now();

      // Create a random file
      await createRandomFile(filePath, fileSize);

      // Upload to S3
      await uploadFileToS3(s3Destination, fileId, filePath);

      // Calculate time taken
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // time in seconds

      // Calculate rate of copy
      const rateOfCopy = (fileSize / 1024 / 1024) / timeTaken; // MB/s

      // Clean up
      fs.unlinkSync(filePath);
      const logEntry = {
        fileName,
        fileSize,
        timeToCopy: timeTaken.toFixed(2),
        totalSize: fileSize,
        rateOfCopy: rateOfCopy.toFixed(2),
    };
    logData.push(logEntry);

      console.log(`Processed file ${fileId}`);
      console.log(`Time taken to copy: ${timeTaken.toFixed(2)} seconds`);
      console.log(`Rate of copy: ${rateOfCopy.toFixed(2)} MB/s`);

      channel.ack(msg);
      return logEntry
    }
  });
  return logData
}