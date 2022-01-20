import { v4 as uuidv4 } from "uuid";

export const expandSameEntities = (entity) => {
  const newChildEntity = [];
  entity.ChildEntity.forEach((ea) => {
    const { entityQuantity, ...strippedObj } = ea;

    for (let i = 0; i < ea.entityQuantity; i++) {
      strippedObj.ID = "ID_" + uuidv4();
      newChildEntity.push(strippedObj);
    }
  });
  entity.ChildEntity = newChildEntity;
  entity.ChildEntity.forEach((ea) => {
    if (ea.hasOwnProperty("ChildEntity")) {
      return expandSameEntities(ea);
    }
    return;
  });
  return entity;
};
