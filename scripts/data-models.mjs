import { FEM } from "./config.mjs";

const fields = foundry.data.fields;

function resourceField(value = 0, max = 0) {
  return new fields.SchemaField({
    value: new fields.NumberField({ integer: true, initial: value }),
    max: new fields.NumberField({ integer: true, initial: max }),
    temp: new fields.NumberField({ integer: true, initial: 0 })
  });
}

function attributeField() {
  return new fields.SchemaField({
    value: new fields.NumberField({ integer: true, initial: 10, min: 1 }),
    mod: new fields.NumberField({ integer: true, initial: 0 })
  });
}

function skillField() {
  return new fields.SchemaField({
    rank: new fields.NumberField({ integer: true, initial: 0, min: 0, max: 2 }),
    bonus: new fields.NumberField({ integer: true, initial: 0 }),
    total: new fields.NumberField({ integer: true, initial: 0 }),
    attribute: new fields.StringField({ initial: "" })
  });
}

function aptitudeField() {
  return new fields.SchemaField({
    value: new fields.NumberField({ integer: true, initial: 0, min: 0, max: 5 })
  });
}

export class FEMActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const attributeSchema = {};
    for (const key of FEM.attributeKeys) attributeSchema[key] = attributeField();

    const skillSchema = {};
    for (const key of Object.keys(FEM.skills)) skillSchema[key] = skillField();

    const aptitudeSchema = {};
    for (const key of Object.keys(FEM.aptitudeTypes)) aptitudeSchema[key] = aptitudeField();

    return {
      level: new fields.NumberField({ integer: true, initial: 1, min: 0 }),
      grade: new fields.StringField({ initial: "" }),
      origin: new fields.StringField({ initial: "" }),
      originClan: new fields.StringField({ initial: "" }),
      originSkillChoiceA: new fields.StringField({ initial: "" }),
      originSkillChoiceB: new fields.StringField({ initial: "" }),
      originExpertSkill: new fields.StringField({ initial: "" }),
      originUseExpert: new fields.BooleanField({ initial: false }),
      specialization: new fields.StringField({ initial: "" }),
      specializationSkillChoice: new fields.StringField({ initial: "" }),
      specializationDcAttribute: new fields.StringField({ initial: "" }),
      autoResources: new fields.BooleanField({ initial: true }),
      autoGrade: new fields.BooleanField({ initial: true }),
      manual: new fields.SchemaField({
        initiative: new fields.NumberField({ integer: true, initial: 0 }),
        movement: new fields.NumberField({ integer: true, initial: 0 }),
        armor: new fields.NumberField({ integer: true, initial: 0 }),
        attention: new fields.NumberField({ integer: true, initial: 0 }),
        physicalDR: new fields.NumberField({ integer: true, initial: 0 }),
        specializationDC: new fields.NumberField({ integer: true, initial: 0 }),
        techniqueDC: new fields.NumberField({ integer: true, initial: 0 })
      }),
      techniqueName: new fields.StringField({ initial: "" }),
      techniqueAttribute: new fields.StringField({ initial: "int" }),
      techniqueSkill: new fields.StringField({ initial: "sorcery" }),
      techniqueDescription: new fields.HTMLField({ initial: "" }),
      attributes: new fields.SchemaField(attributeSchema),
      aptitudes: new fields.SchemaField(aptitudeSchema),
      resources: new fields.SchemaField({
        health: resourceField(0, 0),
        energy: resourceField(0, 0),
        vigor: resourceField(0, 0),
        soul: resourceField(100, 100)
      }),
      derived: new fields.SchemaField({
        mastery: new fields.NumberField({ integer: true, initial: 2 }),
        initiative: new fields.NumberField({ integer: true, initial: 0 }),
        movement: new fields.NumberField({ integer: true, initial: 9 }),
        armor: new fields.NumberField({ integer: true, initial: 10 }),
        attention: new fields.NumberField({ integer: true, initial: 10 }),
        physicalDR: new fields.NumberField({ integer: true, initial: 0 }),
        aptitudeIncreases: new fields.NumberField({ integer: true, initial: 0 }),
        techniqueMax: new fields.NumberField({ integer: true, initial: 0 }),
        techniqueKnown: new fields.NumberField({ integer: true, initial: 0 }),
        techniqueAccessLevel: new fields.NumberField({ integer: true, initial: 1 }),
        specializationDC: new fields.NumberField({ integer: true, initial: 10 }),
        techniqueDC: new fields.NumberField({ integer: true, initial: 10 })
      }),
      skills: new fields.SchemaField(skillSchema),
      notes: new fields.HTMLField({ initial: "" })
    };
  }
}

export class FEMItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ initial: "" }),
      quantity: new fields.NumberField({ integer: true, initial: 1, min: 0 }),
      equipped: new fields.BooleanField({ initial: false }),
      cost: new fields.StringField({ initial: "" }),
      damage: new fields.StringField({ initial: "" }),
      damageType: new fields.StringField({ initial: "" }),
      skill: new fields.StringField({ initial: "" }),
      category: new fields.StringField({ initial: "" }),
      aptitude: new fields.StringField({ initial: "" }),
      dcAttribute: new fields.StringField({ initial: "" }),
      useMode: new fields.StringField({ initial: "" }),
      saveSkill: new fields.StringField({ initial: "" }),
      activationCost: new fields.StringField({ initial: "" }),
      duration: new fields.StringField({ initial: "" }),
      target: new fields.StringField({ initial: "" }),
      area: new fields.StringField({ initial: "" }),
      healing: new fields.StringField({ initial: "" }),
      requirements: new fields.StringField({ initial: "" }),
      effectKey: new fields.StringField({ initial: "" }),
      effectValue: new fields.NumberField({ initial: 0 }),
      automationKey: new fields.StringField({ initial: "" }),
      uses: resourceField(0, 0),
      usesRecovery: new fields.StringField({ initial: "" }),
      specialization: new fields.StringField({ initial: "" }),
      range: new fields.StringField({ initial: "" }),
      action: new fields.StringField({ initial: "" }),
      level: new fields.NumberField({ integer: true, initial: 0, min: 0 }),
      properties: new fields.StringField({ initial: "" })
    };
  }
}
