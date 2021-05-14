import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Select } from "@chakra-ui/select";

const SelectInput = ({ options, label, id }) => {
  return (
    <FormControl id={id} name={id}>
      <FormLabel>{label}</FormLabel>
      <Select placeholder="">
        {options.map((opt) => (
          <option value={opt.value || opt.name}>{opt.value || opt.name}</option>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
