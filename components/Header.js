import Image from "next/image";
import { Box, Flex } from "@chakra-ui/layout";
import Navigation from "./Navigation";
import { HANSEN_RED } from "../utils/constants";
import { useMediaQuery } from "@chakra-ui/media-query";

const Header = () => {
  const [isLargerThan800] = useMediaQuery("(min-width:800px)");
  return (
    <Flex
      direction="row"
      align="center"
      justify="space-around"
      bg="transparent"
      w="100%"
      p={4}
      color="black"
      borderBottom={`${HANSEN_RED} 2px solid`}
    >
      <Image
        src="/hansenlogo.jpg"
        alt="Hansen Technologies Logo"
        layout="fixed"
        width={isLargerThan800 ? "300" : "200"}
        height={isLargerThan800 ? "150" : "100"}
      />
      <Navigation />
    </Flex>
  );
};

export default Header;
