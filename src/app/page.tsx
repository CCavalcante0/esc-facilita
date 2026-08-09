import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Faq } from "@/components/Faq";
import { MockAreaCliente } from "@/components/MockAreaCliente";
import { LeadForm } from "@/components/LeadForm";
import { HeroPattern } from "@/components/HeroPattern";
import { HeroGLLoader } from "@/components/HeroGLLoader";
import { Ticker } from "@/components/Ticker";
import { CATEGORIAS, listarPosts } from "@/lib/escola";

const SELOS = [
  "LC 167/2019",
  "Capital próprio",
  "Contrato formalizado",
  "Crédito sujeito a análise",
  "São Luís e municípios limítrofes",
  "Acompanhamento online",
];

const FAQ = [
  {
    pergunta: "Quem pode solicitar crédito na ESC Facilita?",
    resposta:
      "Empreendedores da nossa região de atuação, pessoa física (CPF) ou jurídica (CNPJ) — MEI, ME, EPP, autônomos e prestadores de serviço, inclusive quem trabalha com mídia digital.",
  },
  {
    pergunta: "Quais documentos são exigidos?",
    resposta:
      "RG, CPF e comprovante de residência. Para CNPJ, a documentação da empresa. Na comprovação de renda, aceitamos notas fiscais, contratos, relatórios de atendimento e o registro do seu trabalho digital. Valores mais altos podem exigir garantias.",
  },
  {
    pergunta: "Como funciona a análise de crédito?",
    resposta:
      "Consultamos score e histórico no Serasa e avaliamos a viabilidade de forma individual, considerando a realidade do seu negócio — e não apenas um algoritmo genérico.",
  },
  {
    pergunta: "O que é alienação fiduciária e quando é exigida?",
    resposta:
      "É a garantia em que um bem (veículo, equipamento) fica vinculado ao contrato até a quitação. É aplicada em valores mais altos. Como alternativa, é possível apresentar avalista ou fiador.",
  },
  {
    pergunta: "Como acompanho meu contrato depois da liberação?",
    resposta:
      "Você recebe usuário e senha da Área do Cliente e acompanha tudo online: parcelas pagas, valores em aberto ou em atraso, condições do contrato e conta para depósito — com a mesma praticidade de consultar um resultado de exame.",
  },
  {
    pergunta: "A ESC Facilita é regulamentada?",
    resposta:
      "Sim. Operamos como Empresa Simples de Crédito (ESC), modelo previsto na Lei Complementar nº 167/2019, com capital próprio, contratos formalizados e atuação no município da sede e municípios limítrofes.",
  },
];

