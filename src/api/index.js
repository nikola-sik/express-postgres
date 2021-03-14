const express = require('express');

const {Router} = express;
const router = new Router();

const user = require('./user');
const session = require('./session');
const car = require('./car');
const carModel = require('./car-model');
const garage = require('./garage');

router.use('/api/users', user);
router.use('/api/sessions', session);
router.use('/api/cars', car);
router.use('/api/car-models', carModel);
router.use('/api/garages', garage);
module.exports = router;
