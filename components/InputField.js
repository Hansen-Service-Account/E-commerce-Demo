import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useField } from "formik";

export default function InputField(props) {
  const [field, meta, helper] = useField(props);
  return (
    <FormControl isInvalid={!!meta.error && meta.touched} my={8}>
      <FormLabel>{props.label}</FormLabel>
      <Input
        {...field}
        type={props.type}
        id={field.name}
        placeholder={props.placeholder}
      />
      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
}
