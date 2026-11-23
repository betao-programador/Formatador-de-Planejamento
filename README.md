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

O sistema de geração automática de planejamentos pedagógicos utiliza três ferramentas principais do Google: Google Forms, Google Sheets e Autocrat.

Cada ferramenta possui uma função específica:

- **Google Forms (Formulários Google):** permite que o professor preencha e envie as informações do planejamento.
- **Google Sheets (Planilhas Google):** recebe as respostas e organiza automaticamente os dados necessários para a geração do documento.
- **Autocrat:** utiliza as informações da planilha para preencher um modelo de documento e gerar o planejamento pedagógico, enviando-o automaticamente por e-mail.

O funcionamento acontece de maneira integrada: o professor preenche o formulário, a planilha organiza as informações e o Autocrat gera e distribui o documento final.

### 2.1. Google Forms — Formulário de preenchimento

O formulário é a porta de entrada do sistema. É nele que o professor informa os dados necessários para a elaboração de seu planejamento pedagógico.

Entre as informações solicitadas estão:

- Nome completo do professor responsável pelo planejamento.
- Endereço de e-mail do professor.
- Endereços de e-mail dos segundos professores, quando houver. Esse preenchimento é opcional e permite que eles também recebam uma cópia do planejamento.
- Escola em que o planejamento será aplicado. Essa informação permite que a equipe pedagógica da unidade escolar também receba o documento para conferência, facilitando o acompanhamento pela Assessoria Técnico-Pedagógica (ATP) e pela gestão escolar.
- Ano e turma.
- Objetos de conhecimento e conteúdos que serão trabalhados.
- Habilidades específicas da disciplina.
- Habilidades do Currículo Digital.
- Número de aulas e período de realização do planejamento.
- Metodologia de desenvolvimento das atividades.
- Referências utilizadas.

**Organização do formulário**

As perguntas são organizadas em seções para facilitar o preenchimento. O professor não precisa avançar manualmente entre todas elas: a passagem de uma seção para outra acontece automaticamente.

A maior parte das informações é selecionada a partir de opções previamente cadastradas. Isso evita que o professor precise digitar informações que já fazem parte do currículo ou que poderiam ser selecionadas de uma lista.

O campo de metodologia é a principal exceção: nele, o professor precisa descrever manualmente como pretende desenvolver as atividades e trabalhar as habilidades selecionadas.

É possível preencher esse campo provisoriamente com palavras como "teste" ou até mesmo um ponto (`.`), caso o professor prefira terminar a descrição posteriormente, diretamente no documento gerado. Entretanto, essa prática não é recomendada.

**Atenção:** assim que o formulário é enviado, o planejamento é gerado e encaminhado automaticamente aos endereços de e-mail configurados. Portanto, se o professor enviar o formulário com informações provisórias, os destinatários também receberão o documento incompleto.

Caso seja necessário corrigir ou complementar o planejamento depois do envio, o professor poderá preencher e enviar novamente o formulário.

### 2.2. Google Sheets — Planilha de respostas e processamento

A planilha é responsável por receber as respostas do formulário e preparar as informações para que o Autocrat consiga preencher o documento corretamente.

Quando o formulário é criado, o Google Forms permite acessar sua planilha de respostas pela seção **Respostas**, utilizando a opção **Ver no App Planilhas**.

Ao fazer isso, o Google cria automaticamente uma planilha vinculada ao formulário, contendo inicialmente aproximadamente 25 colunas, dependendo da quantidade de perguntas existentes.

Entretanto, para que o sistema funcione corretamente, será necessário acrescentar algumas colunas auxiliares e duas abas de apoio.

As colunas auxiliares utilizam fórmulas para reunir, separar, localizar e organizar informações. Elas são necessárias porque as respostas do formulário nem sempre estão no formato adequado para serem inseridas diretamente no documento.

**2.2.1. Abas auxiliares obrigatórias**

Além da aba de respostas, cada planilha precisa conter duas abas adicionais:

