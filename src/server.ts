import express from 'express';
import path from 'path';
import { sendTask } from './taskProducer';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let logEntries: any[] = [];
const BUCKET_NAME = process.env.S3_BUCKET_NAME || ""

app.post('/start-task', async (req, res) => {
    const { fileCount, fileSize, } = req.body;
    console.log("DATA::::", { fileCount, fileSize })
    try {
        const logEntry = await sendTask(fileCount, fileSize* 1024 * 1024, BUCKET_NAME);
        logEntries.push(logEntry);
        res.json({ message: 'Task started successfully', data: logEntries });
    } catch (error: any) {
        res.status(500).json({ message: 'Error starting task', error: error.message });
    }
});

app.get('/upload-data', (req, res) => {
    res.json(logEntries);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
