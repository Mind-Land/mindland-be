module.exports = (mongoose, mongoosePaginate) => {
  const schema = mongoose.Schema(
    {
      title: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      category: { type: String, required: true },
      author: { type: mongoose.Types.ObjectId, ref: "doctor" },
      summary: { type: String, required: true },
      body: { type: String, required: true },
      hit: { type: Number, default: 0 },
      imageUrl: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const Article = mongoose.model("article", schema);
  return Article;
};
