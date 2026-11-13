"""Générateur de la maquette David Perraud Auto. Usage : python build.py <dossier-du-projet>
Pas de site actuel. Contenus relevés en novembre 2026 : fiche Google (horaires, 62 avis, note 4,8),
PagesJaunes (avis datés), annuaire des entreprises (adresse). Visuels : photos de l'enseigne (fiche Google).
Prestations détaillées : à confirmer avec le garage."""
import os
import sys
OUT = sys.argv[1] if len(sys.argv) > 1 else "."
A = 'assets/'
PH = A + 'ph/'
V = 3  # cache : incrémenter à chaque changement de CSS ou JS
TEL, TELH = '04 74 21 17 57', 'tel:0474211757'
ADR = ('275 rue des Frères Lumière', '01400 Châtillon-sur-Chalaronne')
MAPS = 'https://www.google.com/maps/search/?api=1&query=David+Perraud+Auto+275+rue+des+Fr%C3%A8res+Lumi%C3%A8re+Ch%C3%A2tillon-sur-Chalaronne'

NAV = [('index.html#garage', 'Le garage'), ('avis.html', 'Avis clients')]

TACHO = '''<span class="rpm" aria-hidden="true"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" class="rb"/>
<path class="ra" d="M12.7 44.6A21 21 0 1 1 47.3 44.6"/><path class="rr" d="M49.6 21.4A21 21 0 0 1 47.3 44.6"/>
<g class="tk">''' + ''.join(f'<line x1="30" y1="11" x2="30" y2="{14 if i % 2 else 16}" transform="rotate({-130 + i * 32.5} 30 30)"/>' for i in range(9)) + '''</g>
<text x="30" y="46" text-anchor="middle">×1000</text>
<g class="nd"><path d="M30 31.6 L28.9 30 L30 12 L31.1 30z"/><circle cx="30" cy="30" r="3"/></g></svg></span>'''


def pill(t, href, cls='', arrow='↗'):
    return f'<a class="pill {cls}" href="{href}"><span class="r"><span>{t}</span><span>{t}</span></span><b>{arrow}</b></a>'


def tile(src, cls='', style='', alt='', par=None, lazy=True):
    p = f' data-par="{par}" style="height:118%;width:100%"' if par else ''
    return f'<figure class="tile {cls}" style="{style}"><img src="{src}" alt="{alt}"{p}{" loading=lazy" if lazy else ""}></figure>'


def logo(cls=''):
    return f'<span class="lgo {cls}" aria-hidden="true"><span><span class="wm">David Perraud <b>Auto</b></span><small>Service rapide</small></span></span>'


def head(title, desc, cur):
    def a(h, t, cls=''):
        return f'<a href="{h}"{" class="+cls if cls else ""}{" aria-current=page" if h == cur else ""}>{t}</a>'
    items = a('index.html', 'Accueil') + ''.join(a(h, t) for h, t in NAV) + a('rendez-vous.html', 'Rendez-vous', 'hl')
    return f'''<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{desc}">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:type" content="website">
<meta name="theme-color" content="#0b1220">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230b1220'/%3E%3Ctext x='16' y='22' font-family='Arial' font-weight='700' font-size='14' fill='%2339a6ea' text-anchor='middle'%3EDP%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{A}style.css?v={V}">
</head><body>
<div id="bar"></div>
<header class="top">
<a class="logo" href="index.html" aria-label="David Perraud Auto, accueil">{logo()}</a>
<nav class="nav" aria-label="Navigation principale">{items}</nav>
<span class="side">{TACHO}<a class="tel" href="{TELH}" aria-label="Appeler le {TEL}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="currentColor"/></svg><span>{TEL}</span></a></span>
<button class="burger" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
</header>
<main>'''


def foot():
    return f'''</main>
<footer><div class="wrap"><div class="fg">
<div>{logo('big')}<p>Garage automobile à Châtillon-sur-Chalaronne, dans l’Ain. Entretien, réparation et diagnostic, avec des explications claires et sans pousser à la dépense.</p></div>
<div><h4 class="micro">Le garage</h4><ul><li><a href="index.html#garage">Prestations</a></li><li><a href="index.html#horaires">Horaires</a></li><li><a href="avis.html">Avis clients</a></li></ul></div>
<div><h4 class="micro">Contact</h4><ul><li><a href="{TELH}">{TEL}</a></li><li><a href="rendez-vous.html">Prendre rendez-vous</a></li><li><a href="{MAPS}" target="_blank" rel="noopener">Itinéraire</a></li></ul></div>
<div><h4 class="micro">Adresse</h4><ul><li>{ADR[0]}</li><li>{ADR[1]}</li><li>Du lundi au vendredi</li></ul></div>
</div></div>
<div class="fw" aria-hidden="true">PERRAUD</div>
<div class="fb micro"><span class="pad">© David Perraud Auto</span><span class="pad">Maquette de site · Le Génie Numérique</span></div></footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="{A}main.js?v={V}"></script></body></html>'''


