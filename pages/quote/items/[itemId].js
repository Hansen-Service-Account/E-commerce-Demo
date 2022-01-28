import { Box, Flex, Heading } from "@chakra-ui/layout";
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
import { getWebPageByWebsiteIdAndPageName } from "../../../utils/contentful";

export default function itemId({
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  quoteId,
  itemId,
  username,
}) {
  const { item, isLoading, isError } = useItem(quoteId, itemId);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [itemSpec, setItemSpec] = useState({});
  useEffect(async () => {
    try {
      const result = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_HANSEN_CPQ_V2_BASE_URL}/configuration/candidateconfiguration?include=compiledSpecification`,
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
        )
      ).json();
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
      <Header
        username={username}
        initialLogoSrc={headerLogo.fields.file.url}
        productLines={productLines}
        headerNav={headerNav}
      />
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
        <Box py={24}>
          <ItemConfig
            item={item}
            quoteId={quoteId}
            setAdding={setAdding}
            adding={adding}
            itemSpec={itemSpec}
          />
        </Box>
      )}
      <QuoteCart quoteId={quoteId} adding={adding} />
      <Footer logoURL={footerLogo.fields.file.url} footerNav={footerNav} />
    </>
  );
}

export const getServerSideProps = withSession(async function ({
  req,
  _,
  params,
}) {
  let productLines;
  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getWebPageByWebsiteIdAndPageName(process.env.CONTENTFUL_WEBSITE_ID);
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const itemId = params.itemId;
  const productLinesRes = await fetch(
    `${process.env.HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
  );
  if (productLinesRes.status > 400) {
    productLines = [];
  } else {
    productLines = await productLinesRes.json();
  }

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  if (!quoteId) {
    return {
      props: {
        headerNav,
        footerNav,
        headerLogo,
        footerLogo,
        productLines,
        username: user.firstName,
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
      quoteId,
      itemId,
      username: user.firstName,
      key: itemId,
    },
  };
});
