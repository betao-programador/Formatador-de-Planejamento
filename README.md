# Formatador-de-Planejamento
Formata planejamentos mensais usando api do Google Docs, negritando códigos de habilidades, separando-as por linhas e colocando marcadores em outros itens. O script do Apps Script pode ser configurado para disparar ao enviar um novo formulário para a planilha.

# Guia de instalação e utilização do sistema de planejamento pedagógico

**Status:** documentação em construção  
**Projeto:** geração e formatação automática de planejamentos pedagógicos

## 1. Visão geral

Este projeto automatiza a elaboração de planejamentos pedagógicos por meio da integração entre Google Forms, Google Sheets, Autocrat e Google Apps Script.

O fluxo geral é:

1. O professor preenche o formulário.
2. As respostas são registradas na planilha.
3. Fórmulas organizam as informações e relacionam habilidades, objetos de conhecimento e critérios.
4. O Autocrat utiliza os dados para gerar o documento de planejamento.
5. O formatador em Apps Script organiza automaticamente a apresentação do documento.

## 2. Componentes do sistema

### 2.1. Google Forms

*Documentação pendente.*

### 2.2. Google Sheets

*Documentação pendente.*

### 2.3. Autocrat

*Documentação pendente.*

### 2.4. Formatador automático — `formatador.gs`

O formatador automático é um script desenvolvido em Google Apps Script. Sua função é ajustar a apresentação dos documentos gerados pelo Autocrat, organizando listas, parágrafos, recuos e códigos de habilidades.

O script não cria o planejamento nem seleciona as habilidades. Ele atua depois que o Autocrat gera o documento.

#### 2.4.1. Requisitos

Para utilizar o formatador, é necessário:

- Ter uma planilha Google Sheets vinculada ao formulário.
- Ter o Autocrat configurado para gerar os documentos.
- Ter um modelo de documento Google Docs com a estrutura esperada pelo formatador.
- Ter acesso de edição à planilha e aos documentos gerados.

#### 2.4.2. Instalação

1. Abra a planilha vinculada ao formulário.
2. Acesse **Extensões → Apps Script**.
3. Crie ou abra o arquivo de script.
4. Cole o conteúdo do arquivo `formatador.gs`.
5. Salve o projeto.

O script deve ser instalado no projeto vinculado à planilha que recebe as respostas do formulário.

#### 2.4.3. Configuração dos cabeçalhos

No início do código existem três constantes:

- `STATUS_AUTOCRAT`: texto que identifica a conclusão bem-sucedida da geração do documento.
- `COLUNA_STATUS`: nome da coluna em que o Autocrat registra o resultado da operação.
- `COLUNA_LINK`: nome da coluna que contém o endereço do documento gerado.

Esses nomes precisam corresponder exatamente aos cabeçalhos existentes na planilha.

Caso sejam alterados na configuração do Autocrat, também deverão ser atualizados no código.

#### 2.4.4. Configuração da automação

Após instalar o código, execute manualmente a função:

`configurarAutomacao()`

Na primeira execução, o Google solicitará autorização para que o script possa acessar a planilha e os documentos.

Essa função cria um gatilho instalável que executa `processarNovoPlanejamento` sempre que uma nova resposta é enviada pelo formulário.

O código verifica se o gatilho já existe antes de criar outro, evitando duplicações.

Não é necessário implantar o projeto como Web App.

#### 2.4.5. Funcionamento automático

Quando uma nova resposta é enviada, a função `processarNovoPlanejamento(e)` recebe as informações do evento.

O script identifica:

- A planilha que recebeu a resposta.
- A linha correspondente ao novo registro.
- As colunas de status e endereço do documento.

Em seguida, aguarda a conclusão do Autocrat.

O tempo máximo de espera configurado é de 30 segundos, com verificações realizadas a cada segundo.

Quando o status indica sucesso e o endereço do documento está disponível, o script chama `processarDocumento(link)`.

Se o Autocrat não concluir a geração dentro do período estabelecido, o script registra uma mensagem de erro no log.

#### 2.4.6. Processamento do documento

A função `processarDocumento(link)` extrai o identificador do documento a partir do endereço fornecido pelo Autocrat.

Com esse identificador, abre o Google Docs e obtém seu conteúdo.

Depois executa as funções responsáveis pela formatação e salva as alterações.

