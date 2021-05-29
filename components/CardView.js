import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, Heading, Text } from "@chakra-ui/layout";
import { Icon, InfoIcon, UnlockIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { FaCartPlus } from "react-icons/fa";

const CardView = ({
  product,
  isLoggedIn,
  setCurrentProduct,
  controls,
  addToCart,
  allowAdd,
}) => {
  const features = product.magentoImages && product.magentoImages.split(",");
  return (
    <>
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        borderRadius="4px"
        boxShadow="lg"
        w={{ base: "70%", lg: "40%", xl: "30%" }}
        mx={{ base: "auto", lg: "5%", xl: "1.6%" }}
        p={8}
        my={8}
      >
        <Box mt={0} mb={4}>
          <Image src="https://via.placeholder.com/600x300" />
          <Heading as="h4" size="md" mx="auto" color="tomato" my={4}>
            {product.name}
          </Heading>
          <Flex justifyContent="space-between" my={2}>
            <Text as="span">Initial payment</Text>
            <Text as="span">${product.marketingPrice}</Text>
          </Flex>
          <Flex justifyContent="space-between" my={2}>
            <Text as="span">Recurring payment:</Text>
            <Text as="span">${product.marketingRecurringPrice}</Text>
          </Flex>
          <Text textAlign="left" my={4}>
            {product.marketingTagLine}
          </Text>
          {features &&
            features.map((f) => (
              <Flex key={f} alignItems="flex-start">
                <Center height="1.5em">
                  <UnlockIcon color="#b39573" mr={4} />
                </Center>

                <Text as="span">{f}</Text>
              </Flex>
            ))}
        </Box>
        <Flex my={2} justifyContent="space-between">
          {isLoggedIn && allowAdd ? (
            <Button
              colorScheme="teal"
              leftIcon={<Icon as={FaCartPlus} />}
              onClick={() => addToCart(product.id)}
            >
              Cart
            </Button>
          ) : null}
          <Button
            colorScheme="telegram"
            leftIcon={<InfoIcon />}
            onClick={() => {
              setCurrentProduct({ ...product });
              controls.onOpen();
            }}
          >
            Details
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default CardView;
