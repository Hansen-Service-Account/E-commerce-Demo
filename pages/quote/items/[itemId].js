import { Box, Center, Flex, Heading } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ItemConfig from "../../../components/ItemConfig";
import QuoteCart from "../../../components/QuoteCart";
import useItem from "../../../hooks/useItem";
import { dbConnect } from "../../../middleware/db";
import withSession from "../../../middleware/session";
import User from "../../../models/user";
import Error from "next/error";
import fetcher from "../../../utils/nodeFetchJson";
import { DARK_GOLD, HANSEN_CPQ_V2_BASE_URL } from "../../../utils/constants";
import QuoteItem from "../../../components/QuoteItem";
import fetch from "../../../utils/fetchJson";
import { renderItem } from "../../../utils/renderItem";

export default function itemId({ quoteId, itemId, username }) {
  const { item, isLoading, isError } = useItem(quoteId, itemId);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [itemSpec, setItemSpec] = useState({});
  useEffect(async () => {
    try {
      const result = await fetch(
        `${HANSEN_CPQ_V2_BASE_URL}/configuration/candidateconfiguration?include=compiledSpecification`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            configuration: { id: quoteId, itemId: itemId },
          }),
        }
      );
      setItemSpec({ ...result });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);
  // if (isError) {
  //   return (
  //     <>
  //       <Header username={username} />
  //       <Center height="70vh" overflow="hidden">
  //         <Error
  //           statusCode={isError.response.status}
  //           title={isError.data.responseText}
  //         />
  //       </Center>
  //       <QuoteCart quoteId={quoteId} />
  //       <Footer />
  //     </>
  //   );
  // }

  return (
    <>
      <Header username={username} />
      {loading ? (
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
          quoteId={quoteId}
          setAdding={setAdding}
          adding={adding}
          itemSpec={itemSpec}
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