export default function Home() {
  return (
    <div className="page-b2c">
      <Header variant="b2c" />

      <main>
      {/* HERO */}
      <section className="hero" id="topo">
        <HeroGLLoader />
        <HeroPattern />
        <div className="wrap hero-grid">
          <div className="hero-in">
            <span className="eyebrow">Empresa Simples de Crédito · LC 167/2019</span>
            <h1>
              Crédito com estrutura para quem{" "}
              <span className="az">empreende de verdade</span>.
            </h1>
            <p className="sub">
              Empréstimo, financiamento e antecipação de recebíveis para pessoa
              física e CNPJ. Análise criteriosa, contrato formalizado e
              acompanhamento online de cada parcela — com a clareza que o seu
              negócio exige.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-azul" href="#lead">
                Solicitar análise de crédito
              </Link>
              <Link className="btn btn-borda" href="#como-funciona">
                Entender o processo
              </Link>
            </div>
            <p className="hero-mini">
              Atendimento direto pelo WhatsApp ·{" "}
              <strong>Acompanhamento online do contrato</strong>, do primeiro
              pagamento à quitação.
            </p>
          </div>
          <div id="area-cliente">
            <MockAreaCliente />
          </div>
        </div>
      </section>

      <Ticker itens={SELOS} />

      {/* FAIXA ESC */}
      <section className="faixa">
        <div className="wrap faixa-grid">
          <div className="reveal">
            <h2>O que é uma Empresa Simples de Crédito?</h2>
            <p>
              A ESC é um modelo criado pela Lei Complementar 167/2019 para{" "}
              <span className="destaque">
                aproximar o crédito de quem empreende no próprio município
              </span>
              . A ESC Facilita opera com capital próprio: análise mais próxima,
              condições claras em contrato e decisão rápida — a estrutura de uma
              instituição, sem a distância de um banco.
            </p>
          </div>
          <div className="faixa-fatos reveal-dir">
            <div className="fato">
              <span className="f-chave">Regulada</span>
              <span className="f-texto">
                Modelo previsto em lei, com contratos formalizados.
              </span>
            </div>
            <div className="fato">
              <span className="f-chave">Local</span>
              <span className="f-texto">
                Atuação no município da sede e municípios limítrofes.
              </span>
            </div>
            <div className="fato">
              <span className="f-chave">CPF e CNPJ</span>
              <span className="f-texto">
                MEI, ME, EPP e autônomos que empreendem podem solicitar.
              </span>
            </div>
            <div className="fato">
              <span className="f-chave">Estruturada</span>
              <span className="f-texto">
                Garantias e condições proporcionais ao valor contratado.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="produtos">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Linhas de crédito</span>
            <h2 className="titulo">Três caminhos para capitalizar o seu negócio</h2>
            <p>
              Você apresenta a necessidade; nós fazemos a análise e apresentamos
              as condições — sem letra miúda.
            </p>
          </div>
          <div className="prod-grid">
            <div className="prod reveal" data-d="1">
              <h3>Empréstimo</h3>
              <p>
                Capital de giro para organizar o caixa, repor estoque ou investir
                no crescimento. Parcelas definidas em contrato e acompanhadas
                online.
              </p>
              <div className="quem-pode">CPF e CNPJ</div>
            </div>
            <div className="prod reveal" data-d="2">
              <h3>Financiamento</h3>
              <p>
                Aquisição de equipamento, veículo de trabalho ou estrutura. Em
                valores maiores, o próprio bem pode compor a garantia por
                alienação fiduciária.
              </p>
              <div className="quem-pode">CPF e CNPJ</div>
            </div>
            <div className="prod reveal" data-d="3">
              <h3>Antecipação de recebíveis</h3>
              <p>
                Contratos fechados ou vendas a receber viram capital imediato.
                Você antecipa o valor e mantém o fluxo do negócio.
              </p>
              <div className="quem-pode">CPF e CNPJ</div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Processo</span>
            <h2 className="titulo">Da solicitação ao recurso na conta</h2>
          </div>
          <div className="fluxo reveal" data-d="1">
            <div className="passo">
              <h3>Solicitação pelo WhatsApp</h3>
              <p>
                Você apresenta a necessidade: quanto, para quê e em qual prazo.
                Atendimento direto, sem fila de banco.
              </p>
            </div>
            <div className="passo">
              <h3>Análise de crédito</h3>
              <p>
                Consultamos score e histórico (Serasa) e avaliamos a viabilidade
                individualmente, como quem conhece o cliente de perto.
              </p>
            </div>
            <div className="passo">
              <h3>Formalização do contrato</h3>
              <p>
                Condições registradas com clareza. Valores maiores podem exigir
                alienação fiduciária ou avalista/fiador.
              </p>
            </div>
            <div className="passo">
              <h3>Liberação e acompanhamento</h3>
              <p>
                Recurso na conta e acesso à Área do Cliente para acompanhar cada
                parcela até a quitação.
              </p>
            </div>
          </div>
          <div className="docs-nota reveal" data-d="2">
            <strong>Documentos básicos:</strong> RG, CPF e comprovante de
            residência. Para CNPJ, documentação da empresa. Na comprovação de
            renda, aceitamos mais formas do que o mercado tradicional — veja a
            seguir.
          </div>
        </div>
      </section>

      {/* COMPROVAÇÃO FLEXÍVEL */}
      <section id="comprovacao" style={{ paddingTop: 0 }}>
        <div className="wrap flex-grid">
          <div className="reveal-esq">
            <span className="eyebrow">Diferencial da análise</span>
            <h2 className="titulo">
              Seu trabalho digital vale como comprovação de renda.
            </h2>
            <ul className="flex-lista">
              <li>
                <span className="check">✓</span> Relatórios de atendimentos e
                agenda de clientes
              </li>
              <li>
                <span className="check">✓</span> Perfil profissional ativo —
                publicações, alcance e movimento real
              </li>
              <li>
                <span className="check">✓</span> Contratos de prestação de
                serviço assinados
              </li>
              <li>
                <span className="check">✓</span> Notas fiscais emitidas, no CPF
                ou no CNPJ
              </li>
              <li>
                <span className="check">✓</span> Comprovantes de pagamento
                recebidos de clientes
              </li>
            </ul>
          </div>
          <div className="flex-card reveal-dir">
            <h3>
              O banco não sabe ler quem trabalha com a internet. Nós sabemos.
            </h3>
            <p>
              Criador de conteúdo, social media, prestador de serviço digital:
              quando o trabalho acontece online, ele deixa registro — e registro
              organizado vale na nossa análise de crédito.
            </p>
            <Link className="btn btn-branco" href="#lead">
              Solicitar minha análise
            </Link>
          </div>
        </div>
      </section>

      {/* ESCOLA FACILITA */}
      <section className="escola" id="escola">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Escola Facilita</span>
            <h2 className="titulo">
              Crédito negado não é o fim. É o ponto de partida.
            </h2>
            <p>
              Base de conhecimento, cursos e modelos de contrato para você
              organizar a renda, formalizar a operação e voltar com a análise
              aprovada. Regularizar para crescer.
            </p>
          </div>
          <div className="escola-grid">
            {listarPosts()
              .slice(0, 3)
              .map((post, i) => (
                <Link
                  key={post.slug}
                  className="card-post reveal"
                  data-d={i + 1}
                  href={`/escola/${post.slug}`}
                >
                  <div className={`capa ${CATEGORIAS[post.categoria].capa}`}></div>
                  <div className="corpo">
                    <span className="cat">
                      {CATEGORIAS[post.categoria].rotulo}
                    </span>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                  </div>
                </Link>
              ))}
          </div>
          <div className="escola-cta">
            <Link className="btn btn-profundo" href="/escola">
              Acessar a Escola Facilita
            </Link>
            <span className="yt">
              Em breve: canal da ESC Facilita no YouTube, com vídeos curtos e
              didáticos sobre cada etapa.
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="wrap">
          <div
            className="sec-head reveal"
            style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
          >
            <span className="eyebrow">Dúvidas frequentes</span>
            <h2 className="titulo">Perguntas e respostas diretas</h2>
          </div>
          <div className="reveal" data-d="1">
            <Faq itens={FAQ} />
          </div>
        </div>
      </section>

      {/* FORMULÁRIO DE PRÉ-SOLICITAÇÃO */}
      <section className="lead-sec" id="lead">
        <div className="wrap" style={{ display: "flex", justifyContent: "center" }}>
          <div className="reveal" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <LeadForm origem="credito" />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="wrap cta-box reveal">
          <h2>Pronto para estruturar o seu crédito?</h2>
          <p>
            Solicite sua análise pelo WhatsApp. Processo claro, resposta rápida e
            condições registradas em contrato.
          </p>
          <Link className="btn btn-branco" href="#lead">
            Falar com a ESC Facilita
          </Link>
        </div>
      </section>
      </main>

      <Footer variant="b2c" />
    </div>
  );
}
