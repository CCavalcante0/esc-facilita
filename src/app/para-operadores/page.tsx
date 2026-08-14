import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Faq } from "@/components/Faq";
import { MockEscSystem } from "@/components/MockEscSystem";
import { LeadForm } from "@/components/LeadForm";
import { HeroPattern } from "@/components/HeroPattern";
import { HeroGLLoader } from "@/components/HeroGLLoader";
import { Ticker } from "@/components/Ticker";

const SELOS = [
  "Diagnóstico confidencial",
  "LC 167/2019",
  "Abertura da ESC",
  "Assessoria contábil e jurídica",
  "ESC System",
  "Regularizar para crescer",
];

export const metadata: Metadata = {
  title: "Torne-se uma Empresa Simples de Crédito",
  description:
    "Estruturação completa para quem opera crédito e quer se regularizar: abertura de ESC, assessoria jurídica e contábil contínua, ESC System e mentoria. Regularizar para crescer.",
  alternates: { canonical: "/para-operadores" },
  openGraph: {
    title: "ESC Facilita — Torne-se uma Empresa Simples de Crédito",
    description:
      "Estruturação completa para quem opera crédito: abertura de ESC, assessoria jurídica e contábil, ESC System e mentoria.",
    url: "/para-operadores",
  },
};

const FAQ = [
  {
    pergunta:
      "Eu já opero crédito informalmente. Posso ser fiscalizado por procurar vocês?",
    resposta:
      "O diagnóstico é confidencial e o nosso trabalho é justamente conduzir a transição para a operação regular, com orientação jurídica e contábil. O caminho é a regularização estruturada — organizar documentação, constituir a empresa adequada e operar dentro dos limites legais daqui em diante.",
  },
  {
    pergunta: "Abrir a ESC não resolve tudo?",
    resposta:
      "Abrir o CNPJ é o começo, não a solução. Sem escrituração contínua, contratos adequados, gestão de carteira e acompanhamento, a formalidade vira aparência. Por isso o plano combina abertura + sistema + assessoria mensal.",
  },
  {
    pergunta: "Qual o investimento?",
    resposta:
      "O plano de adesão é apresentado após o diagnóstico, porque a estrutura certa depende do volume, da situação atual e do desenho da operação. O diagnóstico define escopo e valores antes de qualquer compromisso.",
  },
  {
    pergunta: "Quem pode abrir uma ESC?",
    resposta:
      "Empreendedores que queiram operar empréstimo, financiamento e antecipação de recebíveis com capital próprio, atendendo pessoas físicas e pequenos negócios no município da sede e municípios limítrofes, conforme a LC 167/2019. No diagnóstico validamos se a ESC é a estrutura adequada para o seu caso.",
  },
  {
    pergunta: "Vou perder a autonomia que tenho hoje?",
    resposta:
      "Não — a proposta é o contrário: manter a autonomia que você conquistou, com uma base que sustente o crescimento. Você continua dono das decisões; a estrutura entra para dar registro, previsibilidade e segurança a elas.",
  },
  {
    pergunta:
      "Vocês também emprestam? Qual a relação com a operação de crédito de vocês?",
    resposta:
      'Sim — a ESC Facilita opera crédito na própria região (conheça em "Quero crédito"). É exatamente por operar que conseguimos entregar método, sistema e mentoria baseados em prática real, e não em teoria.',
  },
];

