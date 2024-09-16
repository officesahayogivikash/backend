const express = require('express');
const {enterGst, defaulthit, getAllGst, getGstById} = require('../../controllers/gstControllers/gstController');
const router = express.Router();

router.get('/',defaulthit)
router.get('/getGst',getAllGst);
router.get('/getGst/:id',getGstById)
router.post('/gst-details',enterGst);


module.exports = router;