def cta(t='Un voyant <em>allumé ?</em>'):
    return f'''<section class="sec cta"><div class="wrap"><span class="micro mute" style="display:block;margin-bottom:1.6rem">Service rapide · Châtillon-sur-Chalaronne</span><h2 class="sp">{t}</h2>
<div class="row rv">{pill('Prendre rendez-vous', 'rendez-vous.html', 'blue')}{pill(TEL, TELH, 'ghost')}</div></div></section>'''


def pagehead(crumb, h1, lead, img, img2=None, extra=''):
    t2 = tile(img2, 'small', lazy=False) if img2 else ''
    return f'''<section class="ph"><div class="wrap"><div class="crumb micro"><a href="index.html">Accueil</a> / {crumb}</div><h1 class="sp">{h1}</h1><p class="lead rv">{lead}</p>{extra}</div>{tile(img, lazy=False)}{t2}</section>'''


# avis publiés (Google et PagesJaunes), extraits fidèles, novembre 2026
AVIS = [('Kris C.', 'Google', '2026', 'Si vous cherchez un garage pour entretenir votre véhicule et ce de façon honnête, sans pousser à la consommation, qui vous propose des solutions adaptées à vos besoins ! Il n’y a pas de doute c’est chez Mr Perraud David qu’il faut aller.'),
        ('Sylvia', 'Google', '2025', 'Cliente depuis de nombreuses années je recommande vivement ce garage, mécanicien très professionnel, disponible, sympathique. Et surtout, personne honnête en qui on peut avoir confiance les yeux fermés !'),
        ('Vincent', 'Google', '2025', 'Un des meilleurs garage que je connaisse, toujours bien accueilli parle très bien avec ses clients, très bosseur très connaisseur. Un bon garagiste honnête quoi !'),
        ('Eric M.', 'PagesJaunes', '06/02/2024', 'M. Perraud est un professionnel compétent qui dit ce qu’il fait et fait ce qu’il dit. M. Perraud ne force pas à la dépense et est très arrangeant. Je ne peux que recommander ce petit garage à l’esprit familial.'),
        ('Adel', 'Google', '2023', 'Mécanicien très professionnel, qui, malgré tout le travail à abattre, fait le maximum pour être disponible, à l’écoute et proche des clients.'),
        ('Christophe', 'Google', '2022', 'Accueil toujours chaleureux, diagnostic précis, très bonne compréhension du client, service rapide propre et soigné ! Je ne peux que recommander !')]


def avis_cards(items):
    return '<div class="rcs">' + ''.join(f'<blockquote class="rc rv"><span class="micro mute">{s} · {d}</span><p>« {t} »</p><footer><b>{n}</b><span>Avis {s}</span><i>5/5</i></footer></blockquote>' for n, s, d, t in items) + '</div>'


