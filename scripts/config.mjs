export const FEM = {};

FEM.attributeKeys = ["str", "dex", "con", "int", "wis", "cha"];

FEM.attributes = {
  str: "Forca",
  dex: "Destreza",
  con: "Constituicao",
  int: "Inteligencia",
  wis: "Sabedoria",
  cha: "Carisma"
};

FEM.skills = {
  acrobatics: { label: "Acrobacia", attribute: "dex", requiresMastery: false },
  cunning: { label: "Astucia", attribute: "int", requiresMastery: false, resistance: true },
  athletics: { label: "Atletismo", attribute: "str", requiresMastery: false },
  driving: { label: "Direcao", attribute: "int", requiresMastery: false, complementary: true },
  deception: { label: "Enganacao", attribute: "cha", requiresMastery: false },
  sorcery: { label: "Feiticaria", attribute: "int", requiresMastery: true },
  fortitude: { label: "Fortitude", attribute: "con", requiresMastery: false, resistance: true },
  stealth: { label: "Furtividade", attribute: "dex", requiresMastery: false },
  history: { label: "Historia", attribute: "int", requiresMastery: false },
  integrity: { label: "Integridade", attribute: "con", requiresMastery: false },
  intimidation: { label: "Intimidacao", attribute: "cha", requiresMastery: false },
  insight: { label: "Intuicao", attribute: "wis", requiresMastery: false },
  investigation: { label: "Investigacao", attribute: "int", requiresMastery: false },
  melee: { label: "Luta", attribute: "str", altAttribute: "dex", requiresMastery: false, noExpert: true },
  medicine: { label: "Medicina", attribute: "wis", requiresMastery: true },
  occultism: { label: "Ocultismo", attribute: "wis", requiresMastery: false },
  craft: { label: "Oficio", attribute: "int", requiresMastery: true },
  perception: { label: "Percepcao", attribute: "wis", requiresMastery: false },
  performance: { label: "Performance", attribute: "cha", requiresMastery: false },
  persuasion: { label: "Persuasao", attribute: "cha", requiresMastery: false },
  ranged: { label: "Pontaria", attribute: "dex", altAttribute: "str", requiresMastery: false, noExpert: true },
  sleight: { label: "Prestidigitacao", attribute: "dex", requiresMastery: true },
  reflexes: { label: "Reflexos", attribute: "dex", requiresMastery: false, resistance: true },
  religion: { label: "Religiao", attribute: "int", requiresMastery: false, complementary: true },
  survival: { label: "Sobrevivencia", attribute: "wis", requiresMastery: false, complementary: true },
  technology: { label: "Tecnologia", attribute: "int", requiresMastery: false },
  will: { label: "Vontade", attribute: "wis", requiresMastery: false, resistance: true }
};

FEM.specializations = {
  lutador: {
    label: "Lutador",
    hpFirst: 12,
    hpFixed: 6,
    hpDie: "1d10",
    energyPerLevel: 4,
    fixedSkills: ["fortitude", "melee", "reflexes"],
    choiceSkills: ["athletics", "acrobatics"],
    freeSkills: 2,
    dcAttributes: ["str", "dex"],
    equipment: "Armas marciais, escudo leve e um kit de ferramentas."
  },
  combatente: {
    label: "Especialista em Combate",
    hpFirst: 12,
    hpFixed: 6,
    hpDie: "1d10",
    energyPerLevel: 4,
    fixedSkills: ["melee", "ranged", "fortitude"],
    choiceSkills: ["athletics", "acrobatics"],
    freeSkills: 3,
    dcAttributes: ["str", "dex", "wis"],
    equipment: "Todas as armas, escudos e dois kits de ferramentas."
  },
  tecnico: {
    label: "Especialista em Tecnicas",
    hpFirst: 10,
    hpFixed: 5,
    hpDie: "1d8",
    energyPerLevel: 6,
    addTechniqueAttributeToEnergy: true,
    fixedSkills: ["cunning", "sorcery", "occultism", "will"],
    choiceSkills: [],
    freeSkills: 3,
    dcAttributes: ["int", "wis"],
    equipment: "Armas simples, armas a distancia e dois kits de ferramentas."
  },
  controlador: {
    label: "Controlador",
    hpFirst: 10,
    hpFixed: 5,
    hpDie: "1d8",
    energyPerLevel: 5,
    addTechniqueAttributeToEnergy: true,
    fixedSkills: ["cunning", "persuasion", "perception", "will"],
    choiceSkills: [],
    freeSkills: 2,
    dcAttributes: ["cha", "wis"],
    equipment: "Armas simples, escudo leve e um kit de ferramenta."
  },
  suporte: {
    label: "Suporte",
    hpFirst: 10,
    hpFixed: 5,
    hpDie: "1d8",
    energyPerLevel: 5,
    addTechniqueAttributeToEnergy: true,
    fixedSkills: ["cunning", "medicine", "sleight", "will"],
    choiceSkills: [],
    freeSkills: 3,
    dcAttributes: ["cha", "wis"],
    equipment: "Armas simples, escudos e dois kits de ferramentas."
  },
  restringido: {
    label: "Restringido",
    hpFirst: 16,
    hpFixed: 7,
    hpDie: "1d12",
    energyPerLevel: 0,
    fixedSkills: ["fortitude", "melee", "ranged", "reflexes"],
    choiceSkills: [],
    freeSkills: 4,
    forbiddenFreeSkills: ["sorcery"],
    dcAttributes: ["str", "dex", "con", "int", "wis", "cha"],
    equipment: "Todas as armas, escudos e um kit de ferramentas."
  }
};

