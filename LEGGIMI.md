# Il Melo Rosso — nuovo sito

Sito one-page in HTML, CSS e JS puro. Non serve WordPress né un database: basta caricare la cartella su qualsiasi hosting.

## Vederlo in locale
Apri un terminale nella cartella e lancia:

```bash
python3 -m http.server 8080
```

Poi vai su http://localhost:8080
(Se apri `index.html` con un doppio clic funziona quasi tutto, ma con un server locale vedi esattamente il risultato finale.)

## Struttura
- `index.html`: tutti i contenuti (testi, foto, contatti)
- `css/style.css`: stile (colori in cima al file, in `:root`)
- `js/main.js`: animazioni (GSAP + ScrollTrigger + Lenis, già inclusi in `assets/vendor`)
- `assets/img/nuove/`: le 29 foto pubblicate dalla titolare su matrimonio.com (tutte usate)
- `assets/img/site/`, `assets/img/camere/`: foto prese dal sito attuale (Paolo, camere, logo…)

## Sezioni (dall'alto)
1. Loader con contatore e foto in sequenza
2. Hero a tutto schermo (vista aerea della cascina)
3. Manifesto: le parole si accendono mentre scorri, con mini-foto nel testo
4. Zoom: l'immagine centrale si allarga a tutto schermo e le altre "volano via"
5. La Cucina: foto in parallasse, le portate e gli orari
6. "Semplicemente genuino": una foto ad arco tra due scritte che si separano
7. Fascia scorrevole (marquee) che reagisce alla velocità dello scroll
8. Le Camere: card impilate che si sovrappongono
9. Matrimoni: galleria orizzontale + numeri animati
10. Fortunago: scritta gigante "riempita" dal paesaggio
11. Galleria: colonne che scorrono a velocità diverse (clic sulle foto per ingrandirle)
12. Recensioni a scorrimento
13. Contatti / footer

## Modifiche rapide
- **Cambiare la foto della hero:** in `index.html` cerca `hero__media` e cambia il `src`.
- **Colori:** in `css/style.css`, variabili `--red`, `--paper`, `--ink`…
- **Telefono ed email:** cerca `335 176 2614` e `agriturismo@ilmelorosso.it` in `index.html`.

## Da verificare con il cliente prima di andare online
- Prezzi camere ("da €100 a notte"): presi dal listino 2024 del sito attuale.
- Dati recensioni (4,7/5, 94%, 47 recensioni): presi da matrimonio.com a novembre 2026.
- Banner cookie e privacy (il sito attuale usa iubenda): vanno aggiunti al momento della pubblicazione.
- Le foto di Barbara Buschiazzo: assicurarsi che i diritti coprano anche l'uso sul nuovo sito.
