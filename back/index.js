const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());


// Leer el archivo JSON y parsear su contenido
const leerPreguntas = () => {
    const data = fs.readFileSync('./PreguntesCompletes.json', 'utf8');
    return JSON.parse(data);
};

// Guardar las preguntas en el archivo JSON
const guardarPreguntas = (preguntas) => {
    fs.writeFileSync('./PreguntesCompletes.json', JSON.stringify(preguntas, null, 2), 'utf8');
};

// PARA LA WEB PORQUE SALEN LAS RESPUESTAS
app.get('/getPreguntes', (req, res) => {
    try {
        const preguntas = leerPreguntas();
        res.json(preguntas);
    } catch (err) {
        console.error('Error al leer o parsear el archivo:', err);
        res.status(500).json({ error: 'Error al leer el archivo' });
    }
});

// PARA LA APP ANDROID SIN LAS RESPUESTAS CORRECTAS
app.get('/getPreguntesAndoridApp', (req, res) => {
    try {
        const preguntas = leerPreguntas();

        // Filtrar las respuestas correctas
        const preguntasSinCorrectas = preguntas.preguntes.map(pregunta => ({
            id: pregunta.id,
            pregunta: pregunta.pregunta,
            respostes: pregunta.respostes.map(resposta => ({
                id: resposta.id,
                resposta: resposta.resposta
            })),
            imatge: pregunta.imatge
        }));

        res.json({ preguntes: preguntasSinCorrectas });
    } catch (err) {
        console.error('Error al leer o parsear el archivo:', err);
        res.status(500).json({ error: 'Error al parsear el archivo JSON' });
    }
});


// Agregar nueva pregunta
app.post('/addPregunta', (req, res) => {
    const newPregunta = req.body;

    if (!newPregunta.id || !newPregunta.pregunta || !newPregunta.respostes) {
        return res.status(400).json({ error: 'Faltan datos en la pregunta' });
    }

    try {
        const preguntas = leerPreguntas();
        preguntas.preguntes.push(newPregunta); 
        guardarPreguntas(preguntas);
        res.status(201).json(newPregunta); 
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar la pregunta' });
    }
});


app.put('/updatePregunta', (req, res) => {
    const id = parseInt(req.params.id); 
    const updatedPregunta = req.body; 

    try {
        const preguntas = leerPreguntas(); 
        const pregunta = preguntas.preguntes.find(p => p.id === id);

        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Actualiza solo los campos que vienen en el cuerpo de la solicitud
        pregunta.pregunta = updatedPregunta.pregunta || pregunta.pregunta;
        pregunta.respostes = updatedPregunta.respostes || pregunta.respostes;

        guardarPreguntas(preguntas); 
        res.json(pregunta); 
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la pregunta' }); 
    }
});


// Eliminar una pregunta
app.delete('/deletePregunta/:id', (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const preguntas = leerPreguntas();
        const preguntaIndex = preguntas.preguntes.findIndex(p => p.id === id);

        if (preguntaIndex === -1) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        preguntas.preguntes.splice(preguntaIndex, 1);
        guardarPreguntas(preguntas);

        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la pregunta' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