FEM.origins = {
  inato: {
    label: "Inato",
    attributeNote: "+2 em um atributo e +1 em outro.",
    freeSkills: 0,
    summary: "Recebe um talento no 1 nivel e uma habilidade de tecnica adicional com custo reduzido em 1 PE."
  },
  herdado: {
    label: "Herdado",
    attributeNote: "Depende do cla escolhido.",
    clanRequired: true,
    freeSkills: 0,
    summary: "Recebe bonus, maestrias e heranca conforme o cla."
  },
  derivado: {
    label: "Derivado",
    attributeNote: "+2 em um atributo e +1 em outro.",
    freeSkills: 0,
    summary: "Recebe uma aptidao de Aura e pode recuperar PE igual ao dobro da maestria uma vez por dia."
  },
  restringido: {
    label: "Restringido",
    attributeNote: "+1 em Forca, Destreza e Constituicao; +2 pontos entre atributos fisicos.",
    movementBonus: 3,
    forcedSpecialization: "restringido",
    freeSkills: 0,
    summary: "Recebe acesso a especializacao Restringido, +3m de movimento e beneficios da Restricao Celeste."
  },
  feto: {
    label: "Feto Amaldicoado Hibrido",
    attributeNote: "+2 em um atributo e +1 em outro.",
    freeSkills: 0,
    summary: "Recebe Heranca Maldita, uma Caracteristica de Anatomia e Vigor Maldito."
  },
  semTecnica: {
    label: "Sem Tecnica",
    attributeNote: "+4 pontos entre atributos, maximo de 3 no mesmo atributo.",
    freeSkills: 2,
    forbiddenSpecialization: "tecnico",
    summary: "Recebe maestria em 2 pericias, beneficios por nivel e acesso ao Novo Estilo da Sombra."
  },
  corpo: {
    label: "Corpo Amaldicoado Mutante",
    attributeNote: "+2 pontos entre atributos.",
    freeSkills: 0,
    summary: "Recebe Forma de Vida Sintetica e Nucleos Multiplos."
  }
};

FEM.clans = {
  gojo: {
    label: "Cla Gojo",
    attributeNote: "+2 em Inteligencia ou Sabedoria; +1 no outro.",
    skillChoices: ["sorcery", "perception", "insight"],
    energyBonus: (level) => Math.floor(level / 2),
    summary: "+1 PE em todo nivel par e habilidades de tecnica adicionais nos niveis 1, 5, 10, 15 e 20."
  },
  inumaki: {
    label: "Cla Inumaki",
    attributeNote: "+2 em Inteligencia ou Carisma; +1 no outro.",
    skillChoices: ["sorcery", "perception", "insight"],
    summary: "Olhos de Cobra e Presas: comandos como acao bonus e vantagem em uma pericia de Carisma escolhida."
  },
  kamo: {
    label: "Cla Kamo",
    attributeNote: "+2 em Constituicao ou Sabedoria; +1 no outro.",
    skillChoices: ["athletics", "integrity", "medicine"],
    healthBonus: (level) => level < 10 ? level : 9 + ((level - 9) * 2),
    summary: "+1 PV por nivel; a partir do nivel 10, +2 PV por nivel."
  },
  zenin: {
    label: "Cla Zenin",
    attributeNote: "+2 em um atributo e +1 em outro.",
    freeSkills: 2,
    summary: "Maestria em 2 pericias quaisquer ou especialista em uma; habilidades de tecnica focadas."
  }
};

FEM.aptitudeTypes = {
  energy: "Energia",
  control: "Controle e Leitura",
  barrier: "Barreira",
  domain: "Dominio",
  reverse: "Energia Reversa"
};

FEM.aptitudeCategories = {
  aura: "Aura",
  control: "Controle e Leitura",
  domain: "Dominio",
  barrier: "Barreira",
  reverse: "Energia Reversa",
  special: "Especial"
};

FEM.aptitudePresets = {
  auraElemental: {
    name: "Aura Elemental",
    category: "aura",
    aptitude: "energy",
    action: "free",
    activationCost: "0 PE",
    requirements: "",
    description: "Altera o tipo de dano dos seus ataques com armas para um tipo elemental escolhido."
  },
  auraReforcada: {
    name: "Aura Reforcada",
    category: "aura",
    aptitude: "energy",
    effectKey: "physicalDRFromEnergy",
    requirements: "",
    description: "Recebe RD contra dano fisico igual ao dobro do Nivel de Aptidao em Energia."
  },
  auraMacica: {
    name: "Aura Macica",
    category: "aura",
    aptitude: "energy",
    effectKey: "armorFromEnergyPlusOne",
    requirements: "Constituicao 16",
    description: "Sua CA aumenta em 1 + Nivel de Aptidao em Energia."
  },
  auraControlada: {
    name: "Aura Controlada",
    category: "aura",
    aptitude: "energy",
    effectKey: "stealthPlusThree",
    activationCost: "1 PE para vantagem em Furtividade",
    requirements: "Destreza 16 e Maestria em Furtividade",
    description: "Recebe +3 em Furtividade e pode gastar 1 PE para vantagem na rolagem."
  },
  leituraRapida: {
    name: "Leitura Rapida de Energia",
    category: "control",
    aptitude: "control",
    effectKey: "armorFromControl",
    requirements: "",
    description: "Sua CA aumenta em um valor igual ao Nivel de Aptidao em Controle e Leitura."
  },
  canalizarGolpe: {
    name: "Canalizar em Golpe",
    category: "control",
    aptitude: "control",
    action: "bonus",
    activationCost: "PE igual ao nivel de Controle e Leitura",
    requirements: "",
    description: "Gaste PE igual ao nivel de Controle e Leitura para adicionar 1d8 por ponto gasto ao proximo ataque."
  },
  dominioSimples: {
    name: "Dominio Simples",
    category: "domain",
    aptitude: "domain",
    requirements: "",
    description: "Manifestacao simples de dominio, usada como base para varias tecnicas e defesas."
  },
  tecnicasBarreira: {
    name: "Tecnicas de Barreira",
    category: "barrier",
    aptitude: "barrier",
    requirements: "",
    description: "Permite criar e manipular barreiras protetivas."
  },
  energiaReversa: {
    name: "Energia Reversa",
    category: "reverse",
    aptitude: "reverse",
    requirements: "",
    description: "Permite usar energia reversa para recuperar e regenerar o corpo."
  },
  raioNegro: {
    name: "Raio Negro",
    category: "special",
    aptitude: "control",
    requirements: "Nivel 10, Controle e Leitura 3",
    description: "Aptidao especial ligada ao controle preciso de energia no impacto."
  }
};

