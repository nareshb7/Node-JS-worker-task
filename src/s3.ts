import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const createRandomFile = (fileSize: number, fileName: string) => {
    const filePath = path.join(__dirname, fileName);
    const buffer = Buffer.alloc(fileSize * 1024 * 1024, 'a');
    fs.writeFileSync(filePath, buffer);
    return filePath;
};

export const uploadFileToS3 = async (filePath: string, s3Destination: string) => {
    const fileContent = fs.readFileSync(filePath);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${s3Destination}/${path.basename(filePath)}`,
        Body: fileContent,
    };

    const start = Date.now();
    await s3.upload(params).promise();
    const end = Date.now();

    const timeToCopy = (end - start) / 1000;
    const totalSize = fileContent.length / (1024 * 1024);
    const rateOfCopy = totalSize / timeToCopy;

    return {
        timeToCopy,
        rateOfCopy,
        totalSize,
    };
};