- **Escolas e Emails**
- **Habilidades e Critérios**

Essas abas funcionam como tabelas de consulta utilizadas pelas fórmulas da planilha.

#### Aba "Escolas e Emails"

Essa aba relaciona cada unidade escolar ao seu respectivo endereço de e-mail pedagógico.

A estrutura deve conter duas colunas:

| Coluna A | Coluna B |
|---|---|
| Nome da escola | E-mail pedagógico |
| Escola A | pedagogico@escolaa.com |
| Escola B | pedagogico@escolab.com |

Os nomes das escolas devem ser escritos exatamente como aparecem nas opções do formulário. Caso exista alguma diferença na escrita, a planilha poderá não encontrar o endereço correspondente.

Cada linha deve conter o nome de uma escola na primeira coluna e o respectivo e-mail pedagógico na segunda.

#### Aba "Habilidades e Critérios"

Essa aba relaciona as habilidades selecionadas pelo professor aos respectivos critérios de avaliação.

Sua organização utiliza pares de colunas alternadas:

| Coluna | Conteúdo |
|---|---|
| A | Habilidades do primeiro ano ou grupo |
| B | Critérios correspondentes |
| C | Habilidades do segundo ano ou grupo |
| D | Critérios correspondentes |
| E | Habilidades do terceiro ano ou grupo |
| F | Critérios correspondentes |
| G | Habilidades do quarto ano ou grupo |
| H | Critérios correspondentes |

A quantidade de pares de colunas depende da disciplina.

Por exemplo:
- Ciências utiliza habilidades do 6º ao 9º ano.
- Ensino Religioso pode utilizar habilidades do 1º ao 9º ano.
- Biologia, Física, Química, Filosofia e Sociologia utilizam habilidades do Ensino Médio.
- Algumas disciplinas podem utilizar apenas um par de colunas, especialmente quando trabalham com habilidades identificadas por códigos que abrangem diferentes anos escolares, como as habilidades EM13.

As habilidades devem ser copiadas exatamente como aparecem nas opções do formulário, incluindo seus códigos.

Já os critérios de avaliação devem ser escritos sem os códigos das habilidades e com a redação adequada ao que será observado na aprendizagem.

Por exemplo, uma habilidade que começa com "Identificar" pode ter como critério correspondente "Identifica...".

**Observação sobre o Currículo Digital:** não é necessário criar uma relação entre as habilidades do Currículo Digital e os critérios de avaliação. No modelo utilizado, essas habilidades são selecionadas e apresentadas no planejamento, mas não possuem critérios de avaliação associados nessa tabela.

**2.2.2. Colunas auxiliares e fórmulas**

Depois de criar as abas auxiliares, será necessário acrescentar manualmente algumas colunas à aba de respostas.

Essas colunas serão utilizadas pelo Autocrat e devem possuir os nomes indicados abaixo, pois são os nomes utilizados no modelo de referência.

As fórmulas devem ser inseridas na segunda linha de cada coluna, acompanhando as respectivas letras de coluna. Ao utilizar a planilha em outra disciplina, será necessário conferir se as referências correspondem à posição das perguntas e respostas daquela planilha.

As fórmulas abaixo utilizam os nomes das funções e os separadores do Google Sheets em português, conforme a configuração regional da planilha.

**1. E-Mail Pedagógico da escola**

Localiza automaticamente o e-mail pedagógico da escola selecionada pelo professor.

Nome da coluna:

`E-Mail Pedagógico da escola`

Fórmula:

```excel
=SEERRO(SE(F2="";"";PROCX(F2;'Escolas e Emails'!$A$2:$A;'Escolas e Emails'!$B$2:$B));"")
```
***Observação: Troque F2 pela célula real da sua planilha***

A fórmula procura o nome da escola informado na célula F2 dentro da primeira coluna da aba "Escolas e Emails". Quando encontra a escola, retorna o endereço correspondente da segunda coluna.

