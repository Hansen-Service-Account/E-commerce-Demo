import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const ProductsCarouselSection = ({ pageSection }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
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
        <Text
          as="h2"
          fontSize="1.8rem"
          fontWeight="bold"
          textAlign="center"
          color={pageSection.fields.mainHeadingTextColor || "teal"}
        >
          {pageSection.fields.mainHeading}
        </Text>
        <Text
          as="p"
          textAlign="center"
          py={12}
          color={pageSection.fields.subHeadingTextColor || "black"}
        >
          {pageSection.fields.subHeading}
        </Text>
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          arrows={false}
          responsive={responsive}
          ssr={false}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="all 1s"
          transitionDuration={1000}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {pageSection.fields.attachedComponents.map((ac) => (
            <Center height="300px" key={ac.sys.id} flexDir="column">
              <Image
                objectFit="contain"
                width="150px"
                height="300px"
                src={`https:${ac.fields.image.fields.file.url}`}
              />
              <Text as="span">{ac.fields.mainHeading}</Text>
            </Center>
          ))}
        </Carousel>
        <Button
          mt={12}
          variant="outline"
          alignSelf="center"
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
      </Flex>
    </Box>
  );
};
