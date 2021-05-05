import Hero from "../components/Hero";
import Header from "../components/Header";
import { getHomePageImageSections } from "../utils/contentful";
import Footer from "../components/Footer";

export default function Home({ homePageEntry }) {
  console.log(homePageEntry);
  const {
    firstSection,
    secondSection,
    thirdSection,
    fourthSection,
  } = homePageEntry.fields;
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
      <Header />
      <Hero homePageImageSections={homePageImageSections} />
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const homePageEntry = await getHomePageImageSections();

  return {
    props: {
      homePageEntry,
    },
  };
}
