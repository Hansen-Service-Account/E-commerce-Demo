import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ItemConfig from "../../../components/ItemConfig";
import useItem from "../../../hooks/useItem";
import { dbConnect } from "../../../middleware/db";
import withSession from "../../../middleware/session";
import User from "../../../models/user";

export default function itemId({ quoteId, itemId, username }) {
  const { item, isLoading, isError } = useItem(quoteId, itemId);
  return (
    <>
      <Header username={username} />
      {isLoading ? (
        <Spinner />
      ) : (
        <ItemConfig item={item} metaType={{ ...item.metaTypeLookup }} />
      )}
      <Footer />
    </>
  );
}

export const getServerSideProps = withSession(async function ({
  req,
  res,
  params,
}) {
  await dbConnect();
  const user = await User.findOne({ _id: req.session.get("userId") });
  const quoteId = req.session.get("quoteId");
  const itemId = params.itemId;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      quoteId,
      itemId,
      username: user.firstName,
    },
  };
});
