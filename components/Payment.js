import Icon from "@chakra-ui/icon";
import { Center, Flex, Heading } from "@chakra-ui/layout";
import React from "react";
import { DARK_GOLD } from "../utils/constants";
import { RiMastercardFill, RiVisaFill } from "react-icons/ri";
import TextInput from "./TextInput";
import { Spacer } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

export default function Payment({
  nonRecurringCharge,
  recurringCharges,
  card,
  setCard,
  quoteId,
  checkout,
  submitting,
}) {
  return (
    <>
      <Heading
        as="h4"
        size="md"
        textAlign="center"
        color={DARK_GOLD}
        p={2}
        borderColor={DARK_GOLD}
        borderRadius="6px"
        borderWidth="2px"
      >
        Your total Upfront payment is ${nonRecurringCharge}
        {recurringCharges.map(
          (c) => `, ${c.periodicity} payment is $${c.charge}`
        )}
      </Heading>
      <Flex
        w={{ base: "90%", md: "70%", lg: "50%" }}
        mx="auto"
        direction="column"
        align="center"
        py={12}
      >
        <Flex w="100%" justify="space-between" mt={4} mb={12}>
          <Center
            w="40%"
            h="200px"
            borderWidth="6px"
            borderColor={card === "Visa" ? "#1a1f71" : "#F79E1B"}
            color={card === "Visa" ? "#1a1f71" : "#F79E1B"}
            id="Visa"
            _hover={{ borderColor: "#1a1f71", color: "#1a1f71" }}
            boxShadow={card === "Visa" ? "dark-lg" : "none"}
            cursor="pointer"
            onClick={(e) => setCard(e.currentTarget.id)}
          >
            <Icon w={24} h={24} as={RiVisaFill} />
          </Center>
          <Center
            w="40%"
            h="200px"
            borderWidth="6px"
            borderColor={card === "Mastercard" ? "#EB001B" : "#F79E1B"}
            color={card === "Mastercard" ? "#EB001B" : "#F79E1B"}
            id="Mastercard"
            _hover={{ borderColor: "#EB001B", color: "#EB001B" }}
            boxShadow={card === "Mastercard" ? "dark-lg" : "none"}
            cursor="pointer"
            onClick={(e) => setCard(e.currentTarget.id)}
          >
            <Icon w={24} h={24} as={RiMastercardFill} />
          </Center>
        </Flex>
        <TextInput my="12px" placeholder="Name on card" />
        <TextInput my="12px" placeholder="Card number" />
        <Flex my="12px" w="100%" justify="space-between" align="center">
          <TextInput w="30%" placeholder="MM/YY" />
          <TextInput w="30%" placeholder="CVC/CVV" />
          <TextInput w="30%" placeholder="Zip/Postal Code" />
        </Flex>
      </Flex>
      <Flex w="100%" justify="space-between">
        <Button>Continue Shopping</Button>
        <Button
          colorScheme="green"
          onClick={() => checkout(quoteId)}
          isLoading={submitting}
        >
          Confirm Payment
        </Button>
      </Flex>
    </>
  );
}
