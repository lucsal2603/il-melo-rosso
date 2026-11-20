#!/usr/bin/env python3
"""
Genera le pagine interne del sito (cucina.html, camere.html, ...) e aggiorna
le parti condivise (header, menu, footer, script) anche in index.html.

Uso:   python3 tools/build_pages.py
Per cambiare un testo o una foto di una pagina, modifica PAGES qui sotto e rilancia.
"""
import html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
E = html.escape

# --------------------------------------------------------------------------
# COLORI (devono coincidere con P in js/core.js)
# --------------------------------------------------------------------------
COL = {
    "cucina":    dict(bg="#F58A1F", ink="#5A2400", hill="#D9700D", title="#FFD23F"),
    "camere":    dict(bg="#8E80F0", ink="#1E1660", hill="#7262DD", title="#D7D1FF"),
    "matrimoni": dict(bg="#F59DB0", ink="#6E1330", hill="#E3829A", title="#FFE3EA"),
    "piscina":   dict(bg="#5BC6EE", ink="#073C55", hill="#3AAEDB", title="#DDF5FF"),
    "colazione": dict(bg="#F5CF33", ink="#5A3D00", hill="#DDB41A", title="#FFF5C2"),
    "fortunago": dict(bg="#8CCB3A", ink="#173D08", hill="#6FB021", title="#E8FFC2"),
}
TEL = "tel:+393351762614"
MAIL = "mailto:agriturismo@ilmelorosso.it"
MAPS = "https://www.google.com/maps/search/?api=1&query=Agriturismo+Il+Melo+Rosso+Via+Ca%27+De%27+Vecchi+1+Fortunago"

# --------------------------------------------------------------------------
# ICONE (linee semplici, 24x24)
# --------------------------------------------------------------------------
ICON = {
    "leaf":   '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19c4-5 7-7 10-9"/>',
    "pin":    '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "heart":  '<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z"/>',
    "key":    '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
    "bed":    '<path d="M3 18V7M3 13h18v5M21 13v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10.5" r="1.6"/>',
    "door":   '<path d="M6 21V4h12v17M3 21h18"/><circle cx="15" cy="12.5" r=".8"/>',
    "rings":  '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M10 5l2-2 2 2"/>',
    "cake":   '<path d="M4 20h16v-7H4zM4 16c2 1 4-1 6 0s4 1 6 0 3-1 4 0M12 13V9M12 6.5c-1-1 0-2.5 0-2.5s1 1.5 0 2.5"/>',
    "star":   '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    "wave":   '<path d="M2 15c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5-1"/><path d="M2 19c2.5-2 5-2 7.5 0s5 2 7.5 0 3.5-1.5 5-1"/><circle cx="16" cy="7" r="3"/>',
    "tree":   '<path d="M12 21v-5M12 3l6 9h-3l4 4H5l4-4H6z"/>',
    "sun":    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "cup":    '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2.5 2.5 0 0 1 0 5h-2M8 3c-1 1 1 2 0 3M12 3c-1 1 1 2 0 3"/>',
    "clock":  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "castle": '<path d="M4 21V9h3V6h2v3h6V6h2v3h3v12zM10 21v-5h4v5M4 9V6M20 9V6"/>',
    "path":   '<path d="M6 21c0-4 4-5 6-8s0-6 4-10"/><circle cx="6" cy="21" r=".5"/><path d="M15 3h3v3"/>',
    "wine":   '<path d="M8 3h8l-.5 5a3.5 3.5 0 0 1-7 0zM12 11.5V20M8.5 21h7"/>',
}

def svg_icon(name):
    return f'<svg class="pw__icon" viewBox="0 0 24 24" aria-hidden="true">{ICON[name]}</svg>'

