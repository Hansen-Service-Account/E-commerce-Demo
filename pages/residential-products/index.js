import Header from "../../components/Header";
import fetch from "node-fetch";
import { MOBILE_PRODUCTS_ENDPOINT } from "../../utils/constants";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import User from "../../models/user";
import { getHomePageImageSections } from "../../utils/contentful";
import Hero from "../../components/Hero";
import CategorySelection from "../../components/CategorySelection";

export default function residentialProducts({
  username,
  homePageEntry,
  products,
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
  const categories = [
    { id: "52288c67-4475-4fa0-ae27-64dad5b2b7c1", name: "Mobile" },
    { id: "2ac09274-ad39-4e6d-8029-f368b396b96b", name: "Internet" },
    { id: "c1d3c147-c949-47f0-b768-6a10133c9f4e", name: "TV" },
  ];

  return (
    <>
      <Header username={username} />
      <CategorySelection categories={categories} type={type} />
      <Hero homePageImageSections={homePageImageSections} />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const homePageEntry = await getHomePageImageSections();
  const result = await (await fetch(MOBILE_PRODUCTS_ENDPOINT)).json();
  const products = result[0];
  //   const products = JSON.parse(result.data);
  if (!user) {
    return {
      props: { products, homePageEntry },
    };
  }

  return {
    props: {
      products,
      homePageEntry,
      username: user.firstName,
    },
  };
});
