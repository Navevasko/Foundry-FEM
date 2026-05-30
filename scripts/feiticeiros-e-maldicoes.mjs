import { FEM } from "./config.mjs";
import { FEMActorData, FEMItemData } from "./data-models.mjs";
import { FEMActor, FEMItem } from "./documents.mjs";
import { FEMActorSheet } from "./sheets/actor-sheet.mjs";
import { FEMItemSheet } from "./sheets/item-sheet.mjs";

Hooks.once("init", async () => {
  console.log("Feiticeiros e Maldicoes | Inicializando sistema");

  CONFIG.FEM = FEM;
  CONFIG.Actor.documentClass = FEMActor;
  CONFIG.Item.documentClass = FEMItem;

  for (const type of ["personagem", "npc", "invocacao"]) {
    CONFIG.Actor.dataModels[type] = FEMActorData;
  }

  for (const type of Object.keys(FEM.itemTypes)) {
    CONFIG.Item.dataModels[type] = FEMItemData;
  }

  const ActorSheetV1 = foundry.appv1?.sheets?.ActorSheet ?? globalThis.ActorSheet;
  const ItemSheetV1 = foundry.appv1?.sheets?.ItemSheet ?? globalThis.ItemSheet;
  const loadSystemTemplates = foundry.applications?.handlebars?.loadTemplates ?? globalThis.loadTemplates;

  try {
    Actors.unregisterSheet("core", ActorSheetV1);
  } catch (error) {
    console.warn("Feiticeiros e Maldicoes | Ficha core de ator nao removida.", error);
  }

  Actors.registerSheet("feiticeiros-e-maldicoes", FEMActorSheet, {
    types: ["personagem", "npc", "invocacao"],
    makeDefault: true
  });

  try {
    Items.unregisterSheet("core", ItemSheetV1);
  } catch (error) {
    console.warn("Feiticeiros e Maldicoes | Ficha core de item nao removida.", error);
  }

  Items.registerSheet("feiticeiros-e-maldicoes", FEMItemSheet, {
    types: Object.keys(FEM.itemTypes),
    makeDefault: true
  });

  await loadSystemTemplates([
    "systems/feiticeiros-e-maldicoes/templates/parts/resource.hbs"
  ]);
});
