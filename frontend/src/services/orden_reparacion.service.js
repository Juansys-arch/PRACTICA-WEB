"use strict";
import axios from "./root.service.js";

export async function getOrdenesReparacion() {
  try {
    const { data } = await axios.get("/reparaciones");
    return data.data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}

export async function crearOrdenReparacion(dataOrden) {
  try {
    const { data } = await axios.post("/reparaciones", dataOrden);
    return data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}

export async function actualizarEstadoOrden(id, payload) {
  try {
    const { data } = await axios.patch(`/reparaciones/${id}/estado`, payload);
    return data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}
