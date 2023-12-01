import userModel from "@/models/user";
import dbConnect from "@/config/dbConnect";
import bcrypt from "bcrypt";
import { GenAccessToken } from "@/helper/jwt";
import { serialize } from "cookie";
export default async function handler(req, res) {
  dbConnect();
  try {
    const { email, password } = req.body;

    //Check if the password and email has been provided

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email & Password is required",
      });
      return;
    }

    //find user by email

    const foundUser = await userModel.findOne({ email: req.body.email });

    if (!foundUser) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Compare provided password with hashed password

    const IsPasswordValid = await bcrypt.compare(password, foundUser?.password);

    if (!IsPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentioals",
      });
      return;
    }
    const Accesstoken = await GenAccessToken({
      id: foundUser._id,
    });
    res.setHeader(
      "Set-Cookie",
      serialize("AccessToken", Accesstoken, {
        path: "/",
        httpOnly: true,
        secure: true,
      })
    );
    var user = {
      id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
      isActive: foundUser.isActive,
    };
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
}
