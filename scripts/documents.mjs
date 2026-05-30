import { FEM } from "./config.mjs";

export class FEMActor extends Actor {
  prepareDerivedData() {
    super.prepareDerivedData();

    const system = this.system;
    const level = Number(system.level) || 0;
    const halfLevel = Math.floor(level / 2);
    const mastery = 2 + Math.floor(Math.max(level - 1, 0) / 4);
    const specialization = FEM.specializations[system.specialization];
    const origin = FEM.origins[system.origin];
    const clan = system.origin === "herdado" ? FEM.clans[system.originClan] : null;
    const manual = system.manual ?? {};
    system.derived.mastery = mastery;
    system.derived.aptitudeIncreases = this._aptitudeIncreasesForLevel(level);
    system.derived.techniqueAccessLevel = this._techniqueAccessLevel(system, level);
    system.derived.techniqueKnown = this.items.filter((entry) => entry.type === "tecnica").length;
    system.derived.physicalDR = 0;

    const passiveEffects = this._collectPassiveEffects();

    for (const key of FEM.attributeKeys) {
      const attribute = system.attributes[key];
      attribute.mod = Math.floor(((Number(attribute.value) || 10) - 10) / 2);
    }

    for (const [key, config] of Object.entries(FEM.skills)) {
      const skill = system.skills[key];
      const attrMod = system.attributes[skill.attribute || config.attribute]?.mod ?? 0;
      const rank = Number(skill.rank) || 0;
      const masteryBonus = rank === 1 ? mastery : rank === 2 ? Math.floor(mastery * 1.5) : 0;
      skill.attribute = skill.attribute || config.attribute;
      skill.total = attrMod + halfLevel + masteryBonus + (Number(skill.bonus) || 0) + (passiveEffects.skillBonuses[key] ?? 0);
    }

    system.derived.initiative = system.attributes.dex.mod + passiveEffects.initiativeBonus + (Number(manual.initiative) || 0);
    system.derived.movement = 9 + (origin?.movementBonus ?? 0) + passiveEffects.movementBonus + (Number(manual.movement) || 0);
    system.derived.armor = 10 + system.attributes.dex.mod + passiveEffects.armorBonus + (Number(manual.armor) || 0);
    system.derived.physicalDR = passiveEffects.physicalDR + (Number(manual.physicalDR) || 0);
    system.derived.attention = 10 + (system.skills.perception?.total ?? 0) + (Number(manual.attention) || 0);
    const specAttribute = system.specializationDcAttribute || specialization?.dcAttributes?.[0] || "str";
    system.derived.specializationDC = 10 + halfLevel + (system.attributes[specAttribute]?.mod ?? 0) + (Number(manual.specializationDC) || 0);
    const techAttribute = system.techniqueAttribute || "int";
    system.derived.techniqueDC = 10 + halfLevel + (system.attributes[techAttribute]?.mod ?? 0) + (Number(manual.techniqueDC) || 0);
    system.derived.techniqueMax = this._techniqueMax(system, specialization, level, mastery);

    if (system.autoResources && specialization && level > 0) {
      const conMod = system.attributes.con.mod;
      const hpMax = specialization.hpFirst + conMod + Math.max(level - 1, 0) * (specialization.hpFixed + conMod);
      const energyAttribute = system.attributes[techAttribute]?.mod ?? 0;
      const clanHealthBonus = clan?.healthBonus?.(level) ?? 0;
      const clanEnergyBonus = clan?.energyBonus?.(level) ?? 0;
      const energyMax = (specialization.energyPerLevel * level) + (specialization.addTechniqueAttributeToEnergy ? energyAttribute : 0) + clanEnergyBonus;
      system.resources.health.max = Math.max(hpMax + clanHealthBonus + passiveEffects.healthMaxBonus, 1);
      system.resources.energy.max = Math.max(energyMax + passiveEffects.energyMaxBonus, 0);
      if (specialization.energyPerLevel === 0) system.resources.energy.value = 0;
    }

    if (system.specialization === "restringido") {
      system.resources.vigor.max = Math.max(level * 4, 0);
    }

    if (system.autoGrade) system.grade = this._gradeForLevel(level);
  }

