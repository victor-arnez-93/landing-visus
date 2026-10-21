# VISUS — Landing page de pré-lançamento

Base: landing-visus.rar enviado em 21/10/2026. Não inclui código Android nem modifica o aplicativo.

## Alterações

- Corrigidas as quatro referências de capturas inexistentes no HTML original.
- Tema claro/escuro alterna as capturas reais `visus1/visus1claro` e `visus2/visus2claro`.
- Carrossel de TV, Séries e Filmes com rotação automática, setas, indicadores e gesto lateral (toque), pausando em foco e hover.
- Ícones vetoriais consistentes na seção de compatibilidade e nos recursos.
- Botão de explorar com seta direcional animada; botão Google Play com glitch discreto no hover.
- CTA Google Play com contorno animado e link real; botão voltar ao topo.
- Tema com ícones sol/lua, persistência local e transições suaves.
- ScrollTrigger (substitui ScrollMagic) com fallback sem dependência obrigatória da CDN.
- Nova `termos.html`, otimizada para leitura e com índice lateral/rolagem interna em telas maiores.

## IMPORTANTE: PENDÊNCIA DOS TERMOS

O arquivo recebido contém SOMENTE a landing page, e NÃO contém o texto integral dos termos exibidos no aplicativo Android. Por isso, `termos.html` é uma versão PRELIMINAR baseada no conteúdo legal confirmado da landing e deve ser confrontada/substituída pela redação LITERAL do app antes de ser cadastrada como URL oficial na Google Play.

A página provisória usa `noindex,nofollow` e um aviso visível. Remover ambos DEPOIS de integrar os termos definitivos e de revisar a política de privacidade.

## Google Play

Link configurado:
https://play.google.com/store/apps/details?id=app.visus.player

O ID pode ser mantido quando mudar de teste fechado para produção. Visitantes sem acesso ao teste podem não conseguir abrir a página até a publicação pública. Não usar download de APK externo.

## Publicação

Hospedagem estática: `index.html`, `termos.html` e pasta `assets/` no mesmo nível.
Não subir o arquivo .rar em si; extrair a pasta do projeto.
Nenhuma dependência de compilação de npm é necessária. Animações GSAP carregam da CDN; botões e carrossel são implementados em JS local.

## Testes recomendados

- Desktop claro/escuro; celular e Android TV (usando browser quando disponível)
- Testar navegação pelo teclado, carrossel no celular, abertura externa da Google Play
- Conferir a versão do app na Play Console antes de informar que a disponibilidade é pública
- Conferir TERMOS DE USO e POLÍTICA DE PRIVACIDADE integrais antes de trocar a URL oficial
