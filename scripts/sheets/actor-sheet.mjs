import { FEM } from "../config.mjs";
import { activateFieldAutosave, saveFieldFromEvent, updateDocumentFromForm } from "./form-autosave.mjs";

const ActorSheetV1 = foundry.appv1?.sheets?.ActorSheet ?? globalThis.ActorSheet;

export class FEMActorSheet extends ActorSheetV1 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["feiticeiros-e-maldicoes", "sheet", "actor"],
      template: "systems/feiticeiros-e-maldicoes/templates/actor-sheet.hbs",
      width: 860,
      height: 760,
      submitOnChange: true,
      submitOnClose: true,
      closeOnSubmit: false,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.config = FEM;
    context.system = this.actor.system;
    context.editable = this.isEditable;
    context.attributes = Object.entries(FEM.attributes).map(([key, label]) => ({
      key,
      label,
      value: this.actor.system.attributes[key].value,
      mod: this.actor.system.attributes[key].mod
    }));
    context.aptitudes = Object.entries(FEM.aptitudeTypes).map(([key, label]) => ({
      key,
      label,
      value: this.actor.system.aptitudes[key]?.value ?? 0
    }));
    context.aptitudeSpent = context.aptitudes.reduce((total, aptitude) => total + (Number(aptitude.value) || 0), 0);
    context.aptitudeRemaining = this.actor.system.derived.aptitudeIncreases - context.aptitudeSpent;
    context.aptitudePresets = Object.entries(FEM.aptitudePresets).map(([key, preset]) => ({
      key,
      label: preset.name,
      category: FEM.aptitudeCategories[preset.category] ?? preset.category
    }));
    context.skills = Object.entries(FEM.skills).map(([key, config]) => ({
      key,
      ...config,
      ...this.actor.system.skills[key]
    }));
    context.itemGroups = Object.entries(FEM.itemTypes).map(([type, label]) => ({
      type,
      label,
      items: this.actor.items.filter((item) => item.type === type)
    }));
    context.aptitudeItems = this.actor.items.filter((item) => item.type === "aptidao");
    context.techniqueItems = this.actor.items.filter((item) => item.type === "tecnica");
    context.talentItems = this.actor.items.filter((item) => item.type === "talento");
    context.specializationAbilityItems = this.actor.items.filter((item) => item.type === "habilidade").map((item) => this._itemDisplayData(item));
    context.nonAptitudeItemGroups = context.itemGroups.filter((group) => !["aptidao", "tecnica", "talento", "habilidade"].includes(group.type));
    context.techniqueUseModes = FEM.techniqueUseModes;
    context.techniqueAccessOptions = [0, 1, 2, 3, 4, 5].filter((level) => level <= this.actor.system.derived.techniqueAccessLevel);
    context.talentPresets = Object.entries(FEM.talentPresets).map(([key, preset]) => ({
      key,
      label: preset.name,
      category: FEM.talentCategories[preset.category] ?? preset.category
    }));
    context.specializationAbilityPresets = Object.entries(FEM.specializationAbilityPresets)
      .filter(([, preset]) => !preset.specialization || preset.specialization === this.actor.system.specialization)
      .map(([key, preset]) => ({
        key,
        label: preset.name,
        specialization: FEM.specializations[preset.specialization]?.label ?? "Geral",
        level: preset.level ?? 0
      }));
    const specialization = FEM.specializations[this.actor.system.specialization];
    const chosenSkill = this.actor.system.specializationSkillChoice;
    const autoSkillKeys = new Set(specialization?.fixedSkills ?? []);
    if (specialization?.choiceSkills.includes(chosenSkill)) autoSkillKeys.add(chosenSkill);
    const masteredSkills = Object.values(this.actor.system.skills).filter((skill) => Number(skill.rank) > 0).length;
    context.specialization = specialization;
    context.specializationChoices = (specialization?.choiceSkills ?? []).map((key) => ({
      key,
      label: FEM.skills[key]?.label ?? key
    }));
    context.specializationDcAttributes = (specialization?.dcAttributes ?? FEM.attributeKeys).map((key) => ({
      key,
      label: FEM.attributes[key] ?? key
    }));
    context.autoSkillLabels = [...autoSkillKeys].map((key) => FEM.skills[key]?.label ?? key).join(", ");
    context.freeSkillSlots = specialization?.freeSkills ?? 0;
    context.masteredSkills = masteredSkills;
    const origin = FEM.origins[this.actor.system.origin];
    const clan = this.actor.system.origin === "herdado" ? FEM.clans[this.actor.system.originClan] : null;
    const originChoiceSource = clan?.skillChoices ?? [];
    context.origin = origin;
    context.clan = clan;
    context.originSkillChoices = originChoiceSource.map((key) => ({
      key,
      label: FEM.skills[key]?.label ?? key
    }));
    context.originFreeSkillSlots = (origin?.freeSkills ?? 0) + (clan?.freeSkills ?? 0);
    context.originWarnings = [];
    if (origin?.forbiddenSpecialization && this.actor.system.specialization === origin.forbiddenSpecialization) {
      context.originWarnings.push(`${origin.label} nao pode usar essa especializacao pelo livro.`);
    }
    if (origin?.forcedSpecialization && this.actor.system.specialization !== origin.forcedSpecialization) {
      context.originWarnings.push(`${origin.label} deve usar a especializacao ${FEM.specializations[origin.forcedSpecialization]?.label}.`);
    }
    return context;
  }

  _itemDisplayData(item) {
    const automation = this.actor.getFeatureAutomationData(item);
    return {
      id: item.id,
      name: item.name,
      img: item.img,
      system: item.system,
      actionLabel: FEM.actions[item.system.action] ?? item.system.action ?? "",
      automationLabel: automation.label,
      usesLabel: automation.key === "fighterExcitement" ? `Nivel ${automation.usesValue}/${automation.usesMax}` : automation.usesLabel,
      usesValue: automation.usesValue,
      usesMax: automation.usesMax,
      hasUses: automation.usesMax > 0,
      recoveryLabel: automation.recoveryLabel
    };
  }

  async _updateObject(event, formData) {
    return updateDocumentFromForm(this.actor, formData);
  }

  async _onChangeInput(event) {
    if (typeof super._onChangeInput === "function") await super._onChangeInput(event);
    return saveFieldFromEvent(this.actor, event);
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    activateFieldAutosave(this, html, this.actor);

    html.find("[data-roll-attribute]").on("click", (event) => {
      this.actor.rollAttribute(event.currentTarget.dataset.rollAttribute);
    });
    html.find("[data-roll-skill]").on("click", (event) => {
      this.actor.rollSkill(event.currentTarget.dataset.rollSkill);
    });
    html.find("[data-apply-specialization]").on("click", async () => {
      await this.actor.applySpecializationDefaults();
      ui.notifications.info("Especializacao aplicada.");
    });
    html.find("[data-feature-recovery]").on("click", async (event) => {
      await this.actor.recoverFeatureUses(event.currentTarget.dataset.featureRecovery);
      ui.notifications.info("Usos de habilidades recuperados.");
    });
    html.find("[data-derived-adjust]").on("change", async (event) => {
      await this.actor.setManualDerivedValue(event.currentTarget.dataset.derivedAdjust, event.currentTarget.value);
    });
    html.find("[data-item-use-field]").on("change", async (event) => {
      const row = event.currentTarget.closest("[data-item-id]");
      await this.actor.setItemUsesValue(row?.dataset.itemId, event.currentTarget.dataset.itemUseField, event.currentTarget.value);
    });
    html.find("[data-apply-origin]").on("click", async () => {
      await this.actor.applyOriginDefaults();
      ui.notifications.info("Origem aplicada.");
    });
    html.find("[data-create-aptitude]").on("click", async () => {
      const select = html.find("[data-aptitude-preset]")[0];
      if (!select?.value) return;
      await this.actor.createAptitudeFromPreset(select.value);
      select.value = "";
    });
    html.find("[data-create-technique]").on("click", async () => {
      const level = html.find("[data-technique-level]")[0]?.value ?? 1;
      const useMode = html.find("[data-technique-mode]")[0]?.value ?? "save";
      await this.actor.createTechniqueAbility({ level, useMode });
    });
    html.find("[data-create-talent]").on("click", async () => {
      const select = html.find("[data-talent-preset]")[0];
      if (!select?.value) return;
      await this.actor.createTalentFromPreset(select.value);
      select.value = "";
    });
    html.find("[data-create-specialization-ability]").on("click", async () => {
      const select = html.find("[data-specialization-ability-preset]")[0];
      if (!select?.value) return;
      await this.actor.createSpecializationAbilityFromPreset(select.value);
      select.value = "";
    });
    html.find("[data-roll-item]").on("click", (event) => {
      this.actor.rollItem(event.currentTarget.closest("[data-item-id]").dataset.itemId);
    });
    html.find("[data-item-create]").on("click", async (event) => {
      const type = event.currentTarget.dataset.itemCreate;
      await this.actor.createEmbeddedDocuments("Item", [{ name: FEM.itemTypes[type] ?? "Item", type }]);
    });
    html.find("[data-item-edit]").on("click", (event) => {
      this.actor.items.get(event.currentTarget.closest("[data-item-id]").dataset.itemId)?.sheet.render(true);
    });
    html.find("[data-item-delete]").on("click", async (event) => {
      await this.actor.deleteEmbeddedDocuments("Item", [event.currentTarget.closest("[data-item-id]").dataset.itemId]);
    });
  }
}