Object.assign(FEM.aptitudePresets, {
  auraElementalAprimorada: {
    name: "Aura Elemental Aprimorada",
    category: "aura",
    aptitude: "energy",
    requirements: "Aura Elemental",
    description: "Adiciona dano elemental aos ataques e concede resistencia ao tipo escolhido."
  },
  auraImpenetravel: {
    name: "Aura Impenetravel",
    category: "aura",
    aptitude: "energy",
    action: "bonus",
    activationCost: "3 PE",
    duration: "1 rodada",
    requirements: "Aura Reforcada, Nivel 10, Energia 2",
    description: "Concede resistencia a dano cortante, perfurante e de impacto por uma rodada."
  },
  casuloEnergia: {
    name: "Casulo de Energia",
    category: "aura",
    aptitude: "energy",
    action: "common",
    activationCost: "6 PE",
    duration: "1 rodada",
    requirements: "Aura Impenetravel, Nivel 12, Energia 4",
    description: "Concede imunidade temporaria contra danos fisicos."
  },
  auraInofensiva: {
    name: "Aura Inofensiva",
    category: "aura",
    aptitude: "energy",
    requirements: "Carisma 16",
    description: "A primeira criatura que atacar voce em combate pode perder o ataque se falhar em Vontade."
  },
  auraComandante: {
    name: "Aura do Comandante",
    category: "aura",
    aptitude: "energy",
    action: "bonus",
    activationCost: "2 PE por turno",
    range: "4,5 metros",
    requirements: "Carisma 16, Nivel 8",
    description: "Aliados proximos recebem bonus em dano e testes durante o combate."
  },
  auraMacabra: {
    name: "Aura Macabra",
    category: "aura",
    aptitude: "energy",
    saveSkill: "will",
    activationCost: "1 PE para expandir",
    description: "Criaturas hostis proximas podem ficar amedrontadas."
  },
  auraLacerante: {
    name: "Aura Lacerante",
    category: "aura",
    aptitude: "energy",
    action: "free",
    duration: "1 rodada",
    saveSkill: "fortitude",
    description: "Causa dano de forca a criaturas proximas que falharem em Fortitude."
  },
  auraChamativa: {
    name: "Aura Chamativa",
    category: "aura",
    aptitude: "energy",
    saveSkill: "will",
    requirements: "Carisma 16",
    description: "Criaturas proximas podem ficar enfeiticadas."
  },
  auraAnuladora: {
    name: "Aura Anuladora",
    category: "aura",
    aptitude: "energy",
    activationCost: "2/4/6/10 PE",
    description: "Permite gastar PE para ignorar condicoes conforme a gravidade."
  },
  afinidadeAmpliada: {
    name: "Afinidade Ampliada",
    category: "aura",
    aptitude: "energy",
    description: "Aumenta o dano causado por um tipo elemental escolhido."
  },
  absorcaoElemental: {
    name: "Absorcao Elemental",
    category: "aura",
    aptitude: "energy",
    requirements: "Aura Elemental",
    description: "Ao receber dano elemental, pode armazenar parte dele para o proximo ataque."
  },
  auraContencao: {
    name: "Aura de Contencao",
    category: "aura",
    aptitude: "energy",
    effectKey: "skillBonus",
    effectValue: 3,
    requirements: "Forca ou Constituicao 15",
    description: "Melhora agarrar e dificulta a fuga de criaturas agarradas."
  },
  auraDrenadora: {
    name: "Aura Drenadora",
    category: "aura",
    aptitude: "energy",
    requirements: "Nivel 6, Energia 2",
    description: "Cura voce quando mata um inimigo."
  },
  auraEmbacada: {
    name: "Aura Embacada",
    category: "aura",
    aptitude: "energy",
    action: "bonus",
    activationCost: "2 PE",
    duration: "Cena",
    requirements: "Destreza 16",
    description: "Ataques corpo-a-corpo ou a distancia contra voce tem chance de falhar."
  },
  auraBastiao: {
    name: "Aura do Bastiao",
    category: "aura",
    aptitude: "energy",
    range: "3 metros",
    description: "Aliados proximos recebem bonus de CA baseado na Aptidao em Energia."
  },
  auraMovedica: {
    name: "Aura Movedica",
    category: "aura",
    aptitude: "energy",
    description: "Recebe RD contra ataques a distancia baseada na Aptidao em Energia."
  },
  enganacaoProjetada: {
    name: "Enganacao Projetada",
    category: "aura",
    aptitude: "energy",
    saveSkill: "cunning",
    requirements: "Destreza 18, Nivel 4",
    description: "Projeta a aura antes do ataque para tentar obter vantagem."
  },
  transferenciaAura: {
    name: "Transferencia de Aura",
    category: "aura",
    aptitude: "energy",
    action: "bonus",
    activationCost: "2 PE + 1 PE/rodada",
    range: "9 metros",
    description: "Transfere uma aura para uma criatura por uma rodada ou mais."
  },
  auraRedirecionadora: {
    name: "Aura Redirecionadora",
    category: "aura",
    aptitude: "energy",
    activationCost: "1 PE",
    requirements: "Destreza 16",
    description: "Permite redirecionar projetil ou arma de arremesso apos erro."
  },
  concentrarAura: {
    name: "Concentrar Aura",
    category: "aura",
    aptitude: "energy",
    action: "free",
    description: "Desabilita auras por uma rodada para adicionar dano de forca apos acertar."
  },
  golpeComAura: {
    name: "Golpe com Aura",
    category: "aura",
    aptitude: "energy",
    activationCost: "1 PE",
    description: "Imbui um ataque com aptidao de aura e aumenta a CD do teste de resistencia."
  },
  auraExcessiva: {
    name: "Aura Excessiva",
    category: "aura",
    aptitude: "energy",
    activationCost: "2 PE por rodada",
    requirements: "Aura Reforcada, Constituicao 16, Nivel 8",
    description: "A RD da Aura Reforcada passa a valer contra varios tipos de dano."
  },
  rastreioAvancado: {
    name: "Rastreio Avancado",
    category: "control",
    aptitude: "control",
    description: "Permite identificar e seguir rastros de energia amaldicoada."
  },
  canalizacaoAvancada: {
    name: "Canalizacao Avancada",
    category: "control",
    aptitude: "control",
    requirements: "Canalizar em Golpe, Forca ou Destreza 18, Nivel 8, Controle e Leitura 2",
    description: "Canalizar pode ser usado como reacao e melhora o dado de dano."
  },
  canalizacaoMaxima: {
    name: "Canalizacao Maxima",
    category: "control",
    aptitude: "control",
    requirements: "Canalizacao Avancada, Forca ou Destreza 20, Nivel 16, Controle e Leitura 4",
    description: "Leva Canalizar em Golpe ao apice, melhorando dano e afetando mais ataques."
  },
  cobrirSe: {
    name: "Cobrir-se",
    category: "control",
    aptitude: "control",
    action: "reaction",
    description: "Gasta PE ao receber dano para reduzir o dano recebido."
  },
  coberturaAvancada: {
    name: "Cobertura Avancada",
    category: "control",
    aptitude: "control",
    requirements: "Cobrir-se, Nivel 10, Controle e Leitura 2",
    description: "Melhora a reducao de dano de Cobrir-se."
  },
  projetarEnergia: {
    name: "Projetar Energia",
    category: "control",
    aptitude: "control",
    action: "common",
    description: "Converte PE em projetil de energia de forca."
  },
  tecnicasBarreiraResistentes: {
    name: "Paredes Resistentes",
    category: "barrier",
    aptitude: "barrier",
    requirements: "Nivel 4, Tecnicas de Barreira, Barreira 1",
    description: "Aumenta a vida das paredes criadas por Tecnicas de Barreira."
  },
  barreiraRapida: {
    name: "Barreira Rapida",
    category: "barrier",
    aptitude: "barrier",
    requirements: "Tecnicas de Barreira, Nivel 6, Barreira 2",
    description: "Erguer ou manipular barreiras se torna acao bonus."
  },
  barreiraImediata: {
    name: "Barreira Imediata",
    category: "barrier",
    aptitude: "barrier",
    requirements: "Barreira Rapida, Nivel 10, Barreira 3",
    description: "Permite erguer/manipular barreiras como reacao em situacoes defensivas."
  },
  cortina: {
    name: "Cortina",
    category: "barrier",
    aptitude: "barrier",
    requirements: "Tecnicas de Barreira",
    description: "Cria uma barreira de ocultamento em area, podendo receber condicoes."
  },
  liberacaoEnergiaReversa: {
    name: "Liberacao de Energia Reversa",
    category: "reverse",
    aptitude: "reverse",
    requirements: "Nivel 10, Energia Reversa",
    description: "Permite usar Energia Reversa para curar outras criaturas a distancia."
  },
  curaAmplificada: {
    name: "Cura Amplificada",
    category: "reverse",
    aptitude: "reverse",
    requirements: "Energia Reversa, Nivel 12, Energia Reversa 3",
    description: "Melhora os dados e modificador usados em curas com Energia Reversa."
  },
  curaGrupo: {
    name: "Cura em Grupo",
    category: "reverse",
    aptitude: "reverse",
    requirements: "Liberacao de Energia Reversa",
    description: "Permite dividir uma cura entre criaturas em alcance."
  },
  canalizarEnergiaReversa: {
    name: "Canalizar Energia Reversa",
    category: "reverse",
    aptitude: "reverse",
    requirements: "Canalizar em Golpe, Energia Reversa",
    description: "Adiciona dano de energia reversa contra maldicoes."
  },
  fluxoConstante: {
    name: "Fluxo Constante",
    category: "reverse",
    aptitude: "reverse",
    requirements: "Energia Reversa, Nivel 12, Energia Reversa 3",
    description: "Permite curas reativas ou livres usando Energia Reversa."
  },
  regeneracaoAprimorada: {
    name: "Regeneracao Aprimorada",
    category: "reverse",
    aptitude: "reverse",
    requirements: "Nivel 15, Cura Amplificada, Energia Reversa 4",
    description: "Permite regenerar membros perdidos ou feridas internas."
  },
  abencoadoFaiscasNegras: {
    name: "Abencoado pelas Faiscas Negras",
    category: "special",
    aptitude: "control",
    requirements: "Nivel 15, Raio Negro, Controle e Leitura 4, Energia 3",
    description: "Aprimora o uso de Raio Negro e seus beneficios em combate."
  },
  reversaoTecnica: {
    name: "Reversao de Tecnica",
    category: "special",
    aptitude: "reverse",
    requirements: "Nivel 12, Energia Reversa",
    description: "Permite abastecer a tecnica com energia reversa para criar efeitos opostos."
  },
  tecnicaMaxima: {
    name: "Tecnica Maxima",
    category: "special",
    aptitude: "special",
    requirements: "Habilidades de Tecnica Nivel 5, Maestria em Feiticaria",
    description: "Permite criar uma tecnica maxima a partir de uma habilidade de nivel 5."
  }
});

