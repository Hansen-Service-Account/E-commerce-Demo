import { renderItem } from "../utils/renderItem";
import { Box, Flex, Text, Collapse, useToast } from "@chakra-ui/react";
import { DARK_GOLD } from "../utils/constants";
import { renderInputs } from "../utils/renderInputs";
import { CheckCircleIcon } from "@chakra-ui/icons";

const EntityConfig = ({
  color,
  itemSpec,
  entityHash,
  parentEntity,
  setState,
  handleChoose,
  handleSelect,
  handleInput,
}) => {
  const currentEntity =
    itemSpec.compiledSpecification.entityContext[entityHash];
  if (!currentEntity) {
    return null;
  }
  if (currentEntity.currency) {
    return null;
  }
  if (currentEntity.isGrandfathered) {
    return null;
  }
  if (currentEntity.isUiFiltered === true) {
    return null;
  }

  const toast = useToast();

  return (
    <Box w="100%" ml="auto">
      <Flex
        textAlign="left"
        justifyContent="space-between"
        alignItems="center"
        bg={color === DARK_GOLD ? "lightcyan" : DARK_GOLD}
        p={3}
        mr="auto"
        my={2}
        borderRadius={4}
        id={currentEntity.entityId}
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        onClick={(e) => {
          if (currentEntity.minOccurs === 1) {
            toast({
              title: "Operation Prohibited.",
              description: "You cannot deselect a package item.",
              status: "warning",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            return;
          }
          const result = handleChoose(e, parentEntity);
          setState({ ...result });
        }}
      >
        <Text as="span" size="lg" fontWeight="bold" id={currentEntity.entityId}>
          {currentEntity.name} {currentEntity.minOccurs}
        </Text>
        {parentEntity &&
        parentEntity.ChildEntity.find(
          (ce) => ce.EntityID === currentEntity.entityId
        ) ? (
          <CheckCircleIcon
            id={currentEntity.entityId}
            color="red"
            fontSize="18px"
          />
        ) : (
          <CheckCircleIcon
            id={currentEntity.entityId}
            color="gray.300"
            fontSize="18px"
          />
        )}
      </Flex>
      <Collapse
        w="100%"
        direction="column"
        alignItems="flex-start"
        p={0}
        name={currentEntity.entityId}
        in={
          parentEntity &&
          parentEntity.ChildEntity.find(
            (ce) => ce.EntityID === currentEntity.entityId
          )
        }
      >
        {parentEntity &&
          renderInputs(
            currentEntity.characteristics,
            parentEntity.ChildEntity.find(
              (ce) => ce.EntityID === currentEntity.entityId
            )?.CharacteristicUse,
            parentEntity.ChildEntity.find(
              (ce) => ce.EntityID === currentEntity.entityId
            )?.ConfiguredValue,
            handleSelect,
            handleInput,
            parentEntity &&
              parentEntity.ChildEntity.find(
                (ce) => ce.EntityID === currentEntity.entityId
              ),
            setState
          )}
        <Flex w="90%" direction="column" ml="auto" my={4}>
          {currentEntity.children &&
            parentEntity &&
            renderItem({
              color: color === DARK_GOLD ? "lightcyan" : DARK_GOLD,
              itemSpec,
              entityHash: Object.keys(currentEntity.children),
              parentEntity:
                parentEntity.ChildEntity[
                  parentEntity.ChildEntity.findIndex(
                    (p) => p.EntityID === currentEntity.entityId
                  )
                ],
              setState,
              handleChoose,
              handleSelect,
              handleInput,
            })}
        </Flex>
      </Collapse>
    </Box>
  );
};

export default EntityConfig;
