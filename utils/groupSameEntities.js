export const groupSameEntities = (entity) => {
  const newChildEntity = [];
  entity.entityQuantity = 1;
  entity.ChildEntity.forEach((ea) => {
    let index = newChildEntity.findIndex((a) => a.EntityID === ea.EntityID);
    if (index >= 0) {
      newChildEntity[index].entityQuantity += 1;
    } else {
      newChildEntity.push({ ...ea });
      newChildEntity[newChildEntity.length - 1].entityQuantity = 1;
    }
  });
  entity.ChildEntity = newChildEntity;
  entity.ChildEntity.forEach((ea) => {
    if (ea.hasOwnProperty("ChildEntity")) {
      return groupSameEntities(ea);
    }
    return;
  });
  return entity;
};
