import { Checkbox } from "@chakra-ui/checkbox";
import { Box } from "@chakra-ui/layout";

const ConfigList = ({ item, selectedOptions, onChange, metaType }) => {
  const handleSelect = (selectedOptionId) => {
    const options = { ...selectedOptions };
    if (selectedOptions[selectedOptionId]) {
      console.log("delete");
      delete options[selectedOptionId];
    } else {
      options[selectedOptionId] = {};
    }
    onChange(options);
  };

  const handleSubOptionsListChange = (optionId, subSelections) => {
    console.log("oik");
    const options = { ...selectedOptions };
    // add sub selections to current optionId
    options[optionId] = subSelections;
    // call onChange function given by parent
    onChange(options);
  };

  return (
    <Box>
      {item.prePricedCandidate
        ? item.prePricedCandidate.ChildEntity.map((c) => (
            <ul>
              <Checkbox
                isChecked={!!selectedOptions[c.ID]}
                onChange={() => handleSelect(c.ID)}
              >
                {metaType[c.EntityID].name}
              </Checkbox>
              {c.ChildEntity.length > 0 && selectedOptions[c.ID] && (
                <ConfigList
                  item={c}
                  selectedOptions={selectedOptions[c.ID]}
                  metaType={metaType}
                  onChange={(subSelections) =>
                    handleSubOptionsListChange(c.ID, subSelections)
                  }
                />
              )}
            </ul>
          ))
        : item.ChildEntity.map((c) => {
            // if (metaType[c.EntityID].pattern === "component")
            return (
              <ul>
                <Checkbox
                  isChecked={!!selectedOptions[c.ID]}
                  onChange={() => handleSelect(c.ID)}
                >
                  {metaType[c.EntityID].name}
                </Checkbox>
                {c.ChildEntity.length > 0 && selectedOptions[c.ID] && (
                  <ConfigList
                    item={c}
                    selectedOptions={selectedOptions[c.ID]}
                    metaType={metaType}
                    onChange={(subSelections) =>
                      handleSubOptionsListChange(c.ID, subSelections)
                    }
                  />
                )}
              </ul>
            );
          })}
    </Box>
  );
};

export default ConfigList;
