import { Menu, MenuItem, MenuButton, MenuList, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { isServer } from "../utils/isServer";

export default function UserButton({ isLargerThan1024 }) {
  return (
    <Menu>
      <MenuButton
        mx={isLargerThan1024 || isServer() ? 8 : 2}
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
  );
}
