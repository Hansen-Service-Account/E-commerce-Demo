import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import Icon from "@chakra-ui/icon";
import { SpinnerIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import {
  Badge,
  Box,
  Center,
  Divider,
  Heading,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import useQuote from "../hooks/useQuote";
import { DARK_GOLD, HANSEN_CPQ_V2_BASE_URL } from "../utils/constants";
import CartItem from "./CartItem";
import { useRouter } from "next/router";
import fetch from "../utils/fetchJson";
import { useToast } from "@chakra-ui/toast";
import ErrorToast from "./ErrorToast";

const QuoteCart = ({ quoteId, adding }) => {
  const toast = useToast();
  if (!quoteId) {
    toast({
      render: ({ id, onClose }) => (
        <ErrorToast
          error={{
            data: {
              responseCode: "CPQ Server Error",
              httpStatus: 500,
              responseText:
                "Failed to create or retrieve a quote from CPQ server. You can only browse products at the moment.",
            },
          }}
          onClose={onClose}
        />
      ),
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    return null;
  }
  const { quote, mutateQuote, isLoading, isError } = useQuote(quoteId);
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
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cartBtnRef = React.useRef();
  const deleteItem = async (itemId) => {
    mutateQuote(
      {
        ...quote,
        items: quote.items.filter((i) => i.id !== itemId),
      },
      false
    );
    try {
      await fetch(
        `${HANSEN_CPQ_V2_BASE_URL}/quotes/${quoteId}/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      mutateQuote();
    } catch (error) {
      mutateQuote();
    }
  };
  return (
    <>
      <Button
        ref={cartBtnRef}
        leftIcon={
          adding || isLoading ? <Spinner /> : <Icon as={FaShoppingCart} />
        }
        colorScheme="teal"
        onClick={onOpen}
        position="fixed"
        size="lg"
        px={{ base: 2, lg: 4 }}
        left={8}
        bottom={8}
        disabled={adding || isLoading || isError}
      >
        {isError && "Error Retrieving Cart"}
        {quote && !isError ? (
          <Badge
            variant="solid"
            colorScheme="red"
            fontSize="lg"
            ml={{ base: 0, lg: 2 }}
          >
            {quote.items.length}
          </Badge>
        ) : null}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={cartBtnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Quote Cart</DrawerHeader>
          {quote &&
            quote.currentValidation &&
            quote.currentValidation.valid === false && (
              <DrawerHeader fontSize="16px" color="red">
                Please configure all invalid items before submitting for orders.
              </DrawerHeader>
            )}
          {quote && quote.items.length === 0 && (
            <DrawerHeader fontSize="16px" color="black">
              Your cart is currently empty.
            </DrawerHeader>
          )}
          <DrawerBody>
            <VStack
              spacing={4}
              align="stretch"
              divider={<StackDivider borderColor="gray.200" />}
              py={4}
            >
              {quote
                ? quote.items.map((i) => (
                    <CartItem
                      key={i.itemNumber}
                      item={i}
                      deleteItem={deleteItem}
                      onClose={onClose}
                    />
                  ))
                : null}
            </VStack>
            {quote && quote.items.length !== 0 && (
              <>
                <DrawerHeader px={0}>Pricing Summary</DrawerHeader>
                <Text py={2}>
                  Upfront charge: $
                  {(quote &&
                    quote.pricingSummary &&
                    quote.pricingSummary.TotalPriceSummary.NonRecurring &&
                    quote.pricingSummary.TotalPriceSummary.NonRecurring
                      .ItemCharge) ||
                    "0"}
                </Text>
                <Divider borderColor={DARK_GOLD} />
                <Text py={2}>
                  Monthly charge: $
                  {(quote &&
                    quote.pricingSummary &&
                    quote.pricingSummary.TotalPriceSummary.Recurring.Monthly &&
                    quote.pricingSummary.TotalPriceSummary.Recurring.Monthly
                      .ItemCharge) ||
                    "0"}
                </Text>
              </>
            )}
            {quote &&
              quote.items.length !== 0 &&
              quote.currentValidation &&
              quote.currentValidation.valid === true && (
                <Box textAlign="center" py={4}>
                  <Button
                    colorScheme="green"
                    onClick={() => router.push("/quote")}
                  >
                    Summary
                  </Button>
                </Box>
              )}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default QuoteCart;
