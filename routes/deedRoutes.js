const express = require('express');
const {
    getAllDeeds,editDeed

} = require('../controllers/deedController');

const routerDeeds = express.Router();

routerDeeds.get('/all', getAllDeeds);
routerDeeds.put('/edit/:id',editDeed)
module.exports = routerDeeds