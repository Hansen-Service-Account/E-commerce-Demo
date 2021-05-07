import User from "../../models/user";
import withSession from "../../middleware/session";
import argon2 from "argon2";

export default withSession(async (req, res) => {
  const {
    firstName,
    lastName,
    title,
    streetAddress1,
    streetAddress2,
    city,
    country,
    countyState,
    postalZipCode,
    phone,
    email,
    customerType,
    password,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("error");
      res.json({
        error: {
          field: "email",
          message: "User with this email already exists",
        },
      });
      return;
    }
    const hashedPassword = await argon2.hash(password);
    const user = new User({
      firstName,
      lastName,
      title,
      streetAddress1,
      streetAddress2,
      city,
      country,
      countyState,
      postalZipCode,
      phone,
      email,
      customerType,
      password: hashedPassword,
    });
    const newUser = await user.save();

    req.session.set("userId", newUser._id);
    await req.session.save();
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err.message);
  }
});
