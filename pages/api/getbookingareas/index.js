import bookingareaModel from "@/models/bookingarea";
import dbConnect from "@/config/dbConnect";
export default async function handler(req, res) {
  dbConnect();
  try {
    var bookings = {};
    var match = {};
    var limit = req.query.limit || 6;
    var page = req.query.page || 1;
    var skip = limit * (page - 1);

    if (req.query?.keyword) {
      match.title = new RegExp(req.query.keyword, "i");
    }

    if (req.query?.isApproved) {
      match.isApproved = true;
    }

    if (req.query.type) {
      match.type = new RegExp(req.query.type, "i");
    }
   

    bookings.data = await bookingareaModel.find(match).limit(limit).skip(skip).populate("owner");

    bookings.starting = skip + 1;
    bookings.ending =
      bookings.starting + limit - 1 > bookings.count
        ? bookings.count
        : bookings.starting + limit - 1;
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log(error);
  }
}
