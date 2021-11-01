import { Badge, Flex, Heading, List, ListItem } from "@chakra-ui/layout";
import { DARK_GOLD } from "../utils/constants";
import NextLink from "next/link";
import { IconButton } from "@chakra-ui/button";
import { CloseIcon, Icon } from "@chakra-ui/icons";
import { Divider } from "@chakra-ui/layout";
import { IoIosCloseCircle } from "react-icons/io";
import { useRouter } from "next/router";

const CartItem = ({ item, deleteItem, onClose }) => {
  const { ItemisedPricingSummary } = item.currentPricing.Pricing;
  const { metaTypeLookup } = item;
  const router = useRouter();
  console.log(item);
  return (
    <Flex
      direction="column"
      p={2}
      borderRadius={4}
      border="2px"
      borderColor={DARK_GOLD}
      position="relative"
    >
      <Flex
        align="center"
        justify="space-between"
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        onClick={() => {
          onClose();
          router.push(`/quote/items/${item.id}`);
        }}
      >
        <Heading as="h4" color={DARK_GOLD} size="sm" bg="white">
          {item.name}
        </Heading>
        <Badge colorScheme={item.currentValidation.valid ? "green" : "red"}>
          {item.currentValidation.valid ? "Valid" : "Invalid"}
        </Badge>
      </Flex>

      <Divider my={1} />
      <List>
        {ItemisedPricingSummary.map((p) => {
          if (p.NonRecurring)
            return (
              <ListItem key={p.EntityID} fontSize="14px">
                {p.NonRecurring.ItemCharge
                  ? `${metaTypeLookup[p.EntityID].name}: $${
                      p.NonRecurring && p.NonRecurring.ItemCharge
                    }`
                  : ""}
              </ListItem>
            );
        })}
      </List>
      <List>
        {ItemisedPricingSummary.map((p) => {
          if (p.Recurring)
            return (
              <ListItem key={p.EntityID} fontSize="14px">
                {p.Recurring.Monthly.ItemCharge
                  ? `${metaTypeLookup[p.EntityID].name}: $${
                      p.Recurring.Monthly.ItemCharge
                    }`
                  : ""}
              </ListItem>
            );
        })}
      </List>
      <Icon
        color="red"
        position="absolute"
        transform="translate(50%,50%)"
        bottom="0"
        right="0"
        bg="white"
        p={0}
        w={6}
        h={6}
        cursor="pointer"
        _hover={{ color: "black" }}
        onClick={() => deleteItem(item.id)}
        as={IoIosCloseCircle}
      />
    </Flex>
  );
};

export default CartItem;
