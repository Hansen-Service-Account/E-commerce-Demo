import { Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import React from "react";

const CategorySelection = ({ type, categories }) => {
  return (
    <>
      <Flex
        justifyContent="space-around"
        alignItems="center"
        mt={8}
        p={4}
        w="80%"
        mx="auto"
        borderColor="gray.100"
        borderWidth="2px"
        borderRadius="4px"
      >
        {categories.map((c) => (
          <NextLink key={c.id} href={`/${type}-products/${c.id}`}>
            <Link
              px={4}
              py={2}
              borderRadius="4px"
              _hover={{
                bg: type === "residential" ? "teal" : "tomato",
                color: "white",
              }}
            >
              {c.name}
            </Link>
          </NextLink>
        ))}
      </Flex>
    </>
  );
};

export default CategorySelection;
