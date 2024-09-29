const express = require('express');
const router = express.Router();


const movCtrl = require('../controllers/movimientos.controller');

//ingresos
router.get('/api/listingresos', movCtrl.listIngresos);
router.post('/api/createingreso', movCtrl.createIngreso);
//gastos
router.get('/api/listgastos', movCtrl.listGastos);
router.post('/api/creategasto', movCtrl.createGasto);
//kardex
router.get('/api/kardex', movCtrl.kardex);


module.exports = router;