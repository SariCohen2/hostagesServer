const express = require('express');
const {
  getAllDocuments,
  getDiedDocumens,
  getReturnedDocumens,
  getExistDocumens,
  editDocument,
  getLikesCount,
  likeDocument,
  addComment,
  deleteComment
} = require('../controllers/documentController');

const router = express.Router();

router.get('/all', getAllDocuments);

router.get('/died', getDiedDocumens);
router.get('/exist', getExistDocumens);
router.get('/returned', getReturnedDocumens);

router.get('/likesCount', getLikesCount);
// router.get('/:id', getDocumentById);
// router.post('/', createDocument);
// router.delete('/:id/:password',deleteDocument);
router.put('/edit/:id',editDocument);
// router.get('/like/:docId/',likeDocument)
router.put('/:objId', likeDocument);
router.put('/addComment/:id',addComment)
router.delete('/delete-comment/:id/:password/:comment', deleteComment);
// router.post('/checkUser/:id',checkPassword)


module.exports = router;
