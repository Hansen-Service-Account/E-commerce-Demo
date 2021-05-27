import { Button } from "@chakra-ui/button";
import { Icon, InfoIcon } from "@chakra-ui/icons";
import { Img } from "@chakra-ui/image";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/layout";
import { FaCartPlus } from "react-icons/fa";

const ListView = ({
  product,
  isLoggedIn,
  setCurrentProduct,
  controls,
  addToCart,
}) => {
  return (
    <>
      <Flex
        direction="row"
        p={4}
        justifyContent="space-between"
        alignItems="center"
        w="90%"
        mx="auto"
        my={8}
        borderRadius={4}
        border="green"
        borderWidth={2}
      >
        <Img src="https://via.placeholder.com/200" justifySelf="start" />
        <Flex justifyContent="space-between" w="80%">
          <Box px={6}>
            <Heading as="h4" size="md" color="tomato">
              {product.name}
            </Heading>
            <Divider my={4} />
            <Text as="p">{product.marketingTagLine}</Text>
            <Divider my={4} />
            <Flex justifyContent="space-between">
              <Text as="p">Initial payment: ${product.marketingPrice}</Text>
              <Text as="p">Recurring: ${product.marketingRecurringPrice}</Text>
            </Flex>
          </Box>
          <Flex direction="column" justifyContent="center">
            {isLoggedIn ? (
              <Button
                colorScheme="teal"
                my={2}
                leftIcon={<Icon as={FaCartPlus} />}
                onClick={() => addToCart(product.id)}
              >
                ADD PRODUCT
              </Button>
            ) : null}
            <Button
              colorScheme="telegram"
              variant="outline"
              my={2}
              leftIcon={<InfoIcon />}
              onClick={() => {
                setCurrentProduct({ ...product });
                controls.onOpen();
              }}
            >
              PRODUCT DETAILS
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Divider my={4} w="90%" mx="auto" borderColor="#e32525" />
    </>
  );
};

export default ListView;
