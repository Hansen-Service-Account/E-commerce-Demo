import ChildEntity from "../components/ChildEntity";

/*Function used to render all child entities of the target entity
  @param {object} entity: The target entity (parent) with offer specifications
  @param {string} color: The background color of the target entity tab (alternates between different levels)
  @param {function} onChange: onChange function to be passed down to select inputs
  @param {object} productCandidate: Chosen child entities of the current entity under productCandidate property (part of the configuredItem state)
  @param {object} parentEntity: The target entity (parent) under productCandidate property, used as a reference point (part of the configuredItem state)
  @param {function} handleChoose: Onclick function that handles selection of non-charge entities.
  @param {function} setState: Function used to mutate configuredItem state
  @param {object} phoneNumber: Array of phone numbers up for select inputs
  @param {object} serialNumber: Array of serial numbers up for select inputs
  @param {boolean} submittedError: The error status of evaluateRules, state managed by ItemConfig component
  */
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
        // Pass the corresponding productCandidate along with the entity
        productCandidate={productCandidate.find(
          (pc) => pc.EntityID === e.product.id
        )}
      />
    );
  });
};

export default renderEntities;
