import SelectInput from "../components/SelectInput";

const setDefault = (char, parentEntity) => {
  if (char.meta.elementName !== "Commercial_UserDefinedChar") {
    if (char.meta.elementName === "Commercial_SpecCharUse") {
      if (
        parentEntity.CharacteristicUse.find(
          (c) => c.CharacteristicID === char.characteristic.id
        )
      ) {
        return;
      }
      parentEntity.CharacteristicUse.push({
        UseArea: char.meta.elementName,
        CharacteristicID: char.characteristic.id,
        ItemSource: "cpq",
        Value: [
          {
            ValueID: char.characteristic.characteristicCharValue[0].id,
            ValueDetail: char.characteristic.characteristicCharValue[0].value,
          },
        ],
      });
    } else {
      if (
        parentEntity.CharacteristicUse.find(
          (c) => c.CharacteristicID === char.id
        )
      ) {
        return;
      }
      parentEntity.CharacteristicUse.push({
        UseArea: char.meta.elementName,
        CharacteristicID: char.id,
        ItemSource: "cpq",
        Value: [
          {
            ValueID: char.values[0].id,
            ValueDetail: char.values.name,
          },
        ],
      });
    }
  } else {
    if (
      parentEntity.ConfiguredValue.find(
        (c) => c.CharacteristicID === char.characteristic.id
      )
    ) {
      return;
    }
    parentEntity.ConfiguredValue.push({
      UseArea: "Commercial_UserDefinedChar",
      CharacteristicID: char.characteristic.id,
      UserID: "caebf2c0-fb08-470c-955f-832d473c7a08",
      ItemSource: "cpq",
      Value: [
        {
          Value:
            char.defaultValue ||
            (char.cpqBehavior && char.cpqBehavior[0].defaultValue) ||
            "A Random Value",
          ValueDetail: char.name,
        },
      ],
    });
  }
};

const useDefault = (characteristic) => {
  if (!characteristic.cpqBehavior && !characteristic.defaultValue) {
    return "A Random Default Value";
  }
  if (characteristic.name === "Location") {
    return "A Random Location";
  }
  if (
    characteristic.cpqBehavior &&
    !characteristic.cpqBehavior[0].externalCaptureGrp
  ) {
    return characteristic.cpqBehavior[0].defaultValue;
  }
  if (characteristic.defaultValue) {
    return characteristic.defaultValue;
  }
};

const useReadOnly = (characteristic) => {
  if (
    characteristic.cpqControlTypeBehavior &&
    characteristic.cpqControlTypeBehavior[0].isReadOnly === "true"
  ) {
    return true;
  }
  if (characteristic.name === "Location") {
    return true;
  }
  if (
    !characteristic.defaultValue &&
    !characteristic.cpqBehavior &&
    !characteristic.characteristic.characteristicCharValue
  ) {
    return true;
  }
  return false;
};

/*Function used to render select inputs based on all configurable fields of the current entity being rendered
  @param {object} entity: The target entity (with offer specification) to be passed in to render its configurable child entities
  @param {object} productCandidate: The entity (under productCandidate) that characteristic belongs to
  */
