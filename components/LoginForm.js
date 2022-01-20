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
          try {
            const data = await fetchJson("/api/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            if (data.error) {
              const errorMap = {};
              errorMap[data.error.field] = data.error.message;
              setErrors(errorMap);
              if (data.user) {
                toast({
                  title: `Welcome back, ${data.userInfo.firstName} ${data.userInfo.lastName}`,
                  description:
                    "You have successfully logged in, but we cannot create or retrieve a quote for you at the moment. Redirecting you back to home page.",
                  status: "warning",
                  position: "top",
                  duration: 3000,
                  isClosable: true,
                  onCloseComplete: () => {
                    router.push("/");
                  },
                });
              }
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
          } catch (error) {
            if (error.data.user.isLoggedIn) {
              return toast({
                title: `Welcome back, ${error.data.user.userInfo.firstName} ${error.data.user.userInfo.lastName}`,
                description:
                  "You have successfully logged in, but we cannot create or retrieve a quote for you at the moment. Redirecting you back to home page.",
                status: "warning",
                position: "top",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => {
                  router.push("/");
                },
              });
            }
            return toast({
              title: "Error logging in.",
              description: "We are not able to log you in.",
              status: "error",
              duration: 3000,
              isClosable: true,
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
