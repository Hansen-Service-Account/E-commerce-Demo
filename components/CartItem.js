import { Flex, Heading, List, ListItem } from "@chakra-ui/layout";
import { DARK_GOLD } from "../utils/constants";
import NextLink from "next/link";
import { IconButton } from "@chakra-ui/button";
import { CloseIcon } from "@chakra-ui/icons";

const CartItem = ({ item, deleteItem }) => {
  return (
    <Flex direction="column">
      <NextLink href={`/quote/items/${item.id}`}>
        <Heading as="h4" size="sm" bg={DARK_GOLD}>
          {item.name}
        </Heading>
      </NextLink>
      <List>
        {item.currentPricing.Pricing.ItemisedPricingSummary.map((p) => (
          <ListItem key={p.EntityID}>{`${
            item.metaTypeLookup[p.EntityID].name
          }:${p.NonRecurring?.ItemCharge}`}</ListItem>
        ))}
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
