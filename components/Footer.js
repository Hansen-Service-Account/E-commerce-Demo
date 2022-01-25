import { Box, Center, Flex, Heading, Link } from "@chakra-ui/layout";
import Image from "next/image";

export default function Footer({ logoURL, footerNav }) {
  return (
    <>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-around"
        bg={footerNav.fields.backgroundColor || "transparent"}
        w="100%"
        px={8}
        py={24}
        color={footerNav.fields.textColor || "white"}
      >
        <Image
          src={`https:${logoURL}`}
          alt="Hansen Technologies Logo"
          width="300px"
          height="150px"
        />
        <Flex
          direction="column"
          align="center"
          justify="space-around"
          m={8}
          minW="150px"
        >
          <Heading as="h5" size="md" px={1} py={4}>
            Site Links
          </Heading>
          {footerNav.fields.menuItems.map((i) => (
            <Link
              key={i.sys.id}
              href={i.fields.linkUrl}
              textAlign="center"
              color={i.fields.textColor || "white"}
            >
              {i.fields.linkText}
            </Link>
          ))}
        </Flex>
        <Image
          src={`https:${logoURL}`}
          alt="Hansen Technologies Logo"
          width="300px"
          height="150px"
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
