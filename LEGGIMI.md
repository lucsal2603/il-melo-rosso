# Il Melo Rosso — nuovo sito (v2)

Sito one-page in HTML, CSS e JavaScript, senza WordPress né database: funziona su qualsiasi hosting e su GitHub Pages.

Riferimento di stile: **Agrumea Farm** (Sito del Giorno su Awwwards, 5/11/2026: grafica 3D, GSAP e Lenis), adattato al Melo Rosso.

## Vederlo in locale
```bash
python3 -m http.server 8080
```
Poi apri http://localhost:8080

## Sezioni e animazioni
1. **Caricamento**: frutti illustrati (mela, pera, uva, ciliegie, zucca, gatto…) che saltano fuori, contatore %, doppia tendina rossa/bordeaux
2. **Hero 3D (WebGL)**: 10 foto su una ruota che gira con lo scroll; le foto si piegano e cambiano colore ai bordi in base alla velocità; scritta circolare gigante che ruota sulla "tavola" bordeaux; etichetta che cambia con la foto davanti; clic su una foto per andare alla sezione
3. **La Cascina**: titolo gigante lettera per lettera, immagine che si allarga a tutto schermo con il titolo sopra
4. **Promessa**: forme illustrate che cadono dall'alto, si fermano e poi escono
5. **La Cucina**: tre foto che entrano dai lati, schede Antipasti/Dolci/Colazione con cambio foto animato, tabella del menù che si disegna
6. **Paolo**: scritta "Con il cuore" che scorre dietro la foto, che ruota; frutti che fluttuano
7. **Le Camere**: card numerate impilate che si inclinano una sull'altra
8. **Matrimoni**: galleria da trascinare con il mouse/dito (si piega con la velocità) e numeri che contano
9. **Fortunago**: foto laterali che entrano ruotando, foto centrale che si ingrandisce
10. **Galleria**: due nastri di foto in direzioni opposte che accelerano con lo scroll (clic = foto grande)
11. **Recensioni** a rotazione e **footer** con il nome gigante

## File
- `index.html`: contenuti e testi
- `css/style.css`: stile (colori nelle variabili in cima)
- `js/main.js`: animazioni
- `src/hero-gl.js`: sorgente della ruota 3D. Se lo modifichi, ricompila con:
  `npx esbuild src/hero-gl.js --bundle --minify --format=iife --global-name=MeloGL --outfile=js/hero-gl.min.js` (serve `npm i three esbuild`)
- `assets/img/nuove/`: le 29 foto nuove di matrimonio.com
- `assets/img/gl/`: versioni leggere delle foto della ruota 3D

## Modifiche rapide
- **Foto ed etichette della ruota**: in `js/main.js`, l'elenco `heroItems`
- **Foto delle schede della cucina**: in `js/main.js`, l'elenco `sets`
- **Colori**: `--cream`, `--wine`, `--apple` in cima a `css/style.css`

## Da verificare prima della messa online
- Prezzo "da €100 a notte" (listino 2024) e dati recensioni (4,7/5, 94%)
- Banner cookie/privacy (il sito attuale usa iubenda)
- Diritti delle foto di Barbara Buschiazzo anche per il nuovo sito