FEM.techniqueCosts = {
  0: 0,
  1: 2,
  2: 5,
  3: 8,
  4: 12,
  5: 20
};

FEM.techniqueAccessByLevel = (level) => {
  if (level >= 17) return 5;
  if (level >= 13) return 4;
  if (level >= 9) return 3;
  if (level >= 5) return 2;
  return 1;
};

FEM.techniqueDamage = {
  singleSave: {
    0: "1d10",
    1: "3d8",
    2: "7d8",
    3: "12d8",
    4: "14d10",
    5: "18d12"
  },
  singleAttack: {
    0: "1d10",
    1: "4d8",
    2: "8d8",
    3: "14d8",
    4: "16d10",
    5: "20d12"
  },
  areaSave: {
    1: "2d8",
    2: "4d8",
    3: "5d12",
    4: "10d10",
    5: "12d12"
  }
};

FEM.techniqueRanges = {
  0: "9 metros",
  1: "12 metros",
  2: "18 metros",
  3: "24 metros",
  4: "30 metros",
  5: "48 metros"
};

FEM.techniqueAreas = {
  1: "4,5 metros",
  2: "6 metros",
  3: "9 metros",
  4: "12 metros",
  5: "18 metros"
};

FEM.techniqueUseModes = {
  passive: "Passiva",
  attack: "Teste de Ataque",
  save: "Teste de Resistencia",
  utility: "Utilidade",
  healing: "Cura"
};

