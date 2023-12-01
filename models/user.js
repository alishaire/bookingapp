import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the Name"],
    },
    email: {
      type: String,
      required: [true, "Enter your Email"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Customer", "Owner", "admin"],
      default: "Customer",
      required: true,
    },
    photo: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Enter Your Phone"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);
export default mongoose.models?.users || mongoose.model("users", userSchema);
