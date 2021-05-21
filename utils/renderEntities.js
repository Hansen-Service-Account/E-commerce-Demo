import ChildEntity from "../components/ChildEntity";

const renderEntities = ({
  entity,
  color,
  onChange,
  productCandidate,
  parentEntity,
  handleChoose,
  setState,
  rootCandidate,
  phoneNumber,
  serialNumber,
  submittedError,
}) => {
  // entity.sort((a, b) => {
  //   if (a.product.meta.pattern < b.product.meta.pattern) {
  //     return 1;
  //   }
  //   if (a.product.meta.pattern > b.product.meta.pattern) {
  //     return -1;
  //   }
  // });
  return entity.map((e) => {
    return (
      <ChildEntity
        key={e.product.id}
        entity={e}
        color={color}
        onChange={onChange}
        parentEntity={parentEntity}
        handleChoose={handleChoose}
        setState={setState}
        rootCandidate={rootCandidate}
        phoneNumber={phoneNumber}
        serialNumber={serialNumber}
        submittedError={submittedError}
        productCandidate={productCandidate.find(
          (pc) => pc.EntityID === e.product.id
        )}
      />
    );
  });
};

export default renderEntities;
