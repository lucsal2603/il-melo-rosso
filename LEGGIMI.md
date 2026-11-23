# Il Melo Rosso

Sito dell'Agriturismo Il Melo Rosso, Fortunago (PV).
HTML, CSS e JavaScript statici, nessun database: si pubblica su qualsiasi hosting.

## In locale
```bash
python3 -m http.server 8080
```
Poi apri http://localhost:8080

## Struttura
- `index.html`: home
- `cucina.html`, `camere.html`, `matrimoni.html`, `piscina.html`, `colazione.html`, `fortunago.html`: pagine interne, generate da `tools/build_pages.py`
- `css/style.css`: stile comune e home (colori in `:root`)
- `css/page.css`: stile delle pagine interne
- `js/core.js`: parti comuni (adesivi e colori `P`, menu, transizioni, footer con la fisica, link social `SOCIAL`)
- `js/main.js`: animazioni della home (dati delle camere in `ROOMS`, momenti del matrimonio in `DAY`)
- `js/page.js`: animazioni delle pagine interne
- `assets/`: immagini, font (Melo Cond, da Jost, licenza OFL) e librerie (GSAP, ScrollTrigger, Lenis, Matter.js)

## Modificare le pagine interne
Testi e foto sono nell'elenco `PAGES` in `tools/build_pages.py`. Dopo una modifica:
```bash
python3 tools/build_pages.py
```
Lo script riscrive le pagine interne, aggiorna header, menu e footer della home e il numero di versione di CSS e JS (`?v=...`).
Va lanciato prima di ogni pubblicazione. Le modifiche fatte a mano su `cucina.html` ecc. vengono sovrascritte.

## Da verificare prima della messa online
- Prezzi delle camere (listino 2024: depandance da €140, bagno privato da €120, bagno attiguo da €100, letto aggiunto €20, pranzo light da €25, cena da €40)
- Recensioni (4,7/5, 47 recensioni, 94%) e servizi matrimoni da matrimonio.com
- Piscina: orari e stagione di apertura
- Banner cookie e privacy (il sito attuale usa iubenda)
- Diritti delle foto di Barbara Buschiazzo per il nuovo sito
