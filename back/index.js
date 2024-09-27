const express = require('express');
const fs = require('fs'); 
const app = express();
const port = 3000;

app.use(express.json());
 

//PARA LA WEB PORQUE SALEN LAS RESPUESTAS
app.get('/getPreguntes', (req, res) => {

    fs.readFile('./PreguntesCompletes.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({ error: 'Error al leer el archivo' }); 
            return;
        }

        try {
            const preguntas = JSON.parse(data);       
            res.json(preguntas); 
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            res.status(500).json({ error: 'Error al parsear el archivo JSON' });
        }
    });
});




app.get('/getPreguntesAndoridApp', (_req, res) => {

    fs.readFile('./PreguntesCompletes.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({ error: 'Error al leer el archivo' }); 
            return;
        }
        try {
            const preguntas = JSON.parse(data); 
            
            const preguntasSinCorrectas = preguntas.preguntes.map(pregunta => {
                return {
                    id: pregunta.id,
                    pregunta: pregunta.pregunta,
                    respostes: pregunta.respostes.map(resposta => {
                        return {
                            id: resposta.id,
                            resposta: resposta.resposta
                            // No incluir 'correcta'
                        };
                    }),
                    imatge: pregunta.imatge
                };
            });

            res.json({ preguntes: preguntasSinCorrectas }); // Enviar el objeto modificado como respuesta
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            res.status(500).json({ error: 'Error al parsear el archivo JSON' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
