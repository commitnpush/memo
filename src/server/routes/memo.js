import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';

const router = express.Router();

/*
  TOGGLE STAR OF MEMO: POST /api/memo/star/:id
  ERROR CODES
    1: INVALID ID
    2: NOT SIGNED IN
    3: NO RESOURCE
*/
router.post('/star/:id', (req, res) => {
  //CHECK MEMO ID VALIDITY
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  //CHECK SIGN IN STATUS
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(403).json({
      error: "NOT SIGNED IN",
      code: 2
    });
  }

  Memo.findById(req.params.id, (error, memo) => {
    if(error) throw error;
    
    //MEMO DOES NOT EXIST
    if(!memo){
      return res.status(404).json({
        error: "NO RESOURCE",
        code:3
      });
    }

    //GET INDEX OF USERNAME IN THE ARRAY
    let index = memo.starred.indexOf(req.session.loginInfo.username);

    //CHECK WHETHER THE USER ALREADY GIVEN A STAR
    let hasStarred = index !== -1;

    if(!hasStarred){
      //IF IT DOES NOT EXIST
      memo.starred.push(req.session.loginInfo.username);
    }else{
      memo.starred.splice(index, 1);
    }

    //SAVE THE MEMO
    memo.save((error, memo) => {
      if(error) throw error;
      res.json({
        success: true,
        'has_starred': !hasStarred,
        memo
      });
    });
  });
});

/*
  WRITE MEMO: POST /api/memo
  BODY SAMPLE: {content: "sample"}
  ERROR CODES
    1: NOT LOGGED IN
    2: EMPTY CONTENT
*/
router.post('/', (req, res) => {
  //CHECK LOGIN STATUS
  console.log(req.session.loginInfo);
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 1
    });
  }

  //CHECK CONTENT VALID
  if(typeof req.body.content !== 'string' || req.body.content === ''){
    return res.status(400).json({
      error: "EMPTY CONTENT",
      code:2
    });
  }

  //CREATE NEW MEMO
  let memo = new Memo({
    writer: req.session.loginInfo.username,
    content: req.body.content
  });

  //SAVE IN DATABASE
  memo.save(err => {
    if(err) throw err;
    return res.json({success:true});
  });
});


/*
    MODIFY MEMO: PUT /api/memo/:id
    BODY SAMPLE: { content: "sample "}
    ERROR CODES
        1: INVALID ID,
        2: EMPTY CONTENT
        3: NOT SIGNED IN
        4: NO RESOURCE
        5: PERMISSION FAILURE
*/
router.put('/:id', (req, res) => {
  //CHECK MOMO ID IS VAILD
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  //CHECK CONTENTS VALID
  if(typeof req.body.content !== 'string' || req.body.content === ''){
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  }

  //CHECK LOGIN STATUS
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 3
    });
  }

  //FIND MEMO
  Memo.findById(req.params.id, (err, memo) => {
    if(err) throw err
    
    //IF MEMO NOT EXIST
    if(!memo){
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 4
      });
    }

    //CHECK FOR WRITER
    if(memo.writer !== req.session.loginInfo.username){
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 5
      });
    }

    //MODIFY AND SAVE IN DATABASE
    memo.content = req.body.content;
    memo.date.edited = new Date();
    memo.is_edited = true;

    memo.save((err, memo) => {
      if(err) throw err;
      return res.json({
        success: true,
        memo
      });
    });
  });
});

/*
    DELETE MEMO: DELETE /api/memo/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {
  //CHECK MEMO ID IS VAILD
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  //CHECK LOGIN STATUS
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 2
    });
  }

  //FIND MEMO AND CHECK FOR WRITER
  Memo.findById(req.params.id, (err, memo) => {
    if(err) throw err;
    if(!memo){
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 3
      })
    }

    if(memo.writer !== req.session.loginInfo.username){
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 4
      });
    }

    //REMOVE THE MEMO
    Memo.remove({_id: req.params.id}, err => {
      if(err) throw err;
      res.json({success:true});
    });
  });
});

/* 
  READ MEMO OF A USER: GET /api/memo:username 
*/
router.get('/:username', (req, res) => {
  Memo.find({writer: req.params.username})
  .sort({"_id": -1})
  .limit(6)
  .exec((error, memos) => {
    if(error) throw error;
    res.json(memos);
  });
});

/* 
  READ ADDITIONAL MEMO OF A USER: GET /api/memo/:username/:listType/:id
*/
router.get('/:username/:listType/:id', (req, res) => {
  let {listType, id, username} = req.params;

  //CHECK LIST TYPE VALIDITY
  if(listType !== 'old' && listType !== 'new'){
    return res.status(400).json({
      error: "INVALID LIST TYPE",
      code: 1
    });
  }

  //CHECK MEMO ID VALIDITY
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }

  let objId = new mongoose.Types.ObjectId(req.params.id);
  
  if(listType === 'new'){
    //GET NEWER MEMO
    Memo.find({writer: username, _id: {$gt: objId}})
    .sort({_id: -1})
    .limit(6)
    .exec((error, memos)=>{
      if(error) throw error;
      return res.json(memos);
    });
  }else{
    //GET OLDER MEMO
    Memo.find({writer: username, _id: {$lt: objId}})
    .sort({_id: -1})
    .limit(6)
    .exec((error, memos)=>{
      if(error) throw error;
      return res.json(memos);
    });
  }
});


/*
    READ MEMO: GET /api/memo
*/
router.get('/', (req, res) => {
  Memo.find()
  .sort({"_id":-1})
  .limit(6)
  .exec((err,memos) => {
    if(err) throw err;
    res.json(memos);
  });
});

/*
  READ ADDITIONAL: GET /api/memo/:listType/:id
*/
router.get('/:listType/:id', (req, res) => {
  let listType = req.params.listType;
  let id = req.params.id;

  //CHECK LIST TYPE VALIDITY
  if(listType !== 'old' && listType !== 'new'){
    return res.status(400).json({
      error: "INVALID LISTTYPE",
      code: 1
    });
  }

  //CHECK MEMO ID VALIDITY
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }

  let objId = new mongoose.Types.ObjectId(id);
  if(listType === 'new'){
    //GET NEWER MEMO
    Memo.find({_id: {$gt: objId}})
    .sort({_id: -1})
    .limit(6)
    .exec((err, memos) => {
      if(err) throw err;
      return res.json(memos);
    });
  }else{
    //GET OLDER MEMO
    Memo.find({_id: {$lt: objId}})
    .sort({_id: -1})
    .limit(6)
    .exec((err, memos) => {
      if(err) throw err;
      return res.json(memos);
    });
  }
});

export default router;