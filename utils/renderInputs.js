import SelectInput from "../components/SelectInput";
import { TextInput } from "../components/TextInput";

export const renderInputs = (
  characteristics,
  characteristicUse,
  configuredValue,
  handleSelect,
  handleInput,
  parentEntity,
  setState
) => {
  if (!characteristics) return null;
  console.log(configuredValue);
  return Object.keys(characteristics).map((key) => {
    if (characteristics[key].isUiFiltered !== false) {
      return null;
    } else if (!characteristics[key].values) {
      return (
        <TextInput
          w="100%"
          my="10px"
          key={key}
          placeholder={
            characteristics[key].cpqBehavior
              ? characteristics[key].cpqBehavior.defaultValue
              : ""
          }
          label={
            characteristics[key].displayName || characteristics[key].useArea
          }
          id={characteristics[key].id}
          name={characteristics[key].useArea}
          value={
            !configuredValue
              ? ""
              : configuredValue.find(
                  (c) => c.CharacteristicID === characteristics[key].id
                )
              ? configuredValue.find(
                  (c) => c.CharacteristicID === characteristics[key].id
                ).Value[0].Value
              : characteristics[key].cpqBehavior
              ? characteristics[key].cpqBehavior.defaultValue
              : ""
          }
          onChange={(e) => {
            const result = handleInput(e, parentEntity);
            setState({ ...result });
          }}
        />
      );
    } else {
      return (
        characteristicUse && (
          <SelectInput
            key={key}
            options={characteristics[key].values || []}
            label={
              characteristics[key].displayName || characteristics[key].useArea
            }
            id={characteristics[key].id}
            name={characteristics[key].useArea}
            required={characteristics[key].minOccurs !== 0}
            value={
              characteristicUse.find(
                (c) => c.CharacteristicID === characteristics[key].id
              )
                ? characteristicUse.find(
                    (c) => c.CharacteristicID === characteristics[key].id
                  ).Value[0].ValueID
                : ""
            }
            onChange={(e) => {
              const result = handleSelect(e, parentEntity);
              setState({ ...result });
            }}
          />
        )
      );
    }
  });
};
