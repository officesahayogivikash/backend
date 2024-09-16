const express = require('express');
const {orgControllers, getByPan,getAllOrg} = require('../../controllers/masterControllers/orgControllers')
const router = express.Router();


router.get('/',getAllOrg);
router.post('/create', orgControllers);
router.get('/:pan',getByPan);

module.exports = router;

