import bookingareaModel from "@/models/bookingarea";
import dbConnect from "@/config/dbConnect";
import jwt from "jsonwebtoken";
export default async function handler(req, res) {

  dbConnect();
  //  
  try {
    if ( !req.cookies.AccessToken) {
          res.status(403).json({
              success:false,
              message:"Access Token Not Provided"
          })
          return
        }  
        const tokendata = jwt.verify(req.cookies.AccessToken,process.env.SECURE_URL)
      
    const bookingarea = await bookingareaModel.create({...req.body, owner:tokendata.id});

 res.status(200).json({
  success:true,
  bookingarea
 })
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      if (error.keyPattern?.title) {
        res.status(409).json({
          success: false,
          message: "Title is Already in Use!",
        });
      }
      return;
    }

    // Required Fields Errors Handling
    if (error.message.split(",")[0]?.split(":")[2]?.trim()) {
      res.status(400).json({
        success: false,
        message: error.message.split(",")[0]?.split(":")[2]?.trim(),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Something Went Wrong!",
    });
  }
}
