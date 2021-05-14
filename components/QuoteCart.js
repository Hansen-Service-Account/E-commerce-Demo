import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import Icon from "@chakra-ui/icon";
import { SpinnerIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Badge, Stack, StackDivider, VStack } from "@chakra-ui/layout";
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
import fetch from "node-fetch";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import useQuote from "../hooks/useQuote";
import CartItem from "./CartItem";

const QuoteCart = ({ quoteId, adding }) => {
  if (!quoteId) {
    return null;
  }
  const { quote, mutateQuote, isLoading, isError } = useQuote(quoteId);
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
    await fetch(`/api/quotes/${quoteId}/items/${itemId}`, { method: "DELETE" });
    mutateQuote();
  };
  return (
    <>
      <Button
        ref={cartBtnRef}
        leftIcon={adding ? <Spinner /> : <Icon as={FaShoppingCart} />}
        colorScheme="teal"
        onClick={onOpen}
        position="fixed"
        size="lg"
        px={{ base: 2, lg: 4 }}
        left={8}
        bottom={8}
        disabled={adding}
      >
        {quote ? (
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
          <DrawerBody>
            <VStack
              spacing={4}
              align="stretch"
              divider={<StackDivider borderColor="gray.200" />}
            >
              {quote
                ? quote.items.map((i) => (
                    <CartItem
                      key={i.itemNumber}
                      item={i}
                      deleteItem={deleteItem}
                    />
                  ))
                : null}
            </VStack>
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
