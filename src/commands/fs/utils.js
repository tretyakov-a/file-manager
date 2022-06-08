import fsPromises from 'fs/promises'
import fs from 'fs';
import { pipeline } from 'stream/promises';

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

function createStream(source, flag = 'r') {
  return new Promise((resolve, reject) => {
    const stream = flag === 'r'
      ? fs.createReadStream(source)
      : fs.createWriteStream(source, { flags: flag });
    stream.on('ready', () => resolve(stream));
    stream.on('error', reject);
  })
}

const createReadStream = (source) => createStream(source, 'r');
const createWriteStream = (source) => createStream(source, 'wx');

async function copyFile(src, dest) {
  const readStream = await createReadStream(src);
  const writeStream = await createWriteStream(dest);

  return pipeline(readStream, writeStream);
}

export {
  toSnakeCase,
  isFileExists,
  createReadStream,
  createWriteStream,
  copyFile,
};
