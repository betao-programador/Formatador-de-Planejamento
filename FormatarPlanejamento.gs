/**
 * ============================================================
 * FORMATADOR AUTOMÁTICO DE PLANEJAMENTOS PEDAGÓGICOS
 * ============================================================
 *
 * Autor: Roberto Cardoso | Roberto Estúdios
 * Versão: 1.0.0
 *
 * Descrição:
 * Automatiza a formatação de documentos de planejamento
 * pedagógico gerados pelo Autocrat no Google Docs.
 *
 * Funcionalidades:
 * - Identificação automática de documentos gerados pelo Autocrat.
 * - Formatação de habilidades dos tipos EF e EM em negrito.
 * - Organização de conteúdos em parágrafos e listas.
 * - Aplicação de alinhamento, espaçamento e recuos.
 * - Preservação da formatação original do campo Referências.
 * - Execução automática por gatilho do Google Sheets.
 *
 * Requisitos:
 * - Google Sheets
 * - Google Docs
 * - Google Apps Script
 * - Autocrat
 *
 * Licença:
 * Apache License 2.0
 *
 * Copyright (c) 2026 Roberto Estúdios
 *
 * Este software é disponibilizado sob os termos da Apache License 2.0.
 * É permitido usar, copiar, modificar e distribuir este código,
 * inclusive para fins comerciais, respeitando as condições da licença.
 *
 * Uma cópia da licença completa está disponível em:
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * ============================================================
 */

const STATUS_AUTOCRAT = "Data merged and appended successfully;";
const COLUNA_STATUS = "Document Merge Status - Planejamento - CIE";
const COLUNA_LINK = "Merged Doc URL - Planejamento - CIE";

function processarNovoPlanejamento(e)
{
  const planilha = e.range.getSheet();
  const linha = e.range.getRow();
  const cabecalhos = planilha.getRange(1, 1, 1, planilha.getLastColumn()).getValues()[0];
  const colunaStatus = cabecalhos.indexOf(COLUNA_STATUS) + 1;
  const colunaLink = cabecalhos.indexOf(COLUNA_LINK) + 1;
  let link = "";
  let status = "";
  if (!colunaStatus || !colunaLink)
  {
    console.error("Cabeçalho de status encontrado: " + (colunaStatus > 0));
    console.error("Cabeçalho de link encontrado: " + (colunaLink > 0));
    console.error("Linha processada: " + linha);
    return;
  }
  const inicio = Date.now();
  const timeout = 30000; // 30 segundos
  while (Date.now() - inicio < timeout)
  {
    SpreadsheetApp.flush();
    status = planilha.getRange(linha, colunaStatus).getValue();
    link = planilha.getRange(linha, colunaLink).getValue();
    if (status.toString().startsWith(STATUS_AUTOCRAT) && link) break;
    Utilities.sleep(500);
  }
  if (!link || !status.toString().startsWith(STATUS_AUTOCRAT))
  {
    console.error("Autocrat não concluiu a geração do documento na linha " + linha);
    return;
  }
  processarDocumento(link);
}

function processarDocumento(link)
{
  if (typeof link !== "string")
  {
    console.error("O endereço do documento não é um texto válido.");
    return;
  }
  const resultado = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!resultado)
  {
    console.error("Link do documento inválido: " + link);
    return;
  }
  const id = resultado[1];
  try
  {
    const documento = DocumentApp.openById(id);
    const corpo = documento.getBody();
    formatarListasPlanejamento(corpo);
    documento.saveAndClose();
    console.log("Documento formatado: " + id);
  }
  catch (erro)
  {
    console.error("Erro ao formatar documento " + id + ": " + erro);
  }
}

function formatarCodigosHabilidades(corpo)
{
  const padrao = "\\((EF|EM)[^()\\n]*\\)";
  let encontrado = corpo.findText(padrao);
  while (encontrado)
  {
    const texto = encontrado.getElement().asText();
    texto.setBold(encontrado.getStartOffset(), encontrado.getEndOffsetInclusive(), true);
    encontrado = corpo.findText(padrao, encontrado);
  }
}

