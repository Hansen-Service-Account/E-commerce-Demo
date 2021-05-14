import withSession from "../../middleware/session";

export default withSession(async (req, res) => {
  req.session.unset("userId");
  await req.session.save();
  res.json({ isLoggedIn: false, userInfo: null });
});
