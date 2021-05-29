import { Box, Divider, Flex, Text } from "@chakra-ui/layout";
import React from "react";
import { DARK_GOLD } from "../utils/constants";

export default function PricingSummary({
  nonRecurringCharge,
  recurringCharges,
}) {
  return (
    <Box fontWeight="bold" my={8}>
      <Flex justify="space-between" align="center">
        <Text as="span">Total Charge Upfront</Text>
        <Text as="span">${nonRecurringCharge || 0}</Text>
      </Flex>
      {recurringCharges.map((c) => (
        <Box key={c.periodicity}>
          <Divider my={2} borderColor={DARK_GOLD} />
          <Flex justify="space-between" align="center">
            <Text as="span">Total Charge {c.periodicity}</Text>
            <Text as="span">${c.charge}</Text>
          </Flex>
        </Box>
      ))}
    </Box>
  );
}
