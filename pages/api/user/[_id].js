import userModel from "@/models/user";
import dbConnect from "@/config/dbConnect";
import bcrypt from "bcrypt";
export default async function handler(req, res) {
  try {
    let founduser = await userModel.findById(req.query._id);

    if (!founduser) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    switch (req.method) {
      case "GET":
        res.status(200).json({
          success: true,
          founduser,
        });
        break;
      case "PUT":
        if (req.body.password) {
          const hashpass = await bcrypt.hash(req.body.password, 10);
          const updateduser = await userModel.findByIdAndUpdate(
            founduser._id,
            {
              $set: { ...req.body, password: hashpass },
            },
            { new: true }
          );

          res.status(200).json({
            success: true,
            updateduser,
          });
        }
        if (req.body.email) {
          const updateduser = await userModel.findByIdAndUpdate(
            founduser._id,
            {
              $set: { ...req.body, email: req.body.email },
            },
            { new: true }
          );
          res.status(200).json({
            success: true,
            updateduser,
          });
        }
        if (req.body.name) {
          const updateduser = await userModel.findByIdAndUpdate(
            founduser._id,
            {
              $set: { ...req.body, name: req.body.name },
            },
            { new: true }
          );
          res.status(200).json({
            success: true,
            updateduser,
          });
        }
        break;
      case "DELETE":
        await userModel.findByIdAndDelete(founduser._id);

        res.status(200).json({
          success: true,
          message: "USER DELETED SUCCESSFULLY",
        });
        break;
      default:
        break;
    }
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
  }
}