# --------------------------------------------------------------------------
# CONTENUTI
# --------------------------------------------------------------------------
PAGES = [
  dict(key="cucina", file="cucina.html",
    title=("La", "Cucina"), pill="Ti presentiamo", hand="dall'orto alla tavola ✿",
    meta="La cucina di casa del Melo Rosso: menù degustazione con 8/9 antipasti, primo, secondo, dolce e caffè. Pranzo alle 13:00, cena alle 20:30, solo su prenotazione.",
    desc="Paolo cucina con passione e fantasia: piatti semplici e tradizionali, materie prime fresche di giornata e tutto fatto al momento, dagli antipasti al dolce.",
    card=("assets/img/site/paolo.jpg", "Paolo ai fornelli"),
    chips=["8/9 antipasti", "1 primo", "1 secondo con contorno", "dolce & caffè"],
    cta=("Prenota un tavolo", TEL),
    sib_title="Due appuntamenti al giorno",
    sibs=[
      dict(img="assets/img/nuove/img-7616.jpg", label="Pranzo", h="Pranzo", p="Alle 13:00, tutti i giorni, solo su prenotazione."),
      dict(img="assets/img/nuove/t30-1946176-2.jpg", label="Cena", h="Cena", p="Alle 20:30, tutti i giorni, solo su prenotazione."),
    ],
    powers=[
      ("leaf", "Dall'orto", "Il menù cambia ogni giorno con quello che danno l'orto e la stalla."),
      ("pin", "Km zero", "Quello che non produciamo arriva da aziende agricole e artigiane del territorio."),
      ("heart", "Per tutti", "Allergie, intolleranze, menù vegetariano o vegano: basta dirlo quando prenoti."),
    ],
    power_note="Pet friendly: avvisaci se porti il cane, in azienda ci sono cani maschi territoriali.",
    quote="Il giorno in cui hai assaggiato nove antipasti e hai trovato posto anche per il dolce.",
    quote_img="assets/img/site/b5302.jpg",
    gallery=["assets/img/nuove/13175261.jpg", "assets/img/nuove/img-7616.jpg", "assets/img/nuove/img-7609-1.jpg", "assets/img/site/508g.jpg", "assets/img/nuove/t30-1946176-2.jpg", "assets/img/nuove/img-7841.jpg", "assets/img/site/b5302.jpg"],
    next="camere"),

  dict(key="camere", file="camere.html",
    title=("Le", "Camere"), pill="Dove dormire", hand="sei stanze, una casa di famiglia",
    meta="Le camere del Melo Rosso a Fortunago: depandance indipendenti e camere con bagno privato o attiguo, in B&B, mezza pensione o pensione completa.",
    desc="Stanze ristrutturate con cura, con gli arredi originali e i dettagli di una volta. Doppie, triple, quadruple e depandance indipendenti, per coppie, amici e famiglie.",
    card=("assets/img/camere/luna-2.jpg", "camera della luna"),
    chips=["B&B", "mezza pensione", "pensione completa", "wi-fi"],
    cta=("Prenota una camera", TEL),
    sib_title="La famiglia al completo",
    sibs=[
      dict(img="assets/img/stk/casetta-1.jpg", label="Casetta", h="La Casetta", p="Depandance superior, fino a 4 ospiti."),
      dict(img="assets/img/stk/luna-1.jpg", label="Luna", h="Camera della Luna", p="Soppalco e letto alla francese, fino a 5 ospiti."),
      dict(img="assets/img/stk/nonno-1.jpg", label="Nonno", h="Camera del Nonno", p="Matrimoniale, vista giardino."),
      dict(img="assets/img/stk/zio-2.jpg", label="Zio", h="Camera dello Zio", p="Matrimoniale, vista bosco."),
      dict(img="assets/img/stk/viola-1.jpg", label="Viola", h="Depandance Viola", p="Indipendente, 2 – 3 ospiti."),
      dict(img="assets/img/stk/pv-1.jpg", label="Paolo &|Veronica", h="Paolo & Veronica", p="Due camere attigue, fino a 4 ospiti."),
    ],
    powers=[
      ("key", "Depandance", "Indipendente, con ingresso tutto suo: da € 140 a notte."),
      ("bed", "Bagno privato", "Camera con bagno privato: da € 120 a notte."),
      ("door", "Bagno attiguo", "Camera con bagno attiguo: da € 100 a notte."),
    ],
    power_note="Prezzi indicativi con colazione inclusa, variano con la stagione. Letto aggiunto € 20 a persona · pranzo light da € 25 · cena da € 40.",
    quote="Il weekend in cui hai spento la sveglia e acceso le colline.",
    quote_img="assets/img/camere/nonno-1.jpg",
    gallery=["assets/img/camere/casetta-2.jpg", "assets/img/camere/luna-1.jpg", "assets/img/camere/nonno-2.jpg", "assets/img/camere/zio-1.jpg", "assets/img/camere/viola-2.jpg", "assets/img/camere/pv-2.jpg", "assets/img/camere/casetta-1.jpg", "assets/img/camere/viola-1.jpg"],
    next="matrimoni"),

  dict(key="matrimoni", file="matrimoni.html",
    title=("I", "Matrimoni"), pill="Sposarsi al Melo", hand="un solo matrimonio al giorno: il vostro",
    meta="Matrimoni country chic al Melo Rosso: rito nel prato fiorito, festa in veranda o in tensostruttura, da 60 a 150 ospiti, un solo evento al giorno.",
    desc="Il rito nel prato fiorito, la festa in veranda o sotto la tensostruttura, la cucina di Paolo per il pranzo. Da 60 a 150 ospiti, con tutta la casa solo per voi.",
    card=("assets/img/nuove/img-7615.jpg", "l'altare"),
    chips=["60 – 150 ospiti", "4,7 / 5 su matrimonio.com", "94% degli sposi ci consiglia"],
    cta=("Richiedi un preventivo", MAIL + "?subject=Matrimonio%20al%20Melo%20Rosso"),
    sib_title="Due momenti indimenticabili",
    sibs=[
      dict(img="assets/img/nuove/t30-1946176-3.jpg", label="Il rito", h="Il rito", p="Nel prato fiorito, oppure in comune a Fortunago."),
      dict(img="assets/img/site/b4154.jpg", label="La festa", h="La festa", p="In veranda o sotto la tensostruttura, anche se piove."),
    ],
    powers=[
      ("rings", "Solo voi", "Un solo evento al giorno: la casa è tutta vostra."),
      ("cake", "Su misura", "Menù personalizzati, anche vegetariani, vegani o senza glutine. La torta potete portarla voi."),
      ("star", "Liberi", "Nessuna esclusiva: scegliete voi fotografo, musica e allestimenti."),
    ],
    power_note="Vi invitiamo volentieri a visitare la struttura e ad assaggiare i nostri piatti prima di decidere.",
    quote="Il giorno in cui il gatto di casa è finito in metà delle foto.",
    quote_img="assets/img/site/gatto.jpg",
    gallery=["assets/img/nuove/13660935-2.jpg", "assets/img/nuove/9642710.jpg", "assets/img/nuove/img-7841.jpg", "assets/img/nuove/img-7844.jpg", "assets/img/nuove/t30-1946176-1.jpg", "assets/img/nuove/4079849.jpg", "assets/img/site/485.jpg", "assets/img/site/514.jpg", "assets/img/site/matrimonio-melo.jpg"],
    next="piscina"),

  dict(key="piscina", file="piscina.html",
    title=("La", "Piscina"), pill="Un tuffo", hand="tra i boschi e le colline",
    meta="La piscina panoramica del Melo Rosso, affacciata sui boschi e sulle colline dell'Oltrepò Pavese.",
    desc="Una piscina affacciata sul verde dell'Oltrepò. Un tuffo dopo la passeggiata, un libro all'ombra, e tutto intorno il silenzio della campagna.",
    card=("assets/img/nuove/meloview16.jpg", "vista dall'alto"),
    chips=["vista colline", "tra i boschi", "relax"],
    cta=("Prenota il tuo soggiorno", TEL),
    sib_title="Due modi di stare",
    sibs=[
      dict(img="assets/img/nuove/img-7606.jpg", label="Al sole", h="Al sole", p="Acqua azzurra e cielo blu, senza pensieri."),
      dict(img="assets/img/nuove/img-7838.jpg", label="All'ombra", h="All'ombra", p="Il giardino fiorito è a due passi."),
    ],
    powers=[
      ("wave", "La vista", "Acqua azzurra e colline verdi, fin dove arriva lo sguardo."),
      ("tree", "Il silenzio", "Intorno solo boschi, prati e il canto degli uccelli."),
      ("sun", "Il relax", "Il posto giusto per non fare assolutamente niente."),
    ],
    power_note="",
    quote="Il pomeriggio in cui l'unico impegno era scegliere tra sole e ombra.",
    quote_img="assets/img/nuove/img-7606.jpg",
    gallery=["assets/img/nuove/img-7606.jpg", "assets/img/nuove/meloview16.jpg", "assets/img/nuove/copertina.jpg", "assets/img/nuove/img-8497.jpg", "assets/img/nuove/t30-2973555-1.jpg", "assets/img/nuove/img-7838.jpg", "assets/img/nuove/img-7608.jpg"],
    next="colazione"),

  dict(key="colazione", file="colazione.html",
    title=("La", "Colazione"), pill="Buongiorno!", hand="fatta in casa, sempre",
    meta="La colazione del Melo Rosso: inclusa in ogni soggiorno, con dolci fatti in casa e, quando il tempo lo permette, in giardino.",
    desc="Ogni giornata al Melo comincia così: la colazione è sempre inclusa, con dolci fatti in casa e, quando il tempo lo permette, la tavola apparecchiata in giardino.",
    card=("assets/img/nuove/img-7842.jpg", "in giardino"),
    chips=["inclusa nel soggiorno", "dolci fatti in casa", "in giardino"],
    cta=("Prenota il tuo soggiorno", TEL),
    sib_title="Dolce risveglio",
    sibs=[
      dict(img="assets/img/nuove/img-7609-1.jpg", label="Torte", h="Le torte", p="Fatte in casa nella nostra cucina."),
      dict(img="assets/img/nuove/13175261.jpg", label="Crostate", h="Le crostate", p="Con la frutta fresca."),
    ],
    powers=[
      ("cup", "Inclusa", "In ogni camera e in ogni depandance, tutti i giorni."),
      ("cake", "Fatta in casa", "Torte e dolci preparati nella nostra cucina."),
      ("clock", "Con calma", "Nessuna fretta: in vacanza il tempo è tuo."),
    ],
    power_note="",
    quote="La mattina in cui la torta era ancora tiepida.",
    quote_img="assets/img/nuove/img-7609-1.jpg",
    gallery=["assets/img/nuove/img-7842.jpg", "assets/img/nuove/img-7609-1.jpg", "assets/img/nuove/13175261.jpg", "assets/img/site/508g.jpg", "assets/img/nuove/img-7843.jpg", "assets/img/nuove/img-7608.jpg", "assets/img/nuove/img-7838.jpg"],
    next="fortunago"),

  dict(key="fortunago", file="fortunago.html",
    title=("Benvenuti a", "Fortunago"), pill="Il territorio", hand="uno dei borghi più belli d'Italia",
    meta="Fortunago, sulle colline dell'Oltrepò Pavese, è uno dei Borghi più belli d'Italia. Qui si trova l'Agriturismo il Melo Rosso.",
    desc="Fortunago è un piccolo borgo sulle colline dell'Oltrepò Pavese, tra i Borghi più belli d'Italia. Una terra di confine a sud della Lombardia, oltre il fiume Po, tra vigne, boschi e sentieri.",
    card=("assets/img/nuove/img-7607-1.jpg", "le colline"),
    chips=["Oltrepò Pavese", "provincia di Pavia", "sentieri", "vini"],
    cta=("Come arrivare", MAPS),
    sib_title="Da vedere qui intorno",
    sibs=[
      dict(img="assets/img/nuove/img-7607-1.jpg", label="Colline", h="Le colline", p="Vigne e prati a perdita d'occhio."),
      dict(img="assets/img/nuove/t30-2973555-1.jpg", label="Boschi", h="I boschi", p="Percorsi naturalistici da fare a piedi o in bici."),
    ],
    powers=[
      ("castle", "Il borgo", "Tra i Borghi più belli d'Italia: il Melo è proprio qui, a Fortunago."),
      ("path", "I sentieri", "Luoghi e percorsi naturalistici, itinerari artistici e attività all'aria aperta."),
      ("wine", "I vini", "Siamo nell'Oltrepò Pavese, terra di vigne e di cantine."),
    ],
    power_note="Via Ca' De' Vecchi, 1 · 27040 Fortunago (PV)",
    quote="Il giorno in cui hai lasciato la macchina e non l'hai più cercata.",
    quote_img="assets/img/nuove/t30-2973555-1.jpg",
    gallery=["assets/img/nuove/img-7607-1.jpg", "assets/img/nuove/t30-2973555-1.jpg", "assets/img/nuove/meloview16.jpg", "assets/img/nuove/copertina.jpg", "assets/img/nuove/img-8497.jpg", "assets/img/nuove/13660935-2.jpg"],
    next="cucina"),
]
BY = {p["key"]: p for p in PAGES}

