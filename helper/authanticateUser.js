import jwt from "jsonwebtoken";
import userModel from "@/models/user";

export async function authenticateUser(req,res,next){

try {
    console.log(req)
//   if ( !req.cookies.AccessToken) {
//     res.status(403).json({
//         success:false,
//         message:"Access Token Not Provided"
//     })
//     return
//   }  
//   const tokendata = jwt.verify(req.cookies.AccessToken,process.env.SECURE_URL)
} catch (error) {
    res.status(403).json({
        success:false,
        message:"Invalid Token Provided!"
    })
    console.log(error)
}

}