"use strict";
import axios from "./root.service.js";

export async function getSustracciones() {
  try {
    const { data } = await axios.get("/sustracciones");
    return data.data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}

export async function crearSustraccion(dataSustraccion) {
  try {
    const { data } = await axios.post("/sustracciones", dataSustraccion);
    return data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}

export async function actualizarEstadoSustraccion(id, estado, observacion = null) {
  try {
    const payload = { estado };
    if (observacion) payload.observacion = observacion;
    const { data } = await axios.patch(`/sustracciones/${id}/estado`, payload);
    return data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}
