import Header from "../../components/Header";
import fetch from "node-fetch";
import {
  BUSINESS_SUB_CATEGORIES,
  DARK_GOLD,
  HANSEN_CPQ_V2_BASE_URL,
  MOBILE_PRODUCTS_ENDPOINT,
  RESIDENTIAL_SUB_CATEGORIES,
} from "../../utils/constants";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import User from "../../models/user";
import { getHomePageImageSections } from "../../utils/contentful";
import Hero from "../../components/Hero";
import CategorySelection from "../../components/CategorySelection";
import Footer from "../../components/Footer";
import { Center, Heading } from "@chakra-ui/layout";
import QuoteCart from "../../components/QuoteCart";
import fetcher from "../../utils/nodeFetchJson";
import Error from "next/error";
import { useRouter } from "next/router";

export default function productLines({
  username,
  homePageEntry,
  quoteId,
  status,
  errorMessage,
  productLines,
}) {
  const { firstSection, secondSection, thirdSection, fourthSection } =
    homePageEntry.fields;
  const homePageImageSections = [
    { imageURL: firstSection.fields.file.url, alt: firstSection.fields.title },
    {
      imageURL: secondSection.fields.file.url,
      alt: secondSection.fields.title,
    },
    { imageURL: thirdSection.fields.file.url, alt: thirdSection.fields.title },
    {
      imageURL: fourthSection.fields.file.url,
      alt: fourthSection.fields.title,
    },
  ];

  if (status) {
    return (
      <>
        <Header username={username} />
        <Center height="70vh" overflow="hidden">
          <Error statusCode={status} title={errorMessage} />
        </Center>
        <QuoteCart quoteId={quoteId} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header username={username} />
      <Heading
        as="h2"
        size="lg"
        textAlign="center"
        textTransform="uppercase"
        mt={16}
      >
        Our product lines
      </Heading>
      <CategorySelection categories={productLines} urlPrefix="/product-lines" />
      <Hero homePageImageSections={homePageImageSections} />
      <QuoteCart quoteId={quoteId} />
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const homePageEntry = await getHomePageImageSections();
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
        props: { homePageEntry, productLines },
      };
    }

    return {
      props: {
        homePageEntry,
        username: user.firstName,
        quoteId,
        productLines,
      },
    };
  } catch (error) {
    return {
      props: {
        status: error.response.status,
        errorMessage: error.data.responseText,
        username: user.firstName,
        quoteId,
      },
    };
  }
});
