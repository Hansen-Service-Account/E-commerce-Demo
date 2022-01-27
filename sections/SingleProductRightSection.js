import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";

export const SingleProductRightSection = ({ pageSection }) => {
  return (
    <Box
      as="section"
      w="100%"
      key={pageSection.sys.id}
      py={24}
      bgColor={pageSection.fields.backgroundColor || "transparent"}
    >
      <Flex w="80%" align="center" mx="auto" h={{ base: "40vh", md: "60vh" }}>
        <Box p={6} w="50%">
          <Image
            src={`https:${pageSection.fields.backgroundImage.fields.file.url}`}
            width="1200px"
            height="675px"
            objectFit="cover"
          />
        </Box>
        <Flex
          flexDir="column"
          justify="center"
          align="flex-start"
          w="50%"
          h="100%"
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
          {pageSection.fields.subHeading && (
            <Text
              as="span"
              color={pageSection.fields.subHeadingTextColor || "black"}
            >
              {pageSection.fields.subHeading}
            </Text>
          )}
          {pageSection.fields.description && (
            <Text
              as="p"
              fontSize="1.2rem"
              color={pageSection.fields.descriptionTextColor || "black"}
            >
              {pageSection.fields.description}
            </Text>
          )}
          {pageSection.fields.ctaButtonVariant === "Outline" ? (
            <Button
              variant="outline"
              borderColor={pageSection.fields.ctaButtonBgColor || "teal"}
              borderWidth="2px"
              color={pageSection.fields.ctaButtonTextColor || "black"}
              _hover={{
                bgColor: pageSection.fields.ctaButtonBgColor || "teal",
                color: "white",
              }}
              rightIcon={<ArrowRightIcon fontSize="0.8rem" />}
            >
              {pageSection.fields.ctaButtonText}
            </Button>
          ) : (
            <Button
              bgColor={pageSection.fields.ctaButtonBgColor || "teal"}
              color={pageSection.fields.ctaButtonTextColor || "white"}
              rightIcon={<ArrowRightIcon fontSize="0.8rem" />}
            >
              {pageSection.fields.ctaButtonText}
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
