import bookingareaModel from "@/models/bookingarea";
import dbConnect from "@/config/dbConnect";
export default async function (req, res) {
  dbConnect();
  try {
    let singlebooking = await bookingareaModel.findById(req.query._id);

    if (!singlebooking) {
      res.status(404).json({
        success: false,
        message: "Booking Area is not Found",
      });
    }

    switch (req.method) {
      case "GET":
        res.status(201).json({
          success: true,
          singlebooking,
        });
        break;
      case "PUT":
        const updateArea = await bookingareaModel.findByIdAndUpdate(
          singlebooking._id,
          { $set: req.body },
          { new: true }
        );
        res.status(201).json({
          success: true,
          updateArea,
        });
        break;
      case "DELETE":
        const deletarea = await bookingareaModel.findByIdAndDelete(singlebooking._id)
        res.status(201).json({
          success: true,
          message: "You Play area has been deleted",
        });
        break;
      default:
        break;
    }
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
