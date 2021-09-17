const QuoteItem = ({ item }) => {
  return <h1>{item.entities[item.rootId].name}</h1>;
};

export default QuoteItem;
