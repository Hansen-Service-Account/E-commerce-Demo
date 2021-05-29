import Icon from "@chakra-ui/icon";
import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  StackDivider,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import { IoIosCloseCircle, IoIosCog } from "react-icons/io";
import { DARK_GOLD } from "../utils/constants";
import { useRouter } from "next/router";

export default function QuoteSummary({ quote, deleteItem }) {
  const router = useRouter();
  return (
    <VStack
      spacing={8}
      align="stretch"
      divider={<StackDivider borderColor="gray.200" />}
      py={4}
    >
      {quote &&
        quote.items.map((item) => (
          <Box
            borderRadius={8}
            key={item.id}
            borderColor={DARK_GOLD}
            borderWidth="2px"
            p={8}
            position="relative"
          >
            <Tooltip
              hasArrow
              label={
                item.currentValidation.valid
                  ? "Valid item"
                  : "Invalid items need to be configured or removed before checkout"
              }
              placement="bottom"
              bg={DARK_GOLD}
            >
              <Badge
                position="absolute"
                top="0"
                left="50%"
                transform="translate(-50%,-50%)"
                variant="outline"
                bg="white"
                colorScheme={item.currentValidation.valid ? "green" : "red"}
              >
                {item.currentValidation.valid ? "Valid" : "Invalid"}
              </Badge>
            </Tooltip>
            <Icon
              as={IoIosCloseCircle}
              position="absolute"
              top="0"
              right="0"
              w={6}
              h={6}
              bg="white"
              color="red"
              _hover={{ color: "black" }}
              cursor="pointer"
              transform="translate(50%,-50%)"
              onClick={() => deleteItem(item.id)}
            />
            <Icon
              as={IoIosCog}
              position="absolute"
              bottom="0"
              right="0"
              w={6}
              h={6}
              bg="white"
              color={DARK_GOLD}
              _hover={{ color: "black" }}
              cursor="pointer"
              transform="translate(50%,50%)"
              onClick={() => router.push(`/quote/items/${item.id}`)}
            />
            <Table variant="simple" fontSize={{ base: "12px", md: "18px" }}>
              <TableCaption
                placement="top"
                fontWeight="bold"
                fontSize="18px"
                textAlign="left"
                px={0}
                color={DARK_GOLD}
                mt={0}
                mb={4}
              >
                {item.name}{" "}
              </TableCaption>
              <Thead fontSize={{ base: "12px", md: "18px" }}>
                <Tr borderColor={DARK_GOLD}>
                  <Th
                    w={{ base: "auto", md: "50%" }}
                    fontSize={{ base: "12px", md: "18px" }}
                    p={{ base: 1, md: 3 }}
                  >
                    Name
                  </Th>
                  <Th
                    w="25%"
                    isNumeric
                    fontSize={{ base: "12px", md: "18px" }}
                    p={{ base: 1, md: 3 }}
                  >
                    Upfront
                  </Th>
                  <Th
                    w="25%"
                    isNumeric
                    fontSize={{ base: "12px", md: "18px" }}
                    p={{ base: 1, md: 3 }}
                  >
                    Recurring(Monthly)
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {item.currentPricing.Pricing.ItemisedPricingSummary.map(
                  (ips) => (
                    <Tr borderColor={DARK_GOLD} key={ips.EntityID}>
                      <Td p={{ base: 1, md: 3 }}>
                        {item.metaTypeLookup[ips.EntityID].name}
                      </Td>
                      <Td p={{ base: 1, md: 3 }} isNumeric>
                        {ips.NonRecurring ? ips.NonRecurring.ItemCharge : "N/A"}
                      </Td>
                      <Td p={{ base: 1, md: 3 }} isNumeric>
                        {ips.Recurring
                          ? ips.Recurring.Monthly.ItemCharge
                          : "N/A"}
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </Box>
        ))}
    </VStack>
  );
}
