import ReactS3Client from 'react-aws-s3-typescript';
import { useEffect, useState } from 'react';
import { S3File } from '../models/S3File/S3File';
import {
  ListFileErrorResponse, ListFileResponse,
} from 'react-aws-s3-typescript/dist/types';

const s3Config = {
  bucketName:  process.env.REACT_APP_S3_BUCKET_NAME || '',
  region: process.env.REACT_APP_S3_REGION || '',
  accessKeyId: process.env.REACT_APP_S3_ACESS_KEY || '',
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY || '',
  s3Url: process.env.REACT_APP_S3_URL || ''
}

const useS3 = () => {
  const [s3Files, setS3files] = useState<S3File[]>([]);
  const [isS3FilesLoading, seIisS3FilesLoading] = useState<boolean>(false);

  useEffect(() => {
    listS3Files();
  }, [])

  const listS3Files = async () => {
    const s3 = new ReactS3Client(s3Config);
    try {
      seIisS3FilesLoading(true);
      const res: ListFileResponse | ListFileErrorResponse = await s3.listFiles();
      if ('errMessage' in res) throw new Error(res.errMessage);
      setS3files(res.data.Contents);
    } catch (e) {
      console.log(e);
    } finally {
      seIisS3FilesLoading(false);
    }
  }

  const uploadS3File = async (file: File, fileName: string) => {
    const s3 = new ReactS3Client(s3Config);
    try {
      seIisS3FilesLoading(true);
      await s3.uploadFile(file, fileName);
      await listS3Files();
    } catch (e) {
      console.log(e);
    } finally {
      seIisS3FilesLoading(false);
    }
  }

  const deleteS3File = async (path: string) => {
    const s3 = new ReactS3Client(s3Config);

    try {
      seIisS3FilesLoading(true);
      await s3.deleteFile(path);
      await listS3Files();
    } catch (e) {
      console.log(e);
    } finally {
      seIisS3FilesLoading(false);
    }
  }

  return {
    s3Files,
    isS3FilesLoading,
    listS3Files,
    uploadS3File,
    deleteS3File
  }
}

export default useS3;