Se ocorrer algum erro durante o processamento, a exceção é capturada e registrada no log.

#### 2.4.7. Formatação dos códigos de habilidades

A função `formatarCodigosHabilidades(corpo)` procura códigos que começam com `EF` e estejam entre parênteses.

Exemplos:

- `(EF06MA01)`
- `(EF07MA05)`
- `(EF08CI02)`

Os trechos encontrados recebem formatação em negrito.

A busca utiliza uma expressão regular, permitindo localizar os códigos mesmo quando aparecem junto de outros textos.

#### 2.4.8. Formatação dos campos da tabela

A função `formatarCelulaTabela()` percorre as tabelas do documento procurando os títulos dos campos.

Quando encontra um título, identifica a célula imediatamente à direita, que contém as informações correspondentes.

O conteúdo é dividido em itens utilizando as quebras de linha como separadores.

Dependendo do campo, os itens são reconstruídos como parágrafos comuns ou como listas com marcadores.

Os campos configurados com marcadores são:

- Objetos de conhecimento em estudo / Conteúdos.
- Critérios de avaliação.
- Instrumentos avaliativos utilizados.

Os demais campos são organizados em parágrafos independentes.

A formatação aplicada inclui:

- Alinhamento justificado.
- Espaçamento anterior zerado.
- Espaçamento posterior de 6 pontos.
- Recuos configurados para melhorar a leitura dentro da tabela.

O campo **Referências** recebe tratamento especial: seu conteúdo não é reconstruído, preservando a formatação original do modelo, incluindo negrito e itálico.

A função também remove parágrafos vazios das extremidades das células, evitando espaços desnecessários no documento.

#### 2.4.9. Campos reconhecidos pelo formatador

Os títulos abaixo precisam estar presentes no documento e corresponder exatamente aos textos utilizados pelo script:

- `Habilidade(s) selecionada(s)`
- `Habilidade(s) selecionada(s) do Currículo Digital`
- `Objeto(s) de conhecimento em estudo / Conteúdos`
- `Critério(s) de avaliação`
- `Instrumento(s) avaliativos utilizados`
- `Caminho metodológico para desenvolvimento da habilidade (descrever passo a passo)`
- `Referências`

Caso um título seja alterado no modelo, a chamada correspondente em `formatarListasPlanejamento()` também deverá ser atualizada.

#### 2.4.10. Formatação manual para testes

A função `testarFormatacaoDocumento()` permite executar a formatação manualmente em um documento específico.

Para utilizá-la:

1. Abra o código no Apps Script.
2. Substitua `ID_DOCUMENTO_DE_TESTE` pelo identificador de um documento Google Docs válido.
3. Salve o código.
4. Execute `testarFormatacaoDocumento()`.

Essa função é útil para testar alterações no formatador sem precisar enviar uma nova resposta pelo formulário.

#### 2.4.11. Solução de problemas

**O documento não foi formatado.**

Verifique se o gatilho instalável foi criado e se o script possui as permissões necessárias.

**O script informa que o Autocrat não concluiu a geração.**

Verifique se o Autocrat está funcionando e se os cabeçalhos de status e endereço estão corretos. O tempo de espera padrão é de 30 segundos.

**Um campo não foi formatado.**

Verifique se o título da célula está escrito exatamente como no código. Espaços, acentos e caracteres diferentes podem impedir a localização.

**O documento apresenta formatação incorreta.**

Verifique se o modelo mantém a estrutura de tabela esperada: título na primeira célula e conteúdo na célula imediatamente à direita.

**O gatilho deixou de funcionar.**

Execute novamente `configurarAutomacao()`. Se o gatilho já existir, a função não criará outro. Se necessário, verifique os gatilhos instalados no painel do Apps Script.

## 3. Adaptação para outras disciplinas

*Documentação pendente.*

## 4. Solução de problemas gerais

*Documentação pendente.*

## 5. Autoria e licenciamento

O código do formatador automático é de autoria do desenvolvedor e será disponibilizado sob a licença Apache License 2.0.

Os conteúdos curriculares utilizados como referência devem ser identificados conforme sua fonte original, incluindo o Currículo Base do Território Catarinense (CBTC).

As instruções de montagem, fórmulas e configurações serão documentadas para permitir que outros professores reproduzam e adaptem o sistema.
