const dotenv = require('dotenv');
const sanitizeHtml = require('sanitize-html');
const Joi = require('joi');
dotenv.config();

const myDeed = require('../models/deedModel');

exports.getAllDeeds = async (req, res) => {
    try {
        console.log('getall');
        
        const deeds = await myDeed.find()
        res.status(200).json(deeds)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.editDeed = async (req, res) => {

  try {
    console.log(req.params.id);

    const deed = await myDeed.findById(req.params.id);

    // const addedList = req.body;
    // console.log(addedList);
    if(!deed)
    {
        res.status(404).json({ message: "Deed not found"});
    }

    // if (addedList) {
    //   deed.addedList = addedList;
    // }
    deed.addedCount++;
    deed.lastAdding=Date.now().toString()
    await deed.save();
    res.status(200).json(deed);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
