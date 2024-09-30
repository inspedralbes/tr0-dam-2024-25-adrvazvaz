<template>
  <body>
    <header>
      <div class="header" id="header">
        <h1>Benvingut al Quizz de marques comercials.</h1>
        <br>
        <h4 class="justificado">
          El funcionament del joc serà el seguent: <br> <br>
          - Tens 30 segons per respondre totes les preguntes que puguis. <br>
          - Només puntuaràn si son correctes.
        </h4>
      </div>
    </header>
  
    <div class="main" id="main">
      <table>
        <tr>
          <td colspan="2" class="td_pregunta">
            <h1>Pregunta</h1>
            <img src="" alt="Imatge de la pregunta" class="imatge-pregunta">
          </td>
        </tr>
        <tr>
          <td class="td-resposta">
            <button>resposta 1</button>
          </td>
          <td class="td-resposta">
            <button>resposta 2</button>
          </td>
        </tr>
        <tr>
          <td class="td-resposta">
            <button>resposta 3</button>
          </td>
          <td class="td-resposta">
            <button>resposta 4</button>
          </td>
        </tr>
      </table>
    </div>

    <div class="cronometro">
      <h2 id="timer">30</h2>
    </div>

    <div class="opcions">
      <button class="boton-pequeño">Pregunta Anterior</button>
    </div>

    <div class="menu-administrador" style="background-color: white; padding: 20px; border-radius: 10px;">
      <h2>Menú d'Administrador</h2>
      <button class="admin-button">Editar Text o Imatge</button>
      <button class="admin-button">Inserir Noves Preguntes</button>
      <button class="admin-button">Borrar Preguntes</button>
    </div>
  </body>
</template>

<script>
  import { ref } from 'vue'
</script>

<style>
  .cronometro {
    text-align: center;
    margin-top: 20px;
    font-size: 24px;
    color: #333;
  }

  .boton-pequeño {
    padding: 10px 20px;
    font-size: 14px; 
  }

  .menu-administrador {
    margin-top: 60px;
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

  .imatge-pregunta {
    width: 100%; 
    height: auto; 
    max-height: 200px; 
    display: block; 
    margin: 0 auto; 
  }

  .opcions {
    margin-top: 45px;
    display: flex;          
    justify-content: center;
    align-items: center;     
  }

  .justificado {
    text-align: justify;
    margin-left: 15px;
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
