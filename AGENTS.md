# AGENTS.md

## Visão geral

Este projeto é uma aplicação web educacional e comunitária sobre locais para a prática de voleibol, desenvolvida individualmente por Gustavo Santana Pereira Rodrigues, estudante do 1º semestre de Análise e Desenvolvimento de Sistemas na SPTech.

O objetivo da aplicação é mapear e centralizar informações sobre locais populares para jogar voleibol na cidade de São Paulo, tais como:

- Pelezão 
- Parque Villa-Lobos
- SESC Pompeia
- SESC Consolação
- Quadra em frente ao West Plaza

A plataforma permite que os utilizadores registem os seus comentários e atribuam avaliações (notas de 1 a 5 estrelas) para cada um destes locais. Além disso, conta com uma dashboard com gráfico de colunas para visualizar e comparar as avaliações médias ou quantidade de notas dos recintos.

O projeto tem como objetivo académico e pessoal aprender os conhecimentos do desenvolvedor em CSS, desenvolvimento web e integração entre uma aplicação web, uma API e um banco de dados.

O projeto deve priorizar soluções simples, didáticas e compreensíveis

## Tecnologias

As tecnologias e ferramentas previstas para o projeto são:

- **HTML:** 
- **CSS:** 
- **JavaScript:** 
- **Node.js:** 
- **web-data-viz:** 
- **MySQL:** 
- **Máquina virtual (VM):** 
- **Chart.js:**

As funcionalidades previstas incluem login, cadastro, publicação de comentários com avaliação (1 a 5 estrelas) por local e uma dashboard com gráfico de colunas.


Não adicionar frameworks ou bibliotecas desnecessários sem a autorização do desenvolvedor.

## Comandos

Os comandos inicialmente previstos para trabalhar com o projeto são:

- `npm install`: instala as dependências declaradas no projeto.
- `npm start`: inicia a aplicação conforme o script definido no `package.json`.

Antes de executar comandos, verificar se o projeto possui os arquivos e as configurações necessários.

Não alterar o `package.json`, adicionar dependências ou modificar scripts sem autorização prévia.

Caso algum comando não funcione, analisar a causa e explicar o problema antes de propor alterações.

ipt_**** para variaveis 

## Arquitetura


Antes de implementar funcionalidades, o agente deve analisar os arquivos e diretórios existentes para compreender como o frontend, o backend, a API e o banco de dados se relacionam.

### Organização do projeto

- Identificar as pastas responsáveis pelo frontend, backend, estilos, scripts, recursos visuais e demais componentes existentes.
- Identificar os arquivos responsáveis pela conexão com o banco de dados e pela comunicação com a API.
- Verificar como as páginas compartilham estilos, scripts e componentes.
- Seguir a organização existente ao criar novos arquivos.
- Não criar estruturas de pastas, camadas ou abstrações desnecessárias.

### Fluxo de uma funcionalidade

Ao analisar ou implementar uma funcionalidade, identificar:

1. Onde a interação acontece na interface (ex: envio de nota/comentário para o SESC Pompeia ou consulta do gráfico de colunas).
2. Qual código JavaScript trata essa interação.
3. Se há comunicação com o backend ou com uma API.
4. Como os dados são consultados, processados e armazenados no MySQL, quando aplicável.
5. Como o resultado retorna à interface e é apresentado ao utilizador.

Esse fluxo deve ser explicado de maneira didática, de acordo com a implementação real.

### Implementação de novas funcionalidades

Antes de propor alterações, o agente deve identificar os arquivos envolvidos, explicar quais mudanças seriam necessárias e apresentar um plano de implementação.

O plano deve reunir todas as alterações necessárias para atender à solicitação, indicando os arquivos afetados e o objetivo de cada mudança.

O agente deve aguardar a aprovação explícita do desenvolvedor antes de iniciar a implementação. Após a aprovação, poderá executar todas as alterações previstas no plano aprovado sem solicitar autorização para cada arquivo individualmente.

Caso seja necessário realizar alterações que não estejam contempladas no plano aprovado, o agente deverá apresentar as mudanças adicionais e solicitar uma nova autorização.

