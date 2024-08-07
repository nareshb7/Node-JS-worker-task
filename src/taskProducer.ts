import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { processTask } from './taskConsumer';

require('dotenv').config()

const RABBITMQ_URL = process.env.RABBITMQ_URL || "";
const QUEUE_NAME = 'file_tasks';

async function sendTask(fileCount: number, fileSize: number, s3Destination: string) {
  console.log("process started....")
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
  }

  console.log(`Sent ${fileCount} tasks`);
  await processTask()
  await channel.close();
  await connection.close();
}

sendTask(10, 5 * 1024 * 1024, 'utrllererrr').catch(console.error);
// sendTask(fileCount, fileSize, s3Destination).catch(console.error)
