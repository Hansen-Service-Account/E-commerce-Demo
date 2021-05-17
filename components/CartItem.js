import { Flex, Heading, List, ListItem } from "@chakra-ui/layout";
import { DARK_GOLD } from "../utils/constants";
import NextLink from "next/link";
import { IconButton } from "@chakra-ui/button";
import { CloseIcon } from "@chakra-ui/icons";

const CartItem = ({ item, deleteItem }) => {
  const { ItemisedPricingSummary } = item.currentPricing.Pricing;
  const { metaTypeLookup } = item;
  return (
    <Flex direction="column">
      <NextLink href={`/quote/items/${item.id}`}>
        <Heading as="h4" size="sm" bg={DARK_GOLD}>
          {item.name}
        </Heading>
      </NextLink>
      <List>
        {ItemisedPricingSummary.map((p) => {
          if (p.NonRecurring)
            return (
              <ListItem key={p.EntityID}>
                {p.NonRecurring.ItemCharge
                  ? `${metaTypeLookup[p.EntityID].name}:${
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
              <ListItem key={p.EntityID}>
                {p.Recurring.Monthly.ItemCharge
                  ? `${metaTypeLookup[p.EntityID].name}:${
                      p.Recurring.Monthly.ItemCharge
                    }`
                  : ""}
              </ListItem>
            );
        })}
      </List>
      <Flex>
        <IconButton
          colorScheme="red"
          icon={<CloseIcon />}
          onClick={() => deleteItem(item.id)}
        />
      </Flex>
    </Flex>
  );
};

export default CartItem;
