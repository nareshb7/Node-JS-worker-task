import { createRandomFile, uploadFileToS3 } from './s3';
import { getChannel } from './rabbitMQ';

const runChildTask = async (fileSize: number, s3Destination: string) => {
    const fileName = `file-${Date.now()}-${Math.random()}.txt`;
    const filePath = createRandomFile(fileSize, fileName);
    const result = await uploadFileToS3(filePath, s3Destination);

    console.log(`File ${fileName} uploaded:`, result);
};

export const startWorker = async () => {
    const channel = getChannel();
    channel.consume('tasks', async (msg) => {
        if (msg) {
            const { fileSize, s3Destination } = JSON.parse(msg.content.toString());
            await runChildTask(fileSize, s3Destination);
            channel.ack(msg);
        }
    });
};

startWorker();
