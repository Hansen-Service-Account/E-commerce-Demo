import Header from "../../components/Header";
import fetch from "../../utils/fetchJson";
import {
  BUSINESS_SUB_CATEGORIES,
  HANSEN_CPQ_BASE_URL,
} from "../../utils/constants";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import User from "../../models/user";
import { useState } from "react";
import { Badge, Center, Flex, Heading } from "@chakra-ui/layout";
import Footer from "../../components/Footer";
import ViewControl from "../../components/ViewControl";
import CategorySelection from "../../components/CategorySelection";
import QuoteCart from "../../components/QuoteCart";
import useQuote from "../../hooks/useQuote";
import { useToast } from "@chakra-ui/toast";
import fetcher from "../../utils/nodeFetchJson";
import ProductsDisplay from "../../components/ProductsDisplay";
import Error from "next/error";
import ErrorToast from "../../components/ErrorToast";
import { Alert, AlertIcon } from "@chakra-ui/alert";

export default function businessCategoryID({
  username,
  products,
  quoteId,
  status,
  errorMessage,
  categories,
  customerType,
}) {
  if (status) {
    return (
      <>
        <Header username={username} />
        <Center height="70vh" overflow="hidden">
          <Error statusCode={status} title={errorMessage} />
        </Center>
        <QuoteCart quoteId={quoteId} />
        <Footer />
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
        type={categories.name}
        categories={categories.children}
      />
      {customerType !== "Business" && (
        <Alert status="warning" w="80%" mx="auto" mt={8}>
          <AlertIcon />
          You must be a business type customer to purchase these products.
        </Alert>
      )}
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
        allowAdd={customerType === "Business"}
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
  const quoteId = req.session.get("quoteId");
  try {
    const result = await fetcher(endPoint);
    const products = result[0];
    const classificationresult = await fetcher(
      `${HANSEN_CPQ_BASE_URL}/classifications/CDP`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const categories = classificationresult.find((r) => r.name === "Business");
    if (!user) {
      return {
        props: { products, categories },
      };
    }

    return {
      props: {
        products,
        username: user.firstName,
        quoteId,
        categories,
        customerType: user.customerType,
      },
    };
  } catch (error) {
    return {
      props: {
        status: error.response.status,
        errorMessage: error.data.responseText,
        username: user.firstName,
        quoteId,
      },
    };
  }
});
