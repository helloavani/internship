const express = require('express');
const router = express.Router();
const appController = require('./controllers/appcontroller');

router.post('/signup',appController.signup);
router.post('/login',appController.login);
router.post('/edit',appController.edit);
router.get('/getdata',appController.getdata);
router.post('/delete',appController.deletedata);
router.post('/add',appController.adduser);






module.exports = router;