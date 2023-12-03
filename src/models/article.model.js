module.exports = (mongoose, mongoosePaginate) => {
  const schema = mongoose.Schema(
    {
      title: { type: String, required: true },
      category: { type: Array, default: [] },
      author: { type: String, required: true },
      summary: String,
      body: { type: String, required: true },
      hit: { type: Number, default: 0 },
      imageUrl: String,
      reference: { type: Array, default: [] },
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
