import EntityConfig from "../components/ChildEntityConfig";

export const renderItem = ({
  itemSpec,
  entityHash,
  color,
  parentEntity,
  handleChoose,
  handleSelect,
  handleInput,
  handleNumChange,
  setState,
}) => {
  return entityHash.map((h) => (
    <EntityConfig
      key={h}
      color={color}
      itemSpec={itemSpec}
      entityHash={h}
      parentEntity={parentEntity}
      setState={setState}
      handleChoose={handleChoose}
      handleSelect={handleSelect}
      handleInput={handleInput}
      handleNumChange={handleNumChange}
    />
  ));
};
