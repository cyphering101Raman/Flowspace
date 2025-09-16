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
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6
    }
  },
  { timestamps: true }
)

UserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
})

UserSchema.methods.isPasswordValid = async function(password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", UserSchema);

export default User;