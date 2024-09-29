const buildQuery = require('../utils/querys');
const util = require('util');
const conn = require('../config/database');
const ctrl = {};

const queryAsync = util.promisify(conn.query).bind(conn);

ctrl.listIngresos = async(req,res) => {

    const consulta = buildQuery.select("ingresos");
    const result = await queryAsync(consulta, consulta.vals);

    res.status(200).json(result);

};

ctrl.listGastos = async(req,res) => {

    const consulta = buildQuery.select("gastos");
    const result = await queryAsync(consulta, consulta.vals);

    res.status(200).json(result);

};

ctrl.createIngreso = async(req, res) => {
    try{
        const body = req.body;
        const detalles = body.details;
        delete body.details;
        
        const columns = Object.keys(body);
        const vals = Object.values(body);
        
        const consulta = buildQuery.insert("ingresos", columns);
        const result = await queryAsync(consulta, vals);
        const ingresos_id = result?.insertId;
        
        if(result?.insertId){
            
            detalles.forEach(async (det) => {
                const data = {
                    ...det,
                    ingresos_id
                }
                const columns = Object.keys(data);
                const vals = Object.values(data);
        
                const consulta = buildQuery.insert('detalle_ingresos', columns);
                const result = await queryAsync(consulta, vals);
            })
        }

        res.status(200).json({ mensaje: 'Inserción exitosa', insertId: result?.insertId });


    }catch(error){
        console.error(error);
    }
}

ctrl.createGasto = async(req, res) => {
    try{
        const body = req.body;
        const detalles = body.details;
        delete body.details;
        
        const columns = Object.keys(body);
        const vals = Object.values(body);
        
        const consulta = buildQuery.insert("gastos", columns);
        const result = await queryAsync(consulta, vals);
        const gastos_id = result?.insertId;
        
        if(result?.insertId){
            
            detalles.forEach(async (det) => {
                const data = {
                    ...det,
                    gastos_id
                }
                const columns = Object.keys(data);
                const vals = Object.values(data);
        
                const consulta = buildQuery.insert('detalle_gastos', columns);
                const result = await queryAsync(consulta, vals);
            })
        }

        res.status(200).json({ mensaje: 'Inserción exitosa', insertId: result?.insertId });


    }catch(error){
        console.error(error);
    }
}

ctrl.kardex = async(req,res) => {

    const consulta = buildQuery.selectkardex;
    const result = await queryAsync(consulta);

    res.status(200).json(result);

};

module.exports = ctrl; 