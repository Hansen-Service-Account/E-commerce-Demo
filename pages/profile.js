import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Footer from "../components/Footer";
import { Badge, Flex, StackDivider, Text, VStack } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Editable } from "@chakra-ui/editable";

export default function profilePage({ user }) {
  const userInfo = JSON.parse(user);
  return (
    <>
      <Header username={userInfo.firstName} />
      <Flex align="center" w="80%" mx="auto" direction="column" my={12}>
        <Flex align="center">
          <Avatar
            size="2xl"
            name={`${userInfo.firstName} ${userInfo.lastName}`}
          />
          <VStack
            divider={<StackDivider />}
            spacing={3}
            mx={12}
            align="flex-start"
          >
            <Text fontWeight="bold">
              {`${userInfo.firstName} ${userInfo.lastName}`}{" "}
              <Badge ml={4} colorScheme="whatsapp" variant="outline">
                {userInfo.customerType} customer
              </Badge>
            </Text>
            <Text textAlign="left">{userInfo.email}</Text>

            <Text>{userInfo.phone}</Text>
            <Text>{userInfo.streetAddress1}</Text>
            <Text>{`${userInfo.city}, ${userInfo.countyState}, ${userInfo.country}`}</Text>
          </VStack>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { password, ...userInfo } = user._doc;

  return {
    props: {
      user: JSON.stringify(userInfo),
    },
  };
});
