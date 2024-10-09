// services/preguntaService.js

const API_URL = 'http://a21adrvazvaz.dam.inspedralbes.cat:21211';

// Obtener todas las preguntas
export async function getPreguntas() {
  const response = await fetch(`${API_URL}/getPreguntes`);
  if (!response.ok) {
    throw new Error('Error al obtener las preguntas');
  }
  return await response.json();
}

// Agregar nueva pregunta
export async function addPregunta(pregunta) {
  const response = await fetch(`${API_URL}/addPregunta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pregunta)
  });

  if (!response.ok) {
    throw new Error('Error al agregar la pregunta');
  }
  return await response.json();
}

// Actualizar pregunta
export async function updatePregunta(id, pregunta) {
  const response = await fetch(`${API_URL}/updatePregunta/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pregunta)
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la pregunta');
  }
  return await response.json();
}

// Eliminar pregunta
export async function deletePregunta(id) {
  const response = await fetch(`${API_URL}/deletePregunta/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la pregunta');
  }
}
