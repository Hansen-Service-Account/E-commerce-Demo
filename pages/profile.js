import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";

export default function profile({ username }) {
  return <Header username={username} />;
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      username: user.firstName,
    },
  };
});