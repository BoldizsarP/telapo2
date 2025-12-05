import * as fs from 'fs';
import { stringify } from 'csv-stringify/sync';

/**
 * ResultStore is a static utility class designed to simplify the process of collecting and storing
 * results from interactive scripts, without requiring the script author to worry about whether
 * the results are needed, where they are stored, or how they are persisted.
 *
 * Note: While `ResultStore` makes it easy to accumulate results throughout the execution of an interactive script,
 * it is still the responsibility of the script author to explicitly flush (persist) the storage by calling
 * `ResultStore.pushFile()` once the script has finished running or at the appropriate point in the workflow.
 * This ensures that all collected results are actually written to disk, as `ResultStore` does not automatically
 * persist data on exit or at any other time.
 *
 * Usage is intentionally similar to a stack or queue: scripts simply call `ResultStore.addData([...])`
 * to add a row of results, and later call `ResultStore.pushFile()` to persist all accumulated results
 * to disk. If result storage is not enabled, these methods are effectively no-ops, so scripts do not
 * need to include conditional logic.
 *
 * A typical flow is as follows: when data collection starts, the script sets a description header
 * (e.g., `['varA', 'varB', ...]`) and then pushes entries one by one, as if it were a CSV file.
 *
 * A script can contain multiple, different-sized rows; just make sure to always push a header first,
 * as this differentiates the data blocks. Each header row should precede its corresponding data rows,
 * allowing the output file to contain multiple sections with different structures if needed.
 */
export class ResultStore {
  private static storage: string[][] = [];
  private static csvFileName: string = 'results.csv';
  private static enabled: boolean = false;

  /**
   * Adds a list of string values to the static storage
   * @param data - Array of string values to add to storage
   */
  static addData(data: string[]): void {
    if (!this.enabled) {
      return;
    }

    this.storage.push(data);
  }

  /**
   * Stores the static storage data into a CSV file
   * Each string in storage becomes a row in the CSV
   * Appends to existing file content if file already exists
   */
  static pushFile(): void {
    if (!this.enabled) {
      return;
    }

    if (this.storage.length === 0) {
      console.log('No data to write to CSV file');
      return;
    }

    try {
      // Convert storage array to proper CSV format using csv-stringify
      const csvContent = stringify(this.storage);

      // Check if file exists to determine if we need a newline separator
      const fileExists = fs.existsSync(this.csvFileName);
      const contentToWrite = fileExists ? '\n' + csvContent : csvContent;

      // Append to file (creates file if it doesn't exist)
      fs.appendFileSync(this.csvFileName, contentToWrite, 'utf8');
      console.log(`Data appended to ${this.csvFileName}`);

      // Clear storage after writing
      this.storage = [];
    } catch (error) {
      console.error('Error writing CSV file:', error);
    }
  }

  /**
   * Updates the CSV file name to be used for storage
   * @param fileName - The new CSV file name
   */
  static setName(fileName: string): void {
    if (!fileName.endsWith('.csv')) {
      this.csvFileName = fileName + '.csv';
    } else {
      this.csvFileName = fileName;
    }
  }

  /**
   * Gets the current storage data (for debugging/testing purposes)
   */
  static getStorage(): string[][] {
    return this.storage;
  }

  /**
   * Gets the current CSV file name
   */
  static getFileName(): string {
    return this.csvFileName;
  }

  /**
   * Clears the current storage without writing to file
   */
  static clearStorage(): void {
    this.storage = [];
  }

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  static purgeFile(): void {
    fs.writeFileSync(this.csvFileName, '');
  }
}
