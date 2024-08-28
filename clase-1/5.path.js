const path = require("node:path")

// Barra separadora de carpetas tu sistema operativo
// console.log(path.sep)

// Unir rutas con path.join
// const filePath = path.join('content', 'subfolder', 'test.txt')
// console.log(filePath)

// Nombre del archivo
// const base = path.basename('/tmp/tavo-secret-files/password.txt')
// console.log(base)

// Extension del archivo
const extension = path.extname('image.jpg')
console.log(extension)