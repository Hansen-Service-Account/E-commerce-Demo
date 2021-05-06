import argon2 from "argon2";
import User from "../../models/user";

export default async (req, res) => {
  const {
    firstName,
    lastName,
    title,
    streetAddress1,
    streetAddress2,
    city,
    country,
    state,
    postalZipCode,
    phone,
    email,
    customerType,
    password,
  } = req.body;
  console.log(req.body);
  try {
    const hashedPassword = await argon2.hash(password);
    const user = new User({
      firstName,
      lastName,
      title,
      streetAddress1,
      streetAddress2,
      city,
      country,
      state,
      postalZipCode,
      phone,
      email,
      customerType,
      password: hashedPassword,
    });
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err.message);
  }
};
