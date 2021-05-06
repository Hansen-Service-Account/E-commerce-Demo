import { Menu, MenuItem, MenuButton, MenuList, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import useUser from "../utils/useUser";
import fetchJson from "../utils/fetchJson";
import NextLink from "next/link";

export default function UserButton({ isLargerThan1024, username }) {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    await fetchJson("/api/logout", { method: "POST" });
    router.push("/");
  };
  return (
    <>
      {username ? (
        <Menu>
          <MenuButton
            mx={isLargerThan1024 || isServer() ? 8 : 2}
            bg="#e32525"
            color="white"
            textTransform="uppercase"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            _hover={{ bg: "black" }}
            _active={{ bg: "black" }}
          >
            {username}
          </MenuButton>
          <MenuList>
            <NextLink href="/profile">
              <MenuItem>Profile</MenuItem>
            </NextLink>
            <MenuItem>Orders</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : router.pathname === "/login" ? null : (
        <Button
          mx={isLargerThan1024 || isServer() ? 8 : 2}
          bg="#e32525"
          color="white"
          _hover={{ bg: "black" }}
          _active={{ bg: "black" }}
          onClick={handleLogin}
        >
          Login
        </Button>
      )}
    </>
  );
}