# --------------------------------------------------------------------------
# PARTI CONDIVISE
# --------------------------------------------------------------------------
MENU = [
    ("index.html", "Home", "assets/img/stk/img-7608.jpg"),
    ("cucina.html", "La cucina", "assets/img/stk/13175261.jpg"),
    ("camere.html", "Le camere", "assets/img/stk/luna-1.jpg"),
    ("matrimoni.html", "Matrimoni", "assets/img/stk/13660935-2.jpg"),
    ("piscina.html", "Piscina", "assets/img/stk/img-7606.jpg"),
    ("colazione.html", "Colazione", "assets/img/stk/img-7842.jpg"),
    ("fortunago.html", "Fortunago", "assets/img/stk/img-7607-1.jpg"),
    ("#contatti", "Contatti", "assets/img/stk/img-7609-1.jpg"),
]

def shared_top():
    items = "\n".join(f'    <li><a href="{h}" data-hop><img src="{i}" alt=""><span>{E(t)}</span></a></li>' for h, t, i in MENU)
    return f'''<!-- ============ HEADER ============ -->
<header class="hdr">
  <p class="hdr__claim">Una cascina rossa<br>sulle colline dell'Oltrepò</p>
  <a class="hdr__logo" href="index.html" aria-label="Il Melo Rosso, torna alla home"><img src="assets/img/logo.svg" alt="Il Melo Rosso" width="64" height="64"></a>
  <button class="tag" aria-expanded="false" aria-controls="menu" aria-label="Apri il menu">
    <span class="tag__string"></span>
    <span class="tag__paper"><span class="tag__txt">Tirami</span></span>
  </button>
</header>

<!-- ============ PULL-DOWN MENU ============ -->
<nav class="menu" id="menu" aria-hidden="true">
  <ul class="menu__list">
{items}
  </ul>
  <div class="menu__foot">
    <a href="{TEL}">335 176 2614</a>
    <a href="{MAIL}">agriturismo@ilmelorosso.it</a>
    <span>Via Ca' De' Vecchi 1 · Fortunago (PV)</span>
  </div>
  <p class="menu__hand">tirami su per chiudere ↑</p>
</nav>'''

