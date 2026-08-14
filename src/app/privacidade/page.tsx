import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, WHATSAPP_DISPLAY } from "@/lib/config";

/**
 * Política de Privacidade (LGPD — Lei 13.709/2018).
 *
 * O conteúdo descreve EXATAMENTE o que o site faz hoje: o único tratamento de
 * dado pessoal é o formulário de pré-solicitação (nome, WhatsApp, valor e
 * finalidade) gravado na tabela `leads` do Supabase. Não há analytics, pixel,
 * cookie de terceiro nem rastreador — a CSP em next.config.ts (connect-src
 * 'self') impede tecnicamente que exista.
 *
 * Se um dia entrar analytics, pixel ou a Área do Cliente, ESTE ARQUIVO precisa
 * ser atualizado junto: as seções de cookies, compartilhamento e retenção
 * deixam de ser verdadeiras.
 */

const ATUALIZADO_EM = "2026-08-09";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a ESC Facilita coleta, usa, armazena e protege seus dados pessoais, e como você exerce seus direitos previstos na LGPD (Lei 13.709/2018).",
  alternates: { canonical: `${SITE_URL}/privacidade` },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/privacidade`,
    title: `Política de Privacidade · ${SITE_NAME}`,
    description:
      "Como a ESC Facilita trata seus dados pessoais e como exercer seus direitos na LGPD.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Política de Privacidade",
  url: `${SITE_URL}/privacidade`,
  inLanguage: "pt-BR",
  dateModified: ATUALIZADO_EM,
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
};

export default function Privacidade() {
  return (
    <div className="page-b2c">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header variant="b2c" />

      <main id="conteudo">
        <article className="post">
          <div className="wrap wrap-post">
            <header className="post-head">
              <span className="cat">Documento legal</span>
              <h1>Política de Privacidade</h1>
              <p className="post-desc">
                Como a ESC Facilita coleta, usa, armazena e protege seus dados
                pessoais — e como você exerce os direitos que a LGPD garante.
              </p>
              <p className="post-meta">
                Última atualização:{" "}
                <time dateTime={ATUALIZADO_EM}>9 de agosto de 2026</time>
              </p>
            </header>

            <div className="prose-esc">
              <h2>1. Quem trata seus dados</h2>
              <p>
                O controlador dos dados é a <strong>ESC FACILITA BRASIL LTDA</strong>,
                CNPJ 45.617.869/0001-18, Empresa Simples de Crédito constituída nos
                termos da Lei Complementar nº 167/2019, com sede em São Luís/MA.
              </p>
              <p>
                Para qualquer assunto relacionado a dados pessoais, incluindo o
                exercício dos seus direitos, o canal é{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou o
                WhatsApp {WHATSAPP_DISPLAY}.
              </p>

              <h2>2. Quais dados coletamos</h2>
              <p>
                Coletamos <strong>somente</strong> os dados que você digita no
                formulário de pré-solicitação deste site:
              </p>
              <ul>
                <li>
                  <strong>Nome</strong> — para identificar e tratar você pelo nome
                  no atendimento.
                </li>
                <li>
                  <strong>Número de WhatsApp</strong> — é por onde retornamos o
                  contato.
                </li>
                <li>
                  <strong>Valor pretendido</strong> (opcional) — para dimensionar a
                  conversa inicial.
                </li>
                <li>
                  <strong>Finalidade do crédito</strong> (opcional) — orienta o
                  desenho da operação.
                </li>
                <li>
                  <strong>Origem da solicitação</strong> — se veio do formulário de
                  crédito ou do diagnóstico para operadores.
                </li>
              </ul>
              <p>
                Registramos também a <strong>data e hora</strong> do envio e, de
                forma temporária, o <strong>endereço IP</strong> — este último
                exclusivamente para limitar envios automatizados (proteção
                antispam), não para criar perfil de navegação.
              </p>
              <p>
                <strong>Não pedimos CPF, RG, dados bancários, senha nem documentos
                neste site.</strong> Se algum documento for necessário para a
                análise de crédito, ele é solicitado depois, em canal próprio, já
                com você identificado.
              </p>

              <h2>3. Por que tratamos esses dados</h2>
              <p>
                A finalidade é única: <strong>retornar o seu contato e conduzir a
                análise de crédito que você solicitou</strong>. A base legal é o
                artigo 7º, inciso V, da LGPD — procedimentos preliminares
                relacionados a contrato do qual você é parte, a seu pedido — somada
                ao seu consentimento para o contato por WhatsApp, manifestado no
                envio do formulário.
              </p>
              <p>
                Não usamos seus dados para publicidade de terceiros, não os
                vendemos e não os cedemos para fins comerciais.
              </p>

              <h2>4. Cookies e rastreamento</h2>
              <p>
                <strong>Este site não usa cookies de rastreamento, analytics,
                pixel de rede social ou qualquer ferramenta de perfilamento.</strong>{" "}
                Não há Google Analytics, não há Pixel da Meta, não há mapa de calor.
              </p>
              <p>
                Isso não é só uma promessa: a política de segurança de conteúdo
                (CSP) do site bloqueia tecnicamente conexões a servidores externos.
                Por isso você não vê banner de cookies aqui — não há o que consentir.
              </p>

              <h2>5. Com quem compartilhamos</h2>
              <p>
                Seus dados ficam armazenados na infraestrutura do{" "}
                <strong>Supabase</strong> (banco de dados) e o site é servido pela{" "}
                <strong>Vercel</strong>. Ambos atuam como operadores, tratando os
                dados apenas conforme nossa instrução. Esses serviços podem
                armazenar dados em servidores fora do Brasil.
              </p>
              <p>
                Fora isso, o compartilhamento ocorre apenas quando houver obrigação
                legal ou regulatória, ou ordem de autoridade competente.
              </p>

              <h2>6. Por quanto tempo guardamos</h2>
              <p>
                Mantemos os dados da pré-solicitação enquanto durar o atendimento e,
                depois, pelo prazo necessário para cumprir obrigações legais e para
                defesa em eventual processo. Encerrada a finalidade e vencidos os
                prazos legais, os dados são eliminados.
              </p>
              <p>
                Você pode pedir a exclusão antes disso, a qualquer momento, pelos
                canais da seção 1 — ressalvado o que a lei nos obrigue a reter.
              </p>

              <h2>7. Como protegemos</h2>
              <ul>
                <li>Todo o tráfego do site é criptografado (HTTPS obrigatório).</li>
                <li>
                  O banco usa <em>Row Level Security</em>: o site consegue apenas{" "}
                  <strong>gravar</strong> uma solicitação, nunca ler as que já
                  existem. A leitura é restrita à operação, com credencial que vive
                  só no servidor.
                </li>
                <li>Nenhuma chave secreta trafega para o navegador.</li>
                <li>
                  Cabeçalhos de segurança bloqueiam scripts externos e o
                  enquadramento do site em páginas de terceiros.
                </li>
              </ul>

              <h2>8. Seus direitos</h2>
              <p>
                O artigo 18 da LGPD garante a você, a qualquer momento e sem custo,
                o direito de:
              </p>
              <ul>
                <li>confirmar se tratamos dados seus e acessá-los;</li>
                <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>
                  pedir anonimização, bloqueio ou eliminação de dados desnecessários
                  ou tratados fora da lei;
                </li>
                <li>solicitar a portabilidade a outro fornecedor;</li>
                <li>pedir a eliminação dos dados tratados com consentimento;</li>
                <li>saber com quem compartilhamos seus dados;</li>
                <li>revogar o consentimento;</li>
                <li>opor-se a um tratamento que considere irregular.</li>
              </ul>
              <p>
                Para exercer qualquer um deles, escreva para{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Respondemos
                no prazo legal. Você também pode reclamar à{" "}
                <a href="https://www.gov.br/anpd/pt-br">
                  Autoridade Nacional de Proteção de Dados (ANPD)
                </a>
                .
              </p>

              <h2>9. Menores de idade</h2>
              <p>
                O site e os produtos de crédito da ESC Facilita destinam-se a
                maiores de 18 anos. Não coletamos intencionalmente dados de
                crianças e adolescentes.
              </p>

              <h2>10. Alterações desta política</h2>
              <p>
                Se mudarmos a forma de tratar dados, atualizamos este documento e a
                data no topo da página. Recomendamos reler antes de enviar uma nova
                solicitação.
              </p>
            </div>

            <aside className="post-aviso">
              <strong>Alerta de segurança:</strong> a ESC Facilita{" "}
              <strong>nunca</strong> solicita pagamento antecipado para liberar
              crédito, nem pede senha, código de banco ou cartão. Nosso contato
              oficial é o WhatsApp {WHATSAPP_DISPLAY}. Na dúvida, fale conosco por{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> antes de
              qualquer pagamento.
            </aside>

            <p className="post-volta" style={{ padding: "32px 0 64px" }}>
              <Link href="/">← Voltar para a página inicial</Link>
            </p>
          </div>
        </article>
      </main>

      <Footer variant="b2c" />
    </div>
  );
}
