import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    reviewer:{type:String, required:true},
    meta_description:{type:String, required:true},
    keywords:{type:[String], required:true},
    category:{type:String, required:true},
    sub_category:{type:String, required:true},
    slug:{type:String, required:true},
    data:{type:String, required:true},
    image:{type:String, required:true},
},{
    versionKey:false,
    timestamps:true
})

mongoose.model("Blog",blogSchema);
