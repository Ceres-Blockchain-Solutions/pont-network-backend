import * as fs from 'fs';
import * as path from 'path';
import { ShipDataEncryptedDto } from 'src/ship/dto/create-ship-encypted.dto';

const filePath = path.join(__dirname, 'shipQueue.json'); // Define the file path
const shipEncryptedDataQueueFilePath = path.join(
  __dirname,
  'shipEncryptedDataQueue.json',
);

// Save EncryptedDataQueue array to file
export function saveEncryptedShipQueueToFile(shipEncryptedDataQueue): void {
  try {
    const data = JSON.stringify(shipEncryptedDataQueue, null, 2); // Convert array to JSON string
    fs.writeFileSync(this.shipEncryptedDataQueueFilePath, data, 'utf8'); // Write to file
    console.log('EncryptedShipQueue saved to file successfully.');
  } catch (error) {
    console.error('Error saving EncryptedShipQueue to file:', error);
  }
}

// Load EncryptedDataQueue array from file
export function loadEncryptedShipQueueFromFile(): string[] {
  try {
    if (fs.existsSync(this.filePath)) {
      const fileData = fs.readFileSync(
        this.shipEncryptedDataQueueFilePath,
        'utf8',
      ); // Read file content
      console.log('EncryptedShipQueue loaded from file successfully.');
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