export default function ParaOperadores() {
  return (
    <div className="page-b2b">
      <Header variant="b2b" />

      <main id="conteudo">
      {/* HERO */}
      <section className="hero" id="topo">
        <HeroGLLoader />
        <HeroPattern />
        <div className="wrap hero-grid">
          <div className="hero-in">
            <span className="eyebrow">
              Para quem opera crédito · Estruturação de ESC
            </span>
            <h1>
              Sua operação já movimenta alto.{" "}
              <span className="az">Sua estrutura precisa acompanhar.</span>
            </h1>
            <p className="sub">
              Estruturação completa para quem empresta, financia e antecipa
              recebíveis de forma independente: abertura de Empresa Simples de
              Crédito, assessoria jurídica e contábil contínua, sistema de gestão
              da carteira e mentoria de quem opera.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-azul" href="#lead">
                Solicitar diagnóstico da operação
              </Link>
              <Link className="btn btn-borda" href="#o-que-e">
                Entender o que é uma ESC
              </Link>
            </div>
            <p className="hero-mini">
              Diagnóstico confidencial ·{" "}
              <strong>
                Regularização como ferramenta de crescimento
              </strong>
              , não como castigo.
            </p>
          </div>
          <div>
            <MockEscSystem />
          </div>
        </div>
      </section>

      <Ticker itens={SELOS} />

      {/* FAIXA DE RECONHECIMENTO */}
      <section className="faixa">
        <div className="wrap reveal">
          <h2>O dinheiro cresceu. A estrutura ficou para trás.</h2>
          <p className="sub-faixa">
            Se a sua operação de crédito se parece com isto, você não precisa de
            mais um contador genérico — precisa de estrutura feita por quem
            entende esse mercado.
          </p>
          <div className="dores">
            <div className="dor">
              <span className="d-mark">01</span>
              <p>
                A carteira roda em planilhas soltas, conversas de WhatsApp e
                registros incompletos.
              </p>
            </div>
            <div className="dor">
              <span className="d-mark">02</span>
              <p>
                A movimentação é alta, mas a empresa não existe — ou o CNPJ não é
                compatível com o volume.
              </p>
            </div>
            <div className="dor">
              <span className="d-mark">03</span>
              <p>
                Inadimplência, juros e parcelas são acompanhados de memória,
                gerando erro e conflito.
              </p>
            </div>
            <div className="dor">
              <span className="d-mark">04</span>
              <p>
                O negócio depende inteiramente de você: da sua memória, da sua
                confiança, do seu improviso.
              </p>
            </div>
            <div className="dor">
              <span className="d-mark">05</span>
              <p>
                Você adia decisões de crescimento porque não sabe explicar o
                próprio crescimento.
              </p>
            </div>
            <div className="dor">
              <span className="d-mark">06</span>
              <p>
                Contratos frágeis — ou inexistentes — sustentam valores que
                mereciam documentação de verdade.
              </p>
            </div>
          </div>
          <p className="faixa-fecho">
            Operar no improviso já foi vantagem. Agora é o{" "}
            <span>seu maior risco</span>.
          </p>
        </div>
      </section>

      {/* O QUE É UMA ESC */}
      <section id="o-que-e">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Sem mistério</span>
            <h2 className="titulo">
              O que é — e o que não é — uma Empresa Simples de Crédito
            </h2>
            <p>
              A ESC é o modelo empresarial criado pela Lei Complementar 167/2019
              para quem quer operar crédito com capital próprio, dentro da lei.
              Conhecer os limites é parte da estrutura.
            </p>
          </div>
          <div className="esc-grid">
            <div className="esc-card reveal" data-d="1">
              <h3>
                <span className="sinal pode">✓</span> O que a ESC pode fazer
              </h3>
              <ul>
                <li>
                  Realizar empréstimos, financiamentos e antecipação de
                  recebíveis
                </li>
                <li>Operar com capital próprio, sem captar recursos de terceiros</li>
                <li>
                  Atender pessoas físicas e jurídicas (MEI, ME, EPP) no município
                  da sede e limítrofes
                </li>
                <li>Cobrar juros remuneratórios formalizados em contrato</li>
                <li>Constituir garantias, como alienação fiduciária e aval</li>
              </ul>
            </div>
            <div className="esc-card reveal" data-d="2">
              <h3>
                <span className="sinal nao">✕</span> O que a ESC não pode fazer
              </h3>
              <ul>
                <li>Captar dinheiro do público ou de terceiros para emprestar</li>
                <li>Operar fora do município da sede e municípios limítrofes</li>
                <li>
                  Funcionar sem escrituração e sem emissão dos registros exigidos
                </li>
                <li>
                  Servir de fachada para operação que continua informal na prática
                </li>
                <li>
                  Prometer “blindagem” — estrutura reduz exposição, não elimina
                  obrigações
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTODO */}
      <section id="metodo" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Método</span>
            <h2 className="titulo">Do improviso à estrutura, em quatro etapas</h2>
            <p>
              Regularização não é um evento — é um processo contínuo. Por isso o
              plano de adesão combina estruturação, sistema e acompanhamento
              mensal.
            </p>
          </div>
          <div className="metodo reveal" data-d="1">
            <div className="etapa">
              <h3>Diagnóstico da operação</h3>
              <p>
                Entendemos volume, carteira, riscos e situação atual — com
                confidencialidade e sem julgamento. Daqui sai o desenho da
                estrutura adequada.
              </p>
            </div>
            <div className="etapa">
              <h3>Estruturação e abertura</h3>
              <p>
                Constituição da sua ESC com validação jurídica: CNPJ correto,
                contrato social, enquadramento tributário e modelos de contrato de
                crédito.
              </p>
            </div>
            <div className="etapa">
              <h3>Operação assistida</h3>
              <p>
                Assessoria contábil e jurídica contínua + ESC System para gerir
                carteira, parcelas, juros e inadimplência com registro de tudo.
              </p>
            </div>
            <div className="etapa">
              <h3>Evolução do empresário</h3>
              <p>
                Mentoria, treinamentos e metodologia de análise de crédito para
                operar com critério, escalar a carteira e reduzir perdas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENTREGAS */}
      <section className="entregas" id="entregas">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Plano de adesão</span>
            <h2 className="titulo">O que você recebe ao entrar</h2>
          </div>
          <div className="ent-grid">
            <div className="ent reveal" data-d="1">
              <h3>Abertura da sua ESC</h3>
              <p>
                Constituição completa da Empresa Simples de Crédito, com
                orientação sobre limites legais, enquadramento e capital.
              </p>
            </div>
            <div className="ent reveal" data-d="2">
              <h3>ESC System</h3>
              <p>
                Sistema de gestão da carteira: contratos, parcelas, juros,
                inadimplência, previsão de recebimentos e histórico documentado.
              </p>
            </div>
            <div className="ent reveal" data-d="3">
              <h3>Assessoria contábil e tributária</h3>
              <p>
                Acompanhamento mensal por quem entende operação de crédito —
                escrituração, obrigações e planejamento tributário.
              </p>
            </div>
            <div className="ent reveal" data-d="1">
              <h3>Assessoria jurídica</h3>
              <p>
                Modelos de contrato, constituição de garantias, orientação em
                cobrança e suporte para decisões do dia a dia da operação.
              </p>
            </div>
            <div className="ent reveal" data-d="2">
              <h3>Mentoria e treinamentos</h3>
              <p>
                Acompanhamento de quem opera: rotinas, processos, precificação de
                risco e a transição de operador para empresário.
              </p>
            </div>
            <div className="ent reveal" data-d="3">
              <h3>Metodologia de análise de crédito</h3>
              <p>
                Critérios estruturados de análise — score, documentação,
                comprovação de renda e garantias proporcionais ao valor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OBJEÇÃO */}
      <section className="objecao">
        <div className="wrap">
          <div className="obj-grid">
            <div className="obj-card pergunta reveal-esq">
              <div className="rotulo">A pergunta que trava todo mundo</div>
              <h3>
                “Se eu regularizar, não vou pagar mais imposto e chamar mais
                atenção?”
              </h3>
              <p>
                É a objeção mais comum — e a mais compreensível. Quem construiu a
                operação no relacionamento e no improviso enxerga a formalização
                como custo e exposição.
              </p>
            </div>
            <div className="obj-card resposta reveal-dir">
              <div className="rotulo">A resposta honesta</div>
              <h3>
                A falta de estrutura já chama atenção. A organização reduz
                exposição.
              </h3>
              <p>
                Movimentação alta com estrutura baixa é o que gera risco:
                inconsistência, impossibilidade de explicar o próprio fluxo e
                patrimônio pessoal misturado ao negócio. Regularizar custa;
                continuar no improviso custa mais — e cobra de uma vez. Nosso
                papel é desenhar a estrutura com o enquadramento adequado, para
                que o imposto seja gestão, e não medo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFORMAÇÃO */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Transformação</span>
            <h2 className="titulo">
              De operador informal a empresário do mercado de crédito
            </h2>
          </div>
          <div className="trans-grid">
            <div className="trans antes reveal-esq">
              <div className="t-rotulo">Hoje — operação no improviso</div>
              <ul>
                <li>Carteira na planilha e cobrança pelo WhatsApp</li>
                <li>Movimentação na pessoa física ou em CNPJ inadequado</li>
                <li>Contratos frágeis, garantias informais</li>
                <li>Crescimento travado pelo medo de fiscalização</li>
                <li>Patrimônio pessoal misturado à operação</li>
                <li>Decisões por intuição, sem dado e sem registro</li>
              </ul>
            </div>
            <div className="trans depois reveal-dir">
              <div className="t-rotulo">Amanhã — operação estruturada</div>
              <ul>
                <li>ESC constituída, com enquadramento validado juridicamente</li>
                <li>Carteira gerida no ESC System, com histórico documentado</li>
                <li>Contratos formais, garantias constituídas em lei</li>
                <li>Crescimento tratado como projeto, com previsibilidade</li>
                <li>Pessoa física, patrimônio e operação separados</li>
                <li>Assessoria contábil e jurídica contínua ao seu lado</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div
            className="sec-head"
            style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
          >
            <span className="eyebrow">Dúvidas frequentes</span>
            <h2 className="titulo">Perguntas e respostas diretas</h2>
          </div>
          <Faq itens={FAQ} />
        </div>
      </section>

      {/* FORMULÁRIO DE DIAGNÓSTICO */}
      <section className="lead-sec" id="lead">
        <div className="wrap" style={{ display: "flex", justifyContent: "center" }}>
          <LeadForm origem="diagnostico" />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <div className="wrap cta-box reveal">
          <h2>Sua operação merece deixar de ser improviso.</h2>
          <p>
            Solicite o diagnóstico confidencial. Entendemos a sua realidade,
            mostramos o caminho e você decide com clareza.
          </p>
          <Link className="btn btn-branco" href="#lead">
            Solicitar diagnóstico pelo WhatsApp
          </Link>
        </div>
      </section>
      </main>

      <Footer variant="b2b" />
    </div>
  );
}
