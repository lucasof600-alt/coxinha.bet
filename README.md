# 🥟 COXINHABET — A MELHOR DA PARAÍBA!

Simulação recreativa de casa de apostas, **somente com créditos fictícios** (sem depósito, saque ou valor monetário).

## Estrutura
```
coxinhabet/
├── index.html        página principal
├── 404.html          página de erro
├── css/style.css     estilos (tema escuro, responsivo)
├── js/app.js         lógica: odds, cupom, saldo, apostas, resultados
├── assets/favicon.svg
├── netlify.toml / vercel.json
└── README.md
```
Site estático: não precisa de servidor, banco de dados nem instalação.

## Testar no computador
Dê dois cliques em `index.html` (ou rode `python3 -m http.server 8000` e abra http://localhost:8000).

## Colocar no ar (grátis)

**Opção 1 — Netlify (mais fácil)**
1. Acesse https://app.netlify.com/drop
2. Arraste a pasta `coxinhabet` inteira (descompactada) para a página.
3. Pronto: você recebe um link público. Em *Site settings → Change site name* escolha, por exemplo, `coxinhabet`.

**Opção 2 — GitHub Pages**
1. Crie um repositório no GitHub e envie todos os arquivos.
2. *Settings → Pages → Deploy from branch → main / (root)*.
3. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

**Opção 3 — Vercel**
1. Em https://vercel.com/new importe o repositório (ou use `npx vercel` na pasta).
2. Sem build: deixe as configurações padrão.

## Domínio próprio
Registre um domínio (ex.: registro.br) e aponte-o nas configurações de *Domains* da hospedagem escolhida.

## Como funciona
- Saldo inicial: R$ 1.000,00 fictícios, salvo no navegador (localStorage).
- Painel do administrador (seção Resultados): define o vencedor e liquida os cupons automaticamente.
- Para criar novas apostas, edite o objeto `MARKET` no começo de `js/app.js`.

> Aviso: o painel de administrador é visível a todos os visitantes (é uma demo sem back-end).
