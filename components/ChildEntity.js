import { Accordion } from "@chakra-ui/accordion";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  ListItem,
  List,
  Badge,
  Text,
  Heading,
  VStack,
  StackDivider,
  Flex,
} from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Collapse } from "@chakra-ui/transition";
import { useState } from "react";
import usePhoneNumber from "../hooks/usePhoneNumber";
import { DARK_GOLD } from "../utils/constants";
import renderEntities from "../utils/renderEntities";
import SelectInput from "./SelectInput";

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
  const toast = useToast();

  const renderSelectInput = (product, productCandidate, parentEntity) => {
    const inputs = [];
    if (
      product.product.commercialUserDefinedChar &&
      product.product.commercialUserDefinedChar.length > 0
    ) {
      product.product.commercialUserDefinedChar.map((char) => {
        if (
          char.cpqBehavior &&
          (char.cpqBehavior[0].externalCaptureGrp ||
            char.cpqBehavior[0].isPrimary)
        ) {
          inputs.push(
            <SelectInput
              options={
                char.name === "Phone Number"
                  ? phoneNumber
                  : char.name === "Serial ID"
                  ? serialNumber
                  : []
              }
              name={char.meta.elementName}
              key={char.id}
              id={char.characteristic.id}
              label={char.name}
              required={char.minOccurs !== 0}
              submittedError={submittedError}
              onChange={(e) => {
                console.log(productCandidate);
                const result = onChange(e, parentEntity);
                setState({ ...result });
              }}
              parentEntity={parentEntity}
              setState={setState}
              value={
                productCandidate &&
                productCandidate.ConfiguredValue.find((c) => {
                  console.log(productCandidate);
                  return c.CharacteristicID === char.characteristic.id;
                }) &&
                productCandidate.ConfiguredValue.find(
                  (c) => c.CharacteristicID === char.characteristic.id
                ).Value[0].Value
              }
            />
          );
        }
      });
    }
    if (product.product.commercialSpecCharUse) {
      product.product.commercialSpecCharUse.map((char) => {
        inputs.push(
          <SelectInput
            options={char.characteristic.characteristicCharValue}
            name={char.meta.elementName}
            key={char.id}
            id={char.characteristic.id}
            label={char.characteristic.name}
            required={char.minOccurs !== 0}
            submittedError={submittedError}
            onChange={(e) => {
              console.log(productCandidate);
              const result = onChange(e, parentEntity);
              setState({ ...result });
            }}
            parentEntity={parentEntity}
            setState={setState}
            value={
              productCandidate &&
              productCandidate.CharacteristicUse.find((c) => {
                return c.CharacteristicID === char.characteristic.id;
              }) &&
              productCandidate.CharacteristicUse.find(
                (c) => c.CharacteristicID === char.characteristic.id
              ).Value[0].ValueID
            }
          />
        );
      });
    }
    if (product.product.subscriptionMonth) {
      product.product.subscriptionMonth.map((sub) => {
        inputs.push(
          <SelectInput
            options={sub.values}
            name={sub.meta.elementName}
            key={sub.id}
            id={sub.id}
            label={sub.displayName}
            required={sub.minOccurs !== 0}
            submittedError={submittedError}
            onChange={(e) => {
              const result = onChange(e, parentEntity);
              setState({ ...result });
            }}
            setState={setState}
            value={
              productCandidate &&
              productCandidate.CharacteristicUse.find(
                (c) => c.CharacteristicID === sub.id
              ) &&
              productCandidate.CharacteristicUse.find(
                (c) => c.CharacteristicID === sub.id
              ).Value[0].ValueID
            }
          />
        );
      });
    }

    if (product.product.simCardPlan) {
      product.product.simCardPlan.map((sim) => {
        inputs.push(
          <SelectInput
            options={sim.values}
            name={sim.meta.elementName}
            key={sim.id}
            id={sim.id}
            label={sim.displayName}
            required={sim.minOccurs !== 0}
            submittedError={submittedError}
            onChange={(e) => {
              const result = onChange(e, parentEntity);
              setState({ ...result });
            }}
            setState={setState}
            value={
              productCandidate &&
              productCandidate.CharacteristicUse.find(
                (c) => c.CharacteristicID === sim.id
              ) &&
              productCandidate.CharacteristicUse.find(
                (c) => c.CharacteristicID === sim.id
              ).Value[0].ValueID
            }
          />
        );
      });
    }

    if (product.product.storageSize) {
      product.product.storageSize.map((sto) => {
        inputs.push(
          <SelectInput
            options={sto.values}
            name={sto.meta.elementName}
            key={sto.id}
            id={sto.id}
            label={sto.displayName}
            required={sto.minOccurs !== 0}
            submittedError={submittedError}
            onChange={(e) => {
              const result = onChange(e, parentEntity);
              setState({ ...result });
            }}
            setState={setState}
            value={
              productCandidate &&
              productCandidate.CharacteristicUse.find(
                (c) => c.CharacteristicID === sto.id
              ) &&
              productCandidate.CharacteristicUse.find(
                (c) => c.CharacteristicID === sto.id
              ).Value[0].ValueID
            }
          />
        );
      });
    }

    return inputs;
  };

  const isComponent = (pattern) => {
    return (
      pattern === "Component" ||
      pattern === "Product_Specification" ||
      pattern === "Component_Group"
      // ||
      // pattern === "Customer_Facing_Service_Component"
    );
  };

  const isCharge = (pattern) => {
    return (
      pattern === "Recurring_Charge" ||
      pattern === "Non_Recurring_Charge" ||
      pattern === "RecCostBasedChrg"
    );
  };

  const isRecurring = (pattern) => {
    return pattern === "Recurring_Charge" || pattern === "RecCostBasedChrg";
  };

  const isNonRecurring = (pattern) => {
    return pattern === "Non_Recurring_Charge";
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
                if (entity.minOccurs !== "0") {
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
                console.log(parentEntity);
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
                {entity.product.productToCharge &&
                  entity.product.productToCharge.map((ptc) => (
                    <Badge
                      key={ptc.id}
                      mx={4}
                      colorScheme={
                        ptc.charge.meta.pattern === "Recurring_Charge"
                          ? "cyan"
                          : "orange"
                      }
                    >
                      {ptc.charge.name}:{" "}
                      {ptc.charge.chargePeriodicity &&
                        ptc.charge.chargePeriodicity.map((period) => (
                          <Text key={period.id} ml={2} as="span">
                            {period.name}
                          </Text>
                        ))}
                    </Badge>
                  ))}
                {entity.minOccurs !== "0" ||
                (parentEntity &&
                  parentEntity.ChildEntity.find(
                    (ce) => ce.EntityID === entity.product.id
                  )) ? (
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
          {(renderSelectInput(entity, productCandidate, productCandidate)
            .length !== 0 ||
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
                {renderSelectInput(entity, productCandidate, productCandidate)}
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

      {/* // <AccordionItem py={2}>
        //   {({ isExpanded }) => (
        //     <>
        //       <h2 name={entity.product.id}>
        //         <AccordionButton
        //           bg={color}
        //           name={entity.product.id}
        //           onClick={(e) => {
        //             if (entity.minOccurs !== "0") return;
        //             const result = handleChoose(e, parentEntity);
        //             console.log(result);
        //             setState({ ...result });
        //           }}
        //         >
        //           <Text
        //             flex="1"
        //             textAlign="left"
        //             fontWeight="bold"
        //             name={entity.product.id}
        //           >
        //             {entity.product.name}
        //             {entity.product.productToCharge &&
        //               entity.product.productToCharge.map((ptc) => (
        //                 <Text as="span" key={ptc.id} mx={2}>
        //                   <Badge
        //                     colorScheme={
        //                       ptc.charge.meta.pattern === "Recurring_Charge"
        //                         ? "cyan"
        //                         : "orange"
        //                     }
        //                   >
        //                     {ptc.charge.name}:{" "}
        //                     {ptc.charge.chargePeriodicity &&
        //                       ptc.charge.chargePeriodicity.map((period) => (
        //                         <Text key={period.id} ml={2} as="span">
        //                           {period.name}
        //                         </Text>
        //                       ))}
        //                   </Badge>
        //                 </Text>
        //               ))}
        //           </Text>


        //           {entity.minOccurs !== "0" ||
        //           (parentEntity &&
        //             parentEntity.ChildEntity.find(
        //               (ce) => ce.EntityID === entity.product.id
        //             )) ? (
        //             <CheckCircleIcon color="red" fontSize="18px" />
        //           ) : (
        //             <CheckCircleIcon color="gray.300" fontSize="18px" />
        //           )}
        //         </AccordionButton>
        //       </h2>
        //       {(renderSelectInput(entity, productCandidate, productCandidate)
        //         .length !== 0 ||
        //         (entity.product.productToProduct &&
        //           entity.product.productToProduct.find((p) =>
        //             isComponent(p.product.meta.pattern)
        //           ))) && (
        //         <AccordionPanel p={0}>

        //           <Box w="90%" ml="auto" my={4}>
        //             {renderSelectInput(
        //               entity,
        //               productCandidate,
        //               productCandidate
        //             )}
        //           </Box>
        //           {isComponent(entity.product.meta.pattern) &&
        //             entity.product.productToProduct &&
        //             entity.product.productToProduct.length !== 0 && (
        //               <Accordion
        //                 w="90%"
        //                 ml="auto"
        //                 py={0}
        //                 allowMultiple
        //                 allowToggle
        //               >
        //                 {renderEntities({
        //                   entity: entity.product.productToProduct,
        //                   color: color === DARK_GOLD ? "lightcyan" : DARK_GOLD,
        //                   productCandidate:
        //                     (productCandidate &&
        //                       productCandidate.ChildEntity) ||
        //                     [],
        //                   parentEntity:
        //                     parentEntity &&
        //                     parentEntity.ChildEntity.find(
        //                       (ce) => ce.EntityID === entity.product.id
        //                     ),
        //                   onChange: onChange,
        //                   handleChoose: handleChoose,
        //                   phoneNumber,
        //                   serialNumber,
        //                   rootCandidate,
        //                   setState,
        //                 })}
        //               </Accordion>
        //             )}
        //         </AccordionPanel>
        //       )}
        //     </>
        //   )}
        // </AccordionItem> */}
    </>
  );
};

export default ChildEntity;
