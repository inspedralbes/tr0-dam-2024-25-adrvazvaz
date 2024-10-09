//const { spawn } = require('child_process');


const { exec } = require('child_process');

console.log("before exec!");
// Ejecutar un comando de sistema
exec('ls -l; sleep 2', 
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error}`);
      return;
    }
  
    // Imprimir la salida estándar del comando
    console.log(`Salida estándar: ${stdout}`);
    
    // Imprimir la salida de error del comando
    console.error(`Salida de error: ${stderr}`);
  });
  
  console.log("after exec");