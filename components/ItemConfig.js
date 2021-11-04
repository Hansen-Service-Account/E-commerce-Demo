import { Button } from "@chakra-ui/button";
import { Badge, StackDivider, VStack } from "@chakra-ui/layout";
import { Box, Heading, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import usePhoneNumber from "../hooks/usePhoneNumber";
import useSerialNumber from "../hooks/useSerialNumber";
import useQuote from "../hooks/useQuote";
import { DARK_GOLD, HANSEN_CPQ_V2_BASE_URL } from "../utils/constants";
import { renderItem } from "../utils/renderItem";
import useItem from "../hooks/useItem";
import ErrorPrompt from "./ErrorPrompt";
import fetcher from "../utils/fetchJson";
import ErrorToast from "./ErrorToast";
import { filterUnsupportedProperty } from "../utils/filterProperty";

const ItemConfig = ({ item, quoteId, setAdding, adding, itemSpec }) => {
  const [errors, setErrors] = useState([]);

  //Destructure the quote item for object operations
  const {
    name,
    description,
    metaTypeLookup,
    //Contains the default entities selected for the package/bundle
    productCandidate,
  } = item;

  //Set up toaster for the item configurations
  const toast = useToast();

  //Use mutateQuote provided by SWR to revalidate quote data after http PUT
  const { mutateQuote } = useQuote(quoteId);

  const { mutateItem } = useItem(quoteId, item.id);

  //Keep a copy of the initial productCandidate in the component's state
  const [configuredItem, setConfiguredItem] = useState({ ...productCandidate });

  //TBD, state to keep error status (only TRUE/FALSE for now) upon submission for review (evaluateRules endpoint)
  const [submittedError, setSubmittedError] = useState(false);

  const handleNumChange = (value, parentEntity) => {
    parentEntity.UnitQuantity = value;
    return configuredItem;
  };

  const handleInput = (e, parentEntity) => {
    if (
      parentEntity.ConfiguredValue.find(
        (c) => c.CharacteristicID === e.target.id
      )
    ) {
      const index = parentEntity.ConfiguredValue.findIndex(
        (c) => c.CharacteristicID === e.target.id
      );
      parentEntity.ConfiguredValue.splice(index, 1, {
        UseArea: e.target.name,
        CharacteristicID: e.target.id,
        Action: "modify",
        Value: [{ Value: e.target.value }],
      });
    } else {
      parentEntity.ConfiguredValue.push({
        UseArea: e.target.name,
        CharacteristicID: e.target.id,
        Action: "modify",
        Value: [{ Value: e.target.value }],
      });
    }
    return configuredItem;
  };

  /*Onchange function that handles select input changes
  @param {object} e: Event that occurred
  @param {object} parentEntity: The entity that characteristic belongs to
  */
  const handleSelect = (e, parentEntity) => {
    //If the select input is NOT commercial user defined characteristics such as 'Phone number', 'Serial number' and etc.
    if (e.target.name !== "Commercial_UserDefinedChar") {
      //If the select input configuration already exists under its parent entity's CharacteristicUse property, DIRECTLY change the parent entity object (piece of the 'configuredItem' state)
      if (
        parentEntity.CharacteristicUse.find(
          (c) => c.CharacteristicID === e.target.id
        )
      ) {
        const index = parentEntity.CharacteristicUse.findIndex(
          (c) => c.CharacteristicID === e.target.id
        );
        parentEntity.CharacteristicUse.splice(index, 1, {
          UseArea: e.target.name,
          CharacteristicID: e.target.id,
          ItemSource: "cpq",
          Value: [{ ValueID: e.target.value }],
        });
      }

      //If the select input configuration does NOT exist under its parent entity, DIRECTLY change the parent entity object (piece of the 'configuredItem' state)
      else {
        parentEntity.CharacteristicUse.push({
          UseArea: e.target.name,
          CharacteristicID: e.target.id,
          ItemSource: "cpq",
          Value: [{ ValueID: e.target.value }],
        });
      }
    }
    //If the select input is commercial user defined characteristics such as 'Phone number', 'Serial number' and etc.
    else {
      //If the select input configuration already exists under its parent entity's ConfiguredValue property, DIRECTLY change the parent entity object (piece of the 'configuredItem' state)
      if (
        parentEntity.ConfiguredValue.find(
          (c) => c.CharacteristicID === e.target.id
        )
      ) {
        const index = parentEntity.ConfiguredValue.findIndex(
          (c) => c.CharacteristicID === e.target.id
        );
        parentEntity.ConfiguredValue.splice(index, 1, {
          UseArea: e.target.name,
          CharacteristicID: e.target.id,
          //UserID needs clarification
          UserID: "caebf2c0-fb08-470c-955f-832d473c7a08",
          ItemSource: "cpq",
          Value: [{ Value: e.target.value }],
        });
      }

      //If the select input configuration does NOT exist under its parent entity, DIRECTLY change the parent entity object (piece of the 'configuredItem' state)
      else {
        parentEntity.ConfiguredValue.push({
          UseArea: e.target.name,
          CharacteristicID: e.target.id,
          UserID: "caebf2c0-fb08-470c-955f-832d473c7a08",
          ItemSource: "cpq",
          Value: [{ Value: e.target.value }],
        });
      }
    }
    //Return the whole state for the caller to call setState on
    return configuredItem;
  };

  /*Onclick function that handles selection of entities
  @param {object} e: Event that occurred
  @param {object} parentEntity: The parent entity that clicked entity belongs to
  */
  const handleChoose = (e, parentEntity) => {
    //If the selected entity already exists as one of the child entities of the parent entity, DIRECTLY remove it from the parent object (piece of the 'configuredItem' state).
    if (
      parentEntity.ChildEntity.find((c) => c.EntityID === e.currentTarget.id)
    ) {
      const index = parentEntity.ChildEntity.findIndex(
        (ce) => ce.EntityID === e.currentTarget.id
      );
      parentEntity.ChildEntity.splice(index, 1);
    }
    //If the selected entity does NOT exist as one of the child entities of the parent entity, DIRECTLY add to the parent object (piece of the 'configuredItem' state).
    else {
      const obj = {
        EntityID: e.currentTarget.id,
        ItemSource: "cpq",
        CharacteristicUse: [],
        RateAttribute: [],
        ConfiguredValue: [],
        LinkedEntity: [],
        ChildEntity: [],
      };
      parentEntity.ChildEntity.push(obj);
    }

    //Return the whole state for the caller to call setState on
    return configuredItem;
  };

  /*Function that handles item submission for review (evaluateRules endpoint)
  @param {string} quoteId: The quote's identifier
  @param {string} itemId: The quote item's identifier
  @param {object} item: The configured item to be submitted for review
  */
  const handleReview = async (quoteId, itemId, item) => {
    try {
      const res = await fetcher(
        `${HANSEN_CPQ_V2_BASE_URL}/validation/evaluateCompatibility/?quoteId=${quoteId}&quoteItemId=${itemId}`,
        {
          method: "POST",
          body: JSON.stringify(item.productCandidate),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  /*Function that handles item update after reviewed with no errors
  @param {string} quoteId: The quote's identifier
  @param {string} itemId: The quote item's identifier
  @param {object} item: The configured item to be sent for update
  */
  const handleUpdate = async (quoteId, itemId, item) => {
    try {
      const cleanedUpItem = { ...item };
      filterUnsupportedProperty(item.productCandidate);
      const res = await fetcher(
        `${HANSEN_CPQ_V2_BASE_URL}/quotes/${quoteId}/items/${itemId}?include=candidate`,
        {
          method: "PUT",
          body: JSON.stringify(cleanedUpItem),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      mutateItem();
      mutateQuote();
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  console.log(productCandidate, itemSpec);
  return (
    <>
      <Box w="90%" mx="auto" pt={8}>
        <Heading as="h3" mt={4} mb={8}>
          {name}
        </Heading>
        <Text as="p" my={4}>
          {description}
        </Text>
        <ErrorPrompt errors={errors} metaTypeLookup={metaTypeLookup} />
        {/* <Box pt={4}>

          {rootCharges &&
            rootCharges.map((r) => (
              <Badge
                my={4}
                key={r.id}
                colorScheme={
                  r.charge.meta.pattern === "Recurring_Charge"
                    ? "cyan"
                    : "orange"
                }
              >
                {r.charge.name}:{" "}
                {r.charge.chargePeriodicity &&
                  r.charge.chargePeriodicity.map((period) => (
                    <Text key={period.id} ml={2} as="span">
                      {period.name}
                    </Text>
                  ))}
              </Badge>
            ))}
        </Box> */}

        <VStack align="stretch">
          {/* {renderEntities({
            entity: subConfigurations,
            color: DARK_GOLD,
            parentEntity: configuredItem,
            productCandidate: configuredItem.ChildEntity,
            rootCandidate: configuredItem,
            onChange: handleSelect,
            handleChoose: handleChoose,
            setState: setConfiguredItem,
            phoneNumber: phoneIsLoading ? [] : phoneNumber,
            serialNumber: serialIsLoading ? [] : serialNumber,
            submittedError,
          })} */}
          {renderItem({
            itemSpec,
            entityHash: Object.keys(
              itemSpec.compiledSpecification.entityContext[
                itemSpec.compiledSpecification.rootHashPath
              ].children
            ),
            color: "lightcyan",
            parentEntity: configuredItem,
            setState: setConfiguredItem,
            handleChoose,
            handleSelect,
            handleInput,
            handleNumChange,
          })}
        </VStack>

        <Box textAlign="right" mt={8}>
          <Button
            colorScheme="teal"
            onClick={async () => {
              try {
                setAdding(true);
                const submissionResult = await handleReview(quoteId, item.id, {
                  ...item,
                  productCandidate: configuredItem,
                });
                setErrors([...submissionResult.validationResponse.errors]);

                //If the validation results in errors, toast about the error and set submittedError to true
                if (!submissionResult.validationResponse.valid) {
                  toast({
                    title: "Review error",
                    description:
                      "Item configuration failed, please re-check your options.",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                  });
                  window.scrollTo(0, 0);
                  setSubmittedError(true);
                }
                //If the validation results in no errors, toast about the success and set submitted Error to false. Proceed to update the item with the returned validated and priced item
                else {
                  toast({
                    title: "Reviewed successfully",
                    description:
                      "Item configured successful, your cart has been updated. Reloading the page.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                  });
                  setSubmittedError(false);
                  const updatedItem = {
                    ...item,
                    productCandidate: submissionResult.productCandidate,
                  };
                  await handleUpdate(quoteId, item.id, updatedItem);
                }

                setAdding(false);
              } catch (error) {
                setAdding(false);
                console.log(error);
                toast({
                  render: ({ id, onClose }) => (
                    <ErrorToast error={error} onClose={onClose} />
                  ),
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                });
                window.scrollTo(0, 0);
              }
            }}
            isLoading={adding}
          >
            Review
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ItemConfig;
