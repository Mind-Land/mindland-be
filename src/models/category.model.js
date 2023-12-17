module.exports = (mongoose) => {
  const Category = mongoose.model(
    "category",
    new mongoose.Schema({
      name: String,
      slug: String,
    })
  );

  return Category;
};
