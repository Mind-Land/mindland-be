module.exports = (mongoose, mongoosePaginate) => {
  const validator = require("validator");
  const brcypt = require("bcryptjs");

  const schema = new mongoose.Schema(
    {
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
      avatar: {
        type: String,
      },
      firstName: {
        type: String,
        required: [true, "Nama depan tidak boleh kosong!"],
      },
      lastName: {
        type: String,
        required: [true, "Nama belakang tidak boleh kosong!"],
      },
      fullName: {
        type: String,
      },
      praktik: {
        type: String,
        default: "",
      },
      about: { type: String, default: "" },
      jenisKelamin: {
        type: String,
        enum: ["Laki-laki", "Perempuan"],
        required: [true, "Jenis kelamin tidak boleh kosong!"],
      },
      phoneNumber: { type: Number, default: "" },
      // isVerified: {
      //   type: Boolean,
      //   default: true,
      // },
      rating: { type: String, default: "" },
      pengalaman: { type: Number, default: 0 },
      job: { type: String, default: "" },
      alumnus: { type: String, default: "" },
      rating: { type: String, default: "" },
      followers: { type: Number, default: 0 },
      // article: [{ type: mongoose.Schema.Types.ObjectId, ref: "article" }],
      roles: { type: String, default: "doctor" },
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

  schema.statics.register = async function (
    email,
    password,
    firstName,
    lastName,
    fullName,
    jenisKelamin,
    avatar
  ) {
    if (!email || !password) {
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

    const isEmailExist = await this.findOne({ email });

    if (isEmailExist) throw Error("Email sudah digunakan!");

    const doctor = await this.create({
      email,
      password,
      firstName,
      lastName,
      fullName,
      jenisKelamin,
      avatar,
    });

    return doctor;
  };

  schema.statics.login = async function (email, password) {
    if (!email || !password) {
      throw Error("Semua field harus terisi!");
    }

    const doctor = await this.findOne({
      email,
    });

    if (doctor) {
      const auth = await brcypt.compare(password, doctor.password);
      if (auth) return doctor;
      throw Error("Password salah!");
    }
    throw Error("Email belum terdaftar!");
  };

  schema.plugin(mongoosePaginate);

  const Doctor = mongoose.model("doctor", schema);

  return Doctor;
};
