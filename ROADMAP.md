# Roadmap — ESC Facilita

Produto construído por **módulos**: cada módulo é uma entrega fechada, precificável e com fronteira clara. Uma issue por módulo, uma milestone por módulo.

> Referência de negócio e compliance: `PRD-ESC-FACILITA.md`. Convenções de IDV e fluxo de git: `README.md`.

## Mapa de módulos

| # | Módulo | Entrega | Receita | Depende de |
|---|--------|---------|---------|-----------|
| **M0** | Site institucional | 2 landings (B2C/B2B), SEO, formulário de lead → Supabase + WhatsApp | Indireta (capta lead) | — |
| **M1** | Área do Cliente | Login (operador cria credenciais), painel do contrato: saldo, parcelas, vencimento, conta p/ depósito | Indireta (retém) | M0 |
| **M2** | Consulta paga / Relatório | Integra SPC/Serasa + Open Banking, relatório próprio (~R$19,90; custo de terceiro ~R$25) | **Direta** | M1 |
| **M3** | Backoffice do Operador | Esteira, ficha do cliente, contratos e parcelas, baixa/atraso, credenciais, papéis | Habilita operação | M1 |
| **M4** | Cérebro / Motor de decisão | Quanto e como emprestar, probabilidade de pagamento, projeção de margem, precificação de risco | Protege margem | M2, M3 |
| **M5** | IA Consultiva (chatbot) | Conversa com o cliente, aceite de termos antes, armazena todos os diálogos | Engajamento | M0 |
| **M6** | IA Interna de Dados | Dashboard de dores/perfil a partir dos diálogos + carteira | Inteligência | M5 |
| **M7** | Indicação | Indicar aumenta o limite de empréstimo (não paga em dinheiro) | Crescimento | M1 |
| **M8** | Escola Facilita | Blog, modelos de contrato (lead gate), curso pago, vídeos | Direta (curso) | M0 |
| **M9** | Contratos / Jurídico | Contratos padronizados, assinatura, resguardo p/ cobrança | Reduz inadimplência | transversal |

## Relação com as fases do PRD

- **Fase 1** = M0 · **Fase 2** = M1 · **Fase 3** = M3 · **Fase 4** = M8.
- **M2, M4, M5, M6, M7, M9** são a camada de automação/inovação definida no kickoff — onde está a receita recorrente e o diferencial.

## Ordem recomendada

1. **M0** (concluído) → **M1** → **M3**. Sem backoffice não roda operação real.
2. **M2** em paralelo assim que M1 existir — primeiro módulo que gera caixa.
3. **M9** junto do M3: contrato bom reduz inadimplência.
4. **M5 → M6**: quanto antes começar a acumular diálogos, mais cedo o dado vira ativo.
5. **M4** quando houver carteira suficiente para calibrar as projeções.
6. **M7** e **M8** como alavancas, com a base já formada.

## Restrições que atravessam todos os módulos

- **Territorial:** a ESC atua no município da sede (São Luís) + limítrofes. Escalar pode exigir mais de uma ESC — validar antes de desenhar multi-tenant.
- **Compliance:** LGPD, Res. Bacen 85 e PLD-FT. Aceite de termos **antes** de qualquer diálogo no M5. Dados sensíveis nunca em texto plano; documentos em bucket privado com URL assinada.
- **IDV:** nenhuma cor ou fonte fora dos tokens da seção 2 do PRD.
- **Rodapé legal** obrigatório em toda página pública.
