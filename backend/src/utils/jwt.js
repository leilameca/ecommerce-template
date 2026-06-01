const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

const signUserToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

const signCustomerToken = (customer) => {
  return jwt.sign(
    {
      id: customer._id,
      type: "customer",
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = {
  signUserToken,
  signCustomerToken,
};
