import Header from "../components/Header";
import fetch from "node-fetch";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import { getWebPageByWebsiteIdAndPageName } from "../utils/contentful";
import Footer from "../components/Footer";
import QuoteCart from "../components/QuoteCart";
import { sections } from "../sections/sections.config";

export default function businessProducts({
  username,
  quoteId,
  webPage,
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
}) {
  return (
    <>
      <Header
        username={username}
        initialLogoSrc={headerLogo.fields.file.url}
        productLines={productLines}
        headerNav={headerNav}
      />
      {webPage.fields.pageSections.map(
        (ps) =>
          sections[ps.fields.designedSection] &&
          ps.sys.contentType.sys.id === "pageSection" &&
          sections[ps.fields.designedSection]({
            pageSection: ps,
            key: ps.sys.id,
          })
      )}
      {username && <QuoteCart quoteId={quoteId} />}
      <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;
  const { webPage, headerNav, footerNav, headerLogo, footerLogo } =
    await getWebPageByWebsiteIdAndPageName(
      process.env.CONTENTFUL_WEBSITE_ID,
      "Business Products"
    );
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const productLinesRes = await fetch(
    `${process.env.HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
  );
  if (productLinesRes.status > 400) {
    productLines = [];
  } else {
    productLines = await productLinesRes.json();
  }

  if (!user) {
    return {
      props: {
        webPage,
        headerNav,
        footerNav,
        headerLogo,
        footerLogo,
        productLines,
      },
    };
  }

  if (!quoteId) {
    return {
      props: {
        webPage,
        headerNav,
        footerNav,
        headerLogo,
        footerLogo,
        productLines,
        username: user.firstName,
      },
    };
  }

  return {
    props: {
      webPage,
      headerNav,
      footerNav,
      headerLogo,
      footerLogo,
      productLines,
      username: user.firstName,
      quoteId,
    },
  };
});
