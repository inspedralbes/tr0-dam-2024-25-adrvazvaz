const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const app = express();
const port = 21211;

app.use(express.json());
app.use(cors());

// Función para leer preguntas desde el archivo
const leerPreguntas = () => {
    try {
        const data = fs.readFileSync('./PreguntesCompletes.json', 'utf8');
        console.log("se han leido las preguntas");
        return JSON.parse(data); // Devuelve el objeto parseado
    } catch (err) {
        console.error('Error al leer el archivo JSON:', err);
        return { preguntes: [] }; // Devuelve un objeto vacío si hay un error
    }
};

// Guardar las preguntas en el archivo JSON
const guardarPreguntas = (preguntas) => {
    try {
        fs.writeFileSync('./PreguntesCompletes.json', JSON.stringify(preguntas, null, 2), 'utf8');
        console.log('Preguntas guardadas correctamente');
    } catch (error) {
        console.error('Error al guardar preguntas:', error);
    }
};

// PARA LA WEB PORQUE SALEN LAS RESPUESTAS
app.get('/getPreguntes', (req, res) => {
    try {
        const preguntas = leerPreguntas(); 
        console.log("Se han leído las preguntas");

        // Incluye las respuestas correctas
        const preguntasConRespuestasCorrectas = preguntas.preguntes.map(pregunta => ({
            id: pregunta.id,
            pregunta: pregunta.pregunta,
            respostes: pregunta.respostes.map(resposta => ({
                id: resposta.id,
                resposta: resposta.resposta,
                correcta: resposta.correcta // Incluir información de si la respuesta es correcta
            }))
        }));

        res.json(preguntasConRespuestasCorrectas);
        console.log("Se han enviado las preguntas con respuestas correctas");
    } catch (err) {
        console.error('Error al leer o parsear el archivo:', err);
        res.status(500).json({ error: 'Error al leer el archivo' });
    }
});


// PARA LA APP ANDROID SIN LAS RESPUESTAS CORRECTAS Y QUE SE ENVIA DE UNA EN UNA PREGUNTA 
let currentQuestionIndex = 0; // Agrega un índice global para las preguntas

app.get('/getPreguntesAndroidApp', (req, res) => {
    try {
        const preguntas = leerPreguntas();
        console.log("Se han leído las preguntas");

        // Asegúrate de que el índice no exceda la longitud de las preguntas
        if (currentQuestionIndex >= preguntas.preguntes.length) {
            return res.status(404).json({ error: 'No hay más preguntas disponibles' });
        }

        const pregunta = {
            id: preguntas.preguntes[currentQuestionIndex].id,
            pregunta: preguntas.preguntes[currentQuestionIndex].pregunta,
            respostes: preguntas.preguntes[currentQuestionIndex].respostes.map(resposta => ({
                id: resposta.id,
                resposta: resposta.resposta
            }))
        };

        currentQuestionIndex++; // Incrementa el índice para la próxima pregunta
        res.json(pregunta);
        console.log(`Se ha enviado la pregunta ${pregunta}`);
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

    // Comprobar que hay una respuesta correcta
    const correctaRespuesta = newPregunta.respostes.find(res => res.correcta);
    if (!correctaRespuesta) {
        return res.status(400).json({ error: 'Debes marcar una respuesta como correcta' });
    }

    try {
        const preguntas = leerPreguntas();
        console.log('se han leído las preguntas');
        const newPreguntaId = preguntas.preguntes.length > 0
            ? preguntas.preguntes[preguntas.preguntes.length - 1].id + 1
            : 1;

        newPregunta.id = newPreguntaId; // Asignar el nuevo ID a la pregunta
        console.log('se ha generado un nuevo ID');

        // Generar IDs para respuestas y mantener la propiedad correcta
        for (let i = 0; i < newPregunta.respostes.length; i++) {
            newPregunta.respostes[i].id = i + 1; // Asignar un ID a cada respuesta
            // Asegurarse de que la respuesta correcta se mantiene
            newPregunta.respostes[i].correcta = newPregunta.respostes[i].correcta || false;
        }
        console.log('se han generados los IDs para las respuestas');

        preguntas.preguntes.push(newPregunta); // Agregar la nueva pregunta a la lista
        guardarPreguntas(preguntas); // Guardar las preguntas actualizadas
        console.log("preguntas guardadas");
        res.status(201).json(newPregunta); // Enviar la nueva pregunta como respuesta
        console.log('se ha agregado la pregunta');
    } catch (err) {
        console.error('Error al guardar la pregunta:', err);
        res.status(500).json({ error: 'Error al guardar la pregunta' });
    }
});

// Actualizar pregunta
// Actualizar pregunta
app.put('/updatePregunta/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const nuevaPregunta = req.body;

    if (!nuevaPregunta.pregunta || !Array.isArray(nuevaPregunta.respostes) || nuevaPregunta.respostes.length !== 4) {
        return res.status(400).json({ error: 'La pregunta debe tener un texto y exactamente 4 respuestas' });
    }

    try {
        const preguntas = leerPreguntas();
        const preguntaIndex = preguntas.preguntes.findIndex(p => p.id === id);

        if (preguntaIndex === -1) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Actualizamos la pregunta encontrada con los nuevos datos
        preguntas.preguntes[preguntaIndex] = {
            id: id, // Mantener el mismo ID
            pregunta: nuevaPregunta.pregunta,
            respostes: nuevaPregunta.respostes.map((resposta, index) => ({
                id: index + 1, // Asegurar que las respuestas tienen IDs correctos
                resposta: resposta.resposta,
                correcta: resposta.correcta || false // Mantener la propiedad correcta
            }))
        };

        guardarPreguntas(preguntas);
        console.log('Pregunta actualizada correctamente');
        res.status(200).json(preguntas.preguntes[preguntaIndex]); // Enviamos la pregunta actualizada como respuesta
    } catch (err) {
        console.error('Error al actualizar la pregunta:', err);
        res.status(500).json({ error: 'Error al actualizar la pregunta' });
    }
});





//funcion para cuando se apliquen cambios en el json, se actualizen los id, es decir.. si se elimina 
//la pregunta con id 2 que la 3 pase a ser la 2 y asi sucesivamente en el json
const actualizarId = (preguntas) => {
    leerPreguntas();
    for (let i = 0; i < preguntas.preguntes.length; i++) {
        preguntas.preguntes[i].id = i + 1;
    }
    guardarPreguntas(preguntas);
    console.log("IDs de preguntas actualizados");

    return preguntas; 
};


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
        actualizarId(preguntas);
        console.log("Id's de preguntas actualizados")
        guardarPreguntas(preguntas);
        console.log("preguntas guardadas correctamente")
        res.status(204).send(); 
    } catch (err) {
        console.error('Error al eliminar la pregunta:', err);
        res.status(500).json({ error: 'Error al eliminar la pregunta' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://dam.inspedralbes.cat:${port}`);
});
