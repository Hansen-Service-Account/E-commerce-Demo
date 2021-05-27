import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Select } from "@chakra-ui/select";
import { useEffect, useState } from "react";

const SelectInput = ({
  options,
  label,
  id,
  value,
  onChange,
  name,
  required,
  submittedError,
  readOnly,
  defaultValue,
}) => {
  const [touched, setTouched] = useState(false);
  return (
    <FormControl
      id={id}
      name={id}
      my={2}
      isRequired={required}
      isInvalid={!value && (submittedError || touched) && required && !readOnly}
      isDisabled={readOnly}
    >
      <FormLabel fontWeight="400">{label}</FormLabel>
      <Select
        id={id}
        value={
          value || ""
          //  || (options.length !== 0 && options[0].id)
        }
        onChange={onChange}
        onClick={() => setTouched(true)}
        name={name}
      >
        {!options && (
          <option value={defaultValue || ""}>
            {defaultValue || "-- Make a selection --"}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value || opt.name} value={opt.id} id={opt.id}>
            {opt.value || opt.name}
          </option>
        ))}
      </Select>
      <FormErrorMessage>An option needs to be selected</FormErrorMessage>
    </FormControl>
  );
};

export default SelectInput;
