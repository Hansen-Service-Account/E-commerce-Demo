import ListView from "./ListView";
import { Flex, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { isServer } from "../utils/isServer";
import CardView from "./CardView";
import ProductDetail from "./ProductDetail";
import { useState } from "react";

const ProductsDisplay = ({
  products,
  viewMode,
  isLoggedIn,
  addToCart,
  allowAdd,
}) => {
  const controls = useDisclosure();
  const [currentProduct, setCurrentProduct] = useState();
  return (
    <>
      <Flex w="100%" justifyContent="flex-start" flexWrap="wrap">
        {products.map((product) =>
          viewMode === "listview" ? (
            <ListView
              key={product.id}
              product={product}
              isLoggedIn={isLoggedIn}
              controls={controls}
              setCurrentProduct={setCurrentProduct}
              addToCart={addToCart}
              allowAdd={allowAdd}
            />
          ) : (
            <CardView
              key={product.id}
              product={product}
              isLoggedIn={isLoggedIn}
              controls={controls}
              setCurrentProduct={setCurrentProduct}
              addToCart={addToCart}
              allowAdd={allowAdd}
            />
          )
        )}
      </Flex>
      <ProductDetail product={currentProduct} controls={controls} />
    </>
  );
};

export default ProductsDisplay;
