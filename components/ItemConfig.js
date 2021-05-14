import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Checkbox } from "@chakra-ui/checkbox";
import { Box, Heading, List, Text } from "@chakra-ui/layout";
import { useState } from "react";
import ConfigList from "./ConfigList";
import ChildEntity from "./ChildEntity";
import renderEntities from "../utils/renderEntities";
import SelectInput from "./SelectInput";

const ItemConfig = ({ item, metaType }) => {
  const productComponents = item.prePricedCandidate.ChildEntity.filter(
    (c) => c.ChildEntity.length !== 0
  );
  console.log(item);
  console.log(productComponents);

  return (
    <>
      <Box w="80%" mx="auto">
        <Heading as="h3">{item.offerSpecification.name}</Heading>
        <Text as="p">{item.offerSpecification.description}</Text>
        {item.prePricedCandidate.ChildEntity.map((c, index) => (
          <Box key={c.ID}>
            {c.Rate ? (
              <Heading as="h4" size="sm">
                {item.metaTypeLookup[c.EntityID].name}:
                {c.Rate.Type === "NR_Cost_Based_Rate" || "NC_Cost_Based_Rate"
                  ? `${c.Rate.Value} Non Recurring`
                  : `${c.Rate.Value} Recurring`}
              </Heading>
            ) : (
              <Heading as="h2" size="md">
                {item.metaTypeLookup[c.EntityID].name}
              </Heading>
            )}
            {item.offerSpecification.productToProduct[index]
              ? item.offerSpecification.productToProduct[
                  index
                ].product.commercialSpecCharUse?.map((char) => {
                  return (
                    <SelectInput
                      options={char.characteristic.characteristicCharValue}
                      key={char.id}
                      id={char.id}
                      label={char.description}
                    />
                  );
                })
              : null}

            {/* <List>
              {
                item.offerSpecification.productToProduct[index] &&
                c.ChildEntity.length !== 0
                  ? renderEntities({
                      entity: c.ChildEntity.filter(
                        (e, index) => e.ChildEntity.length !== 0
                      ),
                      metaType,
                      product:
                        item.offerSpecification.productToProduct[index].product
                          .productToProduct,
                    })
                  : null
                // renderEntities({
                //     entity: c.ChildEntity.filter(
                //       (e, index) => e.ChildEntity.length !== 0
                //     ),
                //     metaType,
                //     product: [],
                //   })
              }
            </List> */}
          </Box>
        ))}
        <List>
          {renderEntities({
            entity: productComponents[0].ChildEntity,
            metaType,
            product:
              item.offerSpecification.productToProduct[0].product
                .productToProduct,
          })}
        </List>
      </Box>
    </>
  );
};

export default ItemConfig;
