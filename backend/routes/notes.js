const express = require("express");
const router = express.Router();
const Note =require('../models/Notes');
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');

//route 1 :get all the notes
router.get("/fetchallnotes", fetchuser , async (req , res)=>{
const notes = await Note.find({user:req.user.id});
 res.json(notes)
})

//route 2 :post notes in user the notes
router.post("/addnote",fetchuser ,[
    body('title', "Enter a valid title").isLength({min:3}),
    body('description' , "Enter a valid description").isLength({ min: 5}),
   
] , async (req , res)=>{
    const {title, description , tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title , description , tag , user: req.user.id
    })
    const savednote = await note.save();
     res.json(savednote)
    });



////mode 3 : for updating
router.put("/updatenote/:id",fetchuser ,
    async (req , res)=>{
    const {title, description , tag } = req.body;

    //create new object
    const newNote = {};
    if(title){newNote.title= title};
    if(description){newNote.description=description};
    if(tag){newNote.tag = tag};

    //find note and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(req.params.id , {$set:newNote}, {new:true})
    res.json({note});
    
    });

    ////route 4: deleteing note
    router.delete('/deletenote/:id' , fetchuser , async (req ,res)=>{
     try {
         ///FIND note to be deleted and delete it
         let note = await Note.findById(req.params.id);
          if(!note){return res.status(404).send("Not found")}
      
          if(note.user.toString() !== req.user.id){
              return res.status(401).send("Not Allowed");
    }
          note = await Note.findByIdAndDelete(req.params.id )
          res.json({"sucess": "note has been deleted"});
          
     } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error")
     }
    })

module.exports = router;