FEM.actions = {
  none: "Nenhuma",
  free: "Livre",
  reaction: "Reacao",
  bonus: "Bonus",
  common: "Comum",
  complete: "Completa",
  passive: "Passiva",
  variable: "Variavel",
  downtime: "Interludio"
};

FEM.damageTypes = {
  slashing: "Cortante",
  piercing: "Perfurante",
  impact: "Impacto",
  acid: "Acido",
  shocking: "Chocante",
  cold: "Congelante",
  reverse: "Energia Reversa",
  force: "Forca",
  necrotic: "Necrotico",
  psychic: "Psiquico",
  burning: "Queimante",
  radiant: "Radiante",
  poison: "Venenoso",
  soul: "Alma",
  variable: "Variavel"
};

FEM.effectKeys = {
  none: "Nenhum",
  physicalDRFromEnergy: "RD fisica por Energia",
  physicalDRHalfLevel: "RD fisica por metade do nivel",
  armorFromEnergyPlusOne: "CA por Energia + 1",
  armorFromControl: "CA por Controle",
  stealthPlusThree: "+3 Furtividade",
  initiativePlusMastery: "Iniciativa + Maestria",
  movementPlusValue: "Movimento + Valor",
  armorPlusValue: "CA + Valor",
  healthPerLevel: "PV por Nivel",
  energyPlusMastery: "PE + Maestria",
  skillBonus: "Bonus de Pericia",
  lutadorGostoPelaLuta: "Lutador: Gosto pela Luta",
  restringidoEsquiva: "Restringido: Esquiva Sobre-humana",
  restringidoDefinitiva: "Restringido: Restricao Definitiva"
};

FEM.automationKeys = {
  none: "Nenhuma",
  supportCombat: "Suporte em Combate",
  supportMedicine: "Medicina Infalivel",
  supportPresence: "Presenca Inspiradora",
  supportVersatility: "Versatilidade",
  combatPrep: "Pontos de Preparo",
  combatIntercept: "Intercepcao",
  controllerTraining: "Treinamento em Controle",
  controllerSummonReserve: "Reserva para Invocacao",
  restrictedSneakAttack: "Ataque Furtivo",
  fighterExcitement: "Empolgacao"
};

FEM.recoveryTypes = {
  none: "Nenhuma",
  shortLong: "Descanso curto ou longo",
  shortHalfLongFull: "Curto metade, longo tudo",
  long: "Descanso longo",
  scene: "Cena",
  turn: "Turno",
  manual: "Manual"
};

FEM.talentCategories = {
  general: "Geral",
  origin: "Origem",
  combat: "Combate",
  cursed: "Amaldicoado"
};

FEM.talentPresets = {
  aptidaoDesenvolvida: {
    name: "Aptidao Desenvolvida",
    category: "cursed",
    requirements: "Nivel 4",
    description: "Recebe ou melhora uma aptidao conforme permitido pelo mestre."
  },
  estudoAmaldicoado: {
    name: "Estudo Amaldicoado",
    category: "origin",
    requirements: "Origem Sem Tecnica",
    description: "Recebe uma aptidao amaldicoada a sua escolha, desde que atenda aos requisitos."
  },
  nocaoPreparacao: {
    name: "Nocao e Preparacao",
    category: "origin",
    requirements: "Origem Sem Tecnica, Nivel 4",
    description: "Recebe bonus contra efeitos de aptidoes amaldicoadas. Ajuste o bonus manualmente quando necessario."
  },
  vitalidade: {
    name: "Vitalidade",
    category: "general",
    effectKey: "healthPerLevel",
    effectValue: 1,
    description: "Aumenta os pontos de vida maximos em 1 por nivel enquanto equipado."
  },
  reflexosRapidos: {
    name: "Reflexos Rapidos",
    category: "general",
    effectKey: "initiativePlusMastery",
    description: "Adiciona o bonus de maestria na iniciativa enquanto equipado."
  },
  treinamentoPericia: {
    name: "Treinamento em Pericia",
    category: "general",
    description: "Use para registrar uma nova maestria, especializacao ou bonus em pericia."
  }
};

