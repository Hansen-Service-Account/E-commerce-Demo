import { Box, Center, Flex, Heading } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React, { useState } from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ItemConfig from "../../../components/ItemConfig";
import QuoteCart from "../../../components/QuoteCart";
import useItem from "../../../hooks/useItem";
import { dbConnect } from "../../../middleware/db";
import withSession from "../../../middleware/session";
import User from "../../../models/user";
import Error from "next/error";

export default function itemId({ quoteId, itemId, username }) {
  const { item, isLoading, isError } = useItem(quoteId, itemId);
  const [adding, setAdding] = useState(false);
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
        <QuoteCart quoteId={quoteId} />
      </>
    );
  }

  return (
    <>
      <Header username={username} />
      {isLoading ? (
        <Flex h="70vh" justify="center" align="center" direction="column">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Heading as="h5" size="md" my={4}>
            Loading item details...
          </Heading>
        </Flex>
      ) : (
        <ItemConfig
          item={item}
          metaType={{ ...item.metaTypeLookup }}
          quoteId={quoteId}
          setAdding={setAdding}
          adding={adding}
        />
      )}
      <QuoteCart quoteId={quoteId} adding={adding} />
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({
  req,
  res,
  params,
}) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const itemId = params.itemId;

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
      itemId,
      username: user.firstName,
      key: itemId,
    },
  };
});
