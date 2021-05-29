import { Badge, Wrap, WrapItem } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { DARK_GOLD } from "../utils/constants";

export default function QuoteStatus({ quote }) {
  return (
    <Wrap spacing={4} pb={4}>
      <WrapItem>
        <Tooltip hasArrow label="Quote Validity" bg={DARK_GOLD}>
          <Badge
            colorScheme={quote.currentValidation.valid ? "green" : "red"}
            variant="outline"
          >
            {quote.currentValidation.valid ? "Valid" : "Invalid"}
          </Badge>
        </Tooltip>
      </WrapItem>
      <WrapItem>
        <Tooltip hasArrow label="Quote Number" bg={DARK_GOLD}>
          <Badge colorScheme="telegram">{quote.quoteNumber}</Badge>
        </Tooltip>
      </WrapItem>

      <WrapItem>
        <Tooltip hasArrow label="Updated At" bg={DARK_GOLD}>
          <Badge colorScheme="telegram" variant="subtle">
            {new Date(Date.parse(quote.updated)).toDateString()}
          </Badge>
        </Tooltip>
      </WrapItem>
    </Wrap>
  );
}
