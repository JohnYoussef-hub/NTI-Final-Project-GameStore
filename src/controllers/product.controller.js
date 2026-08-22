const Product = require("../models/product")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")


exports.getAllProducts = catchAsync(async(req,res,next) => {
 
    const products = await Product.find({isDeleted : false})
     
        res.status(200).json({
            success : true ,
            productCount : products.length ,
            data : products
        })
    })



    exports.getDeletedProducts = catchAsync (async (req,res,next)=> {
        const products = await Product.find({isDeleted : true}).select("+isDeleted +deletedAt")

         res.status(200).json({
            success : true ,
            productCount : products.length ,
            data : products
        })
    })
    
    exports.getStatus=catchAsync(async (req,res,next)=>
    {
        const status=await Product.aggregate([
            {$match : {isDeleted : false}},
            { $unwind: "$genre" },
            {$sort :    {price :-1} },
            {$group : {
            _id : "$genre",
            productCount : {$sum :1} , 
            minPrice : {$min : "$price"} , 
            maxPrice : {$max : "$price"} , 
            avgPrice : {$avg : "$price"} , 
            product : {$first : "$$ROOT"} ,

            }},

        ])

   res.status(200).json({
            success : true ,
            data : status
        })

    })

exports.getOneProduct=catchAsync(async (req, res, next)=>{

const product=await Product.findOne({isDeleted : false,  _id : req.params.id});


if (!product) return next(new AppError(`No Product found with this id ${req.params.id}`,404))

 res.status(200).json({
            success : true ,
            data : product
        })


})

exports.addProduct=catchAsync(async (req, res, next)=>{
const product = await Product.create(req.body);
product.isDeleted=undefined;
res.status(201).json({
        success : true ,
        message : `Product is created successfully`,
        data : product
    })

})

exports.updateProduct=catchAsync(async (req,res,next)=>{

  const product = await Product.findOneAndUpdate(
        {isDeleted :false , _id :req.params.id},
        {...req.body,updatedAt: new Date()} , 
        {returnDocument : "after" , runValidators:true})

    
 if (!product) return next(new AppError(`No Product found with this id ${req.params.id}`,404))
       
        
res.status(200).json({
    success :true ,
    message : `Product is updated successfully`,
    data : product
    })
  

})

exports.deleteProduct=catchAsync(async (req,res,next)=>{
 const product = await Product.findOneAndDelete(
        {isDeleted :false , _id :req.params.id},
       )

    if (!product) return next(new AppError(`No Product found with this id ${req.params.id}`,404))
 


    res.status(204).send()
})


exports.softDeleteProduct =catchAsync(async (req,res,next) => {
    const product = await Product.findOneAndUpdate(
        {isDeleted :false , _id :req.params.id},
        {isDeleted:true,deletedAt: new Date()},
        {returnDocument: "after"}
 )

    if (!product) return next(new AppError(`No Product found with this id ${req.params.id}`,404))

    res.status(200).json({
        success :true ,
        message : `Product is deleted successfully`,
        data : product
    })
})
