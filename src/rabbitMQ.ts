import amqp, { Channel, Connection } from 'amqplib';

let channel: Channel;

export async function connectRabbitMQ() {
  const connection: Connection = await amqp.connect('amqp://rabbitmq');
  channel = await connection.createChannel();
  await channel.assertQueue('MakeAndCopyFileQueue', { durable: true });
}

export function getChannel(): Channel {
  return channel;
}

// // import amqplib from 'amqplib';

// // export const connectRabbitMQ = async () => {
// //     const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
// //     const channel = await connection.createChannel();
// //     await channel.assertQueue('tasks');
// //     return { connection, channel };
// // };
// import amqp from 'amqplib';

// let channel: amqp.Channel;

// export async function connectRabbitMQ():Promise<amqp.Channel | undefined> {
//   try {
//     const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
//     channel = await connection.createChannel();
//     console.log('RabbitMQ connected');
//     return channel
//   } catch (error) {
//     console.error('Error connecting to RabbitMQ', error);
//     return error as undefined
//   }
// }

// export function getChannel(): amqp.Channel {
//   if (!channel) {
//     throw new Error('RabbitMQ channel is not initialized');
//   }
//   return channel;
// }
