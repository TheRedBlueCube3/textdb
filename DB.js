import fs from 'fs';

class DB {
	constructor(filePath) {
		this.filePath = filePath;
		this.data = this._loadDataFromFile();
	}
	_loadDataFromFile() {
		try {
			const data = fs.readFileSync(this.filePath, 'utf8');
			const entries = data.split(/\r?\n/); // Split by lines
			const parsedData = {};
			let currentSection = null;

			for (const entry of entries) {
				console.log(entry);
				if (entry.startsWith('{')) {
					currentSection = entry.slice(1, -1);
					console.log(currentSection);
					parsedData[currentSection] = {};
				} else if (entry.includes('=')) {
					const [key, value] = entry.split('=', 1); // Split by the first "=" character
					if (currentSection != null && key) {
						parsedData[currentSection][key] = value;
					} else if (currentSection == null && key) {
						parsedData[key] = value;
					}
				}
			}
			console.log(parsedData);
			return parsedData;
		} catch (error) {
			return {};
		}
	}

	_saveDataToFile() {
		let dataStr = '';
		// ensure the null data is written at the top, if it exists
		if (this.data[null]) {
			for (const key in this.data[null]) {
				const value = this.data[null][key];
				if (typeof value === 'string') {
					// Write string values directly to the file
					dataStr += `${key}=${value}\n`;
				} else {
					// Iterate over the keys of non-string values
					for (const subKey in value) {
						dataStr += `${key}.${subKey}=${value[subKey]}\n`;
					}
				}
			}
		}

		for (const part in this.data) {
			if (part !== 'null') {
				//ignore null data here
				dataStr += `{${part}}\n`;
				for (const key in this.data[part]) {
					if (part === 'thingy') {
						// Only write keys that belong to the "thingy" part
						dataStr += `${key}=${this.data[part][key]}\n`;
					}
				}
			}
		}
		fs.writeFileSync(this.filePath, dataStr, 'utf8');
	}

	// Public method to read a value
	read(partName, keyName) {
		if (this.data[partName] && this.data[partName][keyName]) {
			return this.data[partName][keyName];
		}
		if (!this.data[partName] && this.data[keyName]) {
			return this.data[keyName];
		}
		return undefined;
	}

	// Public method to write a value
	write(partName, keyName, value) {
		if (partName === null) {
			// Handle headerless keys
			this.data[keyName] = String(value);
		} else {
			// Handle keys with headers
			if (!this.data[partName]) {
				this.data[partName] = {};
			}
			this.data[partName][keyName] = String(value);
		}
		this._saveDataToFile();
		return value;
	}
}

export default DB;
