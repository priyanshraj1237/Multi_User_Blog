const mongoose=require('mongoose')

const blogschema=new mongoose.Schema({
    title: {type:String,require:true},
    content: {type:String,require:true},
    createdAt: {
    type: Date,
    default: Date.now,
    imutable:true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});


module.exports=mongoose.model('Blog',blogschema)