const express = require('express');
const {
    getViews,addView

} = require('../controllers/viewsController');

const routerViews = express.Router();

routerViews.get('/', getViews);
routerViews.post('/addView',addView)
module.exports = routerViews