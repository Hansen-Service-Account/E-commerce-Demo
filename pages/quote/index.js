import Icon from "@chakra-ui/icon";
import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  StackDivider,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import { IoIosCloseCircle, IoIosCog } from "react-icons/io";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import useQuote from "../../hooks/useQuote";
import { dbConnect } from "../../middleware/db";
import withSession from "../../middleware/session";
import User from "../../models/user";
import { DARK_GOLD } from "../../utils/constants";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/button";

export default function Quote({ username, quoteId }) {
  const { quote, mutateQuote, isLoading, isError } = useQuote(quoteId);
  const router = useRouter();
  const deleteItem = async (itemId) => {
    mutateQuote(
      {
        ...quote,
        items: quote.items.filter((i) => i.id !== itemId),
      },
      false
    );
    await fetch(`/api/quotes/${quoteId}/items/${itemId}`, { method: "DELETE" });
    mutateQuote();
  };
  return (
    <>
      <Header username={username} />
      {isLoading && (
        <Flex h="70vh" justify="center" align="center" direction="column">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Heading as="h5" size="md" my={4}>
            Loading quote summary...
          </Heading>
        </Flex>
      )}
      {quote && (
        <Box w={{ base: "95%", md: "90%" }} mx="auto">
          <Heading as="h3" py={6}>
            Quote Summary
          </Heading>
          <Wrap spacing={4} pb={4}>
            <WrapItem>
              <Tooltip hasArrow label="Quote Validity" bg={DARK_GOLD}>
                <Badge
                  colorScheme={quote.currentValidation.valid ? "green" : "red"}
                  variant="outline"
                >
                  {quote.currentValidation.valid ? "Valid" : "Invalid"}
                </Badge>
              </Tooltip>
            </WrapItem>
            <WrapItem>
              <Tooltip hasArrow label="Quote Number" bg={DARK_GOLD}>
                <Badge colorScheme="telegram">{quote.quoteNumber}</Badge>
              </Tooltip>
            </WrapItem>

            <WrapItem>
              <Tooltip hasArrow label="Create At" bg={DARK_GOLD}>
                <Badge colorScheme="telegram" variant="subtle">
                  {new Date(Date.parse(quote.updated)).toUTCString()}
                </Badge>
              </Tooltip>
            </WrapItem>
          </Wrap>
          <VStack
            spacing={8}
            align="stretch"
            divider={<StackDivider borderColor="gray.200" />}
            py={4}
          >
            {quote.items.map((item) => (
              <Box
                borderRadius={8}
                key={item.id}
                borderColor={DARK_GOLD}
                borderWidth="2px"
                p={8}
                position="relative"
              >
                <Tooltip
                  hasArrow
                  label={
                    item.currentValidation.valid
                      ? "Valid item"
                      : "Invalid items need to be configured or removed before checkout"
                  }
                  placement="bottom"
                  bg={DARK_GOLD}
                >
                  <Badge
                    position="absolute"
                    top="0"
                    left="50%"
                    transform="translate(-50%,-50%)"
                    variant="outline"
                    bg="white"
                    colorScheme={item.currentValidation.valid ? "green" : "red"}
                  >
                    {item.currentValidation.valid ? "Valid" : "Invalid"}
                  </Badge>
                </Tooltip>
                <Icon
                  as={IoIosCloseCircle}
                  position="absolute"
                  top="0"
                  right="0"
                  w={6}
                  h={6}
                  bg="white"
                  color="red"
                  _hover={{ color: "black" }}
                  cursor="pointer"
                  transform="translate(50%,-50%)"
                  onClick={() => deleteItem(item.id)}
                />
                <Icon
                  as={IoIosCog}
                  position="absolute"
                  bottom="0"
                  right="0"
                  w={6}
                  h={6}
                  bg="white"
                  color={DARK_GOLD}
                  _hover={{ color: "black" }}
                  cursor="pointer"
                  transform="translate(50%,50%)"
                  onClick={() => router.push(`/quote/items/${item.id}`)}
                />
                <Table variant="simple" fontSize={{ base: "12px", md: "18px" }}>
                  <TableCaption
                    placement="top"
                    fontWeight="bold"
                    fontSize="18px"
                    textAlign="left"
                    px={0}
                    color={DARK_GOLD}
                    mt={0}
                    mb={4}
                  >
                    {item.name}{" "}
                  </TableCaption>
                  <Thead fontSize={{ base: "12px", md: "18px" }}>
                    <Tr borderColor={DARK_GOLD}>
                      <Th
                        w={{ base: "auto", md: "50%" }}
                        fontSize={{ base: "12px", md: "18px" }}
                        p={{ base: 1, md: 3 }}
                      >
                        Name
                      </Th>
                      <Th
                        w="25%"
                        isNumeric
                        fontSize={{ base: "12px", md: "18px" }}
                        p={{ base: 1, md: 3 }}
                      >
                        Upfront
                      </Th>
                      <Th
                        w="25%"
                        isNumeric
                        fontSize={{ base: "12px", md: "18px" }}
                        p={{ base: 1, md: 3 }}
                      >
                        Recurring(Monthly)
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {item.currentPricing.Pricing.ItemisedPricingSummary.map(
                      (ips) => (
                        <Tr borderColor={DARK_GOLD} key={ips.EntityID}>
                          <Td p={{ base: 1, md: 3 }}>
                            {item.metaTypeLookup[ips.EntityID].name}
                          </Td>
                          <Td p={{ base: 1, md: 3 }} isNumeric>
                            {ips.NonRecurring
                              ? ips.NonRecurring.ItemCharge
                              : "N/A"}
                          </Td>
                          <Td p={{ base: 1, md: 3 }} isNumeric>
                            {ips.Recurring
                              ? ips.Recurring.Monthly.ItemCharge
                              : "N/A"}
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </Box>
            ))}
          </VStack>
          <Box fontWeight="bold" my={8}>
            <Flex justify="space-between" align="center">
              <Text as="span">Total Charge Upfront</Text>
              <Text as="span">
                {quote.pricingSummary.TotalPriceSummary.NonRecurring.ItemCharge}
              </Text>
            </Flex>
            <Divider my={2} borderColor={DARK_GOLD} />
            <Flex justify="space-between" align="center">
              <Text as="span">Total Charge Monthly</Text>
              <Text as="span">
                {
                  quote.pricingSummary.TotalPriceSummary.Recurring.Monthly
                    .ItemCharge
                }
              </Text>
            </Flex>
          </Box>
          <Flex justify="space-between" align="center" py={4}>
            <Button colorScheme="linkedin" variant="outline">
              Continue shopping
            </Button>
            <Button
              colorScheme="green"
              display={quote.currentValidation.valid ? "initial" : "none"}
            >
              Proceed to checkout
            </Button>
          </Flex>
        </Box>
      )}
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      quoteId,
      username: user.firstName,
    },
  };
});
