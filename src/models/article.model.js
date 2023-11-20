module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: String,
      author: String,
      imageUrl: String,
      content: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, __id, ...object } = this.toObject();
    object.id = __id;
    return object;
  });

  const Article = mongoose.model("article", schema);
  return Article;
};
