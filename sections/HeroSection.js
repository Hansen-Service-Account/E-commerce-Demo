import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

export const HeroSection = ({ pageSection }) => {
  return (
    <Box
      as="section"
      w="100%"
      key={pageSection.sys.id}
      py={24}
      bgColor={pageSection.fields.backgroundColor || "transparent"}
    >
      <Flex w="80%" align="center" mx="auto">
        <Flex
          flexDir="column"
          justify="center"
          align="flex-start"
          w="50%"
          style={{ gap: "20px" }}
          p={4}
        >
          {pageSection.fields.overline && (
            <Text
              as="span"
              color={pageSection.fields.overlineTextColor || "white"}
              bgColor={pageSection.fields.overlineBgColor || "tomato"}
              borderRadius="500px"
              px={5}
            >
              {pageSection.fields.overline}
            </Text>
          )}
          <Text
            as="h1"
            fontSize="3rem"
            textTransform="uppercase"
            color={pageSection.fields.mainHeadingTextColor || "teal"}
            fontWeight="bold"
          >
            {pageSection.fields.mainHeading}
          </Text>
          <Text
            as="span"
            color={pageSection.fields.subHeadingTextColor || "black"}
          >
            {pageSection.fields.subHeading}
          </Text>
          <Button
            bgColor={pageSection.fields.ctaButtonBgColor || "teal"}
            color={pageSection.fields.ctaButtonTextColor || "white"}
            rightIcon={<ArrowRightIcon fontSize="0.8rem" />}
          >
            {pageSection.fields.ctaButtonText}
          </Button>
        </Flex>
        <Box p={6}>
          <Image
            src={`https:${pageSection.fields.backgroundImage.fields.file.url}`}
            width="1200px"
            height="675px"
            objectFit="cover"
          />
        </Box>
        {/* <Box
        w="50%"
        bgImage={`https:${pageSection.fields.backgroundImage.fields.file.url}`}
      ></Box> */}
      </Flex>
    </Box>
  );
};
