import { Button } from "@chakra-ui/button";
import { Center, Heading } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import fetchJson from "../utils/fetchJson";
import RadioField from "../components/RadioField";

export default function RegistrationForm() {
  const router = useRouter();
  const toast = useToast();
  return (
    <Center py={12}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          title: "",
          streetAddress1: "",
          streetAddress2: "",
          city: "",
          country: "",
          countyState: "",
          postalZipCode: "",
          phone: "",
          email: "",
          customerType: "",
          password: "",
          confirmPassword: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          for (const field in values) {
            if (!values[field]) {
              errors[field] = "Required";
            }
          }

          if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "Need to match with your password";
          }

          return errors;
        }}
        onSubmit={async (values, { setErrors }) => {
          const data = await fetchJson("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (data.error) {
            if (!toast.isActive("registration")) {
              toast({
                id: "registration",
                title: `Error submitting your registration`,
                description:
                  "Some of your fields contain errors, please double check and re-enter.",
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true,
              });
            }

            const errorMap = {};
            errorMap[data.error.field] = data.error.message;
            setErrors(errorMap);
          } else {
            router.push("/profile");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Heading as="h4" size="lg" textAlign="center" py={6}>
              Customer Registration
            </Heading>
            <RadioField
              name="customerType"
              label="Customer Type"
              options={["Business", "Residential"]}
            />
            <InputField name="firstName" placeholder="" label="First Name" />
            <InputField name="lastName" placeholder="" label="Last Name" />
            <InputField name="title" placeholder="" label="Title" />
            <InputField
              name="email"
              placeholder="Email address"
              label="Email"
            />
            <InputField
              name="phone"
              placeholder="X-XXX-XXX-XXXX"
              label="Mobile Number"
            />

            <InputField
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
            />
            <InputField
              name="confirmPassword"
              placeholder=""
              label="Confirm Password"
              type="password"
            />
            <InputField
              name="streetAddress1"
              placeholder=""
              label="Street Address 1"
            />
            <InputField
              name="streetAddress2"
              placeholder=""
              label="Street Address 2"
            />
            <InputField
              name="postalZipCode"
              placeholder=""
              label="Postal/Zip Code"
            />
            <InputField name="city" placeholder="" label="City" />
            <InputField
              name="countyState"
              placeholder=""
              label="County/State"
            />
            <InputField name="country" placeholder="" label="Country" />

            <Center>
              <Button
                my={4}
                type="submit"
                variant="outline"
                color="white"
                w="100%"
                background="teal.400"
                _hover={{ bg: "teal.600" }}
                verticalAlign="middle"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Center>
  );
}
