'use strict'
const { S3 } = require('aws-sdk');
const csvParser = require('csv-parser');

const s3 = new S3({ region: 'eu-central-1' });
const { S3_BUCKET } = process.env;

const bucketSource = 'uploaded';
const bucketDist = 'parsed';

async function moveFiles(objectKey) {
  return new Promise((resolve, reject) => {
    const readStream = s3.getObject({ Bucket: process.env.S3_BUCKET, Key: objectKey }).createReadStream();

    readStream
      .pipe(csvParser())
      .on('end', async () => {
        const source = `${S3_BUCKET}/${objectKey}`;
        const distKey = objectKey.replace(bucketSource, bucketDist);

        await s3.copyObject({
          Bucket: S3_BUCKET,
          CopySource: source,
          Key: distKey,
        }).promise();

        await s3.deleteObject({
          Bucket: S3_BUCKET,
          Key: objectKey,
        }).promise();

        resolve();
      })
      .on('error', err => {
        console.log('Error:', err);
        reject(err);
      });
  });
}

module.exports.main = async (event) => {
  if (!event.Records) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Event records are not defined!'
      })
    }
  }
  for (const record of event.Records) {
    const objectKey = record.s3.object.key;

    try {
      await moveFiles(objectKey);
      return {
        statusCode: 200
      }
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify(err)
      }
    }
  }
}