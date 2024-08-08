import express from 'express';
import path from 'path';
import { sendTask } from './taskProducer';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let logEntries: any[] = [];
const BUCKET_NAME = process.env.S3_BUCKET_NAME || ""

app.post('/start-task', async (req, res) => {
    const { fileCount, fileSize,s3Destination } = req.body;
    console.log("DATA::::", { fileCount, fileSize,s3Destination })
    try {
        const logEntry = await sendTask(fileCount, fileSize* 1024 * 1024, s3Destination);
        logEntries.push(logEntry);
        res.json({ message: 'Task started successfully', data: logEntries });
    } catch (error: any) {
        const errorMessage = { message: 'Error starting task', error: error.message }
        console.error(errorMessage)
        res.status(500).json(errorMessage);
    }
});

app.get('/upload-data', (req, res) => {
    res.json(logEntries);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
