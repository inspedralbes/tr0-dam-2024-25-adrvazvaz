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


app.get('/getPreguntesAndoridApp', (req, res) => {

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
                            
                        };
                    }),
                    imatge: pregunta.imatge
                };
            });

            res.json({ preguntes: preguntasSinCorrectas }); 
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            res.status(500).json({ error: 'Error al parsear el archivo JSON' });
        }
    });
});


app.post('/addPregunta', (req, res) => {
    const newPregunta = req.body; 
    
    if (!newPregunta.id || !newPregunta.pregunta || !newPregunta.respostes) {
        return res.status(400).json({ error: 'Faltan datos en la pregunta' });
    }
    
    preguntas.push(newPregunta); 
    res.status(201).json(newPregunta); 
});


app.put('/updatePregunta/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const updatedPregunta = req.body; 
    
    const preguntaIndex = preguntas.findIndex(p => p.id === id);

    if (preguntaIndex === -1) {
        return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    preguntas[preguntaIndex].pregunta = updatedPregunta.pregunta || preguntas[preguntaIndex].pregunta;
    preguntas[preguntaIndex].respostes = updatedPregunta.respostes || preguntas[preguntaIndex].respostes;

    res.json(preguntas[preguntaIndex]); 
});



app.delete('/deletePregunta/:id', (req, res) => {
    const id = parseInt(req.params.id); 


    const preguntaIndex = preguntas.findIndex(p => p.id === id);

    if (preguntaIndex === -1) {
        return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    preguntas.splice(preguntaIndex, 1);
    res.status(204).send(); 
});



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
