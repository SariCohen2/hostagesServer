const express = require('express');
const {
  getGoalCompletionStats,markTaskDone,getTodayTask

} = require('../controllers/dailyTaskController');

const routerDaily = express.Router();

routerDaily.get('/today', getTodayTask);
routerDaily.post('/done',markTaskDone)
routerDaily.get('/get-global',getGoalCompletionStats)
module.exports = routerDaily