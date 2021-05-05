import NextLink from "next/link";
import { HANSEN_RED } from "../utils/constants";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import UserButton from "./UserButton";
import { isServer } from "../utils/isServer";

const Navigation = ({ isLargerThan1024 }) => {
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
          <NextLink href="#" passHref>
            <Link px={4} fontSize="xl">
              For Business
            </Link>
          </NextLink>
          <NextLink href="#" passHref>
            <Link px={4} fontSize="xl">
              For Home
            </Link>
          </NextLink>
          <NextLink href="#" passHref>
            <Link px={4} fontSize="xl">
              Contact
            </Link>
          </NextLink>
          <UserButton isLargerThan1024={isLargerThan1024} />
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
            <UserButton isLargerThan1024={isLargerThan1024} />
          </Flex>
        </>
      )}
    </>
  );
};

export default Navigation;
