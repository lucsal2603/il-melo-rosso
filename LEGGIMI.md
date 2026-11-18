# Il Melo Rosso — nuovo sito (v3 · "Scegli il tuo momento")

Sito one-page in HTML, CSS e JavaScript, senza WordPress né database: funziona su qualsiasi hosting e su GitHub Pages.

Riferimento di stile: **Sweet Tape** (Sito del Giorno su Awwwards, 17/11/2026), pagina https://sweet-tape.com/products come home; le altre sezioni seguono lo stile della loro home. Il codice è scritto da zero.

## Vederlo in locale
```bash
python3 -m http.server 8080
```
Poi apri http://localhost:8080

## Sezioni e animazioni
1. **Caricamento**: il logo salta fuori e gira, poi archi colorati salgono e scoprono la pagina (gli stessi archi fanno da transizione quando si clicca un link)
2. **Scegli il tuo momento**: 6 adesivi rotondi (Cucina, Camere, Matrimoni, Piscina, Colazione, Fortunago). Passandoci sopra **tutta la pagina cambia colore**, l'adesivo si ingrandisce e compare la scritta a mano "cliccami!". Clic = vai alla sezione
3. **Menu "Tirami"**: l'etichetta in alto a destra si tira giù (o si clicca) e il menu scende con un rimbalzo
4. **La storia**: collage con post-it, polaroid attaccate con lo scotch e cartoncino kraft; il testo si colora mentre scorri, la lista "Da fare" si spunta da sola, un adesivo cade dall'alto
5. **Fascia ondulata**: la scritta corre lungo l'onda e cambia direzione con lo scroll
6. **Le camere**: slider a colori. Ogni camera ha il suo colore, la parola gigante cambia lettera per lettera e l'adesivo rotola via (frecce o swipe)
7. **Perché il Melo**: scroll orizzontale "PER GUSTARE / PER RIPOSARE / PER FESTEGGIARE / PER SCOPRIRE" con foto, adesivi che ruotano, frecce disegnate a mano
8. **Matrimoni**: foto grande che si apre, adesivo e striscia di foto che scorre
9. **Vieni a trovarci!**: forme morbide che si deformano lentamente, pulsanti Chiama / WhatsApp / Scrivici
10. **Footer giocabile**: adesivi e bottoni social cadono con la fisica e si possono trascinare e lanciare (i bottoni social sono link)

Passando con il mouse sui testi del menu, del footer e sulle parole grandi, le lettere saltellano.

## File
- `index.html`: contenuti e testi
- `css/style.css`: stile (colori principali in `:root`)
- `js/main.js`: animazioni. In cima trovi:
  - `P`: gli adesivi (foto, colori, etichette)
  - `ROOMS`: le camere dello slider (testi, foto, colori)
  - `SOCIAL`: i bottoni del footer
- `assets/img/paper.jpg`: texture di carta stropicciata (generata, nessun diritto di terzi)
- `assets/img/stk/`: ritagli quadrati delle foto per gli adesivi
- `assets/vendor/`: GSAP, ScrollTrigger, Lenis, Matter.js (fisica del footer)

## Da verificare prima della messa online
- Prezzo "da €100 a notte" (listino 2024) e dati recensioni (4,7/5, 47 recensioni)
- Banner cookie/privacy (il sito attuale usa iubenda)
- Diritti delle foto di Barbara Buschiazzo anche per il nuovo sito
