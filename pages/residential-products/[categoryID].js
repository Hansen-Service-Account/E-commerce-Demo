import Header from "../../components/Header";
import fetch from "../../utils/fetchJson";
import {
  HANSEN_CPQ_BASE_URL,
  HANSEN_RED,
  MOBILE_PRODUCTS_ENDPOINT,
  RESIDENTIAL_SUB_CATEGORIES,
} from "../../utils/constants";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import User from "../../models/user";
import ProductsDisplay from "../../components/ProductsDisplay";
import { useState } from "react";
import { Badge, Flex, Heading } from "@chakra-ui/layout";
import Footer from "../../components/Footer";
import ViewControl from "../../components/ViewControl";
import CategorySelection from "../../components/CategorySelection";
import QuoteCart from "../../components/QuoteCart";
import useQuote from "../../hooks/useQuote";
import { useToast } from "@chakra-ui/toast";
import fetcher from "../../utils/nodeFetchJson";
import Error from "next/error";
import ErrorToast from "../../components/ErrorToast";

export default function residentialCategoryID({
  username,
  products,
  quoteId,
  status,
  errorMessage,
}) {
  if (status) {
    return (
      <>
        <Header username={username} />
        <Error statusCode={status} title={errorMessage} />
      </>
    );
  }
  const isLoggedIn = !!username;
  const toast = useToast();
  const [viewMode, setViewMode] = useState("cardview");
  const { quote, mutateQuote } = useQuote(quoteId);
  const [adding, setAdding] = useState(false);
  const addToCart = async (productId) => {
    try {
      mutateQuote(
        {
          ...quote,
          items: [...quote.items, { productId, itemNumber: Math.random() }],
        },
        false
      );
      setAdding(true);
      await fetch(`${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/items`, {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: { "Content-Type": "application/json" },
      });
      mutateQuote();
      toast({
        title: "Item added.",
        description:
          "The item has been added to cart successfully, please configure before checking out.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setAdding(false);
    } catch (error) {
      toast({
        render: ({ id, onClose }) => (
          <ErrorToast error={error} onClose={onClose} />
        ),
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      mutateQuote(
        {
          ...quote,
          items: quote.items.filter((i) => i.productId !== productId),
        },
        false
      );
      setAdding(false);
    }
  };
  return (
    <>
      <Header username={username} />
      <CategorySelection
        type="residential"
        categories={RESIDENTIAL_SUB_CATEGORIES}
      />
      <Flex justifyContent="space-between" w="80%" mx="auto" mt={8}>
        <Flex justifyContent="center" alignItems="center">
          <Heading as="h2" size="xl" textAlign="center" color="#b39573" mx={2}>
            {products.name}
          </Heading>
          <Badge color="white" bg="gray.500" fontSize="xl" mx={2}>
            &nbsp; {products.entities.length} &nbsp;
          </Badge>
        </Flex>
        <ViewControl viewMode={viewMode} setViewMode={setViewMode} />
      </Flex>
      <ProductsDisplay
        products={products.entities}
        viewMode={viewMode}
        isLoggedIn={isLoggedIn}
        addToCart={addToCart}
      />
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
  const endPoint = `https://cpqserver-e30-cpq1.cloud.sigma-systems.com/api/offers?InstanceTypeNames=Package,Promotion,Bundle&Classifications=[Customer_Demo_Portal;${params.categoryID};false]&ClassificationElementName=Customer_Demo_Portal&xsltCode=offer_special&at[p1]=ID&el[p2]=Name&at[p3]=BusinessID&el[p4]=Description&el[p5]=Element_Guid&el[p6]=Description`;
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  if (!user) {
    return {
      props: { products },
    };
  }
  try {
    const result = await fetcher(endPoint);
    const products = result[0];
    const quoteId = req.session.get("quoteId");
    //   const products = JSON.parse(result.data);

    return {
      props: {
        products,
        username: user.firstName,
        quoteId,
      },
    };
  } catch (error) {
    return {
      props: {
        status: error.response.status,
        errorMessage: error.data.responseText,
      },
    };
  }
});
