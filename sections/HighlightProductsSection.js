import { Button, Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";

export const HighlightProductsSection = ({ pageSection }) => {
  console.log(pageSection);

  return (
    <Box
      as="section"
      w="100%"
      key={pageSection.sys.id}
      py={24}
      bgColor={pageSection.fields.backgroundColor || "transparent"}
    >
      <Flex
        w="80%"
        align="center"
        mx="auto"
        style={{ gap: "30px" }}
        py={12}
        px={4}
      >
        {pageSection.fields.overline && (
          <Text
            as="span"
            color={pageSection.fields.overlineTextColor || "white"}
            bgColor={pageSection.fields.overlineBgColor || "tomato"}
          >
            {pageSection.fields.overline}
          </Text>
        )}
        <Text
          as="h2"
          fontSize="1.5rem"
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
          >
            {pageSection.fields.ctaButtonText}
          </Button>
        ) : (
          <Button
            bgColor={pageSection.fields.ctaButtonBgColor || "teal"}
            color={pageSection.fields.ctaButtonTextColor || "white"}
          >
            {pageSection.fields.ctaButtonText}
          </Button>
        )}
      </Flex>
      <Flex w="80%" justify="space-around" align="stretch" mx="auto">
        {pageSection.fields.attachedComponents.map((ac) => (
          <Flex
            key={ac.sys.id}
            w="33.3%"
            p={4}
            flexDir="column"
            align="flex-start"
            style={{ gap: "20px" }}
          >
            <Image
              height="270px"
              width="480px"
              objectFit="contain"
              src={`https:${ac.fields.image.fields.file.url}`}
            />
            <Text
              as="span"
              color={ac.fields.overlineTextColor || "white"}
              bgColor={ac.fields.overlineBgColor || "tomato"}
              borderRadius="500px"
              px={5}
            >
              {ac.fields.overline}
            </Text>
            <Text
              as="h4"
              fontWeight="bold"
              fontSize="1.5rem"
              color={ac.fields.mainHeadingTextColor || "teal"}
            >
              {ac.fields.mainHeading}
            </Text>
            <Text as="p" fontSize="1.2rem">
              {ac.fields.description}
            </Text>
            {ac.fields.ctaButtonVariant === "Outline" ? (
              <Button
                variant="outline"
                borderColor={ac.fields.ctaButtonBgColor || "teal"}
                fontSize="1.2rem"
                borderWidth="2px"
                color={ac.fields.ctaButtonTextColor || "teal"}
                _hover={{
                  bgColor: ac.fields.ctaButtonBgColor || "teal",
                  color: "white",
                }}
              >
                {ac.fields.ctaButtonText}
              </Button>
            ) : (
              <Button
                bgColor={ac.fields.ctaButtonBgColor || "teal"}
                color={ac.fields.ctaButtonTextColor || "white"}
                fontSize="1.2rem"
              >
                {ac.fields.ctaButtonText}
              </Button>
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
