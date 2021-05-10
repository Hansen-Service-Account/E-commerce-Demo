import { Button } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import NextLink from "next/link";
import React from "react";

const CategorySelection = ({ type, categories }) => {
  return (
    <Flex
      justifyContent="space-around"
      alignItems="center"
      p={8}
      w="50%"
      mx="auto"
    >
      {categories.map((c) => (
        <NextLink key={c.id} href={`/${type}-products/${c.id}`}>
          <Button variant="outline" colorScheme="teal">
            {c.name}
          </Button>
        </NextLink>
      ))}
    </Flex>
  );
};

export default CategorySelection;
