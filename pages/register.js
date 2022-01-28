import Header from "../components/Header";
import withSession from "../middleware/session";
import RegistrationForm from "../components/RegistrationForm";
import Footer from "../components/Footer";
import { getWebPageByWebsiteIdAndPageName } from "../utils/contentful";

export default function registerPage({
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
        headerNav={headerNav}
        productLines={productLines}
      />
      <RegistrationForm />
      <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;

  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getWebPageByWebsiteIdAndPageName(process.env.CONTENTFUL_WEBSITE_ID);

  const productLinesRes = await fetch(
    `${process.env.HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
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
