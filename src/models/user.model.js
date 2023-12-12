module.exports = (mongoose, mongoosePaginate) => {
  const validator = require("validator");
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
        // validate: [isEmail, "Email tidak valid!"],
      },
      password: {
        type: String,
        required: [true, "Password tidak boleh kosong!"],
        minLength: [8, "Password minimal 8 karakter!"],
      },
      roles: {
        type: String,
        enum: ["user", "doctor", "admin"],
        default: "user",
      },
      avatar: {
        type: String,
        default: "https://i.ibb.co/4m3QJ0t/default-avatar.png",
      },
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
      praktik: {
        type: String,
        default: "",
      },
      pengalaman: { type: Number, default: 0 },
      job: { type: String, default: "" },
      alumnus: { type: String, default: "" },
      rating: { type: mongoose.Schema.Types.ObjectId, ref: "rating" },
      followers: { type: Number, default: 0 },
      article: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
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

  schema.statics.register = async function (username, email, password) {
    if (!username || !email || !password) {
      throw Error("Semua field harus terisi!");
    }

    if (email) {
      if (!validator.isEmail(email)) {
        throw Error("Email tidak valid!");
      }
    }

    if (!validator.isStrongPassword(password)) {
      throw Error(
        "Password harus berisi kombinasi huruf besar, angka, dan simbol!"
      );
    }

    const isUsernameExist = await this.findOne({ username });
    const isEmailExist = await this.findOne({ email });

    if (isUsernameExist) throw Error("Username sudah digunakan!");
    if (isEmailExist) throw Error("Email sudah digunakan!");

    const user = await this.create({
      username,
      email,
      password,
    });

    return user;
  };

  schema.statics.login = async function (identifier, password) {
    if (!identifier || !password) {
      throw Error("Semua field harus terisi!");
    }

    const user = await this.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (user) {
      const auth = await brcypt.compare(password, user.password);
      if (auth) return user;
      throw Error("Password salah!");
    }
    throw Error("Username / email belum terdaftar!");
  };

  schema.plugin(mongoosePaginate);

  const User = mongoose.model("user", schema);

  return User;
};
