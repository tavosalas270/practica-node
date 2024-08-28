const fs = require('node:fs/promises');
// const { promisify } = require('node:util');

// Sincronico
// const text = fs.readFileSync('./archivo.txt', 'utf-8');

// console.log(text);

// Asincronico
// fs.readFile('./archivo.txt', 'utf-8', (err, text) => {
//     console.log("Primer texto: ", text);
// });

// Manejo de promesas con el propio fs
// fs.readFile('./archivo.txt', 'utf-8').then((text) => {
//     console.log("Primer texto: ", text);
// });


// Manejo de promesas con util
// const readFilePromise = promisify(fs.readFile)