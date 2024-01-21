const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    UserId:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Photo:{
        type:String,
        required:true,
        default:"https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
    },
    Name:{
        type:String,
    },
    Approval:{
        type:String,
        default:"Not Accepted by Admin",
    }
},{ timestamps: true })

mongoose.model("userDB",userSchema)