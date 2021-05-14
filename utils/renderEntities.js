import ChildEntity from "../components/ChildEntity";

const renderEntities = ({ entity, metaType, product }) => {
  entity.sort((a, b) => {
    if (metaType[a.EntityID].pattern < metaType[b.EntityID].pattern) {
      return 1;
    } else {
      return -1;
    }
  });
  return entity.map((e, index) => {
    return (
      <ChildEntity
        key={e.ID}
        entity={e}
        type={
          metaType[e.EntityID].pattern === "Component" ? "Component" : "Charge"
        }
        metaType={metaType}
        product={
          product
            ? product.find((p) => {
                return p.product.id === e.EntityID;
              })
            : null
        }
      />
    );
  });
};

export default renderEntities;
