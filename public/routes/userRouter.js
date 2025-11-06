const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../../utils/authController');

const router = express.Router();

router.post('/signup', authController.signup);

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/api/v1/users')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
