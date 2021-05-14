import Hero from "../components/Hero";
import Header from "../components/Header";
import { getHomePageImageSections } from "../utils/contentful";
import Footer from "../components/Footer";
import { dbConnect } from "../middleware/db";
import withSession from "../middleware/session";
import User from "../models/user";
import useQuote from "../hooks/useQuote";
import QuoteCart from "../components/QuoteCart";

export default function homePage({
  homePageEntry,
  username,
  initialLogoSrc,
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

  return (
    <>
      <Header username={username} initialLogoSrc={initialLogoSrc} />
      <Hero homePageImageSections={homePageImageSections} />
      {username ? <QuoteCart quoteId={quoteId} /> : null}
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const homePageEntry = await getHomePageImageSections();
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const initialLogoSrc = "https://via.placeholder.com/300x150";
  if (!user) {
    return {
      props: { homePageEntry, initialLogoSrc },
    };
    // return {
    //   redirect: {
    //     destination: "/login",
    //     permanent: false,
    //   },
    // };
  }

  return {
    props: {
      homePageEntry,
      username: user.firstName,
      initialLogoSrc,
      quoteId,
    },
  };
});
