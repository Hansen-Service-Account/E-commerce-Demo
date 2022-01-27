import Header from "../../../components/Header";
import { HANSEN_CPQ_V2_BASE_URL } from "../../../utils/constants";
import withSession from "../../../middleware/session";
import { dbConnect } from "../../../middleware/db";
import User from "../../../models/user";
import CategorySelection from "../../../components/CategorySelection";
import Footer from "../../../components/Footer";
import { Center, Heading, Box } from "@chakra-ui/layout";
import QuoteCart from "../../../components/QuoteCart";
import fetcher from "../../../utils/nodeFetchJson";
import Error from "next/error";
import { useRouter } from "next/router";
import {
  getHeaderAndFooterNavigationOfWebsite,
  getPageSectionsOfWebPage,
} from "../../../utils/contentful";

export default function productLineID({
  status,
  errorMessage,
  username,
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  quoteId,
}) {
  const router = useRouter();
  const { productLineID } = router.query;
  const productLine = productLines.find(
    (p) => p.name === productLineID.replace(/-/g, " ")
  );

  if (status) {
    return (
      <>
        <Header
          username={username}
          initialLogoSrc={headerLogo.fields.file.url}
          productLines={productLines}
          headerNav={headerNav.items[0]}
        />
        <Center height="70vh" overflow="hidden">
          <Error statusCode={status} title={errorMessage} />
        </Center>
        {username ? <QuoteCart quoteId={quoteId} /> : null}
        <Footer
          logoURL={footerLogo.fields.file.url}
          footerNav={footerNav.items[0]}
        />
      </>
    );
  }

  return (
    <>
      <Header
        username={username}
        initialLogoSrc={headerLogo.fields.file.url}
        productLines={productLines}
        headerNav={headerNav.items[0]}
      />
      <Box py={24}>
        <Heading as="h2" size="lg" textAlign="center" textTransform="uppercase">
          {productLine.name}
        </Heading>
        <CategorySelection
          categories={productLine.children}
          urlPrefix={`/product-lines/${productLineID}/offers`}
        />
      </Box>
      {username ? <QuoteCart quoteId={quoteId} /> : null}

      <Footer
        logoURL={footerLogo.fields.file.url}
        footerNav={footerNav.items[0]}
      />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getHeaderAndFooterNavigationOfWebsite(
      process.env.CONTENTFUL_WEBSITE_ID
    );
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  try {
    const productLines = await fetcher(
      `${HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!user) {
      return {
        props: { headerNav, footerNav, headerLogo, footerLogo, productLines },
      };
    }

    return {
      props: {
        headerNav,
        footerNav,
        headerLogo,
        footerLogo,
        productLines,
        username: user.firstName,
        quoteId,
      },
    };
  } catch (error) {
    return {
      props: {
        status: error.response.status,
        errorMessage: error.data.responseText,
        headerNav,
        footerNav,
        headerLogo,
        footerLogo,
        username: user.firstName,
        quoteId,
      },
    };
  }
});
