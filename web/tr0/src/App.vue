<template>
  <body>
    <header>
      <div class="header" id="header">
        <div class="menu-administrador" style="background-color: white; padding: 20px; border-radius: 10px;">
          <h2><mark>Menú d'Administrador</mark></h2>
          <button class="admin-button">Editar Text o Imatge</button>
          <button class="admin-button">Inserir Noves Preguntes</button>
          <button class="admin-button">Borrar Preguntes</button>
        </div>
      </div>
    </header>

    <div class="preguntas-list">
      <h3><mark>Preguntas del juego:</mark></h3>
      <br>
      <ul>
        <li v-for="(pregunta, index) in preguntas" :key="pregunta.id" class="pregunta-item">
          <strong>{{ index + 1 }}. {{ pregunta.pregunta }}</strong>
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
      preguntas: []  
    };
  },
  created() {
    fetch('http://localhost:3000/getPreguntes')
      .then(response => response.json())
      .then(data => {
        console.log('Preguntas recibidas:', data.preguntes);  
        this.preguntas = data.preguntes; 
      })
      .catch(error => console.error('Error fetching preguntas:', error));
  }
};
</script>

<style>
  .menu-administrador {
    margin-top: 100px; 
    text-align: center; 
  }

  .admin-button {
    display: block;         
    width: 200px;           
    margin: 10px auto;    
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
    background-color: #f9f9f9;
    padding: 20px;
    margin: 20px auto;
    width: 80%;
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
    margin-bottom: 15px; /* Espacio entre preguntas */
    padding: 10px;
    border: 1px solid #ccc; /* Borde alrededor de cada pregunta */
    border-radius: 5px; /* Bordes redondeados */
    background-color: #f9f9f9; /* Color de fondo para mayor contraste */
  }

  .pregunta-item strong {
    font-size: 1.1em; /* Tamaño de fuente más grande para las preguntas */
  }

  .header {
    background-color: rgb(22, 22, 180);
    color: rgb(180, 186, 235);
    width: 100%;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    margin-top: 20px;
    margin: auto;
  }

  body {
    background-color: rgb(40, 81, 194);
  }

  .main {
    background-color: rgb(3, 147, 214);
    color: white;
    width: 80%;
    border-radius: 10px;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    margin-top: 20px;
    margin: auto;
    padding: 20px;
  }

  table {
    width: 100%;
    margin: auto;
  }

  .td_pregunta {
    height: 100px;
    text-align: center;
  }

  .td-resposta {
    width: 50%;
    text-align: center;
  }

  button {
    padding: 20px 40px; 
    font-size: 20px; 
    border-radius: 5px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
</style>
