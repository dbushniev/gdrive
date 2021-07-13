import { MIME_TYPES, TYPES } from '../../config/extensions';

const separator = '.';

const getFileInfo = (fileName: string) => {
  const splitArr = fileName.split(separator);
  return {
    type: MIME_TYPES.pdf,
    name: splitArr.reduce((acc, curr) => curr === TYPES.pdf ? acc : `${acc}${separator}${curr}`),
  }
}

export default getFileInfo;