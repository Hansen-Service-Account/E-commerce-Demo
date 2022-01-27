import Header from "../components/Header";
import {
  getHeaderAndFooterNavigationOfWebsite,
  getPageSectionsOfWebPage,
} from "../utils/contentful";
import Footer from "../components/Footer";
import { dbConnect } from "../middleware/db";
import withSession from "../middleware/session";
import User from "../models/user";
import QuoteCart from "../components/QuoteCart";
import { HANSEN_CPQ_V2_BASE_URL } from "../utils/constants";
import { sections } from "../sections/sections.config";

export default function homePage({
  webPage,
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  username,
  quoteId,
}) {
  return (
    <>
      <Header
        username={username}
        initialLogoSrc={headerLogo.fields.file.url}
        productLines={productLines}
        headerNav={headerNav.items[0]}
      />
      {webPage.items[0].fields.pageSections.map(
        (ps) =>
          sections[ps.fields.designedSection] &&
          ps.sys.contentType.sys.id === "pageSection" &&
          sections[ps.fields.designedSection]({
            pageSection: ps,
            key: ps.sys.id,
          })
      )}
      {username ? <QuoteCart quoteId={quoteId} /> : null}
      <Footer
        logoURL={footerLogo.fields.file.url}
        footerNav={footerNav.items[0]}
      />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;
  const { webPage, pageSections, imageAssets } = await getPageSectionsOfWebPage(
    "Home"
  );
  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getHeaderAndFooterNavigationOfWebsite(
      process.env.CONTENTFUL_WEBSITE_ID
    );

  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const productLinesRes = await fetch(
    `${HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
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
        pageSections,
        imageAssets,
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
        pageSections,
        imageAssets,
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
      pageSections,
      imageAssets,
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