Object.assign(FEM.talentPresets, {
  tecnicasEmpunhaduraDupla: {
    name: "Tecnicas de Empunhadura Dupla",
    category: "combat",
    effectKey: "armorPlusValue",
    effectValue: 1,
    requirements: "Forca ou Destreza 14",
    description: "Melhora luta com duas armas e concede +1 CA quando empunhar uma arma em cada mao."
  },
  tecnicasImobilizacao: {
    name: "Tecnicas de Imobilizacao",
    category: "combat",
    requirements: "Forca ou Constituicao 16",
    description: "Melhora ataques contra criaturas agarradas e permite imobilizar alvos."
  },
  almaInquebravel: {
    name: "Alma Inquebravel",
    category: "general",
    effectKey: "skillBonus",
    effectValue: 5,
    requirements: "Constituicao 14",
    description: "Recebe bonus em Integridade e RD contra dano na alma."
  },
  robustezAprimorada: {
    name: "Robustez Aprimorada",
    category: "general",
    effectKey: "healthPerLevel",
    effectValue: 2,
    requirements: "Constituicao 14",
    description: "Aumenta PV maximo em 2 por nivel."
  },
  determinadoViver: {
    name: "Determinado a Viver",
    category: "general",
    requirements: "Constituicao 18 ou Nivel 10",
    description: "Uma vez por dia, evita cair para testes de morte e melhora testes posteriores."
  },
  correrAtirar: {
    name: "Correr e Atirar",
    category: "combat",
    requirements: "Destreza 14",
    description: "Ao disparar com arma de fogo em movimento, recebe defesa e dano adicional."
  },
  tecnicasEsquiva: {
    name: "Tecnicas de Esquiva",
    category: "combat",
    effectKey: "armorPlusValue",
    effectValue: 2,
    requirements: "Destreza 14",
    description: "Recebe +2 CA e Reflexos; pode usar Esquivar como acao bonus algumas vezes."
  },
  tecnicasMobilidade: {
    name: "Tecnicas de Mobilidade",
    category: "combat",
    effectKey: "movementPlusValue",
    effectValue: 3,
    requirements: "Destreza 14",
    description: "Aumenta movimento e melhora movimentacao agressiva."
  },
  discursoMotivador: {
    name: "Discurso Motivador",
    category: "general",
    requirements: "Maestria em pericia de Carisma",
    description: "Inspira aliados apos 10 minutos, concedendo PV temporarios."
  },
  tecnicasOcultamento: {
    name: "Tecnicas de Ocultamento",
    category: "general",
    requirements: "Maestria em Furtividade",
    description: "Aprimora Furtividade e ataques surpresa."
  },
  disparosPerfurantes: {
    name: "Disparos Perfurantes",
    category: "combat",
    requirements: "Nivel 4",
    description: "Ataques com arma de fogo podem ferir criatura adjacente ao alvo."
  },
  mestreCriacao: {
    name: "Mestre da Criacao",
    category: "general",
    requirements: "Nivel 4, Maestria em dois Oficios",
    description: "Melhora criacao de itens durante interludios e concede bonus em Oficios."
  },
  mestreChicotes: {
    name: "Mestre dos Chicotes",
    category: "combat",
    requirements: "Nivel 5",
    description: "Aprimora ataques com chicotes e permite puxar criaturas."
  },
  tecnicasSentinela: {
    name: "Tecnicas do Sentinela",
    category: "combat",
    requirements: "Nivel 5",
    description: "Fortalece ataques de oportunidade e controle de zona."
  },
  rapidoGatilho: {
    name: "Rapido no Gatilho",
    category: "combat",
    requirements: "Destreza 16, Nivel 6",
    description: "Facilita recarga e uso de armas a distancia em corpo-a-corpo."
  },
  especialistaConcussao: {
    name: "Especialista em Concussao",
    category: "combat",
    requirements: "Nivel 8",
    description: "Aprimora armas de impacto, deslocamento e efeitos de critico."
  },
  especialistaCortes: {
    name: "Especialista em Cortes",
    category: "combat",
    requirements: "Nivel 8",
    description: "Aprimora armas cortantes, reduz movimento e penaliza ataques em criticos."
  },
  especialistaPerfuracao: {
    name: "Especialista em Perfuracao",
    category: "combat",
    requirements: "Nivel 8",
    description: "Aprimora armas perfurantes, rerrola dano e melhora criticos."
  },
  mestreArremesso: {
    name: "Mestre do Arremesso",
    category: "combat",
    requirements: "Nivel 8, Tecnicas de Arremesso",
    description: "Melhora dano, acerto e alcance de armas de arremesso."
  },
  segredosArtesaoAlma: {
    name: "Segredos do Artesao da Alma",
    category: "general",
    requirements: "Nivel 10, Maestria em Integridade",
    description: "Aprimora Integridade, concede RD contra dano na alma e permite reparar nucleos."
  },
  familiaridadeTecnica: {
    name: "Familiaridade com Tecnica",
    category: "origin",
    requirements: "Origem Inato, Nivel 12",
    description: "Otimiza habilidades de tecnica, reduzindo custo ou aumentando dano."
  },
  ideiasOriginais: {
    name: "Ideias Originais",
    category: "origin",
    requirements: "Origem Inato, Nivel 5",
    description: "Recebe habilidade de tecnica adicional fora do maximo."
  },
  conhecimentosSigilosos: {
    name: "Conhecimentos Sigilosos",
    category: "origin",
    requirements: "Origem Herdado, Nivel 6",
    description: "Aprimora maestrias de cla e especializacoes relacionadas."
  },
  manualTecnica: {
    name: "Manual de Tecnica",
    category: "origin",
    requirements: "Origem Herdado, Nivel 5",
    description: "Recebe habilidade de tecnica adicional e aumenta o maximo de habilidades."
  },
  expansaoReserva: {
    name: "Expansao de Reserva",
    category: "origin",
    requirements: "Origem Derivado, Nivel 8",
    description: "Melhora Energia Antinatural e concede PE temporario junto da recuperacao."
  },
  quebraLimites: {
    name: "Quebra de Limites",
    category: "origin",
    requirements: "Origem Derivado, Nivel 6",
    description: "Recebe pontos de atributo e aumenta limites naturais."
  },
  desarmeOportunista: {
    name: "Desarme Oportunista",
    category: "origin",
    requirements: "Origem Restringido, Nivel 4",
    description: "Ao desarmar, pode gastar vigor para atacar com a arma desarmada."
  },
  regeneracaoMaior: {
    name: "Regeneracao Maior",
    category: "origin",
    requirements: "Origem Restringido, Nivel 10",
    description: "Melhora recuperacao em descansos curto e longo."
  },
  fisicoAperfeicoado: {
    name: "Fisico Aperfeicoado",
    category: "origin",
    requirements: "Origem Feto Amaldicoado Hibrido, Nivel 6",
    description: "Concede bonus em duas pericias escolhidas."
  },
  reposicaoSanguinea: {
    name: "Reposicao Sanguinea",
    category: "origin",
    requirements: "Origem Feto Amaldicoado Hibrido, Nivel 6",
    description: "Melhora Vigor Maldito e suas formas de uso."
  },
  coletaTalismas: {
    name: "Coleta de Talismas",
    category: "origin",
    requirements: "Origem Sem Tecnica",
    description: "Recebe talismas de shikigami conforme o nivel."
  },
  expansaoEstilo: {
    name: "Expansao de Estilo",
    category: "origin",
    requirements: "Origem Sem Tecnica, Dominio Simples, Nivel 6",
    description: "Recebe tecnicas de estilo adicionais."
  },
  nucleosEspecializados: {
    name: "Nucleos Especializados",
    category: "origin",
    requirements: "Origem Corpo Amaldicoado, Nivel 10",
    description: "Cada nucleo recebe imunidade escolhida e aprimoramento em uma pericia."
  },
  nucleosReforcados: {
    name: "Nucleos Reforcados",
    category: "origin",
    requirements: "Origem Corpo Amaldicoado, Nivel 10",
    description: "Previne destruicao de nucleo uma vez por missao e aumenta Integridade da Alma."
  }
});

