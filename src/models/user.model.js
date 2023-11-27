module.exports = (mongoose) => {
  const { isEmail } = require("validator");
  const brcypt = require("bcryptjs");

  const schema = mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, "Username tidak boleh kosong!"],
        unique: [true, "Username sudah digunakan!"],
      },
      email: {
        type: String,
        required: [true, "Email tidak boleh kosong!"],
        unique: [true, "Email sudah digunakan!"],
        validate: [isEmail, "Email tidak valid!"],
      },
      password: {
        type: String,
        required: [true, "Password tidak boleh kosong!"],
        minLength: [8, "Password minimal 8 karakter!"],
      },
    },
    {
      timestamps: true,
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.pre("save", async function (next) {
    const salt = await brcypt.genSalt(10);
    this.password = await brcypt.hash(this.password, salt);
    next();
  });

  const User = mongoose.model("user", schema);

  return User;
};
