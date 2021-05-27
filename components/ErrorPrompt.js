import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { Box, StackDivider, VStack } from "@chakra-ui/layout";
import React from "react";

export default function ErrorPrompt({ errors, metaTypeLookup }) {
  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        {errors.map(
          (e) =>
            e.errorCode !== "AmbiguousRate" && (
              <Alert key={e.entityID + e.childID} status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{e.errorCode}</AlertTitle>
                <AlertDescription>
                  "{metaTypeLookup[e.entityID].name}"{" "}
                  {e.errorCode === "GroupCardinalityNotSatisfied" ||
                  e.errorCode === "InvalidCustomerPortfolio"
                    ? "group"
                    : "option"}{" "}
                  requires{" "}
                  {e.errorCode === "GroupCardinalityNotSatisfied"
                    ? "at least one sub-option"
                    : e.errorCode === "InvalidCustomerPortfolio"
                    ? "only one package"
                    : "configuration"}
                </AlertDescription>
              </Alert>
            )
        )}
      </VStack>
    </Box>
  );
}