A implementação deve respeitar a arquitetura existente e priorizar o reaproveitamento do código atual, sem introduzir complexidade desnecessária.

## Padrões de desenvolvimento

### JavaScript

- Utilizar `let` para declarar variáveis, conforme a preferência do desenvolvedor.
- Priorizar código simples, legível e fácil de compreender.
- Utilizar funções com responsabilidades claras.
- Evitar duplicação desnecessária de código.
- Explicar os conceitos novos utilizados durante as implementações.

### Nomenclatura

Utilizar o padrão `snake_case` para nomes de arquivos, variáveis, funções, identificadores HTML e demais elementos nomeados pelo desenvolvedor, sempre que tecnicamente aplicável.

Exemplos:

- Arquivo: `comentario_local.js`
- Variável: `nota_estrelas`
- Função: `enviar_avaliacao()`
- Identificador HTML: `ipt_comentario_usuario`

Respeitar as limitações e convenções das tecnologias utilizadas, especialmente quando uma biblioteca ou API exigir nomes específicos.

### HTML e CSS

- Manter o HTML organizado e semanticamente adequado.
- Utilizar nomes consistentes para classes e identificadores CSS.
- Evitar duplicação desnecessária de regras de estilo.
- Preservar o design e o comportamento existentes.
- Priorizar soluções CSS simples antes de recorrer a JavaScript para resolver problemas exclusivamente visuais.
- Não alterar elementos visuais fora do escopo solicitado.

### Commits

Quando houver necessidade de criar mensagens de commit, utilizar o padrão Conventional Commits.

Tipos previstos:

- `feat`: nova funcionalidade.
- `fix`: correção de problema.
- `docs`: documentação.
- `style`: alterações de formatação que não modificam a lógica sim o estilo.
- `refactor`: reorganização interna do código sem mudança intencional de comportamento.

Não criar commits sem autorização.

## Cuidados e restrições

### Autorização para alterações

**Nenhuma alteração nos arquivos do projeto deve ser realizada sem a autorização prévia do desenvolvedor.**

Antes de implementar qualquer mudança, o agente deve:

1. Analisar o código e identificar a causa ou a necessidade da alteração.
2. Explicar o problema ou o objetivo da mudança.
3. Informar quais arquivos serão afetados.
4. Aguardar a aprovação do desenvolvedor.


Se surgir a necessidade de realizar mudanças adicionais, apresentar uma nova proposta e aguardar autorização.

### Preservação do código existente

- Não refatorar partes do projeto sem autorização.
- Não reescrever arquivos inteiros quando uma alteração localizada for suficiente.
- Não remover funcionalidades, estilos, componentes ou trechos de código sem autorização.
- Não realizar alterações adicionais apenas por considerar que o código poderia ser melhorado.
- Se identificar problemas fora do escopo solicitado, explicá-los e pedir autorização antes de corrigi-los.

### Aprendizado do desenvolvedor

O projeto tem como um de seus principais objetivos o aprendizado.

Por isso, toda implementação deve ser acompanhada de uma explicação que apresente:

- O que foi alterado.
- Por que a alteração foi necessária.
- Como o código funciona.
- Como os componentes envolvidos se relacionam.
- Quais conceitos novos foram utilizados.

Sempre que possível, explicar o raciocínio passo a passo e evitar simplesmente fornecer código pronto sem contextualização.

Não presumir conhecimentos avançados do desenvolvedor. Introduzir conceitos novos gradualmente e esclarecer termos técnicos quando necessário.

### Segurança e integridade dos dados

- Não executar comandos destrutivos ou operações que possam apagar ou modificar dados importantes sem autorização explícita.
- Não alterar o banco de dados, suas tabelas ou seus registros sem autorização.
- Não presumir que uma operação funcionou sem verificar seu resultado.

## Regra geral


Em caso de dúvida, apresentar a análise e solicitar esclarecimentos ao desenvolvedor.

**A prioridade é desenvolver uma aplicação funcional e bem organizada, enquanto o desenvolvedor compreende o código e evolui tecnicamente.**