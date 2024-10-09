const { spawn } = require('child_process');

// Ejemplo: Ejecutar el comando 'ls' para listar archivos en el directorio actual
const ls = spawn('ls', ['-l', '-a']); // 'ls -l -a' para listar todos los archivos, incluyendo los ocultos

// Capturar la salida estándar del comando 'ls'
ls.stdout.on('data', (data) => {
  console.log(`Salida estándar:\n${data}`);
});

// Manejar la finalización del comando 'ls'
ls.on('close', (code) => {
  console.log(`Proceso 'ls' se cerró con código de salida ${code}`);
});