import { Box, Center, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { dbConnect } from "../../middleware/db";
import withSession from "../../middleware/session";
import User from "../../models/user";
import Error from "next/error";
import useOrder from "../../hooks/useOrder";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { getWebPageByWebsiteIdAndPageName } from "../../utils/contentful";

export default function orderId({
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  orderId,
  username,
}) {
  const { order, isLoading, isError } = useOrder(orderId);
  if (!order && !isLoading && !isError) {
    return (
      <>
        <Header
          username={username}
          initialLogoSrc={headerLogo.fields.file.url}
          productLines={productLines}
          headerNav={headerNav}
        />
        <Center height="70vh" overflow="hidden">
          <Error statusCode={404} title="Resource not found" />
        </Center>
        <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Header
          username={username}
          initialLogoSrc={headerLogo.fields.file.url}
          productLines={productLines}
          headerNav={headerNav}
        />
        <Center height="70vh" overflow="hidden">
          <Error
            statusCode={isError.response.status}
            title={isError.data.responseText}
          />
        </Center>
        <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
      </>
    );
  }

  return (
    <>
      <Header
        username={username}
        initialLogoSrc={headerLogo.fields.file.url}
        productLines={productLines}
        headerNav={headerNav}
      />
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
            Loading order details...
          </Heading>
        </Flex>
      )}
      {order && (
        <Box w="80%" mx="auto" mt={12}>
          <Heading as="h4" textAlign="center">
            Thank you for your business
          </Heading>
          <Text as="p" textAlign="center" my={6}>
            Your payment has been processed and we have confirmed your Order #
            {order.OrderManagementID}: {order.DisplayID}
          </Text>
          <Stack spacing={3}>
            {order.OrderItem.map((i) => (
              <Alert key={i.ID} status="success">
                <AlertIcon />
                {i.DisplayID} has been ordered.
              </Alert>
            ))}
          </Stack>
        </Box>
      )}
      <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, params }) {
  let productLines;

  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getWebPageByWebsiteIdAndPageName(process.env.CONTENTFUL_WEBSITE_ID);

  const productLinesRes = await fetch(
    `${process.env.HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
  );
  if (productLinesRes.status > 400) {
    productLines = [];
  } else {
    productLines = await productLinesRes.json();
  }
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const quoteId = req.session.get("quoteId");
  const orderId = req.session.get("orderId");

  if (!orderId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //If there is a quote which has been submitted successfully
  if (quoteId && orderId) {
    req.session.unset("quoteId");
    req.session.unset("orderId");
    await req.session.save();

    const newQuoteRes = await fetch(
      `${process.env.HANSEN_CPQ_V2_BASE_URL}/quotes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.firstName,
          customerRef: `${HANSEN_CUSTOMER_REF}`,
          items: [],
        }),
      }
    );

    const newQuote = await newQuoteRes.json();

    req.session.set("quoteId", newQuote.id);
    await req.session.save();
  }

  return {
    props: {
      headerNav,
      footerNav,
      headerLogo,
      footerLogo,
      productLines,
      orderId: params.orderID,
      username: user.firstName,
      key: orderId,
    },
  };
});
