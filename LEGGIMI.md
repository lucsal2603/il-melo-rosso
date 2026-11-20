# Il Melo Rosso — nuovo sito (v3 · "Scegli il tuo momento")

Sito one-page in HTML, CSS e JavaScript, senza WordPress né database: funziona su qualsiasi hosting e su GitHub Pages.

Riferimento di stile: **Sweet Tape** (Sito del Giorno su Awwwards, 17/11/2026), pagina https://sweet-tape.com/products come home; le altre sezioni seguono lo stile della loro home. Il codice è scritto da zero.

## Vederlo in locale
```bash
python3 -m http.server 8080
```
Poi apri http://localhost:8080

## Sezioni e animazioni
1. **Caricamento**: il logo (ricreato in vettoriale, `assets/img/logo.svg`, identico all'originale) si costruisce pezzo per pezzo: cerchio, anello che si disegna, disco, l'albero cresce dalle radici, la mela spunta e dondola, il gatto salta fuori e dà due zampate. Poi gli archi colorati salgono e scoprono la pagina. Gli stessi archi fanno da transizione tra le pagine: la pagina nuova si apre già coperta e gli archi continuano a salire, senza stacchi di colore
2. **Scegli il tuo momento**: 6 adesivi rotondi (Cucina, Camere, Matrimoni, Piscina, Colazione, Fortunago). Passandoci sopra **tutta la pagina cambia colore**, l'adesivo si ingrandisce e compare la scritta a mano "cliccami!". Clic = vai alla sezione
3. **Menu "Tirami"**: l'etichetta in alto a destra si tira giù (o si clicca) e il menu scende con un rimbalzo
4. **La storia**: collage con post-it, polaroid attaccate con lo scotch e cartoncino kraft; il testo si colora mentre scorri, la lista "Da fare" si spunta da sola, un adesivo cade dall'alto
5. **Fascia ondulata**: la scritta corre lungo l'onda e cambia direzione con lo scroll
6. **Le camere**: slider a colori. Ogni camera ha il suo colore, la parola gigante cambia lettera per lettera e l'adesivo scivola via. Si cambia camera con le frecce oppure trascinando con il mouse o con il dito
7. **Perché il Melo**: tela gigante come Sweet Tape. "PER GUSTARE / PER RIPOSARE / PER FESTEGGIARE / PER SCOPRIRE" sono su altezze diverse (alta, bassa, alta, bassa); la telecamera scende dal titolo, corre lungo ogni parola e va in diagonale verso la successiva. Le lettere salgono quando arriva la telecamera; foto, adesivi e frecce disegnate a mano entrano a scatto. Font "Melo Cond" (assets/fonts, Jost Black condensato, licenza OFL), simile al Futura Condensed di Sweet Tape
8. **Matrimoni · la giornata** (come "The Creative" di Sweet Tape): la sezione resta ferma e, scorrendo, passa la giornata: la cerimonia (mattina), l'aperitivo (mezzogiorno), la cena (sera), la festa (notte). A ogni momento cambiano colore, titolo gigante a ventaglio, adesivo (si gira come una moneta) e foto (si staccano e ne arrivano altre col nastro); un piccolo sole attraversa il cielo e diventa luna. A destra una ruota di adesivi per saltare a un momento. Dati in `DAY` in `js/main.js`
9. **Vieni a trovarci!**: forme morbide che si deformano lentamente, pulsanti Chiama / WhatsApp / Scrivici
10. **Footer giocabile**: adesivi e bottoni social cadono con la fisica e si possono trascinare e lanciare (i bottoni social sono link)

Passando con il mouse su qualsiasi testo del sito, salta solo la lettera sotto il mouse.

Gli adesivi rotondi non si capovolgono mai: al massimo si inclinano di una ventina di gradi (anche quelli che cadono nel footer).

## Le pagine interne
Ogni adesivo della home apre la sua pagina, in stile scheda prodotto di Sweet Tape:
`cucina.html`, `camere.html`, `matrimoni.html`, `piscina.html`, `colazione.html`, `fortunago.html`.

Ogni pagina ha il colore del suo adesivo e queste sezioni:
1. **Apertura**: titolo gigante che cade lettera per lettera, adesivo che entra con un rimbalzo; scorrendo, l'adesivo scende fino alla descrizione e arriva dritto
2. **Descrizione**: testo grande che si colora mentre scorri, foto con lo scotch, etichette e pulsante (prenota / preventivo / come arrivare)
3. **Varianti**: card con adesivi (pranzo e cena, le 6 camere, rito e festa...)
4. **Superpoteri**: la sezione si ferma e le schede sono le facce di un solido 3D che ruota scorrendo; sopra e sotto si vedono le facce vicine inclinate e un po' trasparenti. Il titolo della scheda si "mescola" e si ricompone
5. **Frase + galleria**: frase grande, foto con lo scotch, striscia di foto che scorre (clic = foto grande)
6. **Prossima tappa**: l'adesivo della pagina successiva, cliccabile
7. Footer con la fisica, uguale in tutte le pagine (cliccando un adesivo si apre la sua pagina)

**Per modificare testi e foto delle pagine interne** apri `tools/build_pages.py`, cambia l'elenco `PAGES` e lancia:
```bash
python3 tools/build_pages.py
```
Lo script riscrive le 6 pagine e aggiorna anche menu, intestazione e footer della home, così restano uguali ovunque.
(Se modifichi a mano un file `cucina.html` ecc., la modifica viene persa al prossimo lancio dello script.)

## File
- `index.html`: contenuti e testi della home
- `css/style.css`: stile (colori principali in `:root`)
- `js/core.js`: parti comuni a tutte le pagine (adesivi e loro colori `P`, menu, transizioni ad archi, footer con la fisica, bottoni social `SOCIAL`)
- `js/page.js`: animazioni delle pagine interne
- `css/page.css`: stile delle pagine interne
- `js/main.js`: animazioni della home. In cima trovi:
  - `ROOMS`: le camere dello slider (testi, foto, colori)
- `assets/img/paper.jpg`: texture di carta stropicciata (generata, nessun diritto di terzi)
- `assets/img/stk/`: ritagli quadrati delle foto per gli adesivi
- `assets/vendor/`: GSAP, ScrollTrigger, Lenis, Matter.js (fisica del footer)

## Da verificare prima della messa online
- Prezzi delle camere (listino 2024 del sito attuale: depandance da €140, bagno privato da €120, bagno attiguo da €100, letto aggiunto €20, pranzo light da €25, cena da €40)
- Dati recensioni (4,7/5, 47 recensioni, 94%) e servizi matrimoni presi da matrimonio.com
- Pagina Piscina: non ci sono informazioni su orari e stagione di apertura, i testi sono solo descrittivi
- Banner cookie/privacy (il sito attuale usa iubenda)
- Diritti delle foto di Barbara Buschiazzo anche per il nuovo sito
