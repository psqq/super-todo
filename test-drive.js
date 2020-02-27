const drive = require('./drive');

async function main() {
  /** @type {drive.GoogleDrive} */
  const d = new drive.GoogleDrive();
  await d.init();

  let id = await d.getIdByFilename('package2.json');

  console.log(id);
}

main();
