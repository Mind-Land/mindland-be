const errorHandler = (err) => {
  let errors = { username: "", email: "", password: "" };

  if (err.code === 11000 && err.keyValue.username) {
    errors.username = `Username ${err.keyValue.username} sudah digunakan!`;
    return errors;
  }

  if (err.code === 11000 && err.keyValue.email) {
    errors.email = `Email ${err.keyValue.email} sudah digunakan!`;
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports = errorHandler;
