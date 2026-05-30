import { activateFieldAutosave, saveFieldFromEvent, updateDocumentFromForm } from "./form-autosave.mjs";
import { FEM } from "../config.mjs";

const ItemSheetV1 = foundry.appv1?.sheets?.ItemSheet ?? globalThis.ItemSheet;

export class FEMItemSheet extends ItemSheetV1 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["feiticeiros-e-maldicoes", "sheet", "item"],
      template: "systems/feiticeiros-e-maldicoes/templates/item-sheet.hbs",
      width: 560,
      height: 560,
      submitOnChange: true,
      submitOnClose: true,
      closeOnSubmit: false
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.config = FEM;
    context.system = this.item.system;
    context.editable = this.isEditable;
    context.skillOptions = FEM.skills;
    context.attributeOptions = FEM.attributes;
    context.actionOptions = FEM.actions;
    context.damageTypeOptions = FEM.damageTypes;
    context.aptitudeTypeOptions = FEM.aptitudeTypes;
    context.aptitudeCategoryOptions = FEM.aptitudeCategories;
    context.talentCategoryOptions = FEM.talentCategories;
    context.techniqueUseModeOptions = FEM.techniqueUseModes;
    context.specializationOptions = FEM.specializations;
    context.effectKeyOptions = FEM.effectKeys;
    context.automationKeyOptions = FEM.automationKeys;
    context.recoveryOptions = FEM.recoveryTypes;
    context.categoryOptions = this._categoryOptions();
    context.selectedAction = this._choiceKey(FEM.actions, this.item.system.action);
    context.selectedDamageType = this._choiceKey(FEM.damageTypes, this.item.system.damageType);
    context.selectedCategory = this._choiceKey(context.categoryOptions, this.item.system.category);
    context.selectedAptitude = this._choiceKey(FEM.aptitudeTypes, this.item.system.aptitude);
    context.selectedAttribute = this._choiceKey(FEM.attributes, this.item.system.dcAttribute);
    context.selectedUseMode = this._choiceKey(FEM.techniqueUseModes, this.item.system.useMode);
    context.selectedEffectKey = this._choiceKey(FEM.effectKeys, this.item.system.effectKey);
    context.selectedAutomationKey = this._choiceKey(FEM.automationKeys, this.item.system.automationKey);
    context.selectedRecovery = this._choiceKey(FEM.recoveryTypes, this.item.system.usesRecovery);
    return context;
  }

  _categoryOptions() {
    if (this.item.type === "aptidao") return FEM.aptitudeCategories;
    if (this.item.type === "talento") return FEM.talentCategories;
    return {};
  }

  _choiceKey(options, value) {
    if (!value || options[value]) return value ?? "";
    const match = Object.entries(options).find(([, label]) => label === value);
    return match?.[0] ?? value;
  }

  async _updateObject(event, formData) {
    return updateDocumentFromForm(this.item, formData);
  }

  async _onChangeInput(event) {
    if (typeof super._onChangeInput === "function") await super._onChangeInput(event);
    return saveFieldFromEvent(this.item, event);
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    activateFieldAutosave(this, html, this.item);
  }
}
