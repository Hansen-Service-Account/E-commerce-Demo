import { Box, Center, Flex, Heading, Link } from "@chakra-ui/layout";
import { useMediaQuery, Image } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { getHomePageImageSections } from "../utils/contentful";
import { HOME_PAGE_ID } from "../utils/constants";
import { isServer } from "../utils/isServer";

export default function Footer({}) {
  const [isLargerThan800] = useMediaQuery("(min-width:800px)");
  const [logoURL, setLogoURL] = useState("https://via.placeholder.com/300x150");
  useEffect(async () => {
    const { fields } = await getHomePageImageSections(HOME_PAGE_ID);
    setLogoURL(fields.siteLogo.fields.file.url);
  }, [HOME_PAGE_ID]);
  return (
    <>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-around"
        bg="#2d2d2d"
        w="100%"
        px={8}
        py={24}
        color="white"
        mt={16}
      >
        <Image
          src={logoURL}
          fallbackSrc="https://via.placeholder.com/300x150"
          alt="Hansen Technologies Logo"
          width={isLargerThan800 || isServer() ? "300" : "200"}
          height={isLargerThan800 || isServer() ? "150" : "100"}
        />
        <Flex
          direction="column"
          align="start"
          justify="space-around"
          m={8}
          minW="150px"
        >
          <Heading as="h5" size="md" px={1} py={4}>
            Site Links
          </Heading>
          <NextLink href="/business-products" passHref>
            <Link p={1} fontSize="s" color="#999">
              For Business
            </Link>
          </NextLink>
          <NextLink href="/residential-products" passHref>
            <Link p={1} fontSize="s" color="#999">
              For Home
            </Link>
          </NextLink>
          <NextLink href="/contact" passHref>
            <Link p={1} fontSize="s" color="#999">
              Contact
            </Link>
          </NextLink>
        </Flex>
        <Image
          src={logoURL}
          alt="Hansen Technologies Logo"
          width={isLargerThan800 || isServer() ? "300" : "200"}
          height={isLargerThan800 || isServer() ? "150" : "100"}
        />
      </Flex>
      <Center bg="#303030" color="#999" p={8} fontSize="sm">
        <Box>
          © Copyright{" "}
          <Link color="#fff" href="#" target="_blank">
            {" "}
            Evolution
          </Link>{" "}
          | All Rights Reserved
        </Box>
      </Center>
    </>
  );
}
