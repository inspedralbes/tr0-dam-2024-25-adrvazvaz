<template>
  <body>
    <header>
      <div class="header" id="header">
        <div class="menu-administrador">
          <h2><mark>Menú d'Administrador</mark></h2>
          <hr />
          <button class="admin-button" @click="abrirModal('agregar')">Agregar Pregunta</button>
          <button class="admin-button" @click="abrirModal('eliminar')">Eliminar Pregunta</button>
          <button class="admin-button" @click="abrirModal('actualizar')">Actualizar Pregunta</button>
          <button class="admin-button">Stats</button>
        </div>
      </div>
    </header>

    <div class="preguntas-list">
      <h3><mark>Preguntes del Joc:</mark></h3>
      <hr />
      <ul>
        <li v-for="(pregunta, index) in preguntas" :key="pregunta.id" class="pregunta-item">
          <strong class="bold">{{ index + 1 }}. {{ pregunta.pregunta }}</strong>
          <ul>
            <li v-for="(respuesta, resIndex) in pregunta.respostes" :key="respuesta.id" class="respuesta-item">
              {{ String.fromCharCode(97 + resIndex) }}. {{ respuesta.resposta }}
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Modal para Agregar, Actualizar y Eliminar -->
    <div v-if="mostrarModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModal">&times;</span>

        <!-- Modal para Agregar -->
        <div v-if="modalModo === 'agregar'">
          <h3>Agregar Nueva Pregunta</h3>
          <input v-model="nuevaPregunta.pregunta" placeholder="Introduce la pregunta" />
          <div v-for="(respuesta, index) in nuevaPregunta.respostes" :key="index">
            <input
              v-model="nuevaPregunta.respostes[index].resposta"
              :placeholder="'Introduce la respuesta ' + (index + 1)"
            />
            <label>
              <input type="radio" v-model="nuevaPregunta.correcta" :value="index" />
              Correcta
            </label>
          </div>
          <button @click="agregarPregunta">Guardar Pregunta</button>
        </div>
        <!-- Modal para Actualizar -->
        <div v-if="modalModo === 'actualizar'">
          <h3>Actualizar Pregunta</h3>
          <select v-model="preguntaSeleccionadaId" @change="cargarPregunta">
            <option disabled value="">Selecciona una pregunta</option>
            <option v-for="pregunta in preguntas" :key="pregunta.id" :value="pregunta.id">
              {{ pregunta.pregunta }}
            </option>
          </select>

          <div v-if="preguntaActualizada">
            <input v-model="preguntaActualizada.pregunta" placeholder="Actualiza la pregunta" />
            <div v-for="(respuesta, index) in preguntaActualizada.respostes" :key="index">
              <input
                v-model="preguntaActualizada.respostes[index].resposta"
                :placeholder="'Actualiza la respuesta ' + (index + 1)"
              />
              <label>
                <input type="radio" v-model="preguntaActualizada.correcta" :value="index" />
                Correcta
              </label>
            </div>
            <button @click="actualizarPregunta">Actualizar Pregunta</button>
          </div>
        </div>


        <!-- Modal para Eliminar -->
        <div v-if="modalModo === 'eliminar'">
          <h3>Eliminar Pregunta</h3>
          <select v-model="preguntaSeleccionadaId" @change="cargarPregunta">
            <option disabled value="">Selecciona una pregunta</option>
            <option v-for="pregunta in preguntas" :key="pregunta.id" :value="pregunta.id">
              {{ pregunta.pregunta }}
            </option>
          </select>
          <div v-if="preguntaActualizada">
            <p><strong>¿Deseas eliminar la pregunta?</strong></p>
            <p>{{ preguntaActualizada.pregunta }}</p>
            <button @click="eliminarPregunta(preguntaSeleccionadaId)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import { getPreguntas, addPregunta, deletePregunta, updatePregunta } from './fetch.js';

export default {
  data() {
    return {
      preguntas: [],
      mostrarModal: false,
      modalModo: '',
      nuevaPregunta: { pregunta: '', respostes: [{ respuesta: '' }, { respuesta: '' }, { respuesta: '' }, { respuesta: '' }], correcta: null },
      preguntaSeleccionadaId: null,
      preguntaActualizada: { pregunta: '', respostes: [{ respuesta: '' }, { respuesta: '' }, { respuesta: '' }, { respuesta: '' }], correcta: null },
    };
  },
  async mounted() {
    await this.cargarPreguntas(); // Cargar preguntas al iniciar el componente
  },
  methods: {
    async cargarPreguntas() {
      try {
        this.preguntas = await getPreguntas();
      } catch (error) {
        console.error('Error al cargar preguntas:', error);
      }
    },
    abrirModal(modo) {
      this.modalModo = modo;
      this.mostrarModal = true;
      if (modo === 'actualizar' || modo === 'eliminar') {
        this.preguntaActualizada = { pregunta: '', respostes: [{ respuesta: '' }, { respuesta: '' }, { respuesta: '' }, { respuesta: '' }], correcta: null };
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.preguntaSeleccionadaId = null;  // Limpia la selección de la pregunta
    },
    async agregarPregunta() {
      try {
        // Establecer la respuesta correcta en función de la opción seleccionada
        this.nuevaPregunta.respostes.forEach((respuesta, index) => {
          respuesta.correcta = (this.nuevaPregunta.correcta === index);
        });
        await addPregunta(this.nuevaPregunta);
        this.nuevaPregunta = { pregunta: '', respostes: [{ respuesta: '' }, { respuesta: '' }, { respuesta: '' }, { respuesta: '' }], correcta: null };
        await this.cargarPreguntas(); // Recargar preguntas después de agregar
        this.cerrarModal();
      } catch (error) {
        console.error('Error al agregar pregunta:', error);
      }
    },
    async cargarPregunta() {
    const pregunta = this.preguntas.find(p => p.id === this.preguntaSeleccionadaId);
    if (pregunta) {
      this.preguntaActualizada = {
        pregunta: pregunta.pregunta,
        respostes: pregunta.respostes.map((respuesta, index) => ({
          resposta: respuesta.resposta,
          correcta: respuesta.correcta,
          isCorrecta: respuesta.correcta // Esto es para determinar cuál es la correcta
        })), // Copiar las respuestas
        correcta: pregunta.respostes.findIndex(r => r.correcta) // Obtener el índice de la respuesta correcta
      };
    }
  },
  async actualizarPregunta() {
    try {
        await updatePregunta(this.preguntaSeleccionadaId, this.preguntaActualizada);
        await this.cargarPreguntas(); // Recargar preguntas después de actualizar
        this.cerrarModal();
      } catch (error) {
        console.error('Error al actualizar pregunta:', error);
      }
    },
    async eliminarPregunta(id) {
      try {
        await deletePregunta(id);
        await this.cargarPreguntas(); // Recargar preguntas después de eliminar
        this.cerrarModal();
      } catch (error) {
        console.error('Error al eliminar pregunta:', error);
      }
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
  min-width: 300px; 
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.pregunta-item, .respuesta-item {
  margin-bottom: 20px;
  color: black;
}


.bold {
  font-weight: bold;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  color:black;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}
</style>
