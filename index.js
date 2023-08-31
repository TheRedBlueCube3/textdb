import DB from './DB.js';

const database = new DB('data.tdb');

database.write(null, 'thingy', 'two');
database.write('head', 'thingy', 'three');

console.log(database.read(null, 'thingy', 'two'));
