"use strict";
import axios from "./root.service.js";

export async function getPrestamos() {
  try {
    const { data } = await axios.get("/prestamos");
    return data.data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}

export async function crearPrestamo(dataPrestamo) {
  try {
    const { data } = await axios.post("/prestamos", dataPrestamo);
    return data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}

export async function devolverPrestamo(id, data = {}) {
  try {
    const response = await axios.patch(`/prestamos/${id}/devolver`, data);
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Error de conexión" };
  }
}
