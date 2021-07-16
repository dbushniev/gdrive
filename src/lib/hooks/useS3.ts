import ReactS3Client from '../api/s3';
import { useEffect, useMemo, useState } from 'react';
import { S3File } from '../models/S3File/S3File';
import {
  ListFileErrorResponse, ListFileResponse,
} from '../api/s3/types';
import { useGapiContext } from '../providers/GapiProvider';


const useS3 = () => {
  const [s3Files, setS3files] = useState<S3File[]>([]);
  const [isS3FilesLoading, seIisS3FilesLoading] = useState<boolean>(false);

  const {
    gapi,
    isSignIn,
  } = useGapiContext();

  const guid = useMemo(() => {
    if (isSignIn && gapi) return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId()
  }, [isSignIn, gapi]);

  const s3Config = useMemo(() => ({
    bucketName:  process.env.REACT_APP_S3_BUCKET_NAME || '',
    region: process.env.REACT_APP_S3_REGION || '',
    accessKeyId: process.env.REACT_APP_S3_ACESS_KEY || '',
    secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY || '',
    s3Url: `${process.env.REACT_APP_S3_URL}` || '',
    ...(gapi && isSignIn && { dirName: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId() }),
  }), [isSignIn, gapi]);

  useEffect(() => {
    guid && listS3Files(guid);
  }, [guid])

  const listS3Files = async (prefix: string = '') => {
    const s3 = new ReactS3Client(s3Config);
    try {
      seIisS3FilesLoading(true);
      const res: ListFileResponse | ListFileErrorResponse = await s3.listFiles(prefix);
      if ('errMessage' in res) throw new Error(res.errMessage);
      res.data.Contents && setS3files(res.data.Contents);
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
      await listS3Files(guid);
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
      await listS3Files(guid);
    } catch (e) {
      console.log(e);
    } finally {
      seIisS3FilesLoading(false);
    }
  }

  return {
    s3Files,
    guid,
    isS3FilesLoading,
    listS3Files,
    uploadS3File,
    deleteS3File
  }
}

export default useS3;