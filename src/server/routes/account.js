import express from 'express';
import Account from '../models/account';
import { type } from 'os';
const router = express.Router();

/*
  Account SIGNUP : POST /api/account/signup
  BODY SAMPLE: {"username":"test", "password":"1111"}
  ERROR CODE:
    1: BAD USERNAME
    2: BAD PASSWORD
    3: USERNAME EXIST
*/

router.post('/signup', (req, res) => {
  //CHECK USERNAME FORMAT
  let usernameRegex = /^[a-z0-9]+$/;
  if(!usernameRegex.test(req.body.username)){
    return res.status(400).json({
      error: "BAD USERNAME",
      code: 1
    });
  }

  //CHEK PASS LENGTH
  if(req.body.password.length < 4 || typeof req.body.password !== 'string'){
    return res.status(400).json({
      error: "BAD PASSWORD",
      code: 2
    });
  }

  //CHECK USER EXISTANCE
  Account.findOne({username:req.body.username}, (error, exist) => {
    if(error) throw err;
    if(exist){
      return res.status(409).json({
        error: "USERNAME EXIST",
        code:3
      });
    }

    //CREATE ACCOUNT
    let account = new Account({
      username: req.body.username,
      password: req.body.password
    });

    account.password = account.generateHash(account.password);

    //SAVE IN THE DATABASE
    account.save(err => {
      if(err) throw err;
      return res.json({success: true});
    });
    
  });
});

router.post('/signin', (req, res) => {
  if(typeof req.body.password !== 'string'){
    return res.status(401).json({
      error: "LOGIN FAILED",
      code: 1
    });
  }
  //FIND THE USER BY USERNAME
  Account.findOne({username:req.body.username}, (err, account) => {
    if(err) throw err;

    //CHECK ACCOUNT EXISTANCY
    if(!account){
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }

    //CHECK WHETHER PASSWORD IS VALID
    if(!account.validateHash(req.body.password)){
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }

    //ALTER SESSION
    let session = req.session;
    session.loginInfo = {
      _id: account._id,
      username: account.username
    };

    //RETURN SUCCESS
    return res.json({
      success: true
    });
  });
});

router.get('/info', (req, res) => {
  if(typeof req.session.loginInfo === "undefined"){
    return res.status(401).json({
      error: 1
    });
  }

  res.json({info:req.session.loginInfo});
});

router.post('/signout', (req, res) => {
  req.session.destroy(err => {
    if(err) throw err
    return res.json({success:true});
  });
});

export default router;