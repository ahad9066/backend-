require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const mime = require('mime');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

class AwsStorage {

  // Upload file to S3
  static async uploadFile(fileBuffer, folderName, fileName) {
    try {
      // const fileStream = fs.createReadStream(file.path);
      const uploadParams = {
        // Bucket: bucketName,
        // Body: fileStream,
        // Key: folderName + '/' + file.filename,
        Bucket: bucketName,
        Body: fileBuffer,
        Key: `${folderName}/${fileName}`,
      };
      return s3.upload(uploadParams).promise();
    } catch (err) {
      console.log("awssss", err);
      throw (err);
    }
  }

  // Download file from S3 using fileKey and bucket name
  static async getFileStream(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };

    return s3.getObject(downloadParams).createReadStream();
  }

  // Get file from S3 and send it as attachment
  static async getFileForEmail(fileKey) {
    const { Body } = await s3.getObject({
      Key: fileKey,
      Bucket: bucketName
    }).promise()
    const attachment = {
      filename: fileKey.split('/')[1],
      type: mime.getType(fileKey.split('.')[1]),
      content: Body.toString('base64'),
      disposition: 'attachment'
    };
    return attachment;
  }
}



module.exports = AwsStorage;
