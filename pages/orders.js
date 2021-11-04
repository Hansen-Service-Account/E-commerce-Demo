import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Footer from "../components/Footer";
import { Box, Flex, Heading } from "@chakra-ui/layout";

import {
  HANSEN_CPQ_V2_BASE_URL,
  HANSEN_CUSTOMER_REF,
} from "../utils/constants";
import useOrders from "../hooks/useOrders";
import { useToast } from "@chakra-ui/toast";
import ErrorToast from "../components/ErrorToast";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Spinner } from "@chakra-ui/spinner";
import { Accordion } from "@chakra-ui/accordion";
import OrderItem from "../components/OrderItem";
import fetch from "../utils/fetchJson";

export default function orderPage({ username, customerRef }) {
  const { orders, isLoading, isError, mutateOrders } = useOrders(customerRef);
  console.log(orders);
  if (orders) {
    orders.orderSummaries.sort(
      (a, b) =>
        parseInt(b.order.orderSequenceNumber) -
        parseInt(a.order.orderSequenceNumber)
    );
  }
  const toast = useToast();
  // const submitOrder = async(orderId) => {
  //   try{
  //     await fetch(`${HANSEN_CPQ_V2_BASE_URL}/orders/${orderId}/submit`,{method:"POST",headers:{"Content":"application/json"},body:{}})
  //   }
  // }
  const cancelOrder = async (orderId) => {
    const ordersCopy = [...orders.orderSummaries];
    const index = ordersCopy.findIndex((o) => o.id === orderId);
    ordersCopy[index].order.status === "cancelled";
    mutateOrders({ ...orders, orderSumaries: ordersCopy }, false);
    try {
      await fetch(`${HANSEN_CPQ_V2_BASE_URL}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { accept: "application/json" },
      });
      mutateOrders();
      toast({
        title: `Order ${orderId} cancelled`,
        description: "Order has been successfully cancelled.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      mutateOrders();
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
  if (orders && orders.orderSummaries.length === 0) {
    return (
      <>
        <Header username={username} />
        <Box h="30vh" w="80%" mt={12} mx="auto">
          <Alert status="warning">
            <AlertIcon />
            You have no orders at this moment.
          </Alert>
        </Box>
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
            Loading your orders...
          </Heading>
        </Flex>
      )}

      {orders && (
        <Box w={{ base: "95%", md: "90%" }} mx="auto" pt={8}>
          <Heading as="h2" size="lg" textAlign="left" textTransform="uppercase">
            Order History
          </Heading>
          <Accordion allowToggle>
            {orders.orderSummaries.map((o) => (
              <OrderItem key={o.id} order={o} cancelOrder={cancelOrder} />
            ))}
          </Accordion>
        </Box>
      )}
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
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

  //Hard coded temporarily
  const customerRef = HANSEN_CUSTOMER_REF;

  return {
    props: {
      username: user.firstName,
      customerRef,
    },
  };
});
