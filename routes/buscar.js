
const { Router } = require('express');
const { buscar } = require('../controllers/buscar');



const router = Router();

router.get('/:collection/:search', buscar);


module.exports = router