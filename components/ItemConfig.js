import { Accordion } from "@chakra-ui/accordion";
import { Button } from "@chakra-ui/button";
import { Badge, StackDivider, VStack } from "@chakra-ui/layout";
import { Box, Heading, List, Text } from "@chakra-ui/layout";
import { toast, useToast } from "@chakra-ui/toast";
import { useState } from "react";
import usePhoneNumber from "../hooks/usePhoneNumber";
import useSerialNumber from "../hooks/useSerialNumber";
import useQuote from "../hooks/useQuote";
import { DARK_GOLD, HANSEN_CPQ_BASE_URL } from "../utils/constants";
import renderEntities from "../utils/renderEntities";
import SelectInput from "./SelectInput";

const ItemConfig = ({ item, quoteId }) => {
  console.log(item);

  //Destructure the quote item for object operations
  const {
    offerSpecification: {
      //Basic information about the item
      name,
      description,

      //The sub entities and all related configurations
      productToProduct: subConfigurations,

      //The charges which will incurr for the item and the sub entities
      productToCharge: rootCharges,
    },

    //Metadata and type information lookup for entities using entity IDs
    metaTypeLookup,

    //Contains the default entities selected for the package/bundle
    productCandidate,
  } = item;

  //Set up toaster for the item configurations
  const toast = useToast();

  //Load the phone numbers for configuration
  const { phoneNumber, isLoading: phoneIsLoading } = usePhoneNumber(quoteId);

  //Load the serial numbers for configuration
  const { serialNumber, isLoading: serialIsLoading } = useSerialNumber(quoteId);

  //Use mutateQuote provided by SWR to revalidate quote data after http PUT
  const { mutateQuote } = useQuote(quoteId);

  //Keep a copy of the initial productCandidate in the component's state
  const [configuredItem, setConfiguredItem] = useState({ ...productCandidate });

  //TBD, state to keep error status (only TRUE/FALSE for now) upon submission for review (evaluateRules endpoint)
  const [submittedError, setSubmittedError] = useState(false);

  //State to track if API calls are in progress, used to show spinners and etc.
  const [reviewing, setReviewing] = useState(false);

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

  const handleChoose = (e, parentEntity) => {
    console.log(e);
    //If the selected entity already exists as one of the child entities, remove it.
    if (
      parentEntity.ChildEntity.find((c) => c.EntityID === e.currentTarget.id)
    ) {
      const index = parentEntity.ChildEntity.findIndex(
        (ce) => ce.EntityID === e.currentTarget.id
      );
      parentEntity.ChildEntity.splice(index, 1);
      console.log(configuredItem);
      return configuredItem;
      //If the selected entity does not exist as one of the child entities, add to the array.
    } else {
      const obj = {
        EntityID: e.currentTarget.id,
        ItemSource: "cpq",
        CharacteristicUse: [],
        RateAttribute: [],
        ConfiguredValue: [],
        LinkedEntity: [],
        ChildEntity: [],
      };
      console.log(obj);
      parentEntity.ChildEntity.push(obj);
      console.log(parentEntity.ChildEntity);
      console.log(configuredItem);
      return configuredItem;
    }
  };

  const handleReview = async (quoteId, itemId, candidate) => {
    try {
      const res = await fetch(
        `${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/items/${itemId}/evaluateRules`,
        {
          method: "POST",
          body: JSON.stringify(candidate),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await res.json();
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (quoteId, itemId, candidate) => {
    try {
      const res = await (
        await fetch(
          `${HANSEN_CPQ_BASE_URL}/quotes/${quoteId}/items/${itemId}`,
          {
            method: "PUT",
            body: JSON.stringify(candidate),
            headers: { "Content-Type": "application/json" },
          }
        )
      ).json();
      console.log(res);
      mutateQuote();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box w="80%" mx="auto">
        <Heading as="h3">{name}</Heading>
        <Text as="p">{description}</Text>
        <Box>
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
        </Box>

        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          align="stretch"
        >
          {renderEntities({
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
          })}
        </VStack>

        <Button
          onClick={async () => {
            setReviewing(true);
            const submissionResult = await handleReview(quoteId, item.id, {
              ...item,
              productCandidate: configuredItem,
            });

            setReviewing(false);
            if (!submissionResult.currentValidation.valid) {
              toast({
                title: "Review error",
                description:
                  "Item configuration failed, please re-check your options.",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
              setSubmittedError(true);
            } else {
              toast({
                title: "Reviewed successfully",
                description:
                  "Item configured successful, your cart has been updated.",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
              setSubmittedError(false);
              handleUpdate(quoteId, item.id, submissionResult);
            }
          }}
          isLoading={reviewing}
        >
          Review
        </Button>
      </Box>
    </>
  );
};

export default ItemConfig;
