import Header from "../../../components/Header";
import { HANSEN_CPQ_V2_BASE_URL } from "../../../utils/constants";
import withSession from "../../../middleware/session";
import { dbConnect } from "../../../middleware/db";
import User from "../../../models/user";
import { getHomePageImageSections } from "../../../utils/contentful";
import Hero from "../../../components/Hero";
import CategorySelection from "../../../components/CategorySelection";
import Footer from "../../../components/Footer";
import { Center, Heading } from "@chakra-ui/layout";
import QuoteCart from "../../../components/QuoteCart";
import fetcher from "../../../utils/nodeFetchJson";
import Error from "next/error";
import { useRouter } from "next/router";

export default function productLineID({
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
  const router = useRouter();
  const { productLineID } = router.query;
  const productLine = productLines.find(
    (p) => p.name === productLineID.replace(/-/g, " ")
  );

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
        {productLine.name}
      </Heading>
      <CategorySelection
        categories={productLine.children}
        urlPrefix={`/product-lines/${productLineID}/offers`}
      />
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
