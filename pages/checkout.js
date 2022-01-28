import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Footer from "../components/Footer";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import useQuote from "../hooks/useQuote";
import { Spinner } from "@chakra-ui/spinner";
import { useToast } from "@chakra-ui/toast";
import ErrorToast from "../components/ErrorToast";
import PricingSummary from "../components/PricingSummary";
import useRecurringCharge from "../hooks/useRecurringCharge";
import { BsShieldLockFill } from "react-icons/bs";
import Icon from "@chakra-ui/icon";
import { DARK_GOLD, HANSEN_CUSTOMER_REF } from "../utils/constants";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import Payment from "../components/Payment";
import { useState } from "react";
import fetchJson from "../utils/fetchJson";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { getWebPageByWebsiteIdAndPageName } from "../utils/contentful";

export default function checkout({
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  username,
  quoteId,
  customerType,
  customerRef,
}) {
  const { quote, isLoading, isError } = useQuote(quoteId);
  const [card, setCard] = useState("Visa");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  if (isError) {
    toast({
      render: ({ id, onClose }) => (
        <ErrorToast error={isError} onClose={onClose} />
      ),
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  }
  if (quote && quote.items.length === 0) {
    return (
      <>
        <Header
          username={username}
          initialLogoSrc={headerLogo.fields.file.url}
          headerNav={headerNav}
          productLines={productLines}
        />
        <Box h="30vh" w="80%" mt={12} mx="auto" py={24}>
          <Alert status="warning">
            <AlertIcon />
            Seems your cart is currently empty, please add items and validate
            before making a payment.
          </Alert>
        </Box>
        <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
      </>
    );
  }
  const recurringCharges = !isLoading && !isError && useRecurringCharge(quote);
  const checkout = async (quoteId) => {
    setSubmitting(true);
    try {
      const result = await fetchJson("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          quoteId,
          quoteLastUpdated: quote.updated,
          activationDate: new Date().toDateString,
        }),
        headers: { "Content-Type": "application/json" },
      });
      setSubmitting(false);
      await mutate(
        `${process.env.HANSEN_CPQ_V2_BASE_URL}/customers/${customerRef}/orders`
      );
      toast({
        title: `Order ${result.orderReference} has been placed.`,
        description: "Payment processed and order placed, redirecting...",
        duration: 2000,
        isClosable: false,
        position: "top",
        status: "success",
        onCloseComplete: () =>
          router.push(`/confirmation/${result.orderReference}`),
      });
    } catch (error) {
      setSubmitting(false);
      toast({
        render: ({ id, onClose }) => (
          <ErrorToast error={error} onClose={onClose} />
        ),
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Header
        username={username}
        initialLogoSrc={headerLogo.fields.file.url}
        headerNav={headerNav}
        productLines={productLines}
      />
      {isLoading && (
        <Flex
          h="70vh"
          justify="center"
          align="center"
          direction="column"
          py={24}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Heading as="h5" size="md" my={4}>
            Loading payment summary...
          </Heading>
        </Flex>
      )}

      {quote && (
        <Box w={{ base: "95%", md: "90%" }} mx="auto" py={24}>
          <Flex justify="flex-start" align="center">
            <Heading
              as="h2"
              size="lg"
              textAlign="left"
              textTransform="uppercase"
            >
              Payment Summary
            </Heading>
            <Icon w={8} h={8} as={BsShieldLockFill} ml={4} color={DARK_GOLD} />
          </Flex>
          <PricingSummary
            nonRecurringCharge={
              quote.pricingSummary.TotalPriceSummary.NonRecurring &&
              quote.pricingSummary.TotalPriceSummary.NonRecurring.ItemCharge
            }
            recurringCharges={recurringCharges}
          />
          <Payment
            card={card}
            setCard={setCard}
            checkout={checkout}
            quoteId={quoteId}
            submitting={submitting}
            nonRecurringCharge={
              quote.pricingSummary.TotalPriceSummary.NonRecurring &&
              quote.pricingSummary.TotalPriceSummary.NonRecurring.ItemCharge
            }
            recurringCharges={recurringCharges}
          />
        </Box>
      )}
      <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;

  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getWebPageByWebsiteIdAndPageName(process.env.CONTENTFUL_WEBSITE_ID);

  const productLinesRes = await fetch(
    `${process.env.NEXT_PUBLIC_HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
  );
  if (productLinesRes.status > 400) {
    productLines = [];
  } else {
    productLines = await productLinesRes.json();
  }
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  //Hardcoded customerRef for now
  const customerRef = HANSEN_CUSTOMER_REF;

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
      headerNav,
      footerNav,
      headerLogo,
      footerLogo,
      productLines,
      username: user.firstName,
      customerType: user.customerType,
      customerRef,
      quoteId,
    },
  };
});
