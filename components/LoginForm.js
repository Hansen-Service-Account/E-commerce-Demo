import { Button } from "@chakra-ui/button";
import { Center, Heading } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import fetchJson from "../utils/fetchJson";

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  return (
    <Center h={500}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={async (values, { setErrors }) => {
          const data = await fetchJson("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (data.error) {
            console.log(data.error);
            const errorMap = {};
            errorMap[data.error.field] = data.error.message;
            setErrors(errorMap);
          } else {
            toast({
              title: `Welcome back, ${data.userInfo.firstName} ${data.userInfo.lastName}`,
              description: "Redirecting you back to home page",
              status: "success",
              position: "top",
              duration: 3000,
              isClosable: true,
              onCloseComplete: () => {
                router.push("/");
              },
            });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Heading as="h4" size="lg" textAlign="center" py={6}>
              Customer Login
            </Heading>
            <InputField
              name="email"
              placeholder="Email address"
              label="Email"
            />
            <InputField
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
            />
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
                Login
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Center>
  );
}
