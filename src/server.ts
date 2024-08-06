// import express from 'express';
import dotenv from 'dotenv';
import { connectRabbitMQ } from './rabbitMQ';
import { createParentTask } from './parentTask';
import { startWorker } from './workerTask';

// const app = express();
// app.use(express.json());

dotenv.config();

(async function () {
  await connectRabbitMQ();

  if (process.env.ROLE === 'parent') {
    const fileCount = parseInt(process.env.FILE_COUNT || '10', 10);
    const fileSize = parseInt(process.env.FILE_SIZE || '1', 10); // in MB
    const s3Destination = process.env.S3_BUCKET || '';
    await createParentTask(fileCount, fileSize, s3Destination);
  } else {
    await startWorker();
  }
})();



// app.post('/start-task', async (req, res) => {
//     const { fileCount, fileSize, s3Destination } = req.body;
//     await connectRabbitMQ();

//     // const fileCount = parseInt(process.env.FILE_COUNT || '10', 10);
//     // const fileSize = parseInt(process.env.FILE_SIZE || '1', 10); // in MB
//     // const s3Destination = process.env.S3_BUCKET || '';
//     await createParentTask(fileCount, fileSize, s3Destination);

//     // await runParentTask(fileCount, fileSize, s3Destination);
//     res.send('Task started');
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
