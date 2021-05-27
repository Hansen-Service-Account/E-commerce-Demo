import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Badge,
  Text,
  VStack,
  StackDivider,
  Flex,
} from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Collapse } from "@chakra-ui/transition";
import { DARK_GOLD } from "../utils/constants";
import renderEntities from "../utils/renderEntities";
import renderSelectInputs from "../components/renderSelectInputs";

const ChildEntity = ({
  entity,
  color,
  parentEntity,
  onChange,
  productCandidate,
  handleChoose,
  rootCandidate,
  setState,
  phoneNumber,
  serialNumber,
  submittedError,
}) => {
  //Set up toaster for the item configurations
  const toast = useToast();

  /*Function used to check if the entity product is a component or not
  @param {string} pattern: The pattern of the entity
  */
  const isComponent = (pattern) => {
    return (
      pattern === "Component" ||
      pattern === "Product_Specification" ||
      pattern === "Component_Group" ||
      pattern === "Customer_Facing_Service_Component" ||
      pattern === "Customer_Facing_Service_Component_Group"
    );
  };

  return (
    <>
      {isComponent(entity.product.meta.pattern) && (
        <>
          <Box>
            <Flex
              textAlign="left"
              justifyContent="space-between"
              alignItems="center"
              bg={color}
              p={3}
              borderRadius={4}
              id={entity.product.id}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              onClick={(e) => {
                // if (entity.minOccurs !== "0") {
                //   toast({
                //     title: "Operation Prohibited.",
                //     description: "You cannot deselect a package item.",
                //     status: "warning",
                //     duration: 2000,
                //     isClosable: true,
                //     position: "top",
                //   });
                //   return;
                // }
                const result = handleChoose(e, parentEntity);
                setState({ ...result });
              }}
            >
              <Text
                as="span"
                size="lg"
                fontWeight="bold"
                id={entity.product.id}
              >
                {entity.product.name}
              </Text>
              <Flex alignItems="center">
                <Flex alignItems="center" flexWrap="wrap">
                  {entity.product.productToCharge &&
                    entity.product.productToCharge.map((ptc) => (
                      <Badge
                        key={ptc.id}
                        mx={4}
                        my={1}
                        colorScheme={
                          ptc.charge.chargePeriodicity ? "cyan" : "orange"
                        }
                      >
                        {ptc.charge.name}
                        {ptc.charge.chargePeriodicity &&
                          ptc.charge.chargePeriodicity.map((period) => (
                            <Text key={period.id} ml={2} as="span">
                              : {period.name}
                            </Text>
                          ))}
                      </Badge>
                    ))}
                </Flex>
                {parentEntity &&
                parentEntity.ChildEntity.find(
                  (ce) => ce.EntityID === entity.product.id
                ) ? (
                  <CheckCircleIcon
                    id={entity.product.id}
                    color="red"
                    fontSize="18px"
                  />
                ) : (
                  <CheckCircleIcon
                    id={entity.product.id}
                    color="gray.300"
                    fontSize="18px"
                  />
                )}
              </Flex>
            </Flex>
          </Box>
          {(renderSelectInputs(
            entity,
            productCandidate,
            onChange,
            setState,
            submittedError,
            phoneNumber,
            serialNumber
          ).length !== 0 ||
            (entity.product.productToProduct &&
              entity.product.productToProduct.find((p) =>
                isComponent(p.product.meta.pattern)
              ))) && (
            <Collapse
              p={0}
              name={entity.product.id}
              in={
                parentEntity &&
                parentEntity.ChildEntity.find(
                  (ce) => ce.EntityID === entity.product.id
                )
              }
            >
              <Box w="90%" ml="auto" my={4}>
                {parentEntity &&
                  parentEntity.ChildEntity.find(
                    (ce) => ce.EntityID === entity.product.id
                  ) &&
                  renderSelectInputs(
                    entity,
                    productCandidate,
                    onChange,
                    setState,
                    submittedError,
                    phoneNumber,
                    serialNumber
                  )}
              </Box>
              {isComponent(entity.product.meta.pattern) &&
                entity.product.productToProduct &&
                entity.product.productToProduct.length !== 0 && (
                  <VStack
                    w="90%"
                    ml="auto"
                    py={0}
                    divider={<StackDivider borderColor="gray.200" />}
                    align="stretch"
                  >
                    {renderEntities({
                      entity: entity.product.productToProduct,
                      color: color === DARK_GOLD ? "lightcyan" : DARK_GOLD,
                      productCandidate:
                        (productCandidate && productCandidate.ChildEntity) ||
                        [],
                      parentEntity:
                        parentEntity &&
                        parentEntity.ChildEntity.find(
                          (ce) => ce.EntityID === entity.product.id
                        ),
                      onChange: onChange,
                      handleChoose: handleChoose,
                      phoneNumber,
                      serialNumber,
                      rootCandidate,
                      setState,
                      submittedError,
                    })}
                  </VStack>
                )}
            </Collapse>
          )}
        </>
      )}
    </>
  );
};

export default ChildEntity;
