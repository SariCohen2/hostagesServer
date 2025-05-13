const DailyTask = require('../models/dailyModel');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const sanitizeHtml = require('sanitize-html');
const Joi = require('joi');
dotenv.config();
// קבל את משימת היום
// const actsOfKindness = [
//     "לחייך לעוברי אורח",
//     "לעזור לקשיש לחצות את הכביש",
//     "לשלוח הודעה מעודדת לחבר",
//     "לתת מחמאה כנה למישהו",
//     "להחזיק את הדלת למישהו",
//     "לתרום בגדים לנזקקים",
//     "לעזור לחבר עם שיעורי בית",
//     "להציע עזרה לשכן",
//     // "לקנות קפה לאדם זר",
//     "לשאול לשלום אדם בודד",
//     "להקשיב בלי לשפוט",
//     "לשלוח אוכל למישהו חולה",
//     "להציע מקום ישיבה באוטובוס",
//     "לעזור לאמא בבית",
//     // "להתנדב בקהילה",
//     "לאחל יום נעים לקופאית",
//     "לעזור למישהו לסחוב סלים",
//     "לנקות את השולחן במשרד בלי שמבקשים",
//     "להשאיר פתק מחמיא בעילום שם",
//     "להתעניין באמת איך מישהו מרגיש",
//     "לפרגן לחבר",
//     // "להזמין שכן לארוחה",
//     "לעודד ילד שמתבייש לדבר",
//     "להכין עוגיות ולחלק בעבודה",
//     "לתרום דם",
//     "לעשות טובה בלי לבקש תמורה",
//     "לחבק מישהו שצריך חיבוק",
//     "להתקשר לסבא וסבתא",
//     // "להציע עזרה לתייר שאיבד את דרכו",
//     "להשאיר טיפ נדיב במיוחד",
//     "לשתף צעצוע עם ילד אחר",
//     "לעודד חבר שהתייאש",
//     // "לכתוב פוסט חיובי על מישהו בפייסבוק",
//     "להחזיר אבידה",
//     "להתפלל לשלום אדם שחולה",
//     // "לעזור בגן הילדים",
//     // "לתרום לספריה קהילתית",
//     "לעזור בבית עזרה כלשהי",
//     "לא לבטל מישהו שמביע דעה אחרת",
//     "להביא פרחים בלי סיבה",
//     "להאיר פנים לנהג האוטובוס",
//     "להיות סבלני בכביש",
//     "להשאיר מכתב תודה למורה",
//     "להקשיב להורה באהבה",
//     "לא לשפוט לפי מראה חיצוני",
//     "להתייחס למישהו בודד",
//     "לחלק משהו במקום העבודה/הלימודים",
//     "להחזיר ספר מושאל בזמן",
//     "להשתדל לפרגן בכל הזדמנות",
//     "להאמין בטוב של אחרים"
//   ];
const actsOfKindness = [
  'אמירת שני פרקי תהילים בכוונה.',
  'הקדשת שעת לימוד תורה/רק עם דיבורים טובים לזכותם.',
  'שמירת הלשון שעה ביום.',
  'להדליק למישהו חיוך היום',
  'לברך "שהכול" בכוונה מיוחדת לפחות פעם אחת',
  'להכניס שבת 10 דקות קודם.',
]
// function getRandomAct() {
//   const randomIndex = Math.floor(Math.random() * actsOfKindness.length);
//   return actsOfKindness[randomIndex];
// }
function getCurrentDayNumber() {
  const today = new Date();
  const day = today.getDay(); // מחזיר 0 (ראשון) עד 6 (שבת)
  return day === 0 ? 1 : day + 1; // הופך את ראשון ל-1, שני ל-2 וכו'
}

exports.getTodayTask = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    let task = await DailyTask.findOne({ date: today });

    if (!task) {
      task = await DailyTask.create({
        date: today,
        // taskText:getRandomAct(),
        taskText: actsOfKindness[getCurrentDayNumber() - 1],
        goal:58
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// עדכון ביצוע
exports.markTaskDone = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const task = await DailyTask.findOne({ date: today });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completions += 1;
    if (task.completions >= task.goal && !task.completedGoalDates.includes(today)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      task.completedGoalDates.push(yesterdayStr);
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// סך כל הימים שבהם הושג היעד
exports.getGoalCompletionStats = async (req, res) => {
  try {
    const completed = await DailyTask.find({ completedGoalDates: { $exists: true, $ne: [] } });
    const total = await DailyTask.find();
    res.json({ allTasks: total });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
