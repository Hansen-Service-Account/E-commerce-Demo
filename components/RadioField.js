import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { HStack } from "@chakra-ui/layout";
import { Radio } from "@chakra-ui/radio";
import { RadioGroup } from "@chakra-ui/radio";
import { useField } from "formik";

export default function RadioField(props) {
  const [field, meta, helper] = useField(props);
  const { onChange, ...rest } = field;
  return (
    <FormControl isInvalid={!!meta.error} my={8}>
      <FormLabel as="legend">{props.label}</FormLabel>
      <RadioGroup {...rest}>
        <HStack spacing="24px">
          {props.options.map((option) => (
            <Radio
              key={option}
              onChange={onChange}
              name={field.name}
              value={option}
            >
              {option}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
}
