import NextLink from "next/link";
import { HANSEN_RED } from "../utils/constants";
import {
  background,
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

const Navigation = () => {
  const [isLargerThan1024] = useMediaQuery("(min-width:1024px)");
  console.log(isLargerThan1024);
  return (
    <>
      {isLargerThan1024 ? (
        <Flex
          direction="row"
          align="center"
          justify="space-around"
          bg="transparent"
          p={8}
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
          <Menu>
            <MenuButton
              mx={isLargerThan1024 ? 8 : 2}
              bg="#e32525"
              color="white"
              as={Button}
              rightIcon={<ChevronDownIcon />}
              _hover={{ bg: "black" }}
              _active={{ bg: "black" }}
            >
              JAKE
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Orders</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Box>
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
          <Menu>
            <MenuButton
              mx={isLargerThan1024 ? 8 : 2}
              bg="#e32525"
              color="white"
              as={Button}
              rightIcon={<ChevronDownIcon />}
              _hover={{ bg: "black" }}
              _active={{ bg: "black" }}
            >
              JAKE
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Orders</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      )}
    </>
  );
};

export default Navigation;
