import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Environment variables
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// Initialize S3 Client
const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: true, // Use path-style access if needed
});

// Generate a random image name
const randomImgName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const uploadImageInBucket = async (fileBuffer, mimeType) => {
  try {
    const imgName = `${randomImgName()}`; // Generate a unique name for the image
    const params = {
      Bucket: bucketName,
      Key: imgName,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return imgName;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const getImageURL = async (imgName) => {
  try {
    if (Array.isArray(imgName)) {
      imgName = imgName[0]; // Handle if imgName is an array
    }

    if (!imgName) {
      throw new Error("Image name is missing or undefined");
    }

    const getObjectParams = {
      Bucket: bucketName,
      Key: imgName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL valid for 1 hour

    return url;
  } catch (error) {
    console.error("Error generating signed URL for image:", imgName, error);
    throw new Error("Failed to generate signed URL");
  }
};

export const deleteImageFromBucket = async (imgName) => {
  try {
    if (!imgName) {
      console.warn("No image name provided for deletion.");
      return;
    }

    const deleteParams = {
      Bucket: bucketName,
      Key: imgName,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);

  } catch (error) {
    console.error("Error deleting image from S3:", error);
    throw new Error("Failed to delete image");
  }
};
