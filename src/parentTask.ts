import { getChannel } from './rabbitMQ';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  fileSize: number;
  s3Destination: string;
}

export async function createParentTask(fileCount: number, fileSize: number, s3Destination: string) {
  const channel = getChannel();
  const tasks: Task[] = Array(fileCount).fill({ fileSize, s3Destination });

  console.log(`Starting task to create and upload ${fileCount} files of size ${fileSize} MB to S3`);

  tasks.forEach(task => {
    const taskMessage = JSON.stringify({ id: uuidv4(), ...task });
    channel.sendToQueue('MakeAndCopyFileQueue', Buffer.from(taskMessage));
  });

  console.log(`${fileCount} tasks created and sent to the queue`);
}


// import { getChannel } from './rabbitMQ';
// import { v4 as uuidv4 } from 'uuid';

// interface Task {
//   fileSize: number;
//   s3Destination: string;
// }

// export async function createParentTask(fileCount: number, fileSize: number, s3Destination: string) {
//   const channel = getChannel();
//   const tasks: Task[] = Array(fileCount).fill({ fileSize, s3Destination });

//   console.log(`Starting task to create and upload ${fileCount} files of size ${fileSize} MB to S3`);

//   tasks.forEach(task => {
//     const taskMessage = JSON.stringify({ id: uuidv4(), ...task });
//     channel.sendToQueue('MakeAndCopyFileQueue', Buffer.from(taskMessage));
//   });

//   console.log(`${fileCount} tasks created and sent to the queue`);
// }


// // import { getChannel } from './rabbitMQ';
// // import { v4 as uuidv4 } from 'uuid';

// // interface Task {
// //   fileSize: number;
// //   s3Destination: string;
// // }

// // export async function createParentTask(fileCount: number, fileSize: number, s3Destination: string) {
// //   const channel = getChannel();
// //   const tasks: Task[] = Array(fileCount).fill({ fileSize, s3Destination });

// //   tasks.forEach(task => {
// //     const taskMessage = JSON.stringify({ id: uuidv4(), ...task });
// //     channel.sendToQueue('MakeAndCopyFileQueue', Buffer.from(taskMessage));
// //   });

// //   console.log(`${fileCount} tasks created`);
// // }

// // import { connectRabbitMQ } from './rabbitMQ';

// // export const runParentTask = async (fileCount: number, fileSize: number, s3Destination: string) => {
// //     const channel = await connectRabbitMQ();
// //     if (!channel) {
// //         return
// //     }
// //     const tasks = [];

// //     for (let i = 0; i < fileCount; i++) {
// //         tasks.push(
// //             new Promise<void>((resolve) => {
// //                 channel.sendToQueue('tasks', Buffer.from(JSON.stringify({ fileSize, s3Destination })));
// //                 channel.consume('tasks', (msg: any) => {
// //                     if (msg) {
// //                         channel.ack(msg);
// //                         resolve();
// //                     }
// //                 });
// //             })
// //         );
// //     }

// //     const start = Date.now();
// //     await Promise.all(tasks);
// //     const end = Date.now();

// //     const timeToCopyAllFiles = (end - start) / 1000;
// //     const totalSize = fileCount * fileSize;
// //     const rateOfCopy = totalSize / timeToCopyAllFiles;

// //     console.log(`All files uploaded:`);
// //     console.log(`Time to copy all files: ${timeToCopyAllFiles} seconds`);
// //     console.log(`Rate of copy: ${rateOfCopy} MB/s`);
// //     console.log(`Total size: ${totalSize} MB`);
// // };

