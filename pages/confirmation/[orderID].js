import { Box, Center, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React, { useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

import { dbConnect } from "../../middleware/db";
import withSession from "../../middleware/session";
import User from "../../models/user";
import Error from "next/error";
import fetch from "../../utils/nodeFetchJson";
import {
  HANSEN_CPQ_BASE_URL,
  HANSEN_CUSTOMER_REF,
} from "../../utils/constants";
import useOrder from "../../hooks/useOrder";
import { useRouter } from "next/router";
import { Alert, AlertIcon } from "@chakra-ui/alert";

export default function orderId({ orderId, username }) {
  const { order, isLoading, isError } = useOrder(orderId);
  const router = useRouter();
  if (!order && !isLoading && !isError) {
    return (
      <>
        <Header username={username} />
        <Center height="70vh" overflow="hidden">
          <Error statusCode={404} title="Resource not found" />
        </Center>
        <Footer />
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Header username={username} />
        <Center height="70vh" overflow="hidden">
          <Error
            statusCode={isError.response.status}
            title={isError.data.responseText}
          />
        </Center>
        <Footer />
      </>
    );
  }

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
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, params }) {
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

    const newQuote = await fetch(`${HANSEN_CPQ_BASE_URL}/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.firstName,
        customerRef: `${HANSEN_CUSTOMER_REF}`,
        items: [],
      }),
    });

    req.session.set("quoteId", newQuote.id);
    await req.session.save();
  }

  return {
    props: {
      orderId: params.orderID,
      username: user.firstName,
      key: orderId,
    },
  };
});
