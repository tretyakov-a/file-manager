import fsPromises from 'fs/promises'
import fs from 'fs';

async function isFileExists(source) {
  try {
    await fsPromises.access(source, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export {
  isFileExists
};
