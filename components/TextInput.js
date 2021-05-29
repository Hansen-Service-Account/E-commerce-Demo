import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import React from "react";
import { DARK_GOLD } from "../utils/constants";

export default function TextInput({ placeholder, w, my }) {
  return (
    <FormControl w={w} my={my}>
      <Input borderColor={DARK_GOLD} placeholder={placeholder} />
    </FormControl>
  );
}
