"use strict";

import axios from "./root.service.js";

export async function getMateriales() {
    try{
        const {data}= await axios.get('/inventario/materiales');
        return data.data;
    }catch(error){
        return error.response.data;
    }
}
export async function getMaterialPorId(id){
    try{
        const {data}=await axios.get('/inventario/materiales/${id}');
        return data.data
    }catch(error){
        return error.response.data;
    }
}
export async function crearMaterial(dataMaterial){
    try{
        const {data}= await axios.post('/inventario/materiales',dataMaterial);
        return data;
    }catch(error){
        return error.response.data;
    }
}
export async function updateMaterial(id, dataMovimiento){
    try{
        const{data} = await axios.put('/inventario/materiales/${id}',dataMovimiento);
        return response.data.data;
    }catch(error){
        return error.response.data;
    }
}
export async function getMovimientos(materialId = null){
    try{
        const url = materialId ? `/inventario/movimientos?materialId=${materialId}` : '/inventario/movimientos';
        const{data}= await axios.get(url);
        return data.data;
    }catch(error){
        return error.response.data;
    }
}
export async function registrarMovimiento(dataMovimiento){
    try{
        const{data} =await axios.post(`/inventario/movimientos/`, dataMovimiento);
        return data.data;
    }catch(error){
        return error.response.data;
    }
}

