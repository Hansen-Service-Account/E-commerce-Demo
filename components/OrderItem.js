import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Button, IconButton } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import {
  Badge,
  Flex,
  HStack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/layout";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { Portal } from "@chakra-ui/portal";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import { FaStopCircle } from "react-icons/fa";
import { DARK_GOLD } from "../utils/constants";

export default function OrderItem({ order, cancelOrder }) {
  return (
    <AccordionItem my={4} border="none">
      <h2>
        <AccordionButton
          bg={DARK_GOLD}
          color="white"
          _hover={{ color: "black" }}
        >
          <HStack spacing={3} flex="1">
            <Text fontWeight="bold" as="span">
              {order.OrderKey}
            </Text>
            <Text as="span">
              Submitted on{" "}
              {new Date(Date.parse(order.SubmissionDate)).toDateString()}
            </Text>
            <Badge
              colorScheme={
                order.Status === "In Progress"
                  ? "green"
                  : order.Status === "Aborted"
                  ? "yellow"
                  : "red"
              }
            >
              {order.Status}
            </Badge>
          </HStack>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Flex align="center" mt={4}>
            <Popover placement="right-end">
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    {/* <Icon
                    w={6}
                    h={6}
                    as={FaStopCircle}
                    color="red"
                    _hover={{ color: "black" }}
                    cursor="pointer"
                  /> */}
                    <IconButton
                      disabled={order.Status !== "In Progress"}
                      icon={<Icon w={6} h={6} as={FaStopCircle} color="red" />}
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontWeight="bold">
                        Canceling the order
                      </PopoverHeader>
                      <PopoverBody>
                        <Text>Are you sure you want to cancel the order?</Text>
                        <Flex justify="space-between" mt={4}>
                          <Button
                            colorScheme="red"
                            onClick={() => {
                              cancelOrder(order.OrderKey);
                              onClose();
                            }}
                          >
                            YES
                          </Button>
                          <Button onClick={onClose}>NO</Button>
                        </Flex>
                      </PopoverBody>
                      <PopoverFooter>
                        <Alert status="warning">
                          <AlertIcon />
                          Cannot be undone
                        </Alert>
                      </PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </>
              )}
            </Popover>
            <VStack
              divider={<StackDivider />}
              align="flex-start"
              w="90%"
              mx="auto"
            >
              {order.orderItems.map((i) => (
                <Flex
                  key={i.OrderKey}
                  justify="space-between"
                  align="center"
                  w="100%"
                >
                  <Text as="span">{i.Name}</Text>
                  <Badge
                    colorScheme={
                      i.Status === "In Progress"
                        ? "green"
                        : i.Status === "Aborted"
                        ? "yellow"
                        : "red"
                    }
                    mx={4}
                  >
                    {i.Status}
                  </Badge>
                </Flex>
              ))}
            </VStack>
          </Flex>
        </AccordionPanel>
      </h2>
    </AccordionItem>
  );
}
