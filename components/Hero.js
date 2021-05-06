import Image from "next/image";
import { Box } from "@chakra-ui/layout";

const Hero = ({ homePageImageSections }) => {
  return (
    <Box>
      {homePageImageSections.map((section) => (
        <Box py={3} key={section.imageURL}>
          <Image
            src={`https:${section.imageURL}`}
            alt={section.alt}
            width="300"
            height="120"
            layout="responsive"
          />
        </Box>
      ))}
    </Box>
  );
};

export default Hero;
