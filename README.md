# Feiticeiros e Maldicoes para Foundry VTT

Sistema nao oficial em desenvolvimento para jogar Feiticeiros e Maldicoes no Foundry VTT.

## Instalar localmente

1. Copie a pasta `feiticeiros-e-maldicoes` para a pasta `Data/systems` do Foundry.
2. Reinicie o Foundry VTT.
3. Crie um mundo usando o sistema `Feiticeiros e Maldicoes`.

## Versao 0.2.3

Esta versao cria a base jogavel e a primeira camada de automacoes:

- Manifesto `system.json`.
- Tipos de ator: personagem, NPC e invocacao.
- Tipos de item: arma, uniforme, escudo, equipamento, habilidade, tecnica, talento e aptidao.
- Ficha de ator com atributos, recursos, derivados, pericias e inventario.
- Calculo automatico de modificadores de atributo.
- Calculo automatico de bonus de maestria por nivel.
- Calculo automatico de pericias: modificador de atributo + metade do nivel + maestria/especialista + bonus.
- Rolagens de atributos e pericias no chat.
- Ficha basica de item com dano, custo, alcance, acao, propriedades e descricao.
- Especializacoes pre-cadastradas: Lutador, Especialista em Combate, Especialista em Tecnicas, Controlador, Suporte e Restringido.
- Calculo automatico opcional de PV e PE maximos por especializacao e nivel.
- Grau sugerido automaticamente pelo nivel.
- CD de especializacao por atributo permitido.
- Botao para aplicar maestrias fixas da especializacao e a escolha equivalente quando houver.
- Origens pre-cadastradas: Inato, Herdado, Derivado, Restringido, Feto Amaldicoado Hibrido, Sem Tecnica e Corpo Amaldicoado Mutante.
- Herancas de cla para Herdado: Gojo, Inumaki, Kamo e Zenin.
- Botao para aplicar origem, incluindo especializacao obrigatoria do Restringido e maestrias/especialista de cla.
- Movimento extra do Restringido calculado automaticamente.
- Bonus automatico de PV do Cla Kamo e PE do Cla Gojo quando o calculo automatico de recursos estiver ativo.
- Avisos de incompatibilidade, como Sem Tecnica com Especialista em Tecnicas.
- Aba de Aptidoes com niveis de Energia, Controle e Leitura, Barreira, Dominio e Energia Reversa.
- Contador automatico de aumentos de aptidao esperados pelo nivel.
- Presets para criar aptidoes comuns, como Aura Reforcada, Aura Macica, Aura Controlada, Leitura Rapida de Energia, Canalizar em Golpe, Dominio Simples, Tecnicas de Barreira, Energia Reversa e Raio Negro.
- Efeitos passivos automaticos para algumas aptidoes equipadas: bonus de CA, RD fisica e bonus em Furtividade.
- Ficha de item expandida para aptidoes com categoria, aptidao base, atributo de CD, custo, duracao, pre-requisitos e efeito automatico.
- Aba de Tecnicas com perfil da tecnica, funcionamento basico e habilidades de tecnica separadas dos itens comuns.
- Calculo de maximo de habilidades, habilidades conhecidas, nivel maximo acessivel e CD da tecnica.
- Criador basico de habilidades por nivel e modo: dano com TR, dano com ataque, area com TR, utilidade, passiva e cura.
- Custos, alcance e dano base preenchidos a partir das tabelas do livro.
- Botao Usar em habilidades de tecnica, com rolagem de ataque/dano/cura e lembrete de TR/CD quando aplicavel.
- Salvamento manual campo-a-campo nas fichas de ator e item, para corrigir casos em que o Foundry nao dispara o submit automatico da ficha.
- Salvamento reforcado usando caminhos achatados, listener nativo de formulario e `_onChangeInput` explicito.
- Contexto `system` exposto explicitamente para templates de ator e item, corrigindo campos que renderizavam vazios e pareciam nao salvar.
- Aba de Habilidades para talentos e habilidades de especializacao.
- Presets iniciais de talentos e habilidades de especializacao por especializacao.
- Motor de efeitos passivos compartilhado para aptidoes, talentos e habilidades equipadas.
- Efeitos automaticos iniciais: bonus de iniciativa por maestria, movimento fixo, CA fixa, PV por nivel, PE por maestria e bonus em pericias.
- Botao Usar para talentos, habilidades e aptidoes sem rolagem publicar um cartao no chat.
- Biblioteca inicial do livro adicionada aos presets: aptidoes de Aura, Controle e Leitura, Barreira, Energia Reversa, Especiais, talentos gerais e talentos de origem.
- Ficha de edicao de itens com selects para acao, tipo de dano, pericia, categoria, aptidao base, atributo de CD, modo de uso, teste de resistencia, efeito automatico e especializacao.
- Especializacoes revisadas com criacao automatica das habilidades base ate o nivel atual pelo botao Aplicar especializacao.
- Itens de habilidade agora possuem usos, recuperacao e chave de automacao.
- Suporte em Combate calcula cura, usos por Carisma/Sabedoria, melhorias por nivel, gasto de uso e recuperacao por descanso curto ou longo.
- Automacoes iniciais para Medicina Infalivel, Arte do Combate, Reserva para Invocacao, Ataque Furtivo, Empolgacao, Vigor do Restringido e progresso acelerado do Especialista em Tecnicas.
- Valores derivados como Iniciativa, Movimento, CA, Atencao, RD Fisica, CD de Especializacao e CD da Tecnica podem receber ajustes manuais auditados no chat.
- Usos atuais e maximos de habilidades automatizadas podem ser editados na ficha, com registro no chat e ajuste manual preservado sobre o calculo automatico.

## Proximas camadas

- Especializacoes com progressao automatica de PV e PE.
- Rolagens de ataque completas contra CA.
- Rolagem de dano integrada aos itens.
- Tecnicas com custo de PE, nivel, CD e teste de resistencia.
- Compendios de armas, uniformes, escudos, talentos, aptidoes e habilidades.
- Regras de condicoes, reducao de dano, integridade da alma e descansos.

## Nota

Este pacote nao inclui artes, textos extensos do livro ou conteudo protegido. Ele e apenas uma estrutura tecnica para uso pessoal e desenvolvimento.
