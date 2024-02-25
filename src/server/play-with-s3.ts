import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Remult } from 'remult';
import type { Response } from 'express';
import { BottleImages } from '../app/bottles/bottles';
import { pipeline } from 'stream';
import { promisify } from 'util';

const prefix = 'men/botteImages/';
export async function playWithS3(remult: Remult) {
  return;
  for (const image of await remult.repo(BottleImages).find({
    where: {
      image: { '!=': 's3' },
    },
  })) {
    const result = await base64ToS3(image.id, image.image);
    if (result.$metadata.httpStatusCode == 200) {
      image.image = 's3';
      await image.save();
    } else {
      console.log(result);
    }
    //console.log(result);
  }
}

export async function base64ToS3(key: string, image: string) {
  const s3Client = new S3Client({ region: 'eu-west-1' });
  let split = image.split(',');
  let type = split[0].substring(5).replace(';base64', '');
  const buffer = Buffer.from(split[1], 'base64');
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: 'menb',
      Key: prefix + key,
      ContentType: type,
      Body: buffer,
    })
  );
  return result;
}

export async function getFromS3(key: string) {
  const s3Client = new S3Client({ region: 'eu-west-1' });
  const result = await s3Client.send(
    new GetObjectCommand({
      Bucket: 'menb',
      Key: prefix + key,
    })
  );
  return {
    ContentType: result.ContentType,

    async getBuffer() {
      return Buffer.from(await result.Body?.transformToByteArray()!);
    },
    writeToResponse(response: Response) {
      response.contentType(result.ContentType!);
      const pipelinePromise = promisify(pipeline);
      return pipelinePromise(
        result.Body!.transformToWebStream() as any as NodeJS.ReadableStream,
        response
      );
    },
  };
}
