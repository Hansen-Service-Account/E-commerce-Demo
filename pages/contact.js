import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Footer from "../components/Footer";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Icon from "@chakra-ui/icon";
import {
  FaFacebook,
  FaFacebookSquare,
  FaGooglePlusSquare,
  FaInstagramSquare,
  FaTwitterSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { DARK_GOLD } from "../utils/constants";

export default function contactPage({ username }) {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 51.0565696,
    lng: -114.0193534,
  };

  return (
    <>
      <Header username={username} />
      <Flex
        w={{ base: "90%", md: "80%" }}
        mx="auto"
        justify="center"
        direction={{ base: "column", md: "row" }}
        mt={12}
      >
        <Flex
          direction="column"
          align="flex-start"
          justify="space-between"
          w={{ base: "100%", md: "30%" }}
        >
          <Heading as="h2" mb={6}>
            Contact Us
          </Heading>
          <Box color={DARK_GOLD}>
            <Text my={2} fontWeight="bold">
              Email: contact@evolution.com
            </Text>
            <Text my={2} fontWeight="bold">
              Phone: 1800-800-8001
            </Text>
          </Box>
          <Stack direction="row" spacing={3}>
            <Icon
              color="grey"
              _hover={{ color: "#3b5998", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaFacebookSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#1DA1F2", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaTwitterSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#DB4A39", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaGooglePlusSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#C13584", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaInstagramSquare}
            />
            <Icon
              color="grey"
              _hover={{ color: "#FF0000", transform: "scale(1.2,1.2)" }}
              transition="ease-in-out"
              transitionDuration="0.2s"
              cursor="pointer"
              w={8}
              h={8}
              as={FaYoutubeSquare}
            />
          </Stack>
        </Flex>
        <Box w={{ base: "100%", md: "50%" }}>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={16}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </Box>
      </Flex>
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  if (!user) {
    return {
      props: {},
    };
  }

  return {
    props: {
      username: user.firstName,
    },
  };
});
