// const dotenv = require('dotenv');
// const sanitizeHtml = require('sanitize-html');
// const Joi = require('joi');
// dotenv.config();

// const myViews = require('../models/views');

// const ensureViewsDocumentExists = async () => {
//     let doc = await myViews.findOne();
//     if (!doc) {
//         doc = new myViews();
//         await doc.save();
//     }
//     return doc;
// };

// exports.getViews = async (req, res) => {
//     try {
//         console.log('getViews');

//         const views = await ensureViewsDocumentExists();
//         res.status(200).json({ count: views.viewedCount, uniqueIps: views.viewdBy.length });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.addView = async (req, res) => {
//     try {
//         const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//         const views = await ensureViewsDocumentExists();

//         let isNewIP = false;

//         if (!views.viewdBy.includes(ip)) {
//             views.viewdBy.push(ip);
//             isNewIP = true;
//         }

//         views.viewedCount += 1;

//         await views.save();

//         res.status(200).json({
//             message: `View added${isNewIP ? ', new IP logged' : ''}`,
//             count: views.viewedCount,
//             uniqueIps: views.viewdBy.length
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
const dotenv = require('dotenv');
const sanitizeHtml = require('sanitize-html');
const Joi = require('joi');
dotenv.config();

const myViews = require('../models/views');

// פונקציית עזר ליצירת מופע ברירת מחדל אם לא קיים
const ensureViewsDocumentExists = async () => {
    let doc = await myViews.findOne();
    if (!doc) {
        doc = new myViews();
        await doc.save();
    }
    return doc;
};

// מביא את נתוני הצפיות
exports.getViews = async (req, res) => {
    try {
        const views = await ensureViewsDocumentExists();
        res.status(200).json({
            count: views.viewedCount,
            uniqueIps: views.viewdBy.length,
            lastViewedAt: views.lastViewedAt,
            dailyViews: views.dailyViews,
            userAgents: views.userAgents,
            locations: views.locations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// מוסיף צפייה
exports.addView = async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'unknown';
        console.log('ip:', ip);
        

        const views = await ensureViewsDocumentExists();

        // עדכון רשימת IP
        if (!views.viewdBy.includes(ip)) {
            views.viewdBy.push(ip);
            console.log('view pushed succesfully');
            
        }

        // עדכון מונה צפיות כולל
        views.viewedCount += 1;

        // עדכון זמן אחרון
        views.lastViewedAt = new Date();

        // עדכון צפיות לפי תאריך
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const todayViews = views.dailyViews.get(today) || 0;
        views.dailyViews.set(today, todayViews + 1);

        // הוספת user-agent אם חדש
        if (!views.userAgents.includes(userAgent)) {
            views.userAgents.push(userAgent);
        }

        // מיקום לפי IP (placeholder – לשימוש עתידי)
        // לדוגמה עם geoip-lite:
        // const geo = geoip.lookup(ip);
        // if (geo && geo.country && !views.locations.includes(geo.country)) {
        //     views.locations.push(geo.country);
        // }

        await views.save();

        res.status(200).json({
            message: 'View recorded successfully',
            count: views.viewedCount,
            uniqueIps: views.viewdBy.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
