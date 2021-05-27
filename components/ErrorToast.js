import { CloseIcon, InfoIcon } from "@chakra-ui/icons";
import { Flex, Heading, Text } from "@chakra-ui/layout";
import React from "react";

export default function ErrorToast({ error, onClose }) {
  return (
    <Flex
      color="white"
      p={3}
      bg="red"
      justify="space-between"
      align="center"
      direction="column"
      borderRadius="8px"
    >
      <Flex w="100%" justify="space-between" align="center" mb={4}>
        <InfoIcon />
        <Heading
          as="h5"
          fontSize="16px"
        >{`Review error: ${error.data.responseCode}, status ${error.data.httpStatus}`}</Heading>
        <CloseIcon
          w={3}
          h={3}
          cursor="pointer"
          onClick={() => {
            onClose();
          }}
        />
      </Flex>
      <Text as="p" fontSize="14px" w="100%">
        {error.data.responseText}
      </Text>
    </Flex>
  );
}
