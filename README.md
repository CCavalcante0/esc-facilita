# ESC Facilita — Plataforma Web

Plataforma web da **ESC FACILITA BRASIL LTDA** (Empresa Simples de Crédito, LC 167/2019 · São Luís/MA).
Duas frentes no mesmo domínio: **B2C** (crédito para o cliente final) e **B2B** (estruturação de ESC para operadores).

> Conduzido por Wellington Feitosa (CAPTEY). Referência de negócio, IDV e escopo: `PRD-ESC-FACILITA.md`.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4**
- **Supabase** (Postgres + RLS) — captação de leads
- **Vercel** — deploy
- Fonte **Inter** self-hosted (`next/font/local`, TTFs oficiais da IDV)

> ⚠️ Esta versão do Next.js tem breaking changes em relação ao conhecido. Antes de codar, leia o guia relevante em `node_modules/next/dist/docs/`. Ver `AGENTS.md`.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # e preencha os valores (ver seção Ambiente)
npm run dev                  # http://localhost:3000
```

`npm run build` para validar tipos e build de produção.

## Ambiente (.env.local)

| Variável | Uso | Onde pegar |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Dashboard Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publishable (insert de leads) | Dashboard Supabase → Settings → API Keys |
| `SUPABASE_SECRET_KEY` | (Fase 3) leitura de leads no backoffice | Dashboard Supabase → Settings → API Keys |

Nunca commitar `.env.local` (já ignorado). Segredos ficam também nas env vars da Vercel.

## Estrutura

```
src/
├── app/
│   ├── layout.tsx              # Inter local + metadata base + OG/Twitter
│   ├── page.tsx                # ROTA / — landing B2C (crédito)
│   ├── para-operadores/        # ROTA /para-operadores — landing B2B (estruturação)
│   ├── opengraph-image.tsx     # OG image gerada (tokens da IDV)
│   ├── sitemap.ts / robots.ts  # SEO
│   ├── icon.svg                # favicon (logo redução 1)
│   └── globals.css             # CSS portado das landings aprovadas (tokens da IDV)
├── components/                 # compartilhados entre as duas páginas
│   ├── Header.tsx / Footer.tsx # variante b2c | b2b; Footer traz o rodapé legal obrigatório
│   ├── Logo.tsx                # SVG inline oficial (cor | branca)
│   ├── Faq.tsx                 # details/summary acessível
│   ├── MockAreaCliente.tsx     # elemento assinatura do hero B2C
│   ├── MockEscSystem.tsx       # elemento assinatura do hero B2B
│   └── LeadForm.tsx            # formulário de pré-solicitação (client)
├── actions/submit-lead.ts      # server action: valida + grava lead no Supabase
└── lib/
    ├── config.ts               # ⚠️ WHATSAPP_NUMBER, SITE_URL, CONTACT_EMAIL (placeholders)
    ├── supabase/server.ts      # client Supabase (server-side)
    └── database.types.ts       # types gerados do banco
supabase/migrations/            # migrations versionadas
```

## Convenções de IDV (invioláveis)

- **Cores e fonte** apenas dos tokens em `tailwind.config.ts` / `:root` do `globals.css` (seção 2 do PRD). Nada fora do sistema.
- **Rodapé legal** obrigatório em toda página pública (razão social, CNPJ, LC 167/2019, "crédito sujeito a análise") — já centralizado em `Footer.tsx`.
- **Tom de voz**: firme, claro, confiável; sem emojis no copy institucional. Em dúvida, espelhar o copy das landings.
- CSS das seções é escopado por `.page-b2c` / `.page-b2b` quando os valores divergem entre as páginas.

## Pendências antes do go-live

Centralizadas em `src/lib/config.ts`:
- [ ] `WHATSAPP_NUMBER` — hoje placeholder `5598900000000`.
- [ ] `SITE_URL` — domínio definitivo (afeta sitemap, robots, OG).
- [ ] `CONTACT_EMAIL` — e-mail profissional (criado junto com o domínio).

## Escopo por fases (divisão de módulos)

O trabalho é modular. Cada fase é um módulo independente — abrir branch por módulo/feature.

| Fase | Módulo | Status |
|---|---|---|
| **1** | Site institucional (landings B2C/B2B), SEO, formulário de leads, deploy | ✅ em andamento |
| **2** | Área do Cliente (auth, dashboard de contrato, upload de docs) | ⏳ |
| **3** | Área do Operador / backoffice (esteira, ficha, contratos, credenciais) | ⏳ |
| **4** | Escola Facilita (blog, modelos, curso, vídeos) | ⏳ |

Modelo de dados completo e RLS por fase: seção 6 do PRD. **Fase 1 usa apenas a tabela `leads`.**

## Fluxo de trabalho (Git)

- `main` protegida — trabalho em branches `feat/<modulo>-<descricao>` e PR.
- Não commitar segredos. Rodar `npm run build` antes de abrir PR.
- Mudanças de schema: criar migration em `supabase/migrations/` e aplicar no projeto Supabase.
