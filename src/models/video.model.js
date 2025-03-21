import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema(
  {
    videoFile: {
      type: String, //Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, //Cloudinary URL
      required: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
VideoSchema.plugin(mongoosePaginate);
export const Video = mongoose.model("Video", VideoSchema);
