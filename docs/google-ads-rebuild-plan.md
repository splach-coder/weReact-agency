# WeReact — Google Ads Rebuild Plan

Built after the first campaign spent ~3000 DH with **0 leads**. This is the
full "do it right" plan: kill the money-wasters, run a tight Search campaign,
and make every dirham measurable. Copy/paste-ready ad copy + keywords included.

Business facts used: Marrakech-based web design agency · EN + FR · phone
`+212 602-258009` · email `hello@wereact.agency` · landing pages `/en/contact`
and `/fr/contact`.

---

## 0. Why the first campaign failed (most likely)

You got **0 emails/WhatsApp/calls**. A tracking bug can hide conversions that
*happened* — it can't stop people from contacting you. So the money went to the
**wrong traffic**. The usual causes, in order of likelihood:

1. **Wrong campaign type.** Google's "smart"/default wizard often creates a
   **Performance Max or Display** campaign that spends on YouTube, Gmail, and
   random apps — huge reach, near-zero intent. (You weren't sure what type ran —
   that's the tell.)
2. **No/broad keywords + no negatives** → paid for "free website", "web design
   course", "how to build a website", job seekers, etc.
3. **Location set to "presence OR interest"** → clicks from outside Morocco.
4. **Broken conversion signal** → even if a lead came, Smart Bidding optimized
   toward nothing. (Fixed in code: `url_passthrough`; see §6.)

**To confirm exactly what happened, pull the Search Terms report** (see
`scripts/google-ads/README.md` → FAST PATH). It shows the literal searches you
paid for. Send it and negatives get tuned to your real waste.

---

## 1. Account structure

Delete/pause the old campaign. Build **one Search campaign** to start (add a
second only if EN vs FR copy diverges enough to warrant it).

```
Campaign: WeReact — Search — Morocco
├─ Ad group: Web Design Marrakech (EN)
├─ Ad group: Web Design Morocco (EN)
├─ Ad group: Landing Pages / Business Sites (EN)
├─ Ad group: Tourism & Riad Sites (EN)
├─ Ad group: Création Site Web Marrakech (FR)
└─ Ad group: Agence Web Maroc (FR)
```

## 2. Settings (this is where the last budget leaked — get these right)

| Setting | Value | Why |
|---|---|---|
| Campaign type | **Search only** | Highest intent for a service business |
| Networks | **Search only** — UNCHECK "Search Partners" **and** "Display Network" | Display = the #1 budget drain |
| Locations | Marrakech + Casablanca + Rabat + Agadir (or "Morocco") | Where your buyers are |
| Location options | **"Presence: people in your targeted locations"** (NOT "presence or interest") | Stops worldwide/tourist-intent clicks |
| Languages | English **and** French | Your audience |
| Bidding | **Maximize Clicks with a max CPC limit (~3–5 MAD)** to start | No conversion history yet — do NOT use tCPA/Max Conversions until ~15–30 conversions exist |
| Daily budget | **50–100 MAD/day** (set yours in §7) | Controlled test |
| Ad schedule | All week; consider 8:00–22:00 | Cut overnight waste if data shows it |
| Auto-applied recommendations | **OFF** | Google will re-add Display/broad match otherwise |
| "Optimized targeting" | **OFF** if shown | Ignores your keywords |

## 3. Keywords (start tight — exact/phrase only, no broad)

**Web Design Marrakech (EN)**
```
[website design marrakech]
[web design marrakech]
"website designer marrakech"
"web design agency marrakech"
[web agency marrakech]
```
**Web Design Morocco (EN)**
```
"website design morocco"
"web design morocco"
[website designer morocco]
"web agency morocco"
```
**Landing Pages / Business Sites (EN)**
```
"business website design"
"landing page design morocco"
"ecommerce website morocco"
"small business website morocco"
```
**Tourism & Riad Sites (EN)**
```
"tourism website design morocco"
"riad website design"
"hotel website design morocco"
```
**Création Site Web Marrakech (FR)**
```
[création site web marrakech]
"création site internet marrakech"
"agence web marrakech"
"créer un site web marrakech"
```
**Agence Web Maroc (FR)**
```
"création site web maroc"
"agence web maroc"
"site vitrine maroc"
"création site internet maroc"
```

## 4. Negative keywords (add at CAMPAIGN level, day one)

```
free            gratuit          gratuitement     template
templates       theme            themes           wordpress theme
course          cours            formation        tutorial
tutoriel        job              jobs             emploi
recrutement     recrutment       salary           salaire
internship      stage            download         télécharger
crack           cracked          nulled           how to
"comment créer" diy              wix              wix free
godaddy         hostinger        blogger          learn
apprendre       examples         exemples         école
university      étudiant         definition       "c'est quoi"
what is         freelance jobs   remote job       elementor
```
(Refine this from your real Search Terms report.)

## 5. Ad copy — Responsive Search Ads (paste-ready)

Google wants ~15 headlines + 4 descriptions per ad group. Trim per ad group.

### English RSA
**Headlines**
```
Website Design in Marrakech
Fast Websites That Get Leads
WeReact — Marrakech Web Agency
Custom Business Websites
Websites in English & French
Get a Free Project Quote
Reply Within One Business Day
SEO-Ready Landing Pages
Websites for Moroccan Brands
Tourism & Riad Websites
Modern, Mobile-First Sites
Launch in Weeks, Not Months
Convert Visitors Into Clients
Built to Bring You Clients
Book a Free Intro Call
```
**Descriptions**
```
Marrakech web studio building fast, SEO-ready sites that turn visitors into paying clients. Free quote.
Custom business websites, landing pages & tourism sites. EN & FR. We reply within one business day.
Stop losing leads to a slow site. Modern, mobile-first website built to convert. Talk to us today.
From riads to service businesses — websites designed for Morocco. Clear pricing, fast launch.
```

### French RSA
**Headlines (titres)**
```
Création de Site Web Marrakech
Sites Web Rapides et Efficaces
WeReact — Agence Web Marrakech
Sites Web Professionnels
Sites en Français et Anglais
Devis Gratuit de Projet
Réponse Sous 24 Heures
Pages de Destination SEO
Sites Web pour le Maroc
Sites Tourisme & Riads
Design Mobile et Moderne
Lancement en Quelques Semaines
Transformez Vos Visiteurs
Agence Web au Maroc
Réservez un Appel Gratuit
```
**Descriptions**
```
Studio web à Marrakech : sites rapides et optimisés SEO qui transforment vos visiteurs en clients. Devis gratuit.
Sites vitrines, pages de destination et sites tourisme. FR & EN. Réponse sous un jour ouvré.
Ne perdez plus de clients à cause d'un site lent. Site moderne et mobile conçu pour convertir. Contactez-nous.
Des riads aux entreprises de services : des sites pensés pour le Maroc. Prix clairs, lancement rapide.
```

### Assets / extensions (add all — they lift CTR for free)
- **Sitelinks:** Our Work (`/en/work`) · Services · Contact (`/en/contact`) · Blog (`/en/blog`)
- **Callouts:** Free Quote · Reply in 1 Business Day · English & French · Mobile-First · SEO-Ready
- **Structured snippet** (Services): Business Websites, Landing Pages, E-commerce, Tourism Sites, SEO
- **Call extension:** `+212 602-258009`
- **Location extension:** link the Google Business Profile
- **Lead form asset:** optional, but the on-site form now converts better (see §6)

### Landing page mapping
- EN ad groups → `https://www.wereact.agency/en/contact`
- FR ad groups → `https://www.wereact.agency/fr/contact`
- Append tracking: enable **auto-tagging** (`gclid`) in account settings.

## 6. Conversion tracking (already improved in code)

Done in the site code (deploy to activate):
- `url_passthrough` so the `gclid` survives cookie-denied visits.
- Contact form reduced to **Name + Email required** → more submissions.

Do in the Google Ads UI:
1. **Conversions → Summary:** ensure the "Contact form lead" action exists
   (tag `AW-18245192967`, label `C9w5CPvkkc4cEIea_vtD`), set it as the **Primary**
   goal. Counting: **One** (per lead).
2. **Enable Enhanced Conversions for Leads** (method: Google tag) — biggest
   accuracy win; recovers conversions consent mode loses. *(Ask Claude to wire
   the hashed email/phone into the conversion once this is toggled on.)*
3. Link **Google Analytics (GA4)** ↔ Google Ads; optionally import GA4
   `generate_lead`.
4. **Consent — DECIDED (Morocco-focused) & DONE in code:** consent now defaults
   to *granted* (the banner still lets visitors opt out), restoring near-full
   conversion measurement. Activates on deploy.

## 7. Budget & timing — DECIDED

- **Fresh spend: paused for now.** We launch on the **~$300 Google Ads credit**
  (the reward for the 3000 DH already spent), expected available **~18/07**.
- **How to spend the $300 (~3,000 MAD) credit:** ~**100 MAD/day for ~30 days**
  (or 50 MAD/day for ~60 days for a slower, cleaner read). One tight Search
  campaign only — do not let it spread.
- **Locations:** Marrakech + Casablanca/Rabat/Agadir, presence-only. Narrow to
  Marrakech-only if the credit burns too fast.
- **Primary goal:** contact-form leads (WhatsApp + calls as secondary).

### Prep runway (now → ~18/07, spending nothing)
- [ ] **Deploy the site** — activates the 3 code fixes (tracking, easier form, consent).
- [ ] **Pull the old campaign's Search Terms + type** and send to Claude (learn from the waste).
- [ ] **Build the new Search campaign as a DRAFT** (settings §2, keywords §3, negatives §4, ads §5) — don't enable until the credit is live.
- [ ] Confirm the Primary conversion + enable Enhanced Conversions (§6).
- [ ] Free wins meanwhile: Google Business Profile, on-page SEO, verify the site in Search Console.

## 8. Launch day (when the $300 credit is active, ~18/07)

- [ ] Confirm the credit shows in Billing → Promotions
- [ ] Enable the draft Search campaign with §2 settings
- [ ] Turn OFF auto-applied recommendations
- [ ] Set 100 MAD/day + presence-only location targeting
- [ ] Let it run 7 days untouched, then send Claude the Search Terms report to prune

## 9. Week-by-week

- **Week 1:** run untouched. Watch: clicks, CTR, avg CPC, search terms.
- **Week 2:** add negatives from real search terms; pause 0-click keywords;
  push budget to best ad group.
- **Weeks 3–4:** once ~15–30 conversions exist, switch bidding to **Maximize
  Conversions**, then a target CPA.
- **Later:** add Performance Max *only* after Search produces steady leads and
  conversion tracking is trusted — never as the starting point.
