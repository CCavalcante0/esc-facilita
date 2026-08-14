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
| `SUPABASE_SECRET_KEY` | `/admin` cria o login do cliente (Supabase Auth) | Dashboard Supabase → Settings → API Keys |

Nunca commitar `.env.local` (já ignorado). Segredos ficam também nas env vars da Vercel.

### Bootstrap do primeiro operador

Ninguém se auto-cadastra (nem cliente, nem operador) — é assim por design (ver
issue #1). Isso significa que a primeíssima conta de operador precisa ser
criada manualmente, uma única vez, direto no Supabase Studio:

1. **Authentication → Add user** — crie com e-mail e senha (marque
   "Auto Confirm User"). Copie o UUID gerado.
2. **SQL Editor**:
   ```sql
   insert into public.perfis (id, role, nome)
   values ('<uuid do usuário criado acima>', 'operador', 'Seu Nome');
   ```
3. Login em `/login` com esse e-mail/senha → cai direto em `/admin`.

Depois disso, novos operadores só podem ser criados por outro operador via
SQL (não há tela para isso no M1 — só o cadastro de clientes tem UI).

> **Quem já administrava notícias precisa do mesmo passo 2.** O painel de
> notícias tinha login próprio em `/admin/login` e aceitava qualquer usuário
> autenticado. Agora ele vive sob o mesmo `/admin` do operador, com a mesma
> guarda de papel — então cada conta que já publicava notícias precisa de uma
> linha em `perfis` com `role = 'operador'`, senão é redirecionada para
> `/painel`. O login dessas contas passa a ser `/login`.

## Estrutura

```
src/
├── middleware.ts                # protege /painel e /admin (sessão + role do operador)
├── app/
│   ├── layout.tsx               # Inter local + metadata base + OG/Twitter
│   ├── page.tsx                 # ROTA / — landing B2C (crédito)
│   ├── para-operadores/         # ROTA /para-operadores — landing B2B (estruturação)
│   ├── login/, esqueci-senha/, redefinir-senha/  # auth (M1)
│   ├── auth/callback/route.ts   # troca o code do e-mail (PKCE) por sessão
│   ├── painel/                  # ROTA /painel — área do cliente (M1)
│   │   ├── layout.tsx           # topbar + botão sair
│   │   ├── page.tsx             # lista de contratos do cliente
│   │   └── [id]/page.tsx        # detalhe do contrato (visual = MockAreaCliente)
│   ├── noticias/                # ROTA /noticias — lista pública (ISR) + artigo
│   ├── admin/                   # ROTA /admin — mini-backoffice do operador (M1)
│   │   ├── layout.tsx           # topbar + guarda de role (redireciona não-operador)
│   │   ├── page.tsx             # lista de clientes
│   │   ├── clientes/[id]/       # detalhe do cliente + contratos
│   │   ├── contratos/[id]/      # parcelas do contrato (lançar/marcar paga)
│   │   └── noticias/            # CMS de notícias (herda a guarda de role do layout)
│   ├── opengraph-image.tsx      # OG image gerada (tokens da IDV)
│   ├── sitemap.ts / robots.ts   # SEO
│   ├── icon.svg                 # favicon (logo redução 1)
│   └── globals.css              # CSS portado das landings aprovadas (tokens da IDV)
├── components/                  # compartilhados entre as duas páginas
│   ├── Header.tsx / Footer.tsx  # variante b2c | b2b; Footer traz o rodapé legal obrigatório
│   ├── Logo.tsx                 # SVG inline oficial (cor | branca)
│   ├── Faq.tsx                  # details/summary acessível
│   ├── MockAreaCliente.tsx      # elemento assinatura do hero B2C — referência visual de /painel/[id]
│   ├── MockEscSystem.tsx        # elemento assinatura do hero B2B
│   ├── LeadForm.tsx             # formulário de pré-solicitação (client)
│   ├── LoginForm.tsx, EsqueciSenhaForm.tsx, RedefinirSenhaForm.tsx  # auth (client)
│   └── admin/                   # forms/ações do mini-backoffice (client)
├── actions/
│   ├── submit-lead.ts           # server action: valida + grava lead no Supabase
│   ├── auth.ts                  # signIn, signOut, requestPasswordReset, updatePassword
│   ├── admin.ts                 # criarCliente, criarContrato, criarParcela, atualizarParcelaStatus
│   └── noticias.ts              # CRUD das notícias (criar, editar, publicar, excluir)
└── lib/
    ├── config.ts                # ⚠️ WHATSAPP_NUMBER, SITE_URL, CONTACT_EMAIL (placeholders)
    ├── database.types.ts        # types gerados do banco
    └── supabase/
        ├── server.ts            # createServerSupabase (público) + createAuthServerClient (sessão)
        ├── client.ts            # client de Client Component (browser)
        ├── admin.ts             # service role — só para auth.admin.createUser
        └── middleware.ts        # renova a sessão a cada request
supabase/migrations/             # migrations versionadas
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
| **2** | Área do Cliente (auth, dashboard de contrato) | ✅ em andamento (M1 — issue #1) |
| **3** | Área do Operador / backoffice (esteira, ficha, upload de docs, credenciais) | ⏳ |
| **4** | Escola Facilita (blog, modelos, curso, vídeos) | ⏳ |

> `PRD-ESC-FACILITA.md`, citado neste README e no `ROADMAP.md`, não está
> neste repositório — o modelo de dados abaixo foi desenhado a partir da
> issue #1, não da seção 6 do PRD.

Tabelas hoje: `leads` (Fase 1) e `perfis` / `clientes` / `contratos` /
`parcelas` (M1 — RLS: cliente só enxerga os próprios registros, operador
enxerga tudo via `is_operador()`). Upload de documentos e solicitação de
novo crédito (tabela/bucket `documentos`) ficam para o M3.

## Fluxo de trabalho (Git)

- `main` protegida — trabalho em branches `feat/<modulo>-<descricao>` e PR.
- Não commitar segredos. Rodar `npm run build` antes de abrir PR.
- Mudanças de schema: criar migration em `supabase/migrations/` e aplicar no projeto Supabase.
