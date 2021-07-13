import { MIME_TYPES } from '../../config/extensions';

const separator = '.';

const getFileName = (fileName: string) => {
  const splitArr = fileName.split(separator);
  return {
    type: MIME_TYPES.pdf,
    name: splitArr.reduce((acc, curr) => curr === MIME_TYPES.pdf ? acc : `${acc}${separator}${curr}`),
  }
}

export default getFileName;