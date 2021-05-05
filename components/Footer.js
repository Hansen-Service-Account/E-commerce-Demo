import { Box, Center, Flex, Link } from "@chakra-ui/layout";
import { useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";

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
        <Image
          src="/hansenlogo.jpg"
          alt="Hansen Technologies Logo"
          layout="fixed"
          width={isLargerThan800 ? "300" : "200"}
          height={isLargerThan800 ? "150" : "100"}
        />
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
