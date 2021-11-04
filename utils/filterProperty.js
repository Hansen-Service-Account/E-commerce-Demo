export const filterUnsupportedProperty = (obj) => {
  //From the object root, remove any property with key ApplicableDiscount or Action
  Object.keys(obj).forEach((key) => {
    if (
      key === "ApplicableDiscount" ||
      key === "Action" ||
      key === "ItemSource"
    ) {
      delete obj[key];
    }
  });

  if (obj.hasOwnProperty("CharacteristicUse")) {
    obj.CharacteristicUse.forEach((c) => {
      filterUnsupportedProperty(c);
    });
  }

  if (obj.hasOwnProperty("ConfiguredValue")) {
    obj.ConfiguredValue.forEach((c) => {
      filterUnsupportedProperty(c);
    });
  }

  if (obj.hasOwnProperty("ChildEntity")) {
    obj.ChildEntity.forEach((ce) => {
      filterUnsupportedProperty(ce);
    });
  }

  if (obj.hasOwnProperty("RateAttribute")) {
    obj.RateAttribute.forEach((ra) => {
      filterUnsupportedProperty(ra);
    });
  }
};
