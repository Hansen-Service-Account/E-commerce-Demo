import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import React from "react";
import { DARK_GOLD } from "../utils/constants";

export const TextInput = React.memo(
  ({ placeholder, w, my, label, onChange, value, id, name }) => {
    return (
      <FormControl w={w} my={my}>
        <FormLabel fontWeight="normal">{label}</FormLabel>
        <Input
          id={id}
          name={name}
          borderColor={DARK_GOLD}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </FormControl>
    );
  }
);
