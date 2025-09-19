import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, default: 18 },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
  },
  { timestamps: true }
);

const usersDetails = mongoose.model("User", userSchema);

export default usersDetails;
