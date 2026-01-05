// URL base da API
const baseURL = "http://localhost:8081";

export default async function getData(endpoint) {
  const response = await fetch(`${baseURL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  if (!text) {
    return []; // Si el body está vacío, devuelve un array vacío
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Respuesta no es JSON válido en ${endpoint}: ${text}`);
  }
}
