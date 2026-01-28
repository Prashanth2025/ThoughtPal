const express=require('express');
const { handleUserSignup, handleUserLogin, getUserInfo, handleUserUpdateName, handleUserUpdatePassword } = require('../controller/userController');
const verifyToken = require('../middlewares/verifyToken');

const userRouter=express.Router();

userRouter.post('/signup',handleUserSignup);
userRouter.post('/login',handleUserLogin);

userRouter.get('/',verifyToken,getUserInfo);

userRouter.patch('/name',verifyToken,handleUserUpdateName);

userRouter.patch('/password',verifyToken,handleUserUpdatePassword);

module.exports=userRouter