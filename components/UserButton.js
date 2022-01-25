import { Menu, MenuItem, MenuButton, MenuList, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import useUser from "../utils/useUser";
import fetchJson from "../utils/fetchJson";
import NextLink from "next/link";

export default function UserButton({
  username,
  buttonBgColor,
  buttonTextColor,
}) {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    await fetchJson("/api/logout", { method: "POST" });
    router.push("/");
  };
  console.log(buttonBgColor);
  return (
    <>
      {username ? (
        <Menu>
          <MenuButton
            mx={{ base: 2, lg: 8 }}
            bg={buttonBgColor || "#e32525"}
            color={buttonTextColor || "white"}
            textTransform="uppercase"
            fontSize={{ base: "10px", sm: "16px" }}
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
            <NextLink href="/orders">
              <MenuItem>Orders</MenuItem>
            </NextLink>

            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : router.pathname === "/login" ? null : (
        <Button
          mx={{ base: 2, lg: 8 }}
          bg={buttonBgColor || "#e32525"}
          color={buttonTextColor || "white"}
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
