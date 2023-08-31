declare class DB {
	constructor(filePath: string);

	private _loadDataFromFile(): Record<string, Record<string, string>>;
	private _saveDataToFile(): void;
	/**
	 * Reads a value from a key.
	 * @param partName Part in where the key is.
	 * @param keyName Key name to read the value from.
	 * @returns The value.
	 */
	read(partName: string | null, keyName: string): string | undefined;
	/**
	 * Writes a value to a key.
	 * @param partName Part to write to, containing the key.
	 * @param keyName Key to write to.
	 * @param value The value.
	 * @returns The value.
	 */
	write(partName: string | null, keyName: string, value: string): string;

	filePath: string;
	data: Record<string, Record<string, string>>;
}

export default DB;
