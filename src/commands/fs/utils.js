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


const toSnakeCase = (str) => {
  let result = '';
  for (const c of str) {
    if (c === c.toUpperCase()) {
      result += '_';
    }
    result += c.toLowerCase();
  }
  return result;
};

export {
  toSnakeCase,
  isFileExists,
};