def shared_foot():
    return f'''<!-- ============ FOOTER · PHYSICS ============ -->
<footer class="foot" id="contatti">
  <div class="foot__curve" aria-hidden="true"></div>
  <nav class="foot__nav" aria-label="Footer">
    <a href="cucina.html" data-hop>La cucina</a>
    <a href="camere.html" data-hop>Le camere</a>
    <a href="matrimoni.html" data-hop>Matrimoni</a>
    <a href="fortunago.html" data-hop>Fortunago</a>
    <a href="{E(MAPS)}" target="_blank" rel="noopener" data-hop>Dove siamo</a>
  </nav>
  <div class="foot__brand">
    <img src="assets/img/logo.svg" alt="" width="90" height="90">
    <p class="foot__big"><span>Ti aspettiamo</span><span>al Melo!</span></p>
  </div>
  <div class="foot__world" aria-label="Gioca: trascina gli adesivi">
    <div class="foot__bodies"></div>
  </div>
  <div class="foot__info">
    <p>Agriturismo il Melo Rosso di Spina Paolo Alberto Maurizio · Via Ca' De' Vecchi, 1 · 27040 Fortunago (PV) · P.IVA 02291450183</p>
    <p><a href="tel:+390383875481">0383 875481</a> · <a href="{TEL}">335 176 2614</a> · <a href="{MAIL}">agriturismo@ilmelorosso.it</a></p>
    <p>© <span class="js-year">2026</span> Il Melo Rosso</p>
  </div>
</footer>'''

