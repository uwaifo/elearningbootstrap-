import mongoose, { Schema } from "mongoose";

const providerSchema = new Schema(
  {
    f_name: {
      type: String
    },
    l_name: {
      type: String
    },
    phone_number: {
      type: String
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ]
    },
    password: {
      type: String
    },
    address: {
      type: String,
      required: [true, "Please add an address"]
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Provider", providerSchema);
