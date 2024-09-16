const express = require('express');
const {createUserOS, approve,loginUserOS,logoutUserOS,getAll, getAllApprovedUser} =  require('../../controllers/internalControllers/osInternalController.js');
const {approveMiddleware, allViewMiddleware}= require('../../middleware/internalMiddleware/authenticateJWT.js');
const authToken = require('../../middleware/internalMiddleware/authMiddleWare.js')



const router =  express.Router();

router.post('/create', createUserOS );
router.post('/login',loginUserOS);
router.get('/approve/:id',approveMiddleware,approve);
router.get('/logout',logoutUserOS);
router.get('/getAll', getAll);
router.get('/getAllApproved', getAllApprovedUser);


module.exports  = router;