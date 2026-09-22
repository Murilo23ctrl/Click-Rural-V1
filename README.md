# Click Rural — Site

Site institucional de uma página (one-page) para a fotógrafa Flick Rural, construído em HTML, CSS e JavaScript puros (sem frameworks, sem etapa de build).

## Como abrir

Basta abrir `index.html` no navegador. Para testar o formulário e a navegação com um servidor local (recomendado):

```
cd flick-rural
python3 -m http.server 8080
```

e acessar `http://localhost:8080`.

## Estrutura

```
index.html
assets/
  css/style.css
  js/main.js
  img/placeholders/   → texturas ilustrativas (ver abaixo)
  img/favicon.svg
```

## O que precisa ser substituído antes de publicar

1. **Fotografias** — todas as imagens em `assets/img/placeholders/` são texturas decorativas geradas (gradientes na paleta da marca + ícone), não fotos reais. Isso evita usar fotos de terceiros/bancos de imagem genéricos no portfólio da Flick. Basta trocar o `src` de cada `<img>` pelas fotos reais (mantendo a mesma proporção indicada em cada seção) e ajustar o `alt` de cada uma.
2. **WhatsApp** — número de exemplo `5511999999999` aparece em 3 lugares (`index.html`): botão flutuante, seção de CTA e seção de contato. Buscar por `5511999999999` e substituir pelo número real (formato `55DDDNÚMERO`, só dígitos).
3. **Instagram** — links apontam para `instagram.com/flickrural` (placeholder). Ajustar se o usuário real for diferente.
4. **E-mail** — `contato@flickrural.com.br` é placeholder.
5. **Formulário de contato** — hoje funciona apenas no front-end (valida e mostra confirmação, mas não envia e-mail de verdade). Para receber as mensagens, conectar a um serviço como Formspree, EmailJS, Netlify Forms ou um backend próprio no `<form id="contactForm">` / `assets/js/main.js`.

## Notas

- As imagens de referência citadas no briefing não vieram anexadas nesta conversa — o layout foi construído a partir da descrição textual detalhada.
- Sem dependências externas além das fontes do Google Fonts (Cormorant Garamond, Lato, Petit Formal Script), carregadas via CDN.
- Totalmente responsivo, com menu hamburguer no mobile, filtros de galeria com lightbox navegável por teclado, e animações que respeitam `prefers-reduced-motion`.