  _gradeForLevel(level) {
    if (level >= 18) return "Grau Especial";
    if (level >= 14) return "Primeiro Grau";
    if (level >= 8) return "Segundo Grau";
    if (level >= 5) return "Terceiro Grau";
    return "Quarto Grau";
  }

  _techniqueAccessLevel(system, level) {
    if (system.specialization === "tecnico") {
      if (level >= 15) return 5;
      if (level >= 11) return 4;
      if (level >= 7) return 3;
      if (level >= 4) return 2;
    }
    return FEM.techniqueAccessByLevel(level);
  }

  _aptitudeIncreasesForLevel(level) {
    if (level <= 1) return 0;
    return Math.floor(level / 2) + (level >= 10 ? 1 : 0) + (level >= 20 ? 1 : 0);
  }

  _techniqueMax(system, specialization, level, mastery) {
    if (!specialization || system.origin === "semTecnica") return 0;
    const attrs = system.attributes;
    switch (system.specialization) {
      case "lutador":
      case "combatente":
        return Math.max(attrs.str.mod, attrs.dex.mod) + mastery;
      case "tecnico":
        return Math.max(attrs.int.mod, attrs.wis.mod) + level;
      case "controlador":
      case "suporte":
        return Math.max(attrs.wis.mod, attrs.cha.mod) + Math.ceil(level / 2);
      case "restringido":
        return 0;
      default:
        return mastery;
    }
  }

  async setManualDerivedValue(key, targetValue) {
    const labels = {
      initiative: "Iniciativa",
      movement: "Movimento",
      armor: "CA",
      attention: "Atencao",
      physicalDR: "RD Fisica",
      specializationDC: "CD de Especializacao",
      techniqueDC: "CD da Tecnica"
    };
    if (!labels[key]) return;

    const target = Number(targetValue);
    if (!Number.isFinite(target)) return;

    const currentTotal = Number(this.system.derived[key]) || 0;
    const currentManual = Number(this.system.manual?.[key]) || 0;
    const baseValue = currentTotal - currentManual;
    const nextManual = target - baseValue;

    if (nextManual === currentManual) return;

    await this.update({ [`system.manual.${key}`]: nextManual });
    await this._postManualAudit(`${labels[key]} alterado manualmente`, [
      `Valor anterior: ${currentTotal}.`,
      `Novo valor: ${target}.`,
      `Ajuste manual registrado: ${nextManual >= 0 ? "+" : ""}${nextManual}.`
    ]);
  }

  async setItemUsesValue(itemId, field, targetValue) {
    const item = this.items.get(itemId);
    if (!item || !["value", "max"].includes(field)) return;

    const target = Math.max(Number(targetValue) || 0, 0);
    const data = this.getFeatureAutomationData(item);
    const update = {};
    let previous = data.usesValue;
    let next = target;
    let label = "Usos atuais";

    if (field === "value") {
      next = data.usesMax > 0 ? Math.min(target, data.usesMax) : target;
      update["system.uses.value"] = next;
    } else {
      const baseMax = this._featureUsesBaseMax(item.system);
      const manualMax = target - baseMax;
      previous = data.usesMax;
      label = "Usos maximos";
      update["system.uses.max"] = target;
      update["system.uses.temp"] = manualMax;
      if (data.usesValue > target) update["system.uses.value"] = target;
    }

    if (previous === next && field === "value") return;
    if (previous === target && field === "max") return;

    await item.update(update);
    await this._postManualAudit(`${label} de ${item.name} alterados`, [
      `Valor anterior: ${previous}.`,
      `Novo valor: ${field === "max" ? target : next}.`,
      field === "max" ? `Ajuste manual de maximo: ${(target - this._featureUsesBaseMax(item.system)) >= 0 ? "+" : ""}${target - this._featureUsesBaseMax(item.system)}.` : ""
    ]);
  }

