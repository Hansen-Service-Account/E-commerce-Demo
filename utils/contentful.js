import { HOME_PAGE_ID } from "./constants";

const client = require("contentful").createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export const getHomePageImageSections = async () => {
  try {
    const homePageEntry = await client.getEntry(HOME_PAGE_ID);
    return homePageEntry;
  } catch (err) {
    console.log(err);
  }
};
