import Header from "../components/Header";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import Footer from "../components/Footer";
import { Badge, Flex, StackDivider, Text, VStack } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Editable } from "@chakra-ui/editable";
import { getHeaderAndFooterNavigationOfWebsite } from "../utils/contentful";
import { HANSEN_CPQ_V2_BASE_URL } from "../utils/constants";

export default function profilePage({
  headerNav,
  footerNav,
  headerLogo,
  footerLogo,
  productLines,
  user,
}) {
  const userInfo = JSON.parse(user);
  return (
    <>
      <Header
        username={userInfo.firstName}
        initialLogoSrc={headerLogo.fields.file.url}
        headerNav={headerNav.items[0]}
        productLines={productLines}
      />
      <Flex align="center" w="80%" mx="auto" direction="column" py={24}>
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
      <Footer
        logoURL={footerLogo.fields.file.url}
        footerNav={footerNav.items[0]}
      />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req }) {
  let productLines;

  const { headerNav, footerNav, headerLogo, footerLogo } =
    await getHeaderAndFooterNavigationOfWebsite(
      process.env.CONTENTFUL_WEBSITE_ID
    );

  const productLinesRes = await fetch(
    `${HANSEN_CPQ_V2_BASE_URL}/classifications/Selling_Category_Value`
  );
  if (productLinesRes.status > 400) {
    productLines = [];
  } else {
    productLines = await productLinesRes.json();
  }
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
      headerNav,
      footerNav,
      headerLogo,
      footerLogo,
      productLines,
      user: JSON.stringify(userInfo),
    },
  };
});