**2. OBJETOS DO CONHECIMENTO/CONTEÚDOS**

Reúne os objetos de conhecimento selecionados pelo professor e organiza cada item em uma linha separada.

Nome da coluna:

`OBJETOS DO CONHECIMENTO/CONTEÚDOS`

Fórmula:

```excel
=TEXTJOIN(CARACT(10);VERDADEIRO;
MAP(K2:N2;LAMBDA(c;
SE(c="";"";REGEXREPLACE(c;";, ";";"&CARACT(10)))
))
)
```
***Observação: Troque K2:N2 pelas células reais da sua planilha***

A fórmula reúne os conteúdos encontrados entre as células K2 e N2, ignorando as células vazias e separando os itens por quebras de linha.

**3. HABILIDADES DA DISCIPLINA**

Reúne as habilidades específicas da disciplina selecionadas pelo professor, mantendo cada habilidade em uma linha separada.

Nome da coluna:

`HABILIDADES DA DISCIPLINA`

Fórmula:

```excel
=TEXTJOIN(CARACT(10);VERDADEIRO;
MAP(P2:S2;LAMBDA(c;
SE(c="";"";TEXTJOIN(CARACT(10);VERDADEIRO;
SPLIT(REGEXREPLACE(c;", \(EF";"♦(EF");"♦")
))
))
)
)
```
***Observação: Troque P2:S2 pelas células reais da sua planilha***

A fórmula organiza as habilidades selecionadas nas células P2 a S2.

Como algumas respostas podem conter várias habilidades separadas por vírgulas, ela utiliza os códigos que começam com `(EF` para identificar o início de cada nova habilidade e colocá-la em uma linha separada.

**4. CRITÉRIOS DE AVALIAÇÃO**

Localiza os critérios de avaliação correspondentes às habilidades selecionadas pelo professor.

Nome da coluna:

`CRITÉRIOS DE AVALIAÇÃO`

Fórmula:

```excel
=TEXTJOIN(CARACT(10);VERDADEIRO;
MAP(
SPLIT(T2;CARACT(10));
LAMBDA(h;
SEERRO(PROCX(ARRUMAR(h);'Habilidades e Critérios'!$A$1:$A;'Habilidades e Critérios'!$B$1:$B);
SEERRO(PROCX(ARRUMAR(h);'Habilidades e Critérios'!$C$1:$C;'Habilidades e Critérios'!$D$1:$D);
SEERRO(PROCX(ARRUMAR(h);'Habilidades e Critérios'!$E$1:$E;'Habilidades e Critérios'!$F$1:$F);
SEERRO(PROCX(ARRUMAR(h);'Habilidades e Critérios'!$G$1:$G;'Habilidades e Critérios'!$H$1:$H);"")
)))
))
)
```
***Observação: Troque T2 pela célula real da sua planilha. 
As células $A até $H preveem que as células A,C,E,G são das habilidades e B,D,F,H são dos critérios***

A fórmula utiliza as habilidades organizadas na coluna T e procura cada uma delas na aba "Habilidades e Critérios".

Quando encontra uma habilidade, retorna o critério correspondente na coluna seguinte.

A busca é realizada nos pares de colunas A/B, C/D, E/F e G/H. Caso uma habilidade não seja encontrada, a fórmula deixa o resultado vazio.

**5. HABILIDADES CURRÍCULO DIGITAL**

Organiza as habilidades do Currículo Digital selecionadas pelo professor, colocando cada uma em uma linha separada.

Nome da coluna:

`HABILIDADES CURRÍCULO DIGITAL`

Fórmula:

```excel
=TEXTJOIN(CARACT(10);VERDADEIRO;
MAP(V2:Y2;LAMBDA(c;
SE(c="";"";TEXTJOIN(CARACT(10);VERDADEIRO;
SPLIT(REGEXREPLACE(c;", \(EF";"♦(EF");"♦")
))
))
)
)
```