FEM.specializationAbilityPresets = {
  lutadorMestreDaLuta: {
    name: "Mestre da Luta",
    specialization: "lutador",
    level: 1,
    auto: true,
    action: "bonus",
    description: "Base do Lutador: ataques desarmados aprimorados, ataque desarmado como acao bonus em certas condicoes e uso de Forca ou Destreza em armas marciais e golpes desarmados."
  },
  lutadorEmpolgacao: {
    name: "Empolgacao",
    specialization: "lutador",
    level: 1,
    auto: true,
    automationKey: "fighterExcitement",
    usesRecovery: "scene",
    usesValue: 1,
    description: "Controle o nivel de empolgacao manualmente entre 1 e 5. O botao publica a referencia do dado de empolgacao do nivel atual."
  },
  lutadorReflexo: {
    name: "Reflexo Evasivo",
    specialization: "lutador",
    level: 2,
    auto: true,
    effectKey: "physicalDRHalfLevel",
    equipped: true,
    description: "Concede reducao de dano contra todos os tipos exceto alma igual a metade do nivel de Lutador."
  },
  lutadorGostoLuta: {
    name: "Gosto pela Luta",
    specialization: "lutador",
    level: 5,
    auto: true,
    effectKey: "lutadorGostoPelaLuta",
    equipped: true,
    description: "Aplica bonus progressivo em Fortitude e Luta. O bonus tambem deve ser lembrado em rolagens de dano."
  },
  lutadorSuperior: {
    name: "Lutador Superior",
    specialization: "lutador",
    level: 20,
    auto: true,
    action: "free",
    description: "Permite um ataque desarmado adicional uma vez por rodada e inicia combates com empolgacao maior."
  },
  combatenteRepertorio: {
    name: "Repertorio do Especialista",
    specialization: "combatente",
    level: 1,
    auto: true,
    description: "Registre aqui os estilos de combate conhecidos e seus bonus progressivos."
  },
  combatentePreparo: {
    name: "Arte do Combate",
    aliases: ["Pontos de Preparo"],
    specialization: "combatente",
    level: 1,
    auto: true,
    automationKey: "combatPrep",
    usesRecovery: "shortHalfLongFull",
    description: "Recurso de preparo usado para artes de combate. Maximo automatico igual a nivel + bonus de maestria."
  },
  combatenteGolpeEspecial: {
    name: "Golpe Especial",
    specialization: "combatente",
    level: 4,
    auto: true,
    activationCost: "Minimo 1 PE",
    description: "Monte propriedades especiais para ataques, pagando o custo final em PE."
  },
  combatenteRenovacao: {
    name: "Renovacao pelo Sangue",
    specialization: "combatente",
    level: 6,
    auto: true,
    description: "Recupera PE quando acerta critico ou reduz um inimigo a 0 PV."
  },
  combatenteAutossuficiente: {
    name: "Autossuficiente",
    specialization: "combatente",
    level: 20,
    auto: true,
    usesRecovery: "scene",
    description: "Gera PE temporario para Golpe Especial e adiciona dano aos ataques."
  },
  tecnicoFundamentos: {
    name: "Dominio dos Fundamentos",
    specialization: "tecnico",
    level: 1,
    auto: true,
    description: "Registre as mudancas de fundamento conhecidas. Elas alteram custo, alcance, alvos, CD, precisao ou dados de habilidades de tecnica."
  },
  tecnicoConjuracao: {
    name: "Conjuracao Aprimorada",
    specialization: "tecnico",
    level: 1,
    auto: true,
    description: "Lembrete automatico: habilidades de tecnica que causam dano recebem bonus conforme o nivel da habilidade."
  },
  tecnicoAdiantar: {
    name: "Adiantar Evolucao",
    specialization: "tecnico",
    level: 4,
    auto: true,
    description: "O acesso a niveis de habilidades de tecnica usa a progressao acelerada do Especialista em Tecnicas."
  },
  tecnicoFoco: {
    name: "Foco Amaldicoado",
    specialization: "tecnico",
    level: 10,
    auto: true,
    description: "Registre o foco escolhido: destruicao, economia ou refino."
  },
  tecnicoHonrado: {
    name: "O Honrado",
    specialization: "tecnico",
    level: 20,
    auto: true,
    description: "Reduz custos de tecnicas baixas e aumenta CDs e ataques de habilidades de tecnica e aptidoes."
  },
  controladorTreinamento: {
    name: "Treinamento em Controle",
    aliases: ["Invocacoes"],
    specialization: "controlador",
    level: 1,
    auto: true,
    automationKey: "controllerTraining",
    description: "Mostra limites automaticos de invocacoes por maestria e melhor modificador entre Sabedoria e Carisma."
  },
  controladorReserva: {
    name: "Reserva para Invocacao",
    specialization: "controlador",
    level: 4,
    auto: true,
    automationKey: "controllerSummonReserve",
    usesRecovery: "long",
    description: "Reserva de PE exclusiva para invocar ou ativar invocacoes. Maximo automatico igual ao bonus de maestria."
  },
  controladorCompanhia: {
    name: "Companhia Libertadora",
    specialization: "controlador",
    level: 8,
    auto: true,
    description: "Enquanto uma invocacao estiver por perto, ignora terreno dificil e evita ataques de oportunidade por deslocamento entre inimigos."
  },
  controladorApogeu: {
    name: "Apogeu",
    specialization: "controlador",
    level: 10,
    auto: true,
    description: "Registre o caminho escolhido: controle concentrado, disperso ou sintonizado."
  },
  controladorApice: {
    name: "Apice do Controle",
    specialization: "controlador",
    level: 20,
    auto: true,
    description: "Aprimora invocacoes, facilita ativacao e dificulta ataques de invocacoes inimigas contra voce."
  },
  suporteCombate: {
    name: "Suporte em Combate",
    specialization: "suporte",
    level: 1,
    auto: true,
    automationKey: "supportCombat",
    usesRecovery: "shortLong",
    action: "bonus",
    range: "Toque",
    target: "Uma criatura",
    useMode: "healing",
    description: "Usa uma acao bonus para curar uma criatura em toque. Formula e usos sao calculados automaticamente por nivel e pelo melhor modificador entre Carisma e Sabedoria."
  },
  suportePresenca: {
    name: "Presenca Inspiradora",
    specialization: "suporte",
    level: 3,
    auto: true,
    automationKey: "supportPresence",
    activationCost: "2 PE ou mais",
    action: "bonus",
    range: "9 metros",
    description: "Consome PE e publica o bonus de inspiracao progressivo para aliados proximos."
  },
  suporteVersatilidade: {
    name: "Versatilidade",
    specialization: "suporte",
    level: 5,
    auto: true,
    automationKey: "supportVersatility",
    activationCost: "1 PE",
    action: "free",
    description: "Consome 1 PE e lembra que uma pericia sem maestria soma o bonus de maestria."
  },
  suporteMedicina: {
    name: "Medicina Infalivel",
    specialization: "suporte",
    level: 10,
    auto: true,
    automationKey: "supportMedicine",
    usesRecovery: "shortLong",
    description: "Usos automaticos iguais a metade do nivel + maestria para maximizar dado de cura. Tambem adiciona maestria as curas."
  },
  suporteMestre: {
    name: "Mestre Curandeiro",
    specialization: "suporte",
    level: 20,
    auto: true,
    description: "Dobra os usos de Suporte em Combate e dobra o modificador aplicado na cura dele."
  },
  restringidoCeus: {
    name: "Restrito pelos Ceus",
    specialization: "restringido",
    level: 1,
    auto: true,
    description: "Registra os beneficios fisicos, o arsenal, dadivas do ceu, estilo marcial e o recurso Vigor."
  },
  restringidoAtaqueFurtivo: {
    name: "Ataque Furtivo",
    specialization: "restringido",
    level: 2,
    auto: true,
    automationKey: "restrictedSneakAttack",
    action: "free",
    description: "Rola o dano adicional escalonado do Ataque Furtivo."
  },
  restringidoEsquiva: {
    name: "Esquiva Sobre-humana",
    specialization: "restringido",
    level: 3,
    auto: true,
    effectKey: "restringidoEsquiva",
    equipped: true,
    description: "Aplica bonus progressivo em CA e Reflexos. No nivel 10, lembre-se da especializacao em Reflexos."
  },
  restringidoDefinitiva: {
    name: "Restricao Definitiva",
    specialization: "restringido",
    level: 10,
    auto: true,
    effectKey: "restringidoDefinitiva",
    equipped: true,
    description: "Aumenta movimento, melhora furtividade contra usuarios de energia e eleva o nivel de dano de armas."
  },
  restringidoLiberacao: {
    name: "Libertacao do Destino",
    specialization: "restringido",
    level: 20,
    auto: true,
    description: "Concede resistencia fisica, bonus em ataques e bonus de dano por nivel."
  }
};

FEM.itemTypes = {
  arma: "Arma",
  uniforme: "Uniforme",
  escudo: "Escudo",
  equipamento: "Equipamento",
  habilidade: "Habilidade",
  tecnica: "Tecnica",
  talento: "Talento",
  aptidao: "Aptidao"
};
