# ♻️ EcoAcess Manaus: Identificação sem Barreiras

![Banner EcoAcess Manaus]([https://drive.google.com/file/d/1sNDvpq328VankwQzUVG-FWfbpv5J8k6T/view?usp=sharing](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZpOiSkvl_egYvdLq2zPrjhYNWVMWy-IMwgVPXaihqgQ4Jn6Hw7JbCrW8840AH6bC4X__lkQDSOh8t5qpeRxauKrR8sv5JUMAWl5yJKjivDJ7aIfudJz25ckVMLoLZt2vl-H-7RT3uOb_pSoxdipczXKVu4pE9B0ZNx3gLA4OOg5WpBmpwz2vU7O_3Ndc/w945-h600-p-k-no-nu/Captura%20de%20tela%202026-10-26%20034603.png))

O **EcoAcess Manaus** é uma solução tecnológica móvel voltada a promover a **acessibilidade digital**, a **inclusão social** e a **sustentabilidade ambiental** na cidade de Manaus (AM). O projeto integra Inteligência Artificial (IA), Teoria dos Grafos e Design Inclusivo para solucionar os desafios de descarte incorreto de resíduos e apoiar pessoas com deficiência na visão de cores (daltonismo).

---

## 📌 Eixos do Projeto

1. **🤖 IA e Visão Computacional (*On-Device*)**
   * Classificação automatizada de resíduos a partir da câmera do smartphone usando **TensorFlow Lite** (MobileNetV3 / EfficientNet).
   * Identificação de categorias como: *Papel*, *Plástico*, *Metal*, *Vidro*, *Eletrônicos* e *Orgânico*.

2. **🗺️ Teoria dos Grafos e Geolocalização**
   * Recomendação de Pontos de Entrega Voluntária (PEVs) e ecopontos em Manaus.
   * Cálculo de caminhos mínimos otimizados utilizando o **Algoritmo de Dijkstra** / **A*** integrados com **PostGIS** e **Node.js**.

3. **👁️‍🗨️ Acessibilidade Cromática e Multimodal**
   * Aplicação do sistema **ColorADD** (código de símbolos para cores).
   * Conformidade com as diretrizes **WCAG 2.1 (AA)**: alto contraste, padrões texturizados, textos descritivos e retorno sonoro/vibratório.

---

## 🛠️ Tecnologias Utilizadas

* **Mobile / Frontend:** React Native (Expo), TypeScript, Context API / Zustand.
* **Backend:** Node.js, Express.js, Redis.
* **Banco de Dados:** PostgreSQL com extensão PostGIS.
* **Inteligência Artificial:** TensorFlow Lite, Python (NetworkX / Graphology).

---

## 🎯 Impacto Socioambiental (ODS Agenda 2030)

* **ODS 11 - Cidades e Comunidades Sustentáveis:** Facilita a conexão do cidadão com os pontos de coleta seletiva da cidade.
* **ODS 13 - Ação Contra a Mudança Global do Clima:** Estimula a destinação correta de resíduos, contribuindo para a redução da emissão de gases de efeito estufa em aterros.
