import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    meta_data:{type:String, required:true},
    meta_description:{type:String, required:true},
    keywords:{type:[String], required:true},
    open_graph_tags:{type:[String], required:true},
    category:{type:String, required:true},
    sub_category:{type:String, required:true},
    date_created:{type:String, required:true },
    slug:{type:String, required:true},
    chapters:{type:[{title:String,data:String}], required:false}
},{
    versionKey:false
})

mongoose.model("Blog",blogSchema);
