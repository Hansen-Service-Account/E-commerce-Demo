import User from "../../models/user";
import withSession from "../../middleware/session";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../middleware/db";

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
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({
        error: {
          field: "email",
          message: "User with this email already exists",
        },
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
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
