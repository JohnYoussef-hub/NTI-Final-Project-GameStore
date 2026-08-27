const mongoose = require("mongoose") 


const userSchema = mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        minLength : [3 , "min char for name is 3"],
        maxLength : [30 , "name must be below 30 char"],
    },
    email : {
        type : String ,
        required : true ,
        unique : true , 
    },
   password : {
        type : String ,
        required : true ,
        minLength : [6, "min char for password is 6 char"],
        select :false
    },
    image : String ,
    role : {
        type : String ,
        enum : ["user" , "admin"] ,
        default : "user" ,
        select : true
    } ,
    isDeleted : {
        type : Boolean , 
        default : false ,
        select :false
    },
    isActive : {
        type : Boolean , 
        default : false 
    },
    confirmOTP : {
        type : String ,
        select : false
    },
    OTPExpire : {
        type : Date ,
        select : false
    },
    resetToken : String

} , {
    timestamps : true ,
    versionKey : false
})


const User = mongoose.model("user" , userSchema)

module.exports = User