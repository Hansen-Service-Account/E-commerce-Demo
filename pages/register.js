import Header from "../components/Header";
import withSession from "../middleware/session";

import RegistrationForm from "../components/RegistrationForm";
import Footer from "../components/Footer";

export default function registerPage() {
  return (
    <>
      <Header />
      <RegistrationForm />
      <Footer />
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
