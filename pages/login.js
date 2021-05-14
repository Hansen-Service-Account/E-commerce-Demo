import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import withSession from "../middleware/session";

export default function loginPage() {
  return (
    <>
      <Header />
      <LoginForm />
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
