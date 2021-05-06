import Header from "../components/Header";
import withSession from "../middleware/session";

import RegistrationForm from "../components/RegistrationForm";

export default function register() {
  return (
    <>
      <Header />
      <RegistrationForm />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  if (req.session.get("userId")) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
