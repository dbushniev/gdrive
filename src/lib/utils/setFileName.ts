import getFileInfo from './getFileInfo';
import { S3File } from '../models/S3File/S3File';

const setFileName = (s3Files: S3File[], fileName: string) => {
  const numberOfCopies = s3Files.reduce((acc, s3File) => {
    const _fileName = getFileInfo(s3File.Key).name.split('/').pop() || ''; //Get file name without directory. Example 1241781267481627/Test.pdf => Test.pdf
    const isMatch = new RegExp(`^${fileName}\\s\\(\\d\\)$`).test(_fileName); // Check files like Test (1), Test (2) in s3 bucket
    if (isMatch) return [...acc, Number(_fileName.replace(/.+\s\((\d)\)/g, '$1'))]; // Get only number from brackets
    return acc;
  }, [] as number[]);
  return numberOfCopies.length ? `${fileName} (${Math.max(...numberOfCopies) + 1})` : fileName;
}

export default setFileName;