import withSession from "../../middleware/session";
import User from "../../models/user";

export default withSession(async (req, res) => {
  const userId = req.session.userId;

  if (userId) {
    const user = await User.findOne({ _id: userId });

    const { _doc } = user;
    const { password, ...userInfo } = _doc;

    res.json({
      isLoggedIn: true,
      userInfo,
    });
  } else {
    res.json({
      isLoggedIn: false,
      userInfo: null,
    });
  }
});
