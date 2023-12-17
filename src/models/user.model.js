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
        validate: [validator.isEmail, "Email tidak valid!"],
      },
      fullName: {
        type: String,
        default: "",
      },
      password: {
        type: String,
        required: [true, "Password tidak boleh kosong!"],
        minLength: [8, "Password minimal 8 karakter!"],
      },
      avatar: {
        type: String,
        default:
          "https://www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg",
      },
      roles: { type: String, default: "user" },
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
