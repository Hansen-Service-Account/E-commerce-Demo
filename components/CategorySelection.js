import { Wrap } from "@chakra-ui/layout";
import { WrapItem } from "@chakra-ui/layout";
import { Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import React from "react";

const CategorySelection = ({ categories, urlPrefix }) => {
  return (
    <>
      <Wrap
        mt={8}
        p={4}
        w="90%"
        justify="space-around"
        align="stretch"
        mx="auto"
        borderColor="gray.100"
        borderWidth="2px"
        borderRadius="4px"
      >
        {categories.map((p) => (
          <WrapItem key={p.guid}>
            <NextLink href={`${urlPrefix}/${p.name.replace(/ /g, "-")}`}>
              <Link
                px={4}
                py={2}
                height="100%"
                lineHeight="1"
                borderRadius="4px"
                textAlign="center"
                _hover={{
                  bg: "tomato",
                  color: "white",
                }}
              >
                {p.name}
              </Link>
            </NextLink>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
};

export default CategorySelection;
