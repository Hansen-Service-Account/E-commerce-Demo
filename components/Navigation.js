import NextLink from "next/link";
import {
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuDivider,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import UserButton from "./UserButton";
import React from "react";

const Navigation = ({ username, productLines, headerNav }) => {
  const toast = useToast();
  return (
    <>
      <Flex
        direction="row"
        align="center"
        justify="space-around"
        display={{ base: "none", lg: "flex" }}
        p={4}
        color="black"
      >
        <Menu>
          <MenuButton
            mx={4}
            as={Button}
            bgColor={headerNav.fields.buttonBgColor || "teal"}
            color={headerNav.fields.buttonTextColor || "white"}
            onClick={() => {
              if (productLines.length === 0) {
                toast({
                  title: "Error Retrieving Product Catalog.",
                  description:
                    "We are not able to retrieve the product catalog from the server at this moment. Please contact IT admin if this error persists.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            Products
          </MenuButton>
          <MenuList>
            {productLines &&
              productLines.map((p) => (
                <React.Fragment key={p.guid}>
                  <MenuGroup title={p.name}>
                    {p.children.map((c) => (
                      <NextLink
                        key={c.guid}
                        href={`/product-lines/${p.name.replace(
                          / /g,
                          "-"
                        )}/offers/${c.name.replace(/ /g, "-")}`}
                      >
                        <MenuItem key={c.guid}>{c.name}</MenuItem>
                      </NextLink>
                    ))}
                  </MenuGroup>
                  <MenuDivider />
                </React.Fragment>
              ))}
          </MenuList>
        </Menu>
        <NextLink href="/contact" passHref>
          <Link px={4} fontSize="xl">
            Contact
          </Link>
        </NextLink>
        {username ? null : (
          <NextLink href="/register" passHref>
            <Link px={4} fontSize="xl">
              Register
            </Link>
          </NextLink>
        )}
        <UserButton
          username={username}
          buttonBgColor={headerNav.fields.buttonBgColor}
          buttonTextColor={headerNav.fields.buttonTextColor}
        />
      </Flex>
      <Flex
        direction="row"
        align="center"
        justify="space-around"
        display={{ base: "flex", lg: "none" }}
        p={0}
        color="black"
      >
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          ></MenuButton>
          <MenuList>
            <MenuItem>
              <NextLink href="#" passHref>
                <Link px={4} fontSize="xl">
                  For Business
                </Link>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <NextLink href="#" passHref>
                <Link px={4} fontSize="xl">
                  For Home
                </Link>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <NextLink href="#" passHref>
                <Link px={4} fontSize="xl">
                  Contact
                </Link>
              </NextLink>
            </MenuItem>
          </MenuList>
        </Menu>
        <UserButton
          username={username}
          buttonBgColor={headerNav.fields.buttonBgColor}
          buttonTextColor={headerNav.fields.buttonTextColor}
        />
      </Flex>
    </>
  );
};

export default Navigation;
