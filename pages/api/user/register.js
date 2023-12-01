import userModel from "@/models/user";
import dbConnect from "@/config/dbConnect";
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  dbConnect();
  try {

    if(!req.body.password){
      return res.status(400).json({
        success:false,
        message:"Password is Required!"
      })
    }


    const hashpass = await bcrypt.hash(req.body.password, 10);

    const user = await userModel.create({
      ...req.body,
      password: hashpass,
    });
    const saveuser = await user.save();

    res.status(200).json({
      success: true,
      saveuser,
    });

  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        res.status(409).json({
          success: false,
          message: "Email Already in Use!",
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
