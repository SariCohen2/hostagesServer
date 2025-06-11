const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const sanitizeHtml = require('sanitize-html');
const Joi = require('joi');
dotenv.config();

const myObj = require('../models/documentModel');
// const { hashPassword, comparePasswords } = require('../services/authService');

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await myObj.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getDiedDocumens = async (req, res) => {
  try {
    const documents = await myObj.find({ died: true });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.getReturnedDocumens = async (req, res) => {
  try {
    const documents = await myObj.find({ returned: true });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.getExistDocumens = async (req, res) => {
  try {
    console.log('eee');
    
    const documents = await myObj.find();
    const filteredDocuments = documents.filter(doc => doc.died!= true&&doc.returned!=true&&!doc.returnDate);
console.log(filteredDocuments);

    res.status(200).json(filteredDocuments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Get a document by ID
// exports.getDocumentById = async (req, res) => {
//   try {
//     const document = await Document.findById(req.params.id);
//     if (!document) return res.status(404).json({ message: 'Document not found' });
//     const filteredDocument = { name: document.name, content: document.content, createdAt: document.createdAt, id: req.params.id, likesCount: document.likesCount,tags:document.tags }
//     res.status(200).json(filteredDocument);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Create a new document
// exports.createDocument = async (req, res) => {
//   try {
//     const { name, content, password, tags} = req.body;
//     const hashedPassword = await hashPassword(password);

//     const newDocument = new Document({ name, content, password: hashedPassword,tags: tags || [] });
//     newDocument.likedBy = [];
//     newDocument.likesCount = 0;

//     await newDocument.save();
//     res.status(201).json(newDocument);
//   } catch (error) {
//     console.error("error occured:", error)
//     res.status(500).json({ message: error.message });
//   }
// };

// Delete a document
// exports.deleteDocument = async (req, res) => {
//   try {
//     console.log('in delete');
//     const document = await Document.findById(req.params.id);
//     const password = req.params.password;
//     // const isCorrect = await comparePasswords(password, document.password);


//     if (!document) return res.status(404).json({ message: 'Document not found' });
//     if (password == process.env.MANAGER_PASS) {
//       await Document.findByIdAndDelete(req.params.id);
//       console.log("delete successfully")
//       res.status(200).json({ message: 'Document deleted successfully' });
//     }
//     else
//       res.status(401).json({ message: 'Unauthorized' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


//Check user's password
// exports.checkPassword = async (req, res) => {
//   try {
//     const document = await Document.findById(req.params.id);
//     if (!document) return res.status(404).json({ message: 'Document not found' });
//     const password = req.body.password;
//     const isCorrect = await comparePasswords(password, document.password);
//     if (password == process.env.MANAGER_PASS || isCorrect) {
//       console.log("authorized")
//       res.status(200).json({ message: 'Document found successfully' });
//     }
//     else
//       res.status(401).json({ message: 'Unauthorized' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.deleteComment = async (req, res) => {
  try {
    console.log('in deleteComment');

    const { id, password, comment } = req.params;

    const document = await myObj.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    if (password !== process.env.MANAGER_PASS) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

     const updatedDoc = await myObj.findByIdAndUpdate(
      id,
      { $pull: { comments: { text: comment } } }, 
      { new: true }
    );
    if (!updatedDoc) {
      return res.status(404).json({ message: 'Comment not found or already removed' });
    }

    console.log('Comment deleted successfully');
    res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (error) {
    console.error('Error in deleteComment:', error);
    res.status(500).json({ message: error.message });
  }
};

//Add Tag
exports.editDocument = async (req, res) => {

  try {
    console.log(req.params.id);

    const document = await myObj.findById(req.params.id);

    const tags = req.body;
    
    console.log(tags);

    if (tags) {
      document.tags = tags;
    }
    await document.save();
    res.status(200).json(document);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getLikesCount = async (req, res) => {
  try {
    // const document = await myObj.findById(req.params.id);
    // if (!document) {
    //   return res.status(404).json({ success: false, message: "Document not found" });
    // }
    // res.status(200).json({likes:document.likesCount});
    likesObj = await myObj.find()
    let lst = []
    // lst=likesObj.map((doc)=>{"_id"=doc._id,"likesCount"=doc.likesCount})
    for (let i = 0; i < likesObj.length; i++) {
      const element = likesObj[i];
      lst.push({ "_id": element._id, "likesCount": element.likesCount })
    }

    console.log(lst);

    res.status(200).json({ likes: lst })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.likeDocument = async (req, res) => {
  try {
    let objId = req.params.objId;
    // const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let userIp = req.headers['x-forwarded-for'];
    if (!userIp) {
      userIp = req.connection.remoteAddress;
    }

    const index = userIp.indexOf(',');
    userIp = index !== -1 ? userIp.slice(0, index) : userIp;

    objId = +objId
    // console.log(objId);

    const document = await myObj.findById(objId);
    // console.log(document);

    // allDocs=await myObj.find()
    // console.log(allDocs);


    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // אם ה-IP כבר קיים במערך, הסר אותו; אחרת, הוסף אותו
    if (!document.likedBy.includes(userIp)) {
      document.likedBy.push(userIp); // הוספת IP למערך
      document.likesCount = document.likedBy.length;
      await document.save();
      return res.status(200).json({ success: true, message: "Like added successfully!", ok: true, doc: document });
    } else {
      // הסרת ה-IP מהמערך
      document.likedBy = document.likedBy.filter(ip => ip !== userIp);
      document.likesCount = document.likedBy.length;
      await document.save();
      return res.status(200).json({ success: true, message: "Like removed successfully!", ok: false, doc: document });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};
exports.addComment = async (req, res) => {
  try {
    const objId = req.params.id;
    let comment = req.body.comment;
    console.log(objId);

    // שלב 1: ולידציה – לבדוק שהתוכן הוא טקסט בגודל תקני
    const schema = Joi.string().min(1).max(500).required();
    const { error } = schema.validate(comment);
    if (error) {
      return res.status(400).json({ success: false, message: "Invalid comment" });
    }

    // שלב 2: סינון – שימוש ב-sanitize-html כדי למנוע תגיות HTML מזיקות
    comment = sanitizeHtml(comment, {
      allowedTags: [], // לא מאפשר תגיות HTML
      allowedAttributes: {} // לא מאפשר תכונות HTML
    });

    // שלב 3: מציאת האובייקט במסד נתונים
    const document = await myObj.findById(objId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // שלב 4: הוספת התגובה למערך התגובות
    document.comments.push({ text: comment, createdAt: new Date() });

    // שלב 5: שמירה במסד הנתונים
    await document.save();

    // שלב 6: חזרה עם התוצאה
    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: document.comments
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};