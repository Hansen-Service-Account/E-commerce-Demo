import Header from "../../components/Header";
import fetch from "node-fetch";
import {
  DARK_GOLD,
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
import { Heading } from "@chakra-ui/layout";
import QuoteCart from "../../components/QuoteCart";

export default function residentialProducts({
  username,
  homePageEntry,
  quoteId,
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
  const type = "residential";

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
        {type} Products
      </Heading>
      <CategorySelection categories={RESIDENTIAL_SUB_CATEGORIES} type={type} />
      <Hero homePageImageSections={homePageImageSections} />
      <QuoteCart quoteId={quoteId} />
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const homePageEntry = await getHomePageImageSections();
  const quoteId = req.session.get("quoteId");

  if (!user) {
    return {
      props: { homePageEntry },
    };
  }

  return {
    props: {
      homePageEntry,
      username: user.firstName,
      quoteId,
    },
  };
});
