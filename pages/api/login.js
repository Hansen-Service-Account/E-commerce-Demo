import User from "../../models/user";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import bcrypt from "bcryptjs";
import fetch from "node-fetch";
import {
  HANSEN_CPQ_V2_BASE_URL,
  HANSEN_CUSTOMER_REF,
} from "../../utils/constants";

export default withSession(async (req, res) => {
  let retrievedUserInfo;
  try {
    await dbConnect();

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        error: {
          field: "email",
          message: "User with provided email does not exist",
        },
      });
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.json({
        error: { field: "password", message: "The password is incorrect" },
      });
    }
    req.session.set("userId", user._id);
    const { _doc } = user;
    const { password, ...userInfo } = _doc;
    retrievedUserInfo = userInfo;
    await req.session.save();
    if (!req.session.get("quoteId")) {
      const result = await fetch(`${HANSEN_CPQ_V2_BASE_URL}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteType: 0,
          customerRef: `0001`,
          items: [],
        }),
      });

      const newQuote = await result.json();
      console.log(newQuote);
      req.session.set("quoteId", newQuote.id);
      await req.session.save();
    }

    res.status(200).json({ isLoggedIn: true, userInfo });
  } catch (error) {
    if (error.type === "invalid-json") {
      return res.status(500).json({
        user: { isLoggedIn: true, userInfo: retrievedUserInfo },
        error: { field: "server", message: error.message, body: error },
      });
    }
    return res.status(500).json({
      error: { field: "server", message: error.message, body: error },
    });
  }
});
