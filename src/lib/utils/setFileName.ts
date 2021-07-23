import getFileInfo from './getFileInfo';
import { S3File } from '../models/S3File/S3File';

const setFileName = (s3Files: S3File[], fileName: string) => {
  const originName =  getFileInfo(fileName).name;
  const isFileAlreadyDownload = s3Files.find((s3File) => _fileNameWithoutDirectory(s3File.Key) === originName);
  const numberOfCopies = s3Files.reduce((acc, s3File) => {
    const _fileName = _fileNameWithoutDirectory(s3File.Key); //Get file name without directory. Example 1241781267481627/Test.pdf => Test.pdf
    const isMatch = new RegExp(`^${originName}\\s\\(\\d+\\)$`).test(_fileName); // Check files like Test (1), Test (2) in s3 bucket
    if (isMatch) return [...acc, Number(_fileName.replace(/.+\s\((\d+)\)/g, '$1'))]; // Get only number from brackets
    return acc;
  }, [] as number[]);
  if (isFileAlreadyDownload && !numberOfCopies.length) return `${originName} (1)`;
  return numberOfCopies.length ? `${originName} (${Math.max(...numberOfCopies) + 1})` : originName;
}

const _fileNameWithoutDirectory = (fileName: string = '') =>  getFileInfo(fileName).name.split('/').pop() || '';

export default setFileName;