import mongoose from "mongoose";
const Schema = mongoose.Schema
const bookingareaSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title of Your Place is required"],
    unique: true,
  },
  size: {
    type: String,
  },

    street: {
      type: String,
      required: [true, "Street is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    zip: {
      type: String,
      required: [true, "Zip is required"],
    },

  images: {
    type: [String],
    required: [true, "Enter Images of Playarea"],
  },
  facilities: [String],
  openingHours: {
    type: [
      {
        day: {
          type: String,
          enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        startTime: {
          type: String,
          required: [true, "Start TIme  is required"],
        },
        endTime: {
          type: String,
          required: [true, "End Time is required"],      
        },
      },
    ],
    required: [true, "Opening Our is required"],
    validate: {
      validator: function (array) {
        return array.length > 0; // Custom validation logic to check if the array has at least one item.
      },
      message: "Please Enter Atleast One Opening Slot!",
    },
  },
  pricePerHour: {
    type: Number,
    required: [true, "Price Per Hour is required"],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
},{
    timestamps:true
});
export default mongoose.models?.bookingareas || mongoose.model("bookingareas", bookingareaSchema);