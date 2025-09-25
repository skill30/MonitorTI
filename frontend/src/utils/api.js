const API_URL = "http://localhost:8000/api";

export const obtenerVLANs = () => axios.get(`${API_URL}/vlans`);
export const obtenerEquipos = () => axios.get(`${API_URL}/equipos`);
export const obtenerRegistros = (filtro = "") =>
  axios.get(`${API_URL}/registros${filtro}`);

export async function getRegistrosAgrupados(rango = "day") {

  const res = await fetch(`http://localhost:8000/api/registros/agrupados?rango=${rango}`);
  
  if (!res.ok) {
    throw new Error("Error al obtener registros agrupados");
  }
  return await res.json();
  
}

