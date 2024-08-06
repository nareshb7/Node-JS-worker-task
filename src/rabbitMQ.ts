// import amqplib from 'amqplib';

// export const connectRabbitMQ = async () => {
//     const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
//     const channel = await connection.createChannel();
//     await channel.assertQueue('tasks');
//     return { connection, channel };
// };
import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ():Promise<amqp.Channel | undefined> {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('RabbitMQ connected');
    return channel
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
    return error as undefined
  }
}

export function getChannel(): amqp.Channel {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  return channel;
}
