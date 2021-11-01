import NextLink from "next/link";
import {
  Box,
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
  useMediaQuery,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import UserButton from "./UserButton";
import { isServer } from "../utils/isServer";
import useProductLines from "../hooks/useProductLines";
import React from "react";

const Navigation = ({ isLargerThan1024, username }) => {
  const { productLines, isLoading, isError } = useProductLines();
  if (!isLoading) {
    console.log(productLines);
  }
  return (
    <>
      {isLargerThan1024 || isServer() ? (
        <Flex
          direction="row"
          align="center"
          justify="space-around"
          p={4}
          color="black"
        >
          {/* <NextLink href="/business-products" passHref>
            <Link px={4} fontSize="xl">
              For Business
            </Link>
          </NextLink>
          <NextLink href="/residential-products" passHref>
            <Link px={4} fontSize="xl">
              For Home
            </Link>
          </NextLink> */}
          <Menu>
            <MenuButton mx={4} as={Button} colorScheme="pink">
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
          <UserButton isLargerThan1024={isLargerThan1024} username={username} />
        </Flex>
      ) : (
        <>
          <Flex
            direction="row"
            align="center"
            justify="space-around"
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
              isLargerThan1024={isLargerThan1024}
              username={username}
            />
          </Flex>
        </>
      )}
    </>
  );
};

export default Navigation;
