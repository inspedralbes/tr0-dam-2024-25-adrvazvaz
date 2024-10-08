const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Función para leer preguntas desde el archivo
const leerPreguntas = () => {
    try {
        const data = fs.readFileSync('./PreguntesCompletes.json', 'utf8');
        return JSON.parse(data); // Devuelve el objeto parseado
    } catch (err) {
        console.error('Error al leer el archivo JSON:', err);
        return { preguntes: [] }; // Devuelve un objeto vacío si hay un error
    }
};

// Guardar las preguntas en el archivo JSON
const guardarPreguntas = (preguntas) => {
    fs.writeFileSync('./PreguntesCompletes.json', JSON.stringify(preguntas, null, 2), 'utf8');
};

// PARA LA WEB PORQUE SALEN LAS RESPUESTAS
app.get('/getPreguntes', (req, res) => {
    try {
        const preguntas = leerPreguntas(); // Llamar a la función para obtener los datos
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
        const preguntasSinCorrectas = preguntas.preguntes.map(pregunta => ({
            id: pregunta.id,
            pregunta: pregunta.pregunta,
            respostes: pregunta.respostes.map(resposta => ({
                id: resposta.id, 
                resposta: resposta.resposta
            })),
            imatge: pregunta.imatge
        }));

        res.json(preguntasSinCorrectas); // Envía la respuesta correctamente
    } catch (err) {
        console.error('Error al leer o parsear el archivo:', err);
        res.status(500).json({ error: 'Error al parsear el archivo JSON' });
    }
});

// CREATE DE LA PARTE CRUD EN LA WEB, PARA PODER AÑADIR NUEVAS PREGUNTAS FUNCIONA
app.post('/addPregunta', (req, res) => {
    const newPregunta = req.body; // Obtener los datos de la nueva pregunta del cuerpo de la solicitud
    console.log('Nueva pregunta:', newPregunta);
    if (!newPregunta.pregunta || !Array.isArray(newPregunta.respostes) || newPregunta.respostes.length !== 4) {
        return res.status(400).json({ error: 'La pregunta debe tener un texto y exactamente 4 respuestas' });
    }
    // Generar un nuevo ID para la pregunta
    try {
        const preguntas = leerPreguntas();
        console.log('se han leído las preguntas');
        const newPreguntaId = preguntas.preguntes.length > 0
            ? preguntas.preguntes[preguntas.preguntes.length - 1].id + 1
            : 1;

        newPregunta.id = newPreguntaId; // Asignar el nuevo ID a la pregunta
        console.log('se ha generado un nuevo ID');
        // Generar IDs para respuestas
        for (let i = 0; i < newPregunta.respostes.length; i++) {
            newPregunta.respostes[i].id = i + 1; // Asignar un ID a cada respuesta
        }
        console.log('se han generados los IDs para las respuestas');
        preguntas.preguntes.push(newPregunta); // Agregar la nueva pregunta a la lista
        guardarPreguntas(preguntas); // Guardar las preguntas actualizadas
        res.status(201).json(newPregunta); // Enviar la nueva pregunta como respuesta
    } catch (err) {
        console.error('Error al guardar la pregunta:', err);
        res.status(500).json({ error: 'Error al guardar la pregunta' });
    }
});


// Actualizar pregunta
app.put('/updatePregunta/:id', (req, res) => { 
    const id = parseInt(req.params.id);
    const updatedPregunta = req.body; 
    console.log("ID recibido para actualizar pregunta")
    console.log(id); 

    try {
        const preguntas = leerPreguntas(); 
        
        console.log("preguntas leidas"); 
        const pregunta = preguntas.findIndex(p => p.id === id); // peta en esta linea, sseguir debugando y controlando el error. 
        console.log("empezando a buscar si el Id propuesto esta disponible ");
        if (!pregunta) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Actualiza solo los campos que vienen en el cuerpo de la solicitud
        pregunta.pregunta = updatedPregunta.pregunta;
        pregunta.respostes = updatedPregunta.respostes;

        console.log('Pregunta actualizada:', pregunta);

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
