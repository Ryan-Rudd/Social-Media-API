const express = require('express'); 
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register', function(req, res){
    // res, name, username, password, email
    const { name, username, password, email } = req.body;

    authController.registerUser(res, name, username, password, email);
})
module.exports = router