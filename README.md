# Intervalo entre Prêmios

Este projeto foi desenvolvido com Node.js, TypeScript, Express e TypeORM utilizando SQLite, com o objetivo de processar dados de filmes premiados e identificar os produtores com o menor e maior intervalo entre vitórias.

---

## ⚙️ Pré-requisitos

- Node.js (v18 ou superior recomendado)
- npm ou yarn

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/producer-awards-gap.git
cd producer-awards-gap
npm run install
# ou
yarn install
```

## 🗄️ Banco de Dados

O projeto utiliza SQLite para facilitar a execução local. O arquivo do banco será criado automaticamente.

## 📥 Importando o CSV

Para popular o banco com os dados deve-se criar um arquivo dentro da pasta `\src\app\files\` com o nome de `movielist.csv`. Este arquivo deve conter a seguinte estrutura:

| year | title                | studios                             | producers       | winner |
| ---- | -------------------- | ----------------------------------- | --------------- | ------ |
| 1980 | Can't Stop the Music | Associated Film Distribution        | Allan Carr      | yes    |
| 1980 | Cruising             | Lorimar Productions, United Artists | Jerry Weintraub |        |
| 1981 | Mommie Dearest       | Paramount Pictures                  | Frank Yablans   | yes    |
| 1982 | Inchon               | MGM                                 | Mitsuharu Ishii | yes    |

⚠️ O arquivo deve ser salvo em formato CSV, utilizando ponto e vírgula (;) como separador.

Colunas:

- `year`: Ano do filme (número inteiro)
- `title`: Título do filme
- `studios`: Estúdio(s) responsável(is)
- `producers`: Produtor(es) do filme (separados por vírgula ou "and")
- `winner`: Preencha com `yes` se o filme foi vencedor, ou deixe `em branco` caso não tenha vencido

Esse script irá validar e inserir os dados dos filmes no banco.

## ▶️ Executando o Servidos

Para iniciar a aplicação:

```bash
npm run dev
```

ou

```bash
yarn dev
```

A API estrá disponível em `http://localhost:3333` (ou na porta configurada).

## 📡 Endpoint Principal

- `GET /winners`  
  Retorna os produtores com os menores e maiores intervalos entre prêmios.

Exemplo usando `curl`:

```bash
curl http://localhost:3333/winners
```

Exemplo de resposta:

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Buzz Feitshans",
      "interval": 13,
      "previousWin": 1985,
      "followingWin": 1998
    },
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

## 🗂️ Estrutura do Projeto

```
src/
  app/
    controller/
    services/
    files/
  infra/
    typeorm/
      entities/
      migrations/
    database/
  utils/
  movielist.csv
  routes.ts
```

- **entities/**: Definição das entidades do TypeORM.
- **migrations/**: Scripts de criação e alteração de tabelas.
- **services/**: Lógica de negócio, como o cálculo dos intervalos de prêmios.
- **controller/**: Camada de controle das rotas.
- **files/**: Pasta que contem o arquivo excel a ser lido.
- **utils/**: Scripts utilitários, como o importador de CSV.

## 📋 Observações

- O projeto utiliza validação dos dados do CSV antes de inserir no banco.
- O endpoint `/winners` retorna um JSON com os produtores que tiveram o menor e o maior intervalo entre vitórias.

---

📫 Qualquer dúvida ou sugestão, fique à vontade para entrar em contato!
