import { Box, Center, Flex, Heading, Link } from "@chakra-ui/layout";
import { useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";

export default function Footer() {
  const [isLargerThan800] = useMediaQuery("(min-width:800px)");
  return (
    <>
      <Flex
        direction="row"
        align="center"
        justify="space-around"
        bg="#2d2d2d"
        w="100%"
        px={8}
        py={24}
        color="white"
      >
        <Image
          src="/hansenlogo.jpg"
          alt="Hansen Technologies Logo"
          layout="fixed"
          width={isLargerThan800 ? "300" : "200"}
          height={isLargerThan800 ? "150" : "100"}
        />
        <Flex direction="column" align="start" justify="space-around">
          <Heading as="h5" size="md" px={1} py={4}>
            Site Links
          </Heading>
          <NextLink href="#" passHref>
            <Link p={1} fontSize="s" color="#999">
              For Business
            </Link>
          </NextLink>
          <NextLink href="#" passHref>
            <Link p={1} fontSize="s" color="#999">
              For Home
            </Link>
          </NextLink>
          <NextLink href="#" passHref>
            <Link p={1} fontSize="s" color="#999">
              Contact
            </Link>
          </NextLink>
        </Flex>
        <Image
          src="/hansenlogo.jpg"
          alt="Hansen Technologies Logo"
          layout="fixed"
          width={isLargerThan800 ? "300" : "200"}
          height={isLargerThan800 ? "150" : "100"}
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
