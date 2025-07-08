const mongoose=require('mongoose')
const Blog = require('../models/blog.models.js');

// CREATE BLOG
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = new Blog({
      title,
      content,
      user: req.user.id  // from JWT middleware
    });
    await blog.save();
    res.status(201).json({ success: true, message: "Blog created", blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating blog" });
  }
};

// GET USER'S BLOGS
const getUserBlogs = async (req, res) => {
  try {
        // const userId = req.user.id; // assuming this comes from JWT middleware
        const datas = await Blog.find({ user:req.user.id }).sort({ createdAt: 1 });
        console.log(datas)
        if (!datas) {
          res.status(404).json({
            success: false,
            message: "No blogs found for this user",
          });
        }
        console.log(datas)
        res.status(200).json({
          success: true,
          datas,
        });

  } catch (err) {
     res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

//getting aspecific blog through id....

const getBlogbyId=async(req,res)=>{
  try{
      const userid =req.user.id
      const jsonid=req.params.id

      const json= await Blog.findOne({_id:jsonid ,user :userid})
      if(!json){
        return res.status(404).json({
          success:false,
          message:"json document not find with this user..."
        })
      }
      res.status(200).json({
        success:true,
        data:json
      })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"server error",
      error:err.message
    })

  }

}

const deleteblog=async(req,res)=>{
  try{
    const userid=req.user.id
    const blogid=req.params.id

    const deletedoc=await Blog.findOneAndDelete({
      _id:blogid,
      user:userid
    })
    if(!deletedoc){
      return res.status(404).json({
        success:false,
        message:" json document is not found "
      })
    }
    return res.status(200).json({
      sucess:true,
      message:"data delete sucessfully !!",
      data:deletedoc
    })
  }catch(err){
    res.status(500).json({
      success:false,
      message:"server error",
      error:err.message
    })
  }
}

const updatablog=async(req,res)=>{
  try{
    const userid=req.user.id
    const blogid=req.params.id
    console.log(req.body)
    const {title,content}=req.body

    if (!mongoose.Types.ObjectId.isValid(blogid)) {
      return res.status(400).json({ success: false, message: "Invalid blog ID" });
    }

    const updatedoc=await Blog.findOneAndUpdate(
      {'_id':blogid ,
        user:userid},
      {title ,content},
      {new:true, runValidators: true}
    )
    if(!updatedoc){
      return res.status(404).json({
        success:false,
        message:"JSON document not found or access denied",
      })
    }
    res.status(200).json({
      success:true,
      message:"json document updated sucessfully",
      data:updatedoc
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"internal server error",
      error:err.message
    })

  }
}

module.exports = { createBlog, getUserBlogs ,getBlogbyId ,deleteblog ,updatablog};
