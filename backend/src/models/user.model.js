import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
   {
      firstName: String,
      lastName: String,
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         index: true,
         validate: {
            validator: function (v) {
               return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(
                  v
               );
            },
            message: (props) => `${props.value} is not a valid email address!`,
         },
      },
      password: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         unique: true,
      },
      refreshToken: String,
      fcmToken: String,
      timeZone: Number,
      isActive: Boolean,
      phone: String,
      notify: Boolean,
      notifyTime: String,
      habitSkip: {
         type: Number,
         default: 5,
      },
      habitsList: [mongoose.Schema.Types.ObjectId],
   },
   { timestamps: true }
);

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10);
   next();
});

userSchema.methods.checkPassword = async function (password) {
   return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
   return await jwt.sign(
      {
         _id: this._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
};
userSchema.methods.generateRefreshToken = async function () {
   return await jwt.sign(
      {
         _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
   );
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
