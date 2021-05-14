import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Footer from "../components/Footer";

export default function profilePage({ username }) {
  return (
    <>
      <Header username={username} />
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  await dbConnect();
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
