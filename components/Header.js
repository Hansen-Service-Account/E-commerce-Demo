import { Flex } from "@chakra-ui/layout";
import Navigation from "./Navigation";
import { HANSEN_RED, HOME_PAGE_ID } from "../utils/constants";
import { useMediaQuery } from "@chakra-ui/media-query";
import { isServer } from "../utils/isServer";
import { Image } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { getHomePageImageSections } from "../utils/contentful";

const Header = ({ username, initialLogoSrc }) => {
  const [isLargerThan800] = useMediaQuery("(min-width:800px)");
  const [isLargerThan1024] = useMediaQuery("(min-width:1024px)");
  const [logoURL, setLogoURL] = useState("");
  useEffect(async () => {
    const { fields } = await getHomePageImageSections(HOME_PAGE_ID);
    setLogoURL(fields.siteLogo.fields.file.url);
  }, [HOME_PAGE_ID]);
  return (
    <Flex
      direction="row"
      align="center"
      justify="space-around"
      bg="transparent"
      w="100%"
      p={isLargerThan800 || isServer() ? 4 : 0}
      color="black"
      borderBottom={`${HANSEN_RED} 2px solid`}
    >
      <NextLink href="/">
        <Image
          src={logoURL}
          width={isLargerThan800 || isServer() ? "300" : "200"}
          height={isLargerThan800 || isServer() ? "150" : "100"}
          cursor="pointer"
        />
      </NextLink>
      <Navigation isLargerThan1024={isLargerThan1024} username={username} />
    </Flex>
  );
};

export default Header;