const renderSelectInputs = (
  entity,
  parentEntity,
  onChange,
  setState,
  submittedError,
  phoneNumber,
  serialNumber
) => {
  const inputs = [];

  //If there is commercialUserDefindChar on entity's specification, render each characteristic
  if (
    entity.product.commercialUserDefinedChar &&
    entity.product.commercialUserDefinedChar.length > 0
  ) {
    entity.product.commercialUserDefinedChar.map((char) => {
      if (
        (char.cpqBehavior &&
          (char.cpqBehavior[0].externalCaptureGrp ||
            char.cpqBehavior[0].isPrimary)) ||
        char.minOccurs === "1"
      ) {
        inputs.push(
          <SelectInput
            options={
              char.name === "Phone Number"
                ? phoneNumber
                : char.name === "Serial ID"
                ? serialNumber
                : [
                    {
                      value:
                        char.defaultValue ||
                        (char.cpqBehavior &&
                          char.cpqBehavior[0].defaultValue) ||
                        "A Random Value",
                      id:
                        char.defaultValue ||
                        (char.cpqBehavior &&
                          char.cpqBehavior[0].defaultValue) ||
                        "A Random Value",
                    },
                  ]
            }
            readOnly={useReadOnly(char)}
            defaultValue={useDefault(char)}
            name={char.meta.elementName}
            key={char.id}
            id={char.characteristic.id}
            label={char.name}
            required={char.minOccurs !== "0"}
            submittedError={submittedError}
            onChange={(e) => {
              const result = onChange(e, parentEntity);
              setState({ ...result });
            }}
            parentEntity={parentEntity}
            value={
              parentEntity &&
              parentEntity.ConfiguredValue.find((c) => {
                return c.CharacteristicID === char.characteristic.id;
              }) &&
              parentEntity.ConfiguredValue.find(
                (c) => c.CharacteristicID === char.characteristic.id
              ).Value[0].Value
            }
          />
        );
        if (parentEntity) {
          setDefault(char, parentEntity);
        }
      }
    });
  }
  if (entity.product.commercialSpecCharUse) {
    entity.product.commercialSpecCharUse.map((char) => {
      inputs.push(
        <SelectInput
          options={char.characteristic.characteristicCharValue}
          name={char.meta.elementName}
          key={char.id}
          id={char.characteristic.id}
          label={char.characteristic.name}
          required={char.minOccurs !== "0"}
          submittedError={submittedError}
          onChange={(e) => {
            const result = onChange(e, parentEntity);
            setState({ ...result });
          }}
          parentEntity={parentEntity}
          value={
            parentEntity &&
            parentEntity.CharacteristicUse.find((c) => {
              return c.CharacteristicID === char.characteristic.id;
            }) &&
            parentEntity.CharacteristicUse.find(
              (c) => c.CharacteristicID === char.characteristic.id
            ).Value[0].ValueID
          }
        />
      );
      if (parentEntity) {
        setDefault(char, parentEntity);
      }
    });
  }
  if (entity.product.subscriptionMonth) {
    entity.product.subscriptionMonth.map((sub) => {
      inputs.push(
        <SelectInput
          options={sub.values}
          name={sub.meta.elementName}
          key={sub.id}
          id={sub.id}
          label={sub.displayName}
          required={sub.minOccurs !== "0"}
          submittedError={submittedError}
          onChange={(e) => {
            const result = onChange(e, parentEntity);
            setState({ ...result });
          }}
          value={
            parentEntity &&
            parentEntity.CharacteristicUse.find(
              (c) => c.CharacteristicID === sub.id
            ) &&
            parentEntity.CharacteristicUse.find(
              (c) => c.CharacteristicID === sub.id
            ).Value[0].ValueID
          }
        />
      );
      if (parentEntity) {
        setDefault(sub, parentEntity);
      }
    });
  }

  // if (entity.product.simCardPlan) {
  //   entity.product.simCardPlan.map((sim) => {
  //     inputs.push(
  //       <SelectInput
  //         options={sim.values}
  //         name={sim.meta.elementName}
  //         key={sim.id}
  //         id={sim.id}
  //         label={sim.displayName}
  //         required={sim.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === sim.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === sim.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(sim, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.storageSize) {
  //   entity.product.storageSize.map((sto) => {
  //     inputs.push(
  //       <SelectInput
  //         options={sto.values}
  //         name={sto.meta.elementName}
  //         key={sto.id}
  //         id={sto.id}
  //         label={sto.displayName}
  //         required={sto.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === sto.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === sto.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(sto, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.record) {
  //   entity.product.record.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.streaming) {
  //   entity.product.streaming.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.store) {
  //   entity.product.store.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.cloudStorage) {
  //   entity.product.cloudStorage.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.bandwidth) {
  //   entity.product.bandwidth.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.lensModel) {
  //   entity.product.lensModel.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.storageClass) {
  //   entity.product.storageClass.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  // if (entity.product.storageClass) {
  //   entity.product.storageClass.map((a) => {
  //     inputs.push(
  //       <SelectInput
  //         options={a.values}
  //         name={a.meta.elementName}
  //         key={a.id}
  //         id={a.id}
  //         label={a.displayName}
  //         required={a.minOccurs !== "0"}
  //         submittedError={submittedError}
  //         onChange={(e) => {
  //           const result = onChange(e, parentEntity);
  //           setState({ ...result });
  //         }}
  //         value={
  //           parentEntity &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ) &&
  //           parentEntity.CharacteristicUse.find(
  //             (c) => c.CharacteristicID === a.id
  //           ).Value[0].ValueID
  //         }
  //       />
  //     );
  //     if (parentEntity) {
  //       setDefault(a, parentEntity);
  //     }
  //   });
  // }

  for (const property in entity.product) {
    if (
      Array.isArray(entity.product[property]) &&
      entity.product[property][0].meta &&
      entity.product[property][0].meta.pattern === "TConfigurable_Fact"
    ) {
      entity.product[property].map((a) => {
        inputs.push(
          <SelectInput
            options={a.values}
            name={a.meta.elementName}
            key={a.id}
            id={a.id}
            label={a.displayName}
            required={a.minOccurs !== "0"}
            submittedError={submittedError}
            onChange={(e) => {
              const result = onChange(e, parentEntity);
              setState({ ...result });
            }}
            value={
              parentEntity &&
              parentEntity.CharacteristicUse.find(
                (c) => c.CharacteristicID === a.id
              ) &&
              parentEntity.CharacteristicUse.find(
                (c) => c.CharacteristicID === a.id
              ).Value[0].ValueID
            }
          />
        );
        if (parentEntity) {
          setDefault(a, parentEntity);
        }
      });
    }
  }

  return inputs;
};

export default renderSelectInputs;