Seu funcionamento é semelhante ao da fórmula de habilidades da disciplina, mas utiliza as respostas das células V2 a Y2.
***Observação: Troque V2:Y2 pelas células reais da sua planilha***

**6. INSTRUMENTOS DE AVALIAÇÃO**

Organiza os instrumentos avaliativos selecionados, colocando cada item em uma linha separada.

Nome da coluna:

`INSTRUMENTOS DE AVALIAÇÃO`

Fórmula:

```excel
=SEERRO(TEXTJOIN(CARACT(10);VERDADEIRO;
MAP(AC2;LAMBDA(c;
SE(c="";"";REGEXREPLACE(c;";, ";";"&CARACT(10)))
))
);"")
```
A fórmula organiza os instrumentos selecionados na célula AC2, separando os itens por quebras de linha.
***Observação: Troque AC2 pela célula real da sua planilha***

**7. NOME DO ARQUIVO**

Cria automaticamente um nome para o documento gerado, utilizando o primeiro e o último nome do professor, juntamente com a data e o horário do envio do formulário.

Nome da coluna:

`NOME DO ARQUIVO`

Fórmula:

```excel
=SEERRO(
REGEXEXTRACT(ARRUMAR(B2);"^\S+")&
SE(
REGEXEXTRACT(ARRUMAR(B2);"\S+$")=REGEXEXTRACT(ARRUMAR(B2);"^\S+");
"";
" "&REGEXEXTRACT(ARRUMAR(B2);"\S+$")
)&"_"&
TEXTO(A2;"yyyy-MM-dd_HH-mm-ss");
""
)
```
***Observação: Troque B2 pela célula real da sua planilha***
O resultado será semelhante a:

`João Silva_2026-03-15_14-30-00`

A data e o horário ajudam a evitar que planejamentos diferentes recebam exatamente o mesmo nome.

**Importante:** as fórmulas acima foram preparadas para a estrutura da planilha de referência. Ao criar uma planilha para outra disciplina, pode ser necessário ajustar as letras das células de acordo com a posição das perguntas e respostas.

As fórmulas devem ser copiadas para as demais linhas da planilha para que também processem os próximos envios. Recomenda-se preservar os nomes das colunas auxiliares, pois eles serão utilizados na configuração do Autocrat.

### 2.3. Autocrat — Geração automática dos documentos

O Autocrat é uma extensão do Google Planilhas que permite gerar documentos automaticamente a partir de um modelo pronto.

Em vez de copiar manualmente as respostas do formulário para um documento, o Autocrat identifica os campos existentes no modelo e os substitui pelas informações correspondentes da planilha.

Dessa forma, cada envio do formulário pode gerar um documento de planejamento preenchido e encaminhado automaticamente aos destinatários configurados.

**2.3.1. Preparação do modelo de documento**

Antes de configurar o Autocrat, é necessário ter o modelo de planejamento da disciplina salvo no Google Drive.

O modelo deve obrigatoriamente estar no formato **Google Docs (Documentos Google)**.

Arquivos do Microsoft Word (`.docx`) não aparecem entre os modelos disponíveis para seleção pelo Autocrat.

Caso o modelo esteja em formato Word, basta abri-lo com o Google Documentos e salvá-lo como um documento do Google Docs. Depois disso, ele poderá ser selecionado normalmente.

Cada disciplina deve utilizar seu próprio modelo, pois existem diferenças entre os planejamentos. Alguns exigem campos específicos, como recomposição e IFAs, enquanto outros são destinados somente aos anos finais do Ensino Fundamental ou ao Ensino Médio.

**2.3.2. Criando uma configuração no Autocrat**

Com a planilha de respostas aberta:

1. Clique em **Extensões**.
2. Localize **Autocrat**.
3. Clique em **Open**.
4. Na primeira utilização, o Google poderá solicitar autorização para que a extensão acesse os arquivos e execute as operações necessárias.
5. Caso ainda não exista uma configuração de geração de documentos, clique em **NEW JOB**.

