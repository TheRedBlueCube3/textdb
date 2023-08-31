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
		let data = '';

		for (let key in this.data) {
			let value = this.data[key];
			if (typeof value !== 'object') {
				data += `${key}=${value}\n`;
			} else {
				data += `{${key}}\n`;
				for(let skey in value) {  // does the part thing
					let svalue = value[skey] // skey and svalue mean sub key and sub value
					data += `${skey}=${svalue}`;
				}
			}
		}

		fs.writeFileSync(this.filePath, data, 'utf8');
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
