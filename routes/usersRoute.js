const express = require('express');
const userRouter = express.Router();
const {getUsers,addUser} = require("../controller/userController");

userRouter.route('/')
    .get(getUsers)
    .post(addUser);

module.exports = userRouter;
