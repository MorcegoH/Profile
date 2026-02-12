# Documentação do Projeto: Perfil Executivo Heder Santos

Este documento detalha a estrutura, tecnologias e diretrizes de manutenção do site pessoal bibliográfico e curricular.

## 1. Visão Geral
O projeto é um portfólio de alta gama (high-end) voltado para o perfil executivo. A estética é pautada pela **austeridade**, utilizando uma paleta de cores profunda (preto absoluto, ardósia e azul/violeta metálico) e tipografia clássica combinada com elementos modernos de interface.

## 2. Stack Tecnológica
- **Frontend**: React (v19)
- **Estilização**: Tailwind CSS para utilitários e CSS Custom Properties para efeitos de vidro (glassmorphism).
- **Inteligência Artificial**: Integração com a Google Gemini API (modelo `gemini-3-flash-preview`) para o assistente virtual.
- **Fontes**: 
  - `Cinzel`: Para títulos e numeração romana (estilo clássico/monumental).
  - `Playfair Display / Serif`: Para o corpo de texto, reforçando a seriedade.
  - `Birthstone`: Para assinaturas discretas.

## 3. Arquitetura de Arquivos
- `index.html`: Ponto de entrada com configurações globais de estilo e fontes.
- `App.tsx`: Orquestrador principal das seções e lógica de scroll.
- `constants.tsx`: **Single Source of Truth** (Única fonte de verdade). Todos os dados do currículo e bio devem ser editados aqui.
- `components/`: Componentes modulares (Hero, About, Experience, Skills, Contact, Assistant).
- `types.ts`: Interfaces TypeScript para garantir a integridade dos dados.

## 4. Funcionalidades Principais
- **Scroll Progress**: Barra de progresso no topo para indicar a leitura.
- **Glassmorphism**: Painéis translúcidos com blur de fundo para profundidade.
- **Gemini Assistant**: Chatbot contextualizado com os dados do perfil, configurado para respostas curtas e austeras.
- **Navegação Inteligente**: Menu fixo que detecta a posição da página e adapta-se a telas mobile via overlay.

## 5. Manutenção e Atualização
Para atualizar as informações profissionais:
1. Abra o arquivo `constants.tsx`.
2. Altere os valores dentro do objeto `PROFILE_DATA`.
3. Para trocar a imagem, substitua a URL no componente `Hero.tsx`.

## 6. Responsividade
O site foi testado para:
- **Mobile (320px - 768px)**: Menu hambúrguer e colunas empilhadas.
- **Tablet (768px - 1024px)**: Ajustes de tipografia.
- **Desktop (1024px+)**: Layout monumental com grid complexo.

---
*Desenvolvido com foco em excelência operacional e governança de interface.*