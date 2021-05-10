import Header from "../../components/Header";
import fetch from "node-fetch";
import { MOBILE_PRODUCTS_ENDPOINT } from "../../utils/constants";
import withSession from "../../middleware/session";
import { dbConnect } from "../../middleware/db";
import User from "../../models/user";
import { getHomePageImageSections } from "../../utils/contentful";
import Hero from "../../components/Hero";
import ProductsDisplay from "../../components/ProductsDisplay";

export default function categoryID({ username, products }) {
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

export const getServerSideProps = withSession(async function ({
  req,
  res,
  params,
}) {
  const endPoint = `https://cpqserver-e30-cpq1.cloud.sigma-systems.com/api/offers?InstanceTypeNames=Package,Promotion,Bundle&Classifications=[Customer_Demo_Portal;${params.categoryID};false]&ClassificationElementName=Customer_Demo_Portal&xsltCode=offer_special&at[p1]=ID&el[p2]=Name&at[p3]=BusinessID&el[p4]=Description&el[p5]=Element_Guid&el[p6]=Description`;
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const result = await (await fetch(endPoint)).json();
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
