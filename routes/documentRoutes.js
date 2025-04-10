const express = require('express');
const {
  getAllDocuments,
  // getDocumentById,
  // createDocument,
  // deleteDocument,
  editDocument,
  getLikesCount,
  likeDocument,
  // checkPassword
} = require('../controllers/documentController');

const router = express.Router();

router.get('/all', getAllDocuments);
router.get('/likesCount', getLikesCount);
// router.get('/:id', getDocumentById);
// router.post('/', createDocument);
// router.delete('/:id/:password',deleteDocument);
router.put('/edit/:id',editDocument);
// router.get('/like/:docId/',likeDocument)
router.put('/:objId', likeDocument);
// router.post('/checkUser/:id',checkPassword)


module.exports = router;