  async _postManualAudit(title, lines = []) {
    ui.notifications?.info?.(title);
    const userName = game.user?.name ?? "Usuario";
    const details = lines.filter(Boolean).map((line) => `<p>${line}</p>`).join("");
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<h3>Ajuste manual: ${this.name}</h3><p><strong>${title}</strong> por ${userName}.</p>${details}`
    });
  }

  _collectPassiveEffects() {
    const effects = {
      armorBonus: 0,
      physicalDR: 0,
      initiativeBonus: 0,
      movementBonus: 0,
      healthMaxBonus: 0,
      energyMaxBonus: 0,
      skillBonuses: {}
    };

    for (const item of this.items.filter((entry) => ["aptidao", "talento", "habilidade"].includes(entry.type) && entry.system.equipped)) {
      switch (item.system.effectKey) {
        case "physicalDRFromEnergy":
          effects.physicalDR += 2 * (this.system.aptitudes.energy?.value ?? 0);
          break;
        case "armorFromEnergyPlusOne":
          effects.armorBonus += 1 + (this.system.aptitudes.energy?.value ?? 0);
          break;
        case "armorFromControl":
          effects.armorBonus += this.system.aptitudes.control?.value ?? 0;
          break;
        case "stealthPlusThree":
          effects.skillBonuses.stealth = (effects.skillBonuses.stealth ?? 0) + 3;
          break;
        case "initiativePlusMastery":
          effects.initiativeBonus += this.system.derived.mastery ?? 0;
          break;
        case "movementPlusValue":
          effects.movementBonus += Number(item.system.effectValue) || 0;
          break;
        case "armorPlusValue":
          effects.armorBonus += Number(item.system.effectValue) || 0;
          break;
        case "healthPerLevel":
          effects.healthMaxBonus += (Number(item.system.effectValue) || 0) * (Number(this.system.level) || 0);
          break;
        case "energyPlusMastery":
          effects.energyMaxBonus += this.system.derived.mastery ?? 0;
          break;
        case "physicalDRHalfLevel":
          effects.physicalDR += Math.floor((Number(this.system.level) || 0) / 2);
          break;
        case "skillBonus":
          if (item.system.skill) {
            effects.skillBonuses[item.system.skill] = (effects.skillBonuses[item.system.skill] ?? 0) + (Number(item.system.effectValue) || 0);
          }
          break;
        case "lutadorGostoPelaLuta": {
          const level = Number(this.system.level) || 0;
          const bonus = 1 + [9, 13, 17].filter((threshold) => level >= threshold).length;
          for (const skillKey of ["fortitude", "melee"]) {
            effects.skillBonuses[skillKey] = (effects.skillBonuses[skillKey] ?? 0) + bonus;
          }
          break;
        }
        case "restringidoEsquiva": {
          const level = Number(this.system.level) || 0;
          const bonus = 1 + [9, 16].filter((threshold) => level >= threshold).length;
          effects.armorBonus += bonus;
          effects.skillBonuses.reflexes = (effects.skillBonuses.reflexes ?? 0) + bonus;
          break;
        }
        case "restringidoDefinitiva":
          effects.movementBonus += 3;
          break;
      }
    }

    return effects;
  }

  getRollData() {
    const data = super.getRollData();
    data.aptitudes = this.system.aptitudes;
    data.attributes = this.system.attributes;
    data.skills = this.system.skills;
    data.level = this.system.level;
    data.technique = {
      dc: this.system.derived.techniqueDC,
      attribute: this.system.attributes[this.system.techniqueAttribute]?.mod ?? 0,
      skill: this.system.skills[this.system.techniqueSkill]?.total ?? 0
    };
    return data;
  }

  async applySpecializationDefaults() {
    const specialization = FEM.specializations[this.system.specialization];
    if (!specialization) return;

    const update = {};
    const skills = new Set(specialization.fixedSkills);
    if (specialization.choiceSkills.includes(this.system.specializationSkillChoice)) {
      skills.add(this.system.specializationSkillChoice);
    }

    for (const skillKey of skills) {
      const currentRank = Number(this.system.skills[skillKey]?.rank) || 0;
      if (currentRank < 1) update[`system.skills.${skillKey}.rank`] = 1;
    }

    if (!specialization.dcAttributes.includes(this.system.specializationDcAttribute)) {
      update["system.specializationDcAttribute"] = specialization.dcAttributes[0];
    }

    if (this.system.specialization === "restringido") {
      const vigorMax = Math.max((Number(this.system.level) || 0) * 4, 0);
      update["system.resources.vigor.max"] = vigorMax;
      if ((Number(this.system.resources.vigor.value) || 0) <= 0) update["system.resources.vigor.value"] = vigorMax;
    }

    if (Object.keys(update).length) await this.update(update);
    await this.createEligibleSpecializationAbilities();
    await this.createGrantedSpecializationAptitudes();
  }

  async createGrantedSpecializationAptitudes() {
    const level = Number(this.system.level) || 0;
    if (this.system.specialization !== "suporte" || level < 2) return [];
    if (this.items.some((item) => item.type === "aptidao" && item.name === "Energia Reversa")) return [];
    return this.createAptitudeFromPreset("energiaReversa");
  }

  async createEligibleSpecializationAbilities() {
    const specialization = this.system.specialization;
    if (!specialization) return [];

    const level = Number(this.system.level) || 0;
    const created = [];

    for (const [key, preset] of Object.entries(FEM.specializationAbilityPresets)) {
      if (!preset.auto || preset.specialization !== specialization || (preset.level ?? 0) > level) continue;
      const existingByKey = preset.automationKey
        ? this.items.find((item) => item.type === "habilidade" && item.system.automationKey === preset.automationKey)
        : null;
      if (existingByKey) continue;

      const possibleNames = [preset.name, ...(preset.aliases ?? [])];
      const existingByName = this.items.find((item) => item.type === "habilidade" && possibleNames.includes(item.name));
      if (existingByName) {
        await existingByName.update(this._presetItemUpdateData(preset));
        continue;
      }

      const documents = await this.createSpecializationAbilityFromPreset(key);
      if (documents?.length) created.push(...documents);
    }

    return created;
  }

  async applyOriginDefaults() {
    const origin = FEM.origins[this.system.origin];
    if (!origin) return;

    const update = {};

    if (origin.forcedSpecialization) update["system.specialization"] = origin.forcedSpecialization;

    if (this.system.origin === "herdado") {
      const clan = FEM.clans[this.system.originClan];
      if (clan?.skillChoices?.length) {
        if (this.system.originUseExpert && clan.skillChoices.includes(this.system.originExpertSkill)) {
          update[`system.skills.${this.system.originExpertSkill}.rank`] = Math.max(Number(this.system.skills[this.system.originExpertSkill]?.rank) || 0, 2);
        } else {
          for (const skillKey of [this.system.originSkillChoiceA, this.system.originSkillChoiceB]) {
            if (clan.skillChoices.includes(skillKey)) {
              update[`system.skills.${skillKey}.rank`] = Math.max(Number(this.system.skills[skillKey]?.rank) || 0, 1);
            }
          }
        }
      }
    }

    await this.update(update);
  }

  async rollAttribute(attributeKey) {
    const label = FEM.attributes[attributeKey] ?? attributeKey;
    const mod = this.system.attributes[attributeKey]?.mod ?? 0;
    return this._roll(`1d20 + ${mod}`, `${this.name}: ${label}`);
  }

  async rollSkill(skillKey) {
    const config = FEM.skills[skillKey];
    const skill = this.system.skills[skillKey];
    const label = config?.label ?? skillKey;
    const total = skill?.total ?? 0;
    return this._roll(`1d20 + ${total}`, `${this.name}: ${label}`);
  }

  async rollItem(itemId) {
    const item = this.items.get(itemId);
    if (!item) return null;
    if (item.type === "tecnica") return this.rollTechnique(item);
    if (item.system.automationKey) return this.useAutomatedFeature(item);
    const skillKey = item.system.skill;
    if (skillKey && this.system.skills[skillKey]) return this.rollSkill(skillKey);
    if (item.system.damage) return this._roll(item.system.damage, `${this.name}: ${item.name} - Dano`);
    if (["aptidao", "talento", "habilidade"].includes(item.type)) return this.postFeatureToChat(item);
    return item.sheet.render(true);
  }

  async postFeatureToChat(item) {
    const actionLabel = FEM.actions[item.system.action] ?? item.system.action;
    const effectLabel = FEM.effectKeys[item.system.effectKey] ?? item.system.effectKey;
    const details = [
      item.system.activationCost ? `<strong>Custo:</strong> ${item.system.activationCost}` : "",
      item.system.action ? `<strong>Acao:</strong> ${actionLabel}` : "",
      item.system.duration ? `<strong>Duracao:</strong> ${item.system.duration}` : "",
      item.system.requirements ? `<strong>Pre-requisitos:</strong> ${item.system.requirements}` : "",
      item.system.effectKey ? `<strong>Efeito automatico:</strong> ${effectLabel}` : ""
    ].filter(Boolean).map((line) => `<p>${line}</p>`).join("");

    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<h3>${item.name}</h3>${details}${item.system.description ?? ""}`
    });
  }

  async rollTechnique(item) {
    const system = item.system;
    const flavorParts = [
      `${this.name}: ${item.name}`,
      system.activationCost ? `Custo: ${system.activationCost}` : null,
      system.range ? `Alcance: ${system.range}` : null,
      system.target ? `Alvo: ${system.target}` : null,
      system.area ? `Area: ${system.area}` : null,
      system.duration ? `Duracao: ${system.duration}` : null,
      system.saveSkill ? `TR: ${FEM.skills[system.saveSkill]?.label ?? system.saveSkill} CD ${this.system.derived.techniqueDC}` : null
    ].filter(Boolean);

    if (system.useMode === "attack") {
      const skillKey = system.skill || this.system.techniqueSkill;
      await this.rollSkill(skillKey);
    }

    if (system.damage) await this._roll(system.damage, `${flavorParts.join(" | ")} - Dano`);
    else if (system.healing) await this._roll(system.healing, `${flavorParts.join(" | ")} - Cura`);
    else {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<h3>${item.name}</h3><p>${flavorParts.join("<br>")}</p>${system.description ?? ""}`
      });
    }
  }

  getFeatureAutomationData(item) {
    const system = item.system ?? item;
    const usesMax = this._featureUsesMax(system);
    const storedMax = Number(system.uses?.max) || 0;
    let usesValue = Number(system.uses?.value);
    if (!Number.isFinite(usesValue)) usesValue = usesMax;
    if (storedMax <= 0 && usesMax > 0 && usesValue <= 0) usesValue = usesMax;
    if (usesMax > 0) usesValue = Math.min(Math.max(usesValue, 0), usesMax);

    return {
      key: system.automationKey ?? "",
      label: FEM.automationKeys[system.automationKey] ?? system.automationKey ?? "",
      recovery: system.usesRecovery ?? "",
      recoveryLabel: FEM.recoveryTypes[system.usesRecovery] ?? system.usesRecovery ?? "",
      usesMax,
      usesValue,
      usesLabel: usesMax > 0 ? `${usesValue}/${usesMax}` : ""
    };
  }

  async useAutomatedFeature(item) {
    switch (item.system.automationKey) {
      case "supportCombat":
        return this._useSupportCombat(item);
      case "supportMedicine":
        return this._useConsumableFeature(item, "Maximize um dado de cura. A maestria tambem entra no total das curas.");
      case "supportPresence":
        return this._useSupportPresence(item);
      case "supportVersatility":
        return this._useSupportVersatility(item);
      case "combatPrep":
        return this._useConsumableFeature(item, "Gaste este ponto para uma arte de combate. Eliminar inimigos ou analisar o campo pode recuperar preparo conforme a regra.");
      case "controllerTraining":
        return this._postControllerTraining(item);
      case "controllerSummonReserve":
        return this._useConsumableFeature(item, "Gaste esta reserva como PE exclusivo para invocar ou ativar invocacoes.");
      case "restrictedSneakAttack":
        return this._roll(this._restrictedSneakAttackFormula(), `${this.name}: ${item.name}`);
      case "fighterExcitement":
        return this._postFighterExcitement(item);
      default:
        return this.postFeatureToChat(item);
    }
  }

  async recoverFeatureUses(restType = "short") {
    const itemUpdates = [];

    for (const item of this.items.filter((entry) => entry.type === "habilidade" && entry.system.automationKey)) {
      const data = this.getFeatureAutomationData(item);
      if (!data.usesMax) continue;

      const recovery = item.system.usesRecovery;
      let nextValue = data.usesValue;
      if (recovery === "shortLong" && ["short", "long"].includes(restType)) nextValue = data.usesMax;
      else if (recovery === "long" && restType === "long") nextValue = data.usesMax;
      else if (recovery === "shortHalfLongFull") {
        nextValue = restType === "long"
          ? data.usesMax
          : Math.min(data.usesMax, data.usesValue + Math.ceil(data.usesMax / 2));
      }

      const storedMax = Number(item.system.uses.max) || 0;
      if (nextValue !== data.usesValue || storedMax !== data.usesMax) {
        itemUpdates.push({
          _id: item.id,
          "system.uses.value": nextValue,
          "system.uses.max": data.usesMax
        });
      }
    }

    if (itemUpdates.length) await this.updateEmbeddedDocuments("Item", itemUpdates);

    if (this.system.specialization === "restringido") {
      const max = Math.max((Number(this.system.level) || 0) * 4, 0);
      const current = Number(this.system.resources.vigor.value) || 0;
      const next = restType === "long" ? max : Math.min(max, current + Math.ceil(max / 2));
      await this.update({
        "system.resources.vigor.value": next,
        "system.resources.vigor.max": max
      });
    }
  }

  async _useSupportCombat(item) {
    const data = this.getFeatureAutomationData(item);
    if (!(await this._consumeFeatureUse(item, 1, data))) return null;

    const formula = this._supportCombatHealingFormula();
    const remaining = Math.max(data.usesValue - 1, 0);
    return this._roll(formula, `${this.name}: ${item.name} - Cura (${remaining}/${data.usesMax} usos)`);
  }

  async _useSupportPresence(item) {
    if (!(await this._spendEnergy(2, item.name))) return null;
    const bonus = this._supportPresenceBonus();
    return this._postFeatureCard(item, [
      `Gasta 2 PE e deixa aliados em 9 metros inspirados durante a cena.`,
      `Bonus sugerido: +${bonus} em rolagens de pericia se pagar o custo progressivo completo.`
    ]);
  }

  async _useSupportVersatility(item) {
    if (!(await this._spendEnergy(1, item.name))) return null;
    return this._postFeatureCard(item, [
      `Gasta 1 PE para somar maestria em uma pericia sem maestria.`,
      `Bonus aplicado: +${this.system.derived.mastery}.`
    ]);
  }

  async _useConsumableFeature(item, message) {
    const data = this.getFeatureAutomationData(item);
    if (!(await this._consumeFeatureUse(item, 1, data))) return null;
    return this._postFeatureCard(item, [
      message,
      `Usos restantes: ${Math.max(data.usesValue - 1, 0)}/${data.usesMax}.`
    ]);
  }

  async _postControllerTraining(item) {
    const best = this._bestSpecializationAttribute();
    const mastery = this.system.derived.mastery ?? 0;
    const level = Number(this.system.level) || 0;
    const active = 2 + [6, 12, 18].filter((threshold) => level >= threshold).length;
    const total = Math.max(mastery + Math.max(best.mod, 0), 0);
    return this._postFeatureCard(item, [
      `Invocacoes maximas: ${total} (${mastery} maestria + ${Math.max(best.mod, 0)} ${best.label}).`,
      `Invocacoes ativas e comandos por acao: ${active}.`
    ]);
  }

  async _postFighterExcitement(item) {
    const level = Math.min(Math.max(Number(item.system.uses?.value) || 1, 1), 5);
    const die = { 1: "sem dado", 2: "1d4", 3: "1d6", 4: "2d4", 5: "2d6" }[level];
    return this._postFeatureCard(item, [
      `Nivel de empolgacao atual: ${level}.`,
      `Dado de empolgacao: ${die}. Ajuste os usos da habilidade para controlar o nivel atual.`
    ]);
  }

  async _consumeFeatureUse(item, amount = 1, data = null) {
    const feature = data ?? this.getFeatureAutomationData(item);
    if (!feature.usesMax) {
      ui.notifications.warn(`${item.name} nao possui usos automaticos configurados.`);
      return false;
    }
    if (feature.usesValue < amount) {
      ui.notifications.warn(`${item.name} nao possui usos restantes.`);
      return false;
    }
    await item.update({
      "system.uses.value": feature.usesValue - amount,
      "system.uses.max": feature.usesMax
    });
    return true;
  }

  async _spendEnergy(amount, label) {
    const current = Number(this.system.resources.energy.value) || 0;
    if (current < amount) {
      ui.notifications.warn(`${label}: PE insuficiente.`);
      return false;
    }
    await this.update({ "system.resources.energy.value": current - amount });
    return true;
  }

  async _postFeatureCard(item, lines = []) {
    const details = lines.filter(Boolean).map((line) => `<p>${line}</p>`).join("");
    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<h3>${item.name}</h3>${details}${item.system.description ?? ""}`
    });
  }

  _featureUsesMax(system) {
    const baseMax = this._featureUsesBaseMax(system);
    if (!system.automationKey) return baseMax;
    return Math.max(baseMax + (Number(system.uses?.temp) || 0), 0);
  }

  _featureUsesBaseMax(system) {
    const level = Number(this.system.level) || 0;
    const mastery = this.system.derived.mastery ?? 0;
    const best = this._bestSpecializationAttribute();

    switch (system.automationKey) {
      case "supportCombat":
        return Math.max(best.mod, 0) * (level >= 20 ? 2 : 1);
      case "supportMedicine":
        return Math.floor(level / 2) + mastery;
      case "combatPrep":
        return level + mastery;
      case "controllerSummonReserve":
        return mastery;
      case "fighterExcitement":
        return 5;
      default:
        return Number(system.uses?.max) || 0;
    }
  }

  _supportCombatHealingFormula() {
    const level = Number(this.system.level) || 0;
    const dice = level >= 16 ? "6d10" : level >= 12 ? "6d8" : level >= 8 ? "3d12" : level >= 4 ? "2d12" : "2d6";
    const best = this._bestSpecializationAttribute();
    const attributeBonus = Math.max(best.mod, 0) * (level >= 20 ? 2 : 1);
    const masteryBonus = level >= 10 ? this.system.derived.mastery ?? 0 : 0;
    const flat = attributeBonus + masteryBonus;
    return flat > 0 ? `${dice} + ${flat}` : dice;
  }

  _supportPresenceBonus() {
    const level = Number(this.system.level) || 0;
    return 1 + [5, 9, 13, 17].filter((threshold) => level >= threshold).length;
  }

  _restrictedSneakAttackFormula() {
    const level = Number(this.system.level) || 0;
    if (level >= 15) return "6d8";
    if (level >= 12) return "5d8";
    if (level >= 9) return "4d8";
    if (level >= 6) return "3d8";
    if (level >= 3) return "2d8";
    return "1d8";
  }

  _bestSpecializationAttribute(keys = ["cha", "wis"]) {
    const candidates = keys.map((key) => ({
      key,
      label: FEM.attributes[key] ?? key,
      mod: this.system.attributes[key]?.mod ?? 0
    }));
    return candidates.sort((a, b) => b.mod - a.mod)[0] ?? { key: "", label: "", mod: 0 };
  }

  async createAptitudeFromPreset(presetKey) {
    const preset = FEM.aptitudePresets[presetKey];
    if (!preset) return null;

    return this.createEmbeddedDocuments("Item", [{
      name: preset.name,
      type: "aptidao",
      system: {
        category: preset.category ?? "",
        aptitude: preset.aptitude ?? "",
        action: preset.action ?? "",
        activationCost: preset.activationCost ?? "",
        damage: preset.damage ?? "",
        requirements: preset.requirements ?? "",
        effectKey: preset.effectKey ?? "",
        equipped: Boolean(preset.effectKey),
        description: preset.description ?? ""
      }
    }]);
  }

  async createTalentFromPreset(presetKey) {
    const preset = FEM.talentPresets[presetKey];
    if (!preset) return null;

    return this._createPresetItem("talento", preset);
  }

  async createSpecializationAbilityFromPreset(presetKey) {
    const preset = FEM.specializationAbilityPresets[presetKey];
    if (!preset) return null;

    return this._createPresetItem("habilidade", preset);
  }

  async _createPresetItem(type, preset) {
    return this.createEmbeddedDocuments("Item", [{
      name: preset.name,
      type,
      system: this._presetItemSystemData(preset)
    }]);
  }

  _presetItemSystemData(preset) {
    const usesMax = this._featureUsesMax(preset);
    const usesValue = Number.isFinite(Number(preset.usesValue)) ? Number(preset.usesValue) : usesMax;

    return {
      category: preset.category ?? "",
      level: preset.level ?? 0,
      specialization: preset.specialization ?? "",
      action: preset.action ?? "",
      activationCost: preset.activationCost ?? "",
      range: preset.range ?? "",
      target: preset.target ?? "",
      area: preset.area ?? "",
      damage: preset.damage ?? "",
      damageType: preset.damageType ?? "",
      healing: preset.healing ?? "",
      skill: preset.skill ?? "",
      useMode: preset.useMode ?? "",
      requirements: preset.requirements ?? "",
      effectKey: preset.effectKey ?? "",
      effectValue: preset.effectValue ?? 0,
      automationKey: preset.automationKey ?? "",
      usesRecovery: preset.usesRecovery ?? "",
      uses: {
        value: usesValue,
        max: usesMax,
        temp: 0
      },
      equipped: preset.equipped ?? Boolean(preset.effectKey),
      properties: preset.properties ?? "",
      description: preset.description ?? ""
    };
  }

  _presetItemUpdateData(preset) {
    const data = this._presetItemSystemData(preset);
    return {
      "system.category": data.category,
      "system.level": data.level,
      "system.specialization": data.specialization,
      "system.action": data.action,
      "system.activationCost": data.activationCost,
      "system.range": data.range,
      "system.target": data.target,
      "system.area": data.area,
      "system.damage": data.damage,
      "system.damageType": data.damageType,
      "system.healing": data.healing,
      "system.skill": data.skill,
      "system.useMode": data.useMode,
      "system.requirements": data.requirements,
      "system.effectKey": data.effectKey,
      "system.effectValue": data.effectValue,
      "system.automationKey": data.automationKey,
      "system.usesRecovery": data.usesRecovery,
      "system.uses.value": data.uses.value,
      "system.uses.max": data.uses.max,
      "system.uses.temp": data.uses.temp,
      "system.equipped": data.equipped,
      "system.properties": data.properties,
      "system.description": data.description
    };
  }

  async createTechniqueAbility({ level = 1, useMode = "save" } = {}) {
    const safeLevel = Math.min(Math.max(Number(level) || 0, 0), 5);
    const cost = FEM.techniqueCosts[safeLevel] ?? 0;
    const isArea = useMode === "areaSave";
    const damageMode = isArea ? "areaSave" : useMode === "attack" ? "singleAttack" : "singleSave";
    const isDamaging = ["attack", "save", "areaSave"].includes(useMode);

    return this.createEmbeddedDocuments("Item", [{
      name: `Habilidade de Tecnica Nivel ${safeLevel}`,
      type: "tecnica",
      system: {
        level: safeLevel,
        useMode: isArea ? "save" : useMode,
        activationCost: `${cost} PE`,
        action: safeLevel === 0 ? "variable" : "common",
        range: FEM.techniqueRanges[safeLevel] ?? "",
        area: isArea ? FEM.techniqueAreas[safeLevel] ?? "" : "",
        target: isArea ? "Area ou multiplos alvos" : "Uma criatura",
        saveSkill: isArea || useMode === "save" ? "fortitude" : "",
        skill: useMode === "attack" ? this.system.techniqueSkill : "",
        damage: isDamaging ? FEM.techniqueDamage[damageMode]?.[safeLevel] ?? "" : "",
        healing: useMode === "healing" ? `${Math.max(safeLevel, 1)}d8` : "",
        description: "Descreva aqui como esta habilidade aplica o funcionamento basico da tecnica."
      }
    }]);
  }

  async _roll(formula, flavor) {
    const roll = await new Roll(formula, this.getRollData()).evaluate();
    return roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor
    });
  }
}

export class FEMItem extends Item {}
