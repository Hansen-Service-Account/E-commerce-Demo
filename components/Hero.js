import { Img } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";

const Hero = ({ homePageImageSections }) => {
  return (
    <Box>
      {homePageImageSections.map((section) => (
        <Box py={3} key={section.imageURL}>
          <Img src={`https:${section.imageURL}`} alt={section.alt} />
        </Box>
      ))}
    </Box>
  );
};

export default Hero;
