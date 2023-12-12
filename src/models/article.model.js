module.exports = (mongoose, mongoosePaginate) => {
  const schema = mongoose.Schema(
    {
      title: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
      author: { type: mongoose.Types.ObjectId, ref: "user" },
      summary: { type: String, required: true },
      published: { type: Boolean, required: true },
      body: { type: String, required: true },
      hit: { type: Number, default: 0 },
      imageUrl: String,
      reference: { type: mongoose.Schema.Types.ObjectId },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
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
