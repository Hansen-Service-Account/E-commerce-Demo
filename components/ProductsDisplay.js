import ListView from "./ListView";

const ProductsDisplay = ({ products, viewMode, isLoggedIn }) => {
  return (
    <>
      {viewMode === "listview"
        ? products.map((product) => (
            <ListView
              key={product.id}
              product={product}
              isLoggedIn={isLoggedIn}
            />
          ))
        : null}
    </>
  );
};

export default ProductsDisplay;
