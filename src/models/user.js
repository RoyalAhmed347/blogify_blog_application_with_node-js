const { default: mongoose } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../../services/auth");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    salt: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/defulte.png",
      require: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
      require: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const newPass = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.password = newPass;
  this.salt = salt;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found!");
  }

  const slot = user.salt;
  const userPassword = createHmac("sha256", slot)
    .update(password)
    .digest("hex");

  if (userPassword !== user.password) {
    throw new Error("Passwrod not found!");
  }

  const token = createToken(user);
  return token;
});

const USER = new mongoose.model("user", userSchema);
module.exports = USER;
