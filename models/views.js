// server/schema/dailyTask.js
const mongoose = require('mongoose');

const viewsSchema = new mongoose.Schema({
    viewdBy: { type: [String], default: [], require: true },
    viewedCount: { type: Number, default: 0, require: true },
    lastViewedAt: { type: Date, default: Date.now },
    dailyViews: {
        type: Map,
        of: Number,
        default: {}
    },
    userAgents: { type: [String], default: [] },
    locations: { type: [String], default: [] }

});

module.exports = mongoose.model('Views', viewsSchema);
