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
import { DARK_GOLD, HANSEN_CPQ_BASE_URL } from "../../utils/constants";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/button";
import useRecurringCharge from "../../hooks/useRecurringCharge";
import QuoteSummary from "../../components/QuoteSummary";
import PricingSummary from "../../components/PricingSummary";
import QuoteStatus from "../../components/QuoteStatus";

export default function Quote({ username, quoteId }) {
  const { quote, mutateQuote, isLoading, isError } = useQuote(quoteId);
  const recurringCharges = !isLoading && !isError && useRecurringCharge(quote);
  const router = useRouter();
  const deleteItem = async (itemId) => {
    mutateQuote(
      {
        ...quote,
        items: quote.items.filter((i) => i.id !== itemId),
      },
      false
    );
    await fetch(`${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/items/${itemId}`, {
      method: "DELETE",
    });
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
          <QuoteStatus quote={quote} />
          <QuoteSummary quote={quote} deleteItem={deleteItem} />
          <PricingSummary
            nonRecurringCharge={
              quote.pricingSummary.TotalPriceSummary.NonRecurring &&
              quote.pricingSummary.TotalPriceSummary.NonRecurring.ItemCharge
            }
            recurringCharges={recurringCharges}
          />
          <Flex justify="space-between" align="center" py={4}>
            <Button colorScheme="linkedin" variant="outline">
              Continue shopping
            </Button>
            <Button
              colorScheme="green"
              display={quote.currentValidation.valid ? "initial" : "none"}
              onClick={() => router.push("/checkout")}
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
