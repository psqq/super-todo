const drive = require('./drive');

async function main() {
  /** @type {drive.GoogleDrive} */
  const d = new drive.GoogleDrive();
  await d.init();
  let id;
  try {
    id = await d.getIdByFilename('package.json');
  } catch (err) {
    console.error(err);
  }
  console.log('id', id);
  let s = await d.downloadFile('package.json');
  console.log('s', s);
  console.log('upload id', await d.uploadFile('test.txt', '123 123'));
  s = await d.downloadFile('test.txt');
  console.log('s', s);
}

main();
