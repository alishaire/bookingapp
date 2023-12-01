import userModel from "@/models/user";
import dbConnect from "@/config/dbConnect";
export default async function handler(req, res) {
  dbConnect();
  try {
    var users = {};
    var match = {};
    var limit = req.query.limit || 5;
    var page = req.query.page || 1;
    var skip = limit * (page - 1);
    if (req.query.name) {
      match.name = new RegExp(req.query.name, "i");
    }
    if (req.query.email) {
      match.email = new RegExp(req.query.email, "i");
    }

    users.data = await userModel
      .find(match)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    users.count = await userModel.find().count();
    users.starting = skip + 1;
    users.ending =users.starting + limit - 1 > users.count ? users.count : users.starting + limit - 1;

    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
  }
}
