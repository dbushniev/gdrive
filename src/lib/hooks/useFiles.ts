import { Key, useEffect, useState } from 'react';
import { DocumentQuery } from '../models/Document/DocumentQuery';
import { ORDER } from '../../config/order';
import { useGapiContext } from '../providers/GapiProvider';
import { DocumentResponse } from '../models/Document/DocumentResponse';

const useFiles = (query: DocumentQuery) => {
  const [res, serRes] = useState<DocumentResponse>({ files: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    gapi,
    isSignIn,
  } = useGapiContext();

  useEffect(() => {
    if (isSignIn) handleLoadList();
  }, [
    isSignIn,
    query.pageSize,
    query.search,
    query.orderBy,
    query.order
  ]);

  const handleLoadList = async (pageToken: string = '') => {
    try {
      setIsLoading(true);
      const res: { result: DocumentResponse } = await gapi?.client.drive.files.list({
        pageSize: query.pageSize,
        q: `name contains '${query.search}' and mimeType='application/pdf'`,
        fields: "nextPageToken, files(id, name, thumbnailLink)",
        pageToken,
        ...(query.orderBy && { orderBy: `${query.orderBy} ${query.order === ORDER.ASC ? '' : ORDER.DESC}` }),
      })
      serRes((data) => ({
        ...data,
        files: pageToken ? [...data.files, ...res.result.files] : res.result.files,
        nextPageToken: res.result.nextPageToken
      }));
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = async (fileId: Key) => {
    try {
      setIsLoading(true);
      const file: { body: string } = await gapi?.client.drive.files.get({
        fileId,
        alt: 'media',
      });
      return file.body;
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...res,
    isLoading,
    handleLoadList,
    handleDownloadFile,
  }

}

export default useFiles;