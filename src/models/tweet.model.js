import mongoose, { Schema } from "mongoose";
const TweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Tweet = mongoose.model("Tweet", TweetSchema);
export { Tweet };