import DefaultErrorPage from "next/error";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Header from "../components/Header";

const ErrorPage = ({ username }) => {
  return (
    <>
      <Header username={username} />
      <DefaultErrorPage statusCode={404} title="Page Not Found" />
    </>
  );
};

export const getServerSideProps = withSession(async function ({ req }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });

  if (!user) {
    return {
      props: {},
    };
  }

  return {
    props: {
      username: user.firstName,
    },
  };
});

export default ErrorPage;
