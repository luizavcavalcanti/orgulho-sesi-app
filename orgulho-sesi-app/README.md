# Orgulho de Ser Sesi — App de pontuação

App web usado no evento anual "Orgulho de Ser Sesi" (SESI Pernambuco), onde
os visitantes ganham pontos escaneando QR codes espalhados pelas atividades
do dia e acompanham a colocação deles num ranking em tempo real.

Feito pra rodar direto do navegador — sem loja de aplicativo, sem instalar
nada. A pessoa entra por um QR code de acesso na entrada do evento, escaneia
com a própria câmera do celular as próximas ativações, e o placar atualiza
sozinho, inclusive numa TV separada exibindo o ranking geral pro público.

## Por que essas escolhas

**Sem login tradicional.** Pedir e-mail e senha de mais de 500 pessoas num
evento de um dia é fricção desnecessária e um risco de LGPD que não precisa
existir. A identificação de exibição é só nome + sobrenome + os 3 primeiros
números da matrícula — o suficiente pra não confundir duas pessoas no
ranking. Por trás, quem garante que aquele "dono" da pontuação é real é o
**Firebase Authentication Anônimo**: cada aparelho recebe uma credencial
única e invisível assim que abre o app, sem pedir nada à pessoa.

**Pontos não vivem no QR code.** Cada QR code carrega só o identificador da
atividade (`oficina-robotica`, por exemplo). Se a pontuação estivesse
embutida no código, qualquer um poderia imprimir um QR falso valendo 9999
pontos. Quem decide quantos pontos vale cada atividade é o Firestore, através
das regras de segurança — o mesmo valor que está no código do app também
está espelhado nas regras, então mesmo alguém mexendo direto no `fetch` do
navegador não consegue forjar uma pontuação.

**Firebase em vez de backend próprio.** Pra um evento de um dia, sem verba
de infraestrutura e sem equipe de TI dedicada, manter um servidor rodando
não compensa. Firestore aguenta a leitura em tempo real de centenas de
pessoas ao mesmo tempo sem configuração extra, e o app inteiro roda como
site estático no Firebase Hosting.

## Estrutura

```
├── index.html            entrada do app do participante
├── ranking.html           entrada da tela de TV (só leitura)
├── firestore.rules        regras de segurança (a parte que realmente impede fraude)
├── firebase.json          config de deploy (Hosting + Firestore)
└── src/
    ├── firebase.js         inicialização do Firebase
    ├── auth.js              sessão anônima + perfil do participante
    ├── activities.js        lista de atividades e pontuação de cada uma
    ├── scoring.js            transação que credita pontos com proteção contra scan duplicado
    ├── scanner.js            leitura de QR pela câmera
    ├── ranking.js            listener em tempo real do placar
    ├── ranking-tv.js/.css    tela dedicada pra TV
    ├── tokens.css            paleta, tipografia e o estilo "adesivo" do evento
    ├── style.css             telas do app do participante
    ├── utils/
    │   ├── router.js         troca de tela sem framework
    │   └── toast.js          feedback rápido de erro/sucesso
    └── views/                cadastro, início, scan, resultado, ranking
```

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencher com as chaves do projeto Firebase
npm run dev
```

A leitura de câmera exige HTTPS (ou `localhost`) — em `localhost` o Vite já
resolve isso sozinho. Pra testar em celular real na mesma rede, é preciso um
túnel HTTPS (ex: `ngrok`) ou publicar direto no Firebase Hosting.

## Publicando

Duas formas, dependendo se você tem o `firebase-tools` instalado:

### Com a CLI

```bash
npm run build
firebase deploy --only hosting,firestore:rules
```

Antes do primeiro deploy: preencher `.firebaserc` com o id do projeto real e
ativar, no console do Firebase, o **Authentication → Anônimo** e o
**Firestore Database**.

### Sem instalar nada localmente (GitHub Actions)

O repositório já vem com `.github/workflows/deploy.yml`, que builda e publica
no Firebase Hosting sozinho a cada push na branch `main`. Pra ativar:

1. Suba o repositório pro GitHub (o `.env` fica de fora, por causa do
   `.gitignore` — é assim mesmo)
2. No console do Firebase: **Configurações do projeto → Contas de serviço →
   Gerar nova chave privada**, baixa o `.json`
3. No GitHub: **Settings → Secrets and variables → Actions**, cria os
   seguintes secrets:
   - `FIREBASE_SERVICE_ACCOUNT` — cola o conteúdo do `.json` inteiro
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
     `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
     `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — os mesmos
     valores do seu `.env`
4. Próximo push na `main` já dispara o deploy

As regras do Firestore, nesse caminho, são publicadas colando o conteúdo de
`firestore.rules` direto na aba **Regras** do Firestore no console — não
precisa de CLI nem de Action pra isso.

## Pendências antes do evento

- [ ] Trocar a lista de atividades em `src/activities.js` (e espelhar em
      `firestore.rules`) pela lista final da organização
- [ ] Gerar os QR codes de cada atividade apontando pra
      `https://SEU-DOMINIO/scan?atividade=ID-DA-ATIVIDADE`
- [ ] Testar o fluxo completo em celular real, em HTTPS
- [ ] Colocar os ícones de PWA em `public/icons/`

## Tecnologias

Vite, Firebase (Authentication, Firestore, Hosting), html5-qrcode, CSS puro.