def pages():
    P = {}
    hero_tiles = [('t1', 'panneau'), ('t4', 'voiture'), ('t5', 'enseigne-2')]
    ht = ''.join(f'<figure class="tile {c}"><div class="fl"><div class="in"><img src="{PH}{f}.webp" alt=""></div></div></figure>' for c, f in hero_tiles)
    stack = ''.join(tile(f'{PH}{f}.webp') for f in ['parking', 'enseigne-2', 'voiture', 'panneau'])
    items = [('rendez-vous.html', '01', 'Entretien', 'Le suivi de votre véhicule, sans pousser à la consommation.', 'enseigne-2'),
             ('rendez-vous.html', '02', 'Réparation', 'Des solutions adaptées à vos besoins, et à votre budget.', 'voiture'),
             ('rendez-vous.html', '03', 'Diagnostic', 'Rapide et précis, avec le temps de vous expliquer.', 'panneau')]
    pl = ''.join(f'<a href="{h}"><span class="micro mute">{n}</span><span class="nm">{t}</span><span class="d">{d}</span></a>' for h, n, t, d, _ in items)
    prev = ''.join(tile(f'{PH}{it[4]}.webp', 'on' if i == 0 else '') for i, it in enumerate(items))
    steps = [('Honnête', '« Sans pousser à la consommation. » Le mot qui revient dans les avis.'),
             ('Précis', '« Diagnostic rapide et précis. » On cherche la vraie cause.'),
             ('Clair', '« Prend le temps d’expliquer au client. » Vous savez ce qui est fait.'),
             ('Raisonnable', '« Des tarifs plus que raisonnables. » Pas de mauvaise surprise.')]
    st = ''.join(f'<div class="stp"><div class="n">{i + 1}</div><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(steps))
    mq = ''.join(f'<span>{x}</span>' for x in ['Entretien', 'Réparation', 'Diagnostic', 'Service rapide', 'Châtillon', 'Conseil'] * 2)

    P['index.html'] = head('David Perraud Auto — Garage automobile à Châtillon-sur-Chalaronne (Ain)', 'David Perraud Auto, garage automobile à Châtillon-sur-Chalaronne : entretien, réparation, diagnostic. Service rapide, 4,8/5 sur 62 avis Google.', 'index.html') + f'''
<section class="hero">
<div class="cap micro c1"><b>Service rapide</b>c’est écrit sur l’enseigne</div>
<div class="cap micro c2"><b>4,8 / 5</b>62 avis Google</div>
<div class="cap micro c3"><b>Châtillon</b>rue des Frères Lumière</div>
<div class="go">{pill('Prendre rendez-vous', 'rendez-vous.html')}</div>
{ht}
<p class="para">Le garage honnête de Châtillon-sur-Chalaronne. Ce sont ses clients qui le disent.</p>
<h1 class="word">PERRAUD</h1>
<div class="scrollhint micro"><i></i>Défiler</div>
</section>

<div class="mq" aria-hidden="true"><div>{mq}</div></div>

<section class="sec" id="garage"><div class="wrap fin"><div><span class="micro mute" style="display:block;margin-bottom:1.4rem">Châtillon-sur-Chalaronne, dans l’Ain</span><h2 class="sp">Un vrai garagiste, <em>tout simplement</em></h2>
<p class="lead rv" style="margin:1.4rem 0 2rem">David Perraud vous accueille dans son garage de la rue des Frères Lumière. Entretien, réparation, diagnostic : il trouve la solution adaptée à votre voiture, et prend le temps de vous l’expliquer.</p>
<ul class="checks rv" style="margin-bottom:2rem"><li><span><b>Un seul interlocuteur</b> : le mécanicien qui répare votre voiture.</span></li><li><span><b>Pas de dépense inutile</b>, des solutions adaptées.</span></li><li><span><b>Un service rapide</b>, promis sur l’enseigne.</span></li></ul>{pill('Prendre rendez-vous', 'rendez-vous.html', 'blue')}</div>{tile(PH + 'enseigne.webp', '', par=8, alt='L’enseigne David Perraud Auto')}</div></section>

<section class="story"><span class="micro mute m3">Le garage</span>
<h2><span class="w">Votre</span> <span class="w">voiture</span> <span class="w">entre</span> <span class="w"><em>de</em></span> <span class="w"><em>bonnes</em></span> <span class="w"><em>mains</em></span></h2>
<div class="stack">{stack}</div>
<p class="micro mute m1">275 rue des Frères Lumière, Châtillon-sur-Chalaronne.</p><span class="micro mute m2">Du lundi au vendredi</span></section>

<section class="sec" id="services"><div class="wrap"><span class="micro mute" style="display:block;margin-bottom:1.4rem">Prestations</span><h2 class="sp" style="margin-bottom:clamp(2rem,5vw,4rem)">De quoi a besoin <em>votre voiture ?</em></h2>
<div class="plist">{pl}</div><p class="note">Liste détaillée des prestations et des marques à confirmer avec le garage.</p></div><div class="prev">{prev}</div></section>

<section class="sec"><div class="wrap"><span class="micro mute" style="display:block;margin-bottom:1.4rem">Avis Google</span><h2 class="sp">Ils en <em>parlent</em></h2>
<div class="cnt rv"><div><b data-to="4.8">0</b><span>sur 5, note moyenne sur Google</span></div><div><b data-to="62">0</b><span>avis publiés sur Google</span></div><div><b data-to="56">0</b><span>avis à 5 étoiles</span></div></div>
<div style="margin-top:clamp(2rem,4vw,3rem)">{avis_cards(AVIS[:3])}</div><div class="row rv" style="margin-top:2rem">{pill('Tous les avis', 'avis.html')}</div></div></section>

<section class="sec" style="padding-top:0"><div class="wrap"><span class="micro mute" style="display:block;margin-bottom:1.4rem">Ce que disent les clients</span><h2 class="sp">Quatre mots <em>qui reviennent</em></h2><div class="steps">{st}</div></div></section>

<section class="sec" id="horaires" style="padding-top:0"><div class="wrap split"><div><span class="micro mute" style="display:block;margin-bottom:1.2rem">Horaires et accès</span><h2 class="sp">On est <em>ouvert ?</em></h2>
<p class="lead rv" style="margin-top:1.4rem">{ADR[0]}<br>{ADR[1]}</p><div class="row rv" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:2rem">{pill('Itinéraire', MAPS)}{pill(TEL, TELH, 'ghost')}</div></div>
<div class="agl rv"><div class="row act" data-ag="perraud"><h3>Le garage</h3><span class="open"><i></i>…</span><ul class="hours"></ul></div><p class="note">Horaires affichés sur Google, à confirmer avec le garage.</p></div></div></section>
{cta()}''' + foot()

    P['avis.html'] = head('Avis clients — David Perraud Auto, Châtillon-sur-Chalaronne', 'Avis clients du garage David Perraud Auto à Châtillon-sur-Chalaronne : 4,8/5 sur 62 avis Google.', 'avis.html') + pagehead('Avis clients', 'Ils en <em>parlent</em>', '62 avis sur Google, note moyenne 4,8 sur 5. Quelques extraits, reproduits tels quels.', PH + 'panneau.webp') + f'''
<section class="sec"><div class="wrap">{avis_cards(AVIS)}<p class="note" style="margin-top:2rem">Extraits d’avis publiés sur Google et PagesJaunes, avec le prénom affiché par leur auteur.</p></div></section>''' + cta() + foot()

    cr = ''.join(f'<button type="button"{" class=on" if i == 0 else ""}>{h}</button>' for i, h in enumerate(['8 h 00', '9 h 00', '10 h 00', '11 h 00', '14 h 00', '15 h 00', '16 h 00', '17 h 00']))
    P['rendez-vous.html'] = head('Prendre rendez-vous — David Perraud Auto', f'Prenez rendez-vous chez David Perraud Auto, {ADR[0]}, {ADR[1]} : entretien, réparation, diagnostic. {TEL}.', 'rendez-vous.html') + pagehead('Rendez-vous', 'Votre créneau, <em>en ligne</em>', 'Choisissez la prestation, le jour et l’heure. Le garage vous rappelle pour confirmer.', PH + 'enseigne-2.webp') + f'''
<section class="sec" id="rdv"><div class="wrap split"><div><span class="micro mute" style="display:block;margin-bottom:1.2rem">Coordonnées</span><h2 class="sp">Ou <em>un appel</em></h2>
<div class="contactline rv" style="margin-top:2rem"><a href="{TELH}">{TEL}</a></div>
<p class="lead rv" style="margin-top:1.6rem">{ADR[0]}<br>{ADR[1]}</p>
<div class="hor rv"><span><b>Du lundi au vendredi</b> · 8 h – 12 h et 13 h 45 – 18 h 30</span><span class="micro">Horaires Google, à confirmer avec le garage</span></div></div>
<form class="f calc rv" id="resa"><div class="fld"><label for="pr">Prestation</label><select id="pr"><option>Entretien</option><option>Réparation</option><option>Diagnostic</option><option>Autre demande</option></select></div>
<div class="r2"><div class="fld"><label for="rd">Jour</label><input id="rd" type="date" required></div><div class="fld"><label for="im">Véhicule</label><input id="im" placeholder="Marque, modèle"></div></div>
<div class="fld"><label>Créneau</label><div class="cov cr">{cr}</div></div>
<div class="r2"><div class="fld"><label for="rn">Nom</label><input id="rn" required></div><div class="fld"><label for="rt">Téléphone</label><input id="rt" type="tel" required></div></div>
<button class="pill blue" type="submit" style="justify-self:start"><span class="r"><span>Réserver</span><span>Réserver</span></span><b>↗</b></button><div class="ok">Merci ! (Maquette : aucun rendez-vous n’est envoyé.)</div></form></div></section>''' + foot()
    return P


for k, v in pages().items():
    open(os.path.join(OUT, k), 'w', encoding='utf-8').write(v)
print('ok')
