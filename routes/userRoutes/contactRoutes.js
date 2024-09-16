const express = require('express');
const router = express.Router();
const ContactSchema = require('../../model/userModel/ContactUs')
const {handleSendContact,
    getAllUserContacts,
    deleteUserById,
    approveUserbyId,
    assign,
    getAssignedWork
}= require('../../controllers/userControllers/contactUsController')



router.post('/sendContact',handleSendContact);
router.get('/',getAllUserContacts)
router.post('/delete/:id',deleteUserById);
router.post('/isAprove/:id',approveUserbyId);
router.post('/assign/:id',assign);
router.get('/assigned-work', getAssignedWork);
module.exports = router;