import getFileInfo from './getFileInfo';

const fileConvert = (byteString: string, fileName: string) => {
  const { type, name } = getFileInfo(fileName);

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) int8Array[i] = byteString.charCodeAt(i);
  const blob = new Blob([int8Array], { type });
  return {
    name,
    file: new File([blob], name, { type }),
  }
}

export default fileConvert;