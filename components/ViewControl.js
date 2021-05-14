import { IconButton } from "@chakra-ui/button";
import { DragHandleIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";

const ViewControl = ({ viewMode, setViewMode }) => {
  return (
    <Flex justifyContent="center">
      <Tooltip
        hasArrow
        label="List View"
        bg="gray.300"
        color="black"
        placement="left"
      >
        <IconButton
          icon={<HamburgerIcon />}
          onClick={() => setViewMode("listview")}
          bg={viewMode === "listview" ? "#b39573" : "gray.100"}
          mx={2}
          display={{ base: "none", lg: "block" }}
        />
      </Tooltip>
      <Tooltip
        hasArrow
        label="Card View"
        bg="gray.300"
        color="black"
        placement="right"
      >
        <IconButton
          icon={<DragHandleIcon />}
          onClick={() => setViewMode("cardview")}
          bg={viewMode === "cardview" ? "#b39573" : "gray.100"}
          mx={2}
        />
      </Tooltip>
    </Flex>
  );
};

export default ViewControl;
