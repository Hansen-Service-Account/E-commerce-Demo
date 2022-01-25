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
    throw err;
  }
};

export const getHeaderAndFooterNavigationOfWebsite = async (websiteId) => {
  try {
    const headerNav = await client.getEntries({
      content_type: "navigation",
      "fields.navigationType": "Header",
      "fields.website.sys.id": websiteId,
      include: 2,
    });
    const headerLogo = headerNav.includes.Asset[0];
    const footerNav = await client.getEntries({
      content_type: "navigation",
      "fields.navigationType": "Footer",
      "fields.website.sys.id": websiteId,
      include: 2,
    });
    const footerLogo = footerNav.includes.Asset[0];
    return { headerNav, footerNav, headerLogo, footerLogo };
  } catch (err) {
    throw err;
  }
};

export const getPageSectionsOfWebPage = async (webPageName) => {
  try {
    const webPage = await client.getEntries({
      content_type: "webPage",
      "fields.pageName": webPageName,
      include: 2,
    });
    const pageSections = webPage.includes.Entry;
    const imageAssets = webPage.includes.Asset;
    return { webPage, pageSections, imageAssets };
  } catch (err) {
    throw err;
  }
};
