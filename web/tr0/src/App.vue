<template>
  <body>
    <header>
      <div class="header" id="header">
        <div class="menu-administrador">
          <h2><mark>Menú d'Administrador</mark></h2><hr>
          <button class="admin-button" @click="agregarPregunta(nuevaPregunta)">Agregar Pregunta</button>
          <button class="admin-button" @click="actualizarPregunta(pregunta.id, preguntaModificada)">Actualizar Pregunta</button>
          <button class="admin-button" @click=" eliminarPregunta(pregunta.id)">Eliminar Pregunta</button>
          <button class="admin-button">Stats</button>
        </div>
      </div>
    </header>

    <div class="preguntas-list">
      <h3><mark>Preguntes del Joc:</mark></h3><br><hr>
      <br>
      <ul>
        <li v-for="(pregunta, index) in preguntas" :key="pregunta.id" class="pregunta-item">
          <strong class="bold">{{ index + 1 }}. {{ pregunta.pregunta }}</strong>
          <ul>
            <li v-for="(respuesta, resIndex) in pregunta.respostes" :key="respuesta.id">
              {{ String.fromCharCode(97 + resIndex) }}. {{ respuesta.resposta }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </body>
</template>




<script>
export default {
  data() {
    return {
      preguntas: [],
      nuevaPregunta: {
        id: null,
        pregunta: '',
        respostes: []
      },
      preguntaActualizada: {
        id: null,
        pregunta: '',
        respostes: []
      }
    };
  },
  created() {
    // Obtener las preguntas
    fetch('http://localhost:21211/getPreguntes')
      .then(response => response.json())
      .then(data => {
        this.preguntas = data.preguntes;
      })
      .catch(error => console.error('Error fetching preguntas:', error));
  },
  methods: {
    // Agregar nueva pregunta
    agregarPregunta() {
      console.log('Datos a enviar:', this.nuevaPregunta); 
      fetch('http://localhost:21211/addPregunta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.nuevaPregunta)
      })
      .then(response => response.json())
      .then(data => {
        this.preguntas.push(data); 
        this.nuevaPregunta = { id: null, pregunta: '', respostes: [] }; 
      })
      .catch(error => console.error('Error agregando la pregunta:', error));
    },
    
    // Actualizar pregunta
    actualizarPregunta() {
      fetch(`http://localhost:21211/updatePregunta/${this.preguntaActualizada.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.preguntaActualizada)
      })
      .then(response => response.json())
      .then(data => {
        const index = this.preguntas.findIndex(p => p.id === data.id);
        if (index !== -1) {
          this.preguntas.splice(index, 1, data); 
        }
        this.preguntaActualizada = { id: null, pregunta: '', respostes: [] };
      })
      .catch(error => console.error('Error actualizando la pregunta:', error));
    },

    // Eliminar pregunta
    eliminarPregunta(id) {
      fetch(`http://localhost:21211/deletePregunta/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        this.preguntas = this.preguntas.filter(pregunta => pregunta.id !== id);
      })
      .catch(error => console.error('Error eliminando la pregunta:', error));
    }
  }
};
</script>







<style>
 .menu-administrador {
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  width: 250px; 
  z-index: 1000;
}

.admin-button {
  display: block;
  width: 100%; 
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border: none;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.admin-button:hover {
  background-color: #7bec81;
}

.preguntas-list {
  margin-left: 300px; 
  background-color: #f9f9f9;
  padding: 40px;
  width: 70vw; 
  max-width: 600px; 
  min-width: 600px; 
  border-radius: 10px;
}

.preguntas-list h3 {
  text-align: center;
  color: #333;
}

.preguntas-list ul {
  list-style-type: none;
  padding: 0;
}

.preguntas-list ul ul {
  margin-left: 20px;
}

.preguntas-list li {
  margin-bottom: 10px;
}

.pregunta-item {
  margin-bottom: 15px; 
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.pregunta-item strong {
  font-size: 1.2em; 
  font-weight: bold;
}

body {
  background-color: rgb(40, 81, 194);
  font-family: 'Courier New', Courier, monospace;
  margin: 0;
  padding: 0;
}

@media (max-width: 768px) {
  .preguntas-list {
    width: 90vw; 
    margin-left: 0; 
    padding: 20px;
  }

  .menu-administrador {
    position: relative;
    width: 90vw; 
    margin: 0 auto;
    text-align: center;
  }
}

</style>
