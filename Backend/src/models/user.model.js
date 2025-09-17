import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer"
    }
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
})

UserSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", UserSchema);

export default User;