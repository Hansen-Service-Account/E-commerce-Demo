import Footer from "../components/Footer";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import withSession from "../middleware/session";
import { getHeaderAndFooterNavigationOfWebsite } from "../utils/contentful";
import { HANSEN_CPQ_V2_BASE_URL } from "../utils/constants";

export default function loginPage({
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
}) {
  return (
    <>
      <Header
        initialLogoSrc={headerLogo.fields.file.url}
        headerNav={headerNav.items[0]}
        productLines={productLines}
      />
      <LoginForm />
      <Footer
        logoURL={footerLogo.fields.file.url}
        footerNav={footerNav.items[0]}
      />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;

  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getHeaderAndFooterNavigationOfWebsite(
      process.env.CONTENTFUL_WEBSITE_ID
    );

  const productLinesRes = await fetch(
    `${HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
  );
  if (productLinesRes.status > 400) {
    productLines = [];
  } else {
    productLines = await productLinesRes.json();
  }
  if (req.session.get("userId")) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {
      headerNav,
      footerNav,
      headerLogo,
      footerLogo,
      productLines,
    },
  };
});
