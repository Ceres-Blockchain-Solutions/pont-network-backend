import * as fs from 'fs';
import * as path from 'path';

const shipEncryptedDataQueueFilePath = path.join(
  __dirname,
  'shipEncryptedDataQueue.json',
);
const file = shipEncryptedDataQueueFilePath.replace('/dist', '/src');

// Save EncryptedDataQueue array to file
export function saveEncryptedShipQueueToFile(shipEncryptedDataQueue): void {
  try {
    const data = JSON.stringify(shipEncryptedDataQueue, null, 2); // Convert array to JSON string
    fs.writeFileSync(file, data, 'utf8');
  } catch (error) {
    console.error('Error saving EncryptedShipQueue to file:', error);
  }
}

// Load EncryptedDataQueue array from file
export function loadEncryptedShipQueueFromFile(): string[] {
  try {
    if (fs.existsSync(file)) {
      const fileData = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(fileData); // Convert JSON string to array

      return data;
    } else {
      console.log(
        'File does not exist, starting with empty EncryptedShipQueue.',
      );
    }
  } catch (error) {
    console.error('Error loading EncryptedShipQueue from file:', error);
  }
}
