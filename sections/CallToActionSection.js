import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

export const CallToActionSection = ({ pageSection }) => {
  return (
    <Box
      as="section"
      w="100%"
      key={pageSection.sys.id}
      py={24}
      bgColor={pageSection.fields.backgroundColor || "transparent"}
    >
      <Flex w="80%" flexDir="column" align="center" mx="auto">
        <Flex w="100%" justify="space-around">
          <Flex flexDir="column" justify="center">
            <Text
              as="span"
              fontSize="1.5rem"
              bgColor={pageSection.fields.overlineBgColor || "transparent"}
              color={pageSection.fields.overlineTextColor || "black"}
            >
              {pageSection.fields.overline}
            </Text>
            <Text
              as="h2"
              fontSize="1.8rem"
              fontWeight="bold"
              color={pageSection.fields.mainHeadingTextColor || "black"}
            >
              {pageSection.fields.mainHeading}
            </Text>
          </Flex>
          <Image
            src={`https:${pageSection.fields.backgroundImage.fields.file.url}`}
            width="268px"
            height="180px"
          />
        </Flex>
        <Text
          as="span"
          fontSize="1.5rem"
          py={8}
          color={pageSection.fields.subHeadingTextColor || "black"}
        >
          {pageSection.fields.subHeading}
        </Text>
        <Text
          as="p"
          fontSize="1.2rem"
          color={pageSection.fields.descriptionTextColor || "black"}
        >
          {pageSection.fields.description}
        </Text>
        {pageSection.fields.ctaButtonVariant === "Outline" ? (
          <Button
            mt={8}
            variant="outline"
            borderColor={pageSection.fields.ctaButtonBgColor || "teal"}
            borderWidth="2px"
            color={pageSection.fields.ctaButtonTextColor || "black"}
            _hover={{
              bgColor: pageSection.fields.ctaButtonBgColor || "teal",
              color: "white",
            }}
          >
            {pageSection.fields.ctaButtonText}
          </Button>
        ) : (
          <Button
            mt={8}
            bgColor={pageSection.fields.ctaButtonBgColor || "teal"}
            color={pageSection.fields.ctaButtonTextColor || "white"}
          >
            {pageSection.fields.ctaButtonText}
          </Button>
        )}
      </Flex>
    </Box>
  );
};
