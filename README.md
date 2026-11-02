# Long Le – Fresha Landingpage

Statische Landingpage auf GitHub Pages (Domain in `CNAME`), zweisprachig:

- `/` Vietnamesisch (`index.html`)
- `/de/` Deutsch (`de/index.html`)

Beide nutzen `styles.css` und `app.js`. Links, WhatsApp, Kundenstimmen, Video und Nachrichtentexte stehen im `CONFIG`-Block in `app.js`.
Alle Dateien gehören ins Repository, auch `fonts/`, `img/` und `de/`.

## Sprache
Beim ersten Besuch auf `/` erscheint eine Auswahl mit Flaggen (Deutsch oder Tiếng Việt). Die Wahl wird nur im Browser gespeichert, beim nächsten Besuch erscheint die Auswahl nicht mehr. Der Sprachumschalter im Header ändert sie.

Keine Auswahl erscheint bei Links mit `?lang=vi` oder `?lang=de`, bei direktem Aufruf von `/de/` sowie für Suchmaschinen und Link-Vorschauen.

## Links für Posts
- Vietnamesisch: `https://longfresha.com/?lang=vi&src=26-45-MO`
- Deutsch: `https://longfresha.com/de/?src=26-45-MO`

`src` wandert ohne Cookies in die WhatsApp- bzw. Messenger-Nachricht und in den Terminlink.

## Rechner
Der Rechner steht ganz oben im Hero und startet mit der Provision (35 %). Mit `?calc=noshow` im Link öffnet er direkt die No-Shows, z. B. `https://longfresha.com/de/?calc=noshow&src=26-45-MO`.

Nach Änderungen an `styles.css` oder `app.js` die Versionsnummer `?v=` in beiden `index.html` erhöhen, damit Besucher nicht die alte Datei aus dem Zwischenspeicher sehen.