def shared_scripts(page_js):
    return f'''<script src="assets/vendor/gsap.min.js"></script>
<script src="assets/vendor/ScrollTrigger.min.js"></script>
<script src="assets/vendor/lenis.min.js"></script>
<script src="assets/vendor/matter.min.js"></script>
<script src="js/core.js"></script>
<script src="js/{page_js}"></script>'''

ARCS = '''<div class="arcs" aria-hidden="true">
  <span style="--a:#F59DB0"></span><span style="--a:#F58A1F"></span><span style="--a:#F5CF33"></span><span style="--a:#8E80F0"></span><span style="--a:#3A0A0C"></span>
</div>'''

# --------------------------------------------------------------------------
# PAGINA
# --------------------------------------------------------------------------
def page(p):
    c = COL[p["key"]]
    n = BY[p["next"]]
    nc = COL[n["key"]]
    t1, t2 = p["title"]
    chips = "".join(f"<li>{E(x)}</li>" for x in p["chips"])
    sibs = "\n".join(
        f'''      <article class="ps__card" style="--r:{(-1) ** i * (3 + i % 3)}deg">
        <div class="ps__stk" data-sib="{E(json.dumps(dict(img=s["img"], label=s["label"])))}"></div>
        <h3>{E(s["h"])}</h3>
        <p>{E(s["p"])}</p>
      </article>''' for i, s in enumerate(p["sibs"]))
    powers = "\n".join(
        f'''        <article class="pw__card">
          {svg_icon(ic)}
          <h3 class="pw__h" data-text="{E(h)}">{E(h)}</h3>
          <p>{E(tx)}</p>
        </article>''' for ic, h, tx in p["powers"])
    gallery = "\n".join(f'      <figure><img src="{g}" alt="" loading="lazy"></figure>' for g in p["gallery"])
    note = f'<p class="pw__note">{E(p["power_note"])}</p>' if p["power_note"] else ""
    cta_t, cta_h = p["cta"]
    ext = ' target="_blank" rel="noopener"' if cta_h.startswith("http") else ""
    sib_cls = " ps__row--many" if len(p["sibs"]) > 3 else ""
    return f'''<!doctype html>
<html lang="it" style="--bg:{c["bg"]};--ink:{c["ink"]};--hill:{c["hill"]};--title:{c["title"]};--nbg:{nc["bg"]};--nink:{nc["ink"]};--ntitle:{nc["title"]}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- arrivo da un cambio pagina: la pagina nasce già coperta dagli archi colorati,
       così la transizione continua senza stacchi di colore -->
  <script>try{{if(sessionStorage.getItem("meloArc")){{sessionStorage.removeItem("meloArc");var d=document.documentElement;d.classList.add("is-arriving");d.style.setProperty("--arcY",(-innerHeight*1.45)+"px")}}}}catch(e){{}}</script>
  <title>{E(t1 + " " + t2)} — Il Melo Rosso · Agriturismo a Fortunago</title>
  <meta name="description" content="{E(p["meta"])}">
  <meta name="theme-color" content="{c["bg"]}">
  <meta property="og:title" content="{E(t1 + " " + t2)} — Il Melo Rosso">
  <meta property="og:description" content="{E(p["meta"])}">
  <meta property="og:image" content="{p["card"][0]}">
  <link rel="icon" type="image/png" href="assets/img/site/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter+Tight:wght@400;500;600;700;800&family=Nothing+You+Could+Do&display=swap">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/page.css">
</head>
<body class="is-loading is-page" data-page="{p["key"]}">

<div class="loader loader--page" aria-hidden="true"></div>
{ARCS}

{shared_top()}

<main>
  <!-- ============ HERO ============ -->
  <section class="ph">
    <span class="pillbox pillbox--ink ph__pill">{E(p["pill"])}</span>
    <h1 class="ph__title" style="--len:{max(len(t2), 5)}"><span class="ph__l1 js-hop-in">{E(t1)}</span><span class="ph__l2 js-hop-in">{E(t2)}</span></h1>
    <div class="ph__stk" data-player="{p["key"]}"></div>
    <p class="hand ph__hand">{E(p["hand"])}</p>
    <div class="ph__hill" aria-hidden="true"></div>
  </section>

  <!-- ============ DESCRIZIONE ============ -->
  <section class="pd">
    <div class="pd__left">
      <figure class="pd__card"><i class="tape tape--top"></i><img src="{p["card"][0]}" alt="{E(p["card"][1])}"><figcaption class="hand">{E(p["card"][1])}</figcaption></figure>
      <div class="pd__land" aria-hidden="true"></div>
    </div>
    <div class="pd__right">
      <p class="pd__txt js-ink">{E(p["desc"])}</p>
      <ul class="pd__chips">{chips}</ul>
      <a class="pill pill--ink" href="{E(cta_h)}"{ext} data-hop>{E(cta_t)}</a>
      <svg class="pd__scribble" viewBox="0 0 300 120" aria-hidden="true"><path d="M8,96 C60,20 170,10 280,64"/><path d="M262,46 L282,66 L256,74"/></svg>
    </div>
  </section>

  <!-- ============ VARIANTI ============ -->
  <section class="ps">
    <span class="pillbox pillbox--ink">La famiglia</span>
    <h2 class="ps__title js-hop-in">{E(p["sib_title"])}</h2>
    <div class="ps__row{sib_cls}">
{sibs}
    </div>
  </section>

  <!-- ============ SUPERPOTERI ============ -->
  <section class="pw" aria-label="Superpoteri">
    <div class="pw__pin">
      <span class="pw__side pw__side--l" aria-hidden="true">Super</span>
      <div class="pw__stack">
        <div class="pw__track">
{powers}
        </div>
      </div>
      <span class="pw__side pw__side--r" aria-hidden="true">poteri</span>
      {note}
    </div>
  </section>

  <!-- ============ FRASE + GALLERIA ============ -->
  <section class="pq">
    <div class="pq__row">
      <figure class="pq__img"><img src="{p["quote_img"]}" alt=""></figure>
      <div class="pq__txt">
        <h2 class="js-hop-in">{E(p["quote"])}</h2>
        <div class="pq__stk" data-player="{p["key"]}"></div>
      </div>
      <i class="tape pq__tape pq__tape--a" aria-hidden="true"></i>
      <i class="tape pq__tape pq__tape--b" aria-hidden="true"></i>
    </div>
    <div class="pq__strip">
{gallery}
    </div>
  </section>

  <!-- ============ PROSSIMA TAPPA ============ -->
  <section class="pn">
    <a class="pn__link" href="{n["file"]}">
      <span class="pillbox pn__pill">Prossima tappa</span>
      <span class="pn__title">{E(n["title"][1])}</span>
      <span class="pn__stk" data-player="{n["key"]}"></span>
    </a>
  </section>
</main>

{shared_foot()}

<div class="lightbox" aria-hidden="true"><img alt=""><button class="lightbox__x">Chiudi</button></div>

{shared_scripts("page.js")}
</body>
</html>
'''

def replace_block(text, name, content):
    pat = re.compile(rf"(<!-- SHARED:{name} -->\n).*?(\n<!-- /SHARED:{name} -->)", re.S)
    assert pat.search(text), name
    return pat.sub(lambda m: m.group(1) + content + m.group(2), text)

def main():
    for p in PAGES:
        (ROOT / p["file"]).write_text(page(p), encoding="utf-8")
        print("scritta", p["file"])
    idx = ROOT / "index.html"
    s = idx.read_text(encoding="utf-8")
    s = replace_block(s, "TOP", shared_top())
    s = replace_block(s, "FOOT", shared_foot())
    s = replace_block(s, "SCRIPTS", shared_scripts("main.js"))
    idx.write_text(s, encoding="utf-8")
    print("aggiornata index.html")

if __name__ == "__main__":
    main()
