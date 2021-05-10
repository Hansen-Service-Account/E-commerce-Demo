import Header from "../components/Header";
import fetch from "node-fetch";
import { MOBILE_PRODUCTS_ENDPOINT } from "../utils/constants";
import withSession from "../middleware/session";
import { dbConnect } from "../middleware/db";
import User from "../models/user";
import ProductsDisplay from "../components/ProductsDisplay";

export default function residentialProductPage({ username, products }) {
  const isLoggedIn = !!username;
  return (
    <>
      <Header username={username} />
      <ProductsDisplay
        products={products.entities}
        viewMode="listview"
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const result = await (await fetch(MOBILE_PRODUCTS_ENDPOINT)).json();
  const products = result[0];
  //   const products = JSON.parse(result.data);
  if (!user) {
    return {
      props: { products },
    };
  }

  return {
    props: {
      products,
      username: user.firstName,
    },
  };
});
