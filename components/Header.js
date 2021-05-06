import { Flex } from "@chakra-ui/layout";
import Navigation from "./Navigation";
import { HANSEN_RED } from "../utils/constants";
import { useMediaQuery } from "@chakra-ui/media-query";

import { isServer } from "../utils/isServer";
import { Img } from "@chakra-ui/react";

const Header = ({ user }) => {
  const [isLargerThan800] = useMediaQuery("(min-width:800px)");
  const [isLargerThan1024] = useMediaQuery("(min-width:1024px)");

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
      <Img
        src="/hansenlogo.jpg"
        width={isLargerThan800 || isServer() ? "300" : "200"}
        height={isLargerThan800 || isServer() ? "150" : "100"}
      />
      <Navigation isLargerThan1024={isLargerThan1024} user={user} />
    </Flex>
  );
};

export default Header;
