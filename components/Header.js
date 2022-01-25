import { Flex, Link } from "@chakra-ui/layout";
import Navigation from "./Navigation";
import { HANSEN_RED } from "../utils/constants";
import Image from "next/image";

const Header = ({ username, initialLogoSrc, productLines, headerNav }) => {
  return (
    <Flex
      direction="row"
      align="center"
      justify="space-around"
      bg={headerNav.fields.backgroundColor || "transparent"}
      w="100%"
      p={{ base: 0, lg: 4 }}
      color="black"
      borderBottom={`${headerNav.fields.borderColor || HANSEN_RED} 2px solid`}
    >
      <Link href="/">
        <Image
          src={`https:${initialLogoSrc}`}
          width="300px"
          height="150px"
          cursor="pointer"
        />
      </Link>
      <Navigation
        productLines={productLines}
        username={username}
        headerNav={headerNav}
      />
    </Flex>
  );
};

export default Header;
