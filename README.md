# 🔮 Dark Future

Um ritual interativo em forma de app para leituras simbólicas com cartas e respostas guiadas.

## 🧱 Arquitetura utilizada

Este projeto segue uma arquitetura em camadas inspirada em **Clean Architecture**, separando regras de negócio de interface e infraestrutura:

- **domain/** 🜂
  Contém entidades e regras centrais (`card`, `player`, `reading`) e serviços de interpretação.
- **application/** 🜁
  Define portas (contratos) e casos de uso (`get-deck-cards`, `generate-reading`) que orquestram a lógica sem depender de frameworks.
- **infrastructure/** 🜃
  Implementa repositórios concretos com dados JSON simulados.
- **presentation/** 🜄
  Camada de UI com React, telas do jogo e hooks de controle.

Essa organização facilita manutenção, testes e evolução de funcionalidades sem acoplamento excessivo.

## ✨ Funcionalidades principais

- 🃏 **Seleção de cartas** com fluxo guiado por telas.
- 🧠 **Geração de leitura** com base no estado atual do jogo.
- 📜 **Respostas dinâmicas** vindas de repositórios JSON mockados.
- 🔊 **Controle de áudio** para enriquecer a atmosfera da experiência.
- ⚛️ **Frontend moderno** com React + TypeScript + Vite.

## 🎮 Como jogar

1. Abra o app e inicie o ritual na tela de ativação.
2. Informe os dados solicitados no formulário.
3. Escolha as cartas disponíveis no deck.
4. Aguarde a interpretação e leia a resposta final.
5. Reinicie o ciclo para uma nova leitura.

## 🛠️ Scripts disponíveis

- `npm run dev` → inicia em modo desenvolvimento.
- `npm run build` → gera build de produção em `dist`.
- `npm run preview` → pré-visualiza o build local.
- `npm run deploy` → publica no GitHub Pages (usa `gh-pages`).

## 🌐 Deploy no GitHub Pages

O projeto já está preparado para Pages com base configurada em `vite.config.ts`:

- `base: "/darkfuture/"`

Acesse a versão publicada em:

- https://allandevbrazil.github.io/darkfuture/

Para publicar manualmente:

1. `npm install`
2. `npm run deploy`

## 🧪 Stack

- React 19
- TypeScript
- Vite
- ESLint

---

🜏 Que as cartas revelem o que precisa ser visto.
