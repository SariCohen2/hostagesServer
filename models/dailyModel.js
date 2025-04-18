// server/schema/dailyTask.js
const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
    date: {
        type: String, // e.g., '2025-04-15'
        required: true,
        unique: true,
    },
    taskText: {
        type: String,
        required: true,
    },
    completions: {
        type: Number,
        default: 0,
    },
    goal: {
        type: Number,
        default: 55,
    },
      completedGoalDates: [String] // dates when goal was reached
});

module.exports = mongoose.model('DailyTask', dailyTaskSchema);
