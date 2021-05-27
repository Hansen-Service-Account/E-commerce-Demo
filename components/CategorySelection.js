import { Wrap } from "@chakra-ui/layout";
import { WrapItem } from "@chakra-ui/layout";
import { Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import React from "react";

const CategorySelection = ({ type, categories }) => {
  return (
    <>
      <Wrap
        mt={8}
        p={4}
        w="90%"
        justify="space-around"
        mx="auto"
        borderColor="gray.100"
        borderWidth="2px"
        borderRadius="4px"
      >
        {categories.map((c) => (
          <WrapItem key={c.id}>
            <NextLink href={`/${type}-products/${c.id}`}>
              <Link
                px={4}
                py={2}
                w="180px"
                borderRadius="4px"
                textAlign="center"
                _hover={{
                  bg: type === "residential" ? "teal" : "tomato",
                  color: "white",
                }}
              >
                {c.name}
              </Link>
            </NextLink>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
};

export default CategorySelection;
