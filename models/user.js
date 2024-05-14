const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.png",
    },
  },
  { timestamps: true }
);

//Add Middlewares Before Saving the Doc
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static("validateUser", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) return false;

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash) {
    return false;
  }

  return createTokenForUser(user);
});

const User = mongoose.model("user", userSchema);

module.exports = User;