A configuração criada é chamada de *Job*. Ela reúne todas as instruções necessárias para gerar os documentos.

A seguir, estão as etapas de configuração.

#### Etapa 1 — Name your merge job

Informe um nome para identificar a configuração.

Utilize o padrão:

`Planejamento - DISCIPLINA`

Por exemplo:

`Planejamento - CIE`

Para Ciências, ou `Planejamento - MAT` para Matemática.

Depois, clique em **Next**.

#### Etapa 2 — Choose template

Nesta etapa, será selecionado o modelo de documento que o Autocrat utilizará.

1. Selecione **From Drive**.
2. Localize o modelo de planejamento da disciplina.
3. Selecione o documento.
4. Clique em **Next**.

Lembre-se: o modelo precisa estar no formato Google Docs.

#### Etapa 3 — Map source data to template

Esta é uma das etapas mais importantes.

O Autocrat identifica automaticamente todas as tags existentes no modelo selecionado. Tags são marcadores escritos entre sinais de menor e maior, como:

`<<Professor>>`

Cada tag indica um local do documento que deverá receber uma informação da planilha.

Após identificar as tags, o Autocrat permite escolher manualmente qual coluna da planilha fornecerá o conteúdo correspondente.

Portanto, o nome da tag não precisa ser igual ao nome da coluna. O usuário faz essa associação durante a configuração.

No modelo de referência, as associações são:

| Tag no documento | Coluna da planilha |
|---|---|
| `<<Escola>>` | ESCOLA |
| `<<Professor>>` | PROFESSOR |
| `<<Ano série>>` | SÉRIE/ANO |
| `<<Habilidades>>` | HABILIDADES DA DISCIPLINA |
| `<<Habilidade(s) selecionada(s) do Currículo Digital>>` | HABILIDADES CURRÍCULO DIGITAL |
| `<<Objetos de conhecimento>>` | OBJETOS DO CONHECIMENTO/CONTEÚDOS |
| `<<Critérios de avaliação>>` | CRITÉRIOS DE AVALIAÇÃO |
| `<<Descrever Metodologia>>` | DESCREVER METODOLOGIA(s) |
| `<<Instrumentos avaliativos utilizados>>` | INSTRUMENTOS DE AVALIAÇÃO |
| `<<Número de aulas>>` | NÚMERO DE AULAS |
| `<<Cronograma_início>>` | DATA DE INÍCIO DO PLANO |
| `<<Cronograma_fim>>` | DATA DE FIM DO PLANO |
| `<<Referências>>` | REFERÊNCIAS |

As tags e os nomes das colunas apresentados correspondem ao modelo de referência compartilhado. Ao utilizar outro modelo, as tags poderão ser diferentes, sendo necessário fazer as associações correspondentes.

Depois de relacionar todas as tags às colunas adequadas, clique em **Next**.

#### Etapa 4 — File settings

Nesta etapa, serão definidas as características dos documentos gerados.

Configure os campos da seguinte maneira:

**File name:**

`Planejamento Ciências - <<NOME DO ARQUIVO>>`

O nome da disciplina deve ser adaptado conforme o planejamento.

A tag `<<NOME DO ARQUIVO>>` será substituída pelo nome criado automaticamente pela fórmula da planilha.

**Type:**

`Google Docs`

**Output as:**

`Single output mode`

**Add page breaks between data rows:**

`No`

Essa configuração evita que o Autocrat insira quebras de página adicionais entre os registros processados.

Depois, clique em **Next**.

#### Etapa 5 — Choose destination folder(s)

Selecione a pasta do Google Drive em que os documentos gerados serão armazenados.

No modelo de referência, utiliza-se:

`Respostas planos CIE`

O nome deve ser adaptado conforme a disciplina.

É recomendável criar essa pasta junto ao formulário e à planilha, mantendo os arquivos do sistema organizados no mesmo local. Entretanto, isso é apenas uma recomendação de organização: a pasta de saída pode estar em outro local do Google Drive, desde que seja selecionada corretamente nesta etapa.

