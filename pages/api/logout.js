import withSession from "../../middleware/session";

export default withSession(async (req, res) => {
  req.session.destroy();
  res.json({ isLoggedIn: false, userInfo: null });
});
