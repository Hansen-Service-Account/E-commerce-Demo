import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const TextlessCarouselSection = ({ pageSection }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <Box
      as="section"
      w="100%"
      key={pageSection.sys.id}
      py={24}
      bgColor={pageSection.fields.backgroundColor || "transparent"}
    >
      <Flex w="80%" flexDir="column" mx="auto">
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={true}
          arrows={false}
          responsive={responsive}
          ssr={false}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="all 1s"
          transitionDuration={3000}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {pageSection.fields.attachedComponents.map((ac) => (
            <Center height="300px" key={ac.sys.id} flexDir="column">
              <Image
                objectFit="contain"
                width="100px"
                height="100px"
                src={`https:${ac.fields.image.fields.file.url}`}
              />
            </Center>
          ))}
        </Carousel>
      </Flex>
      <Flex
        w="100%"
        justify="space-around"
        mt={20}
        py={8}
        px={8}
        bgColor={pageSection.fields.mainHeadingBgColor || "inherit"}
      >
        <Text
          as="h2"
          fontSize="2rem"
          textTransform="uppercase"
          color={pageSection.fields.mainHeadingTextColor || "white"}
        >
          {pageSection.fields.mainHeading}
        </Text>
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
    </Box>
  );
};