function formatarCelulaTabela(corpo, titulo, usarMarcadores = false)
{
  const tabelas = corpo.getTables();
  for (const tabela of tabelas)
  {
    for (let linha = 0; linha < tabela.getNumRows(); linha++)
    {
      const linhaTabela = tabela.getRow(linha);
      for (let coluna = 0; coluna < linhaTabela.getNumCells() - 1; coluna++)
      {
        const celulaTitulo = linhaTabela.getCell(coluna);
        if (celulaTitulo.getText().trim() !== titulo) continue;
        const celulaConteudo = linhaTabela.getCell(coluna + 1);
        const textoOriginal = celulaConteudo.getText();
        const itens = textoOriginal.split(/\r\n|\r|\n/).map(item => item.trim()).filter(item => item !== "");
        if (titulo !== "Referências")
        {
          celulaConteudo.clear();
          for (const item of itens)
          {
            let paragrafo;
            if (usarMarcadores)
            {
              paragrafo = celulaConteudo.appendListItem(item);
              paragrafo.setGlyphType(DocumentApp.GlyphType.BULLET);
            }
            else paragrafo = celulaConteudo.appendParagraph(item);
            paragrafo.setAlignment(DocumentApp.HorizontalAlignment.JUSTIFY);
            paragrafo.setSpacingBefore(0);
            paragrafo.setSpacingAfter(6);
            paragrafo.setIndentEnd(10.5);
            if (usarMarcadores)
            {
              paragrafo.setIndentStart(21.26); // Recuo à esquerda
              paragrafo.setIndentFirstLine(7.09); // Recuo da primeira linha
            }
            else
            {
              paragrafo.setIndentStart(7.09);
              paragrafo.setIndentFirstLine(7.09);
            }
          }
          while (celulaConteudo.getNumChildren() > 1) // Remove parágrafos vazios do início.
          {
            const primeiro = celulaConteudo.getChild(0);
            if (primeiro.getType() !== DocumentApp.ElementType.PARAGRAPH || primeiro.asParagraph().getText().trim() !== "") break;
            celulaConteudo.removeChild(primeiro);
          }
        }
        while (celulaConteudo.getNumChildren() > 1) // Remove parágrafos vazios do final.
        {
          const ultimo = celulaConteudo.getChild(celulaConteudo.getNumChildren() - 1);
          if (ultimo.getType() !== DocumentApp.ElementType.PARAGRAPH || ultimo.asParagraph().getText().trim() !== "") break;
          celulaConteudo.removeChild(ultimo);
        }
        formatarCodigosHabilidades(corpo);
        console.log("Campo formatado: " + titulo);
        return;
      }
    }
  }
  console.warn("Campo não encontrado: " + titulo);
}

function formatarListasPlanejamento(corpo)
{
  formatarCelulaTabela(corpo, "Habilidade(s) selecionada(s)");
  formatarCelulaTabela(corpo, "Habilidade(s) selecionada(s) do Currículo Digital");
  formatarCelulaTabela(corpo, "Objeto(s) de conhecimento em estudo / Conteúdos", true);
  formatarCelulaTabela(corpo, "Critério(s) de avaliação", true);
  formatarCelulaTabela(corpo, "Instrumento(s) avaliativos utilizados", true);
  formatarCelulaTabela(corpo, "Caminho metodológico para desenvolvimento da habilidade (descrever passo a passo)");
  formatarCelulaTabela(corpo, "Referências");
}

function testarFormatacaoDocumento()
{
  const id = "ID_DOCUMENTO_DE_TESTE";
  const documento = DocumentApp.openById(id);
  const corpo = documento.getBody();
  formatarListasPlanejamento(corpo);
  documento.saveAndClose();
  console.log("Formatação concluída!");
}

function configurarAutomacao()
{
  const gatilhos = ScriptApp.getProjectTriggers();
  if (gatilhos.some(g => g.getHandlerFunction() === "processarNovoPlanejamento")) return;
  ScriptApp.newTrigger("processarNovoPlanejamento").forSpreadsheet(SpreadsheetApp.getActive()).onFormSubmit().create();
}