Depois, clique em **Next**.

#### Etapa 6 — Add dynamic folder reference (optional)

Não é necessário configurar nada nesta etapa.

Clique em **Next**.

#### Etapa 7 — Set merge condition (optional)

Também não é necessário configurar nada nesta etapa.

Clique em **Next**.

#### Etapa 8 — Share docs & send emails

Nesta etapa, será configurado o compartilhamento dos documentos e o envio automático dos e-mails.

Utilize as seguintes configurações:

**Share doc?**

`Yes`

Permite que o documento seja compartilhado com os destinatários.

**Share doc as:**

`editable doc`

Os destinatários poderão editar o documento.

**Allow collaborators to re-share:**

`Yes`

Permite que os destinatários compartilhem o documento com outras pessoas.

**Send from generic no-reply address:**

`No`

**To:**

Informe os destinatários utilizando as tags correspondentes:

`<<Endereço de e-mail>>,
<<E-mail Pedagógico da Escola:>>,
<<E-mail do Segundo Professor:>>,
<<E-mail do Professor Hora-atividade:>>`

Dessa forma, o documento será encaminhado ao professor responsável, à equipe pedagógica da escola e aos demais profissionais informados no formulário.

**Subject:**

Defina o assunto do e-mail. No modelo de referência, utiliza-se um título relacionado ao planejamento da disciplina.

O corpo do e-mail também pode ser personalizado utilizando HTML, permitindo incluir textos formatados, cores, links e outras informações. Entretanto, essa personalização não é necessária para o funcionamento básico do sistema e pode ser implementada em versões futuras.

#### Etapa 9 — Add/remove job triggers
Nesta etapa será configurado o gatilho automático do AutoCrat.

**Run on form trigger:**

`Yes`

**Run on time trigger:**

`No`

Depois de concluir as configurações, finalize a criação do Job.

A partir daí, o Autocrat estará configurado para gerar os documentos conforme as respostas recebidas pela planilha.

**Resultado esperado**

Quando o professor enviar o formulário:

1. As respostas serão registradas na planilha.
2. As fórmulas organizarão os dados e localizarão as informações correspondentes.
3. O Autocrat utilizará essas informações para preencher o modelo de planejamento.
4. O documento será salvo na pasta de destino selecionada.
5. O documento será compartilhado e encaminhado aos endereços de e-mail configurados.

Todo esse processo acontece automaticamente, sem que o professor precise abrir a planilha ou copiar informações manualmente para o documento.

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

O sistema pode ser utilizado em diferentes disciplinas, desde que alguns elementos sejam adaptados conforme as necessidades de cada componente curricular.

Para criar uma versão para outra disciplina, recomenda-se duplicar o conjunto de referência, composto pelo formulário, pela planilha, pelo modelo de documento e pela pasta de saída.

As principais adaptações necessárias são:

- **Formulário:** atualizar as opções de objetos de conhecimento, habilidades e demais informações específicas da disciplina.
- **Planilha:** ajustar as fórmulas caso as perguntas estejam em posições diferentes e preencher a aba "Habilidades e Critérios" com as habilidades e os respectivos critérios de avaliação da disciplina.
- **Modelo de documento:** utilizar o planejamento específico da disciplina, respeitando suas particularidades e campos obrigatórios.
- **Autocrat:** selecionar o novo modelo, conferir as associações entre as tags e as colunas da planilha e ajustar os nomes dos arquivos e a pasta de destino.

A tabela "Habilidades e Critérios" é especialmente importante: cada disciplina deve possuir sua própria relação de habilidades e critérios de avaliação, contemplando os anos escolares em que é ofertada.

Não é necessário preencher pares de colunas referentes a anos que não fazem parte da disciplina.

***Observação: Algumas disciplinas tem Recomposição das Aprendizagens e IFAs. Nesse caso talvez seja necessário criar uma nova coluna para fazer as relações corretamente.***

