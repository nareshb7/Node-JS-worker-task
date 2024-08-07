import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
require("dotenv").config()

const KEY = process.env.AWS_ACCESS_KEY_ID  || ""
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || ""
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export async function uploadFileToS3(bucket: string, key: string, filePath: string): Promise<void> {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: fileStream,
  };

  await s3.send(new PutObjectCommand(uploadParams));
}


// import AWS from 'aws-sdk';
// import fs from "fs"

// AWS.config.update({ region: 'us-east-1' });

// const s3 = new AWS.S3();

// export async function uploadFileToS3(bucket: string, key: string, filePath: string): Promise<void> {
//   const fileStream = fs.createReadStream(filePath);

//   const uploadParams = {
//     Bucket: bucket,
//     Key: key,
//     Body: fileStream,
//   };

//   await s3.upload(uploadParams).promise();
// }
