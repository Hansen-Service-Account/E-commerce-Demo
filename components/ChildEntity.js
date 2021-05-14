import { Checkbox } from "@chakra-ui/checkbox";
import { Box, ListItem, List, Badge, Text } from "@chakra-ui/layout";
import renderEntities from "../utils/renderEntities";
import SelectInput from "./SelectInput";

const ChildEntity = ({ entity, metaType, product, type }) => {
  const renderSelectInput = (product) => {
    if (!product) return null;
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
              options={[]}
              key={char.id}
              id={char.id}
              label={char.name}
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
            key={char.id}
            id={char.id}
            label={char.characteristic.name}
          />
        );
      });
    }
    if (product.product.subscriptionMonth) {
      product.product.subscriptionMonth.map((sub) => {
        inputs.push(
          <SelectInput
            options={sub.values}
            key={sub.id}
            id={sub.id}
            label={sub.displayName}
          />
        );
      });
    }

    if (product.product.simCardPlan) {
      product.product.simCardPlan.map((sim) => {
        inputs.push(
          <SelectInput
            options={sim.values}
            key={sim.id}
            id={sim.id}
            label={sim.displayName}
          />
        );
      });
    }

    if (product.product.storageSize) {
      product.product.storageSize.map((sto) => {
        inputs.push(
          <SelectInput
            options={sto.values}
            key={sto.id}
            id={sto.id}
            label={sto.displayName}
          />
        );
      });
    }

    return inputs;
  };
  return (
    <>
      <ListItem my={4}>
        {/* {metaType[entity.EntityID].pattern === "Component" && ( */}
        {(metaType[entity.EntityID].pattern === "Component" ||
          metaType[entity.EntityID].pattern ===
            "Customer_Facing_Service_Component") && (
          <Checkbox>{metaType[entity.EntityID].name}</Checkbox>
        )}
        {(metaType[entity.EntityID].pattern === "Recurring_Charge" ||
          metaType[entity.EntityID].pattern === "Non_Recurring_Charge" ||
          metaType[entity.EntityID].pattern === "RecCostBasedChrg") &&
          entity.Rate && (
            <Badge
              colorScheme={
                metaType[entity.EntityID].pattern === "Recurring_Charge"
                  ? "cyan"
                  : "orange"
              }
            >
              {metaType[entity.EntityID].name}
            </Badge>
          )}
        {metaType[entity.EntityID].pattern === "Recurring_Charge" ||
        metaType[entity.EntityID].pattern === "RecCostBasedChrg" ? (
          <Text as="span">
            {entity.Rate && entity.Rate.Value} {entity.Periodicity}
          </Text>
        ) : null}
        {metaType[entity.EntityID].pattern === "Non_Recurring_Charge" &&
          entity.Rate && (
            <Text as="span">{entity.Rate && entity.Rate.Value} Upfront</Text>
          )}
        <Box w="80%" mx="auto" my={4}>
          {renderSelectInput(product)}
        </Box>
        {metaType[entity.EntityID].pattern === "Component" &&
          entity.ChildEntity && (
            <List w="80%" mx="auto" my={4}>
              {product
                ? renderEntities({
                    entity: entity.ChildEntity,
                    metaType,
                    product: product.product.productToProduct,
                  })
                : renderEntities({
                    entity: entity.ChildEntity,
                    metaType,
                    product: [],
                  })}
            </List>
          )}
      </ListItem>
    </>
  );
};

export default ChildEntity;