## 4. Solução de problemas gerais

A seguir estão alguns problemas que podem ocorrer durante a utilização ou configuração do sistema e suas possíveis soluções.

### 4.1. A planilha não está organizando habilidades, critérios ou outras informações corretamente

Verifique se as fórmulas estão inseridas na linha correta e se as referências às colunas correspondem à estrutura da planilha.

A primeira linha deve conter os nomes que identificam cada coluna, enquanto as fórmulas devem começar na segunda linha.

Se a planilha já possuir respostas de testes ou preenchimentos anteriores, recomenda-se excluir as linhas de respostas pela opção de exclusão de linhas, preservando a primeira linha com os cabeçalhos.

Sempre que possível, dê preferência a uma planilha ainda sem respostas. Insira as fórmulas na linha 2 e certifique-se de que elas sejam aplicadas também às linhas seguintes.

### 4.2. O Autocrat não está funcionando

Confira os seguintes itens:

- Se o Autocrat possui as permissões necessárias para acessar os arquivos e executar as operações.
- Se o Job foi configurado corretamente.
- Se a opção **Run on form trigger** está ativada.
- Se o modelo selecionado está no formato Google Docs.
- Se a pasta de destino existe e está acessível.
- Se todas as tags do modelo foram associadas às colunas corretas da planilha.

### 4.3. Os e-mails não estão sendo enviados

Confira as tags utilizadas na configuração de envio do Autocrat.

As tags devem corresponder exatamente aos nomes das colunas selecionadas na configuração. Caso o nome de uma coluna seja muito extenso ou contenha caracteres que dificultem sua utilização, pode ser simplificado, desde que a associação seja atualizada no Autocrat.

As tags sugeridas neste documento já seguem um padrão testado no modelo de referência.

**Uma dica importante:** procure as colunas de status do Autocrat na planilha, normalmente localizadas entre as últimas colunas. Elas registram o resultado da execução do Job, indicando se o documento foi gerado e se houve algum erro.

Quando ocorre uma falha, a própria mensagem de status geralmente informa o motivo, ajudando a identificar o que precisa ser corrigido.

### 4.4. O documento não está recebendo a formatação automática

Verifique se o gatilho do Google Apps Script foi configurado corretamente para ser executado quando uma nova resposta for enviada pelo formulário.

Também confira se o script está recebendo o endereço correto do documento gerado pelo Autocrat. O endereço é utilizado para localizar o arquivo e aplicar a formatação.

Caso necessário, é possível testar a formatação utilizando um documento já gerado.

**Como localizar o ID de um documento:**

Abra o documento no Google Docs e observe o endereço exibido no navegador. Ele possui uma estrutura semelhante a esta:

`https://docs.google.com/document/d/1FUwv7ZPNQqQ45Phn1h4MQBLdZnTdWhJwoPIqy0rEZ-Y/edit?tab=t.0`

O ID é o trecho localizado entre `/d/` e a próxima `/`.

No exemplo acima, o ID seria:

`1FUwv7ZPNQqQ45Phn1h4MQBLdZnTdWhJwoPIqy0rEZ-Y`

Esse código deve ser utilizado na função de teste do script.

**Atenção:** o documento utilizado no teste precisa seguir a mesma estrutura do modelo de planejamento utilizado pelo sistema, incluindo as tabelas e os títulos dos campos esperados pelo formatador. Um documento diferente poderá apresentar erros ou simplesmente não receber a formatação corretamente.

## 5. Autoria e licenciamento

O código do formatador automático é de autoria do desenvolvedor e será disponibilizado sob a licença Apache License 2.0.

Os conteúdos curriculares utilizados como referência devem ser identificados conforme sua fonte original, incluindo o Currículo Base do Território Catarinense (CBTC).

As instruções de montagem, fórmulas e configurações serão documentadas para permitir que outros professores reproduzam e adaptem o sistema.
