# StudyOS

StudyOS ist ein leichtes, deutschsprachiges Lern-Cockpit für Laptop und Browser. Es enthält einen Fokus-/Pausentimer, eine nach Fach und Datum organisierte Aufgabenliste, Schnellnotizen sowie einen kleinen Lernfortschritt.

## Daten und Internet

Aufgaben, Notizen, Timerzustand und Lernserie werden mit `localStorage` in diesem Browser gespeichert. Der App-Shell wird nach dem ersten erfolgreichen Laden zusätzlich per Service Worker gecacht. Die Online-Lernsuche fragt die deutschsprachige Wikipedia-API ab und zeigt kurze Zusammenfassungen mit direkten Quellenlinks. Die Suche benötigt eine Internetverbindung; die lokalen Bereiche sollen auch offline nutzbar bleiben.

## Lokal ausprobieren

Im Projektordner lässt sich die statische App zum Beispiel mit `python3 -m http.server 3000 --bind 0.0.0.0` starten und unter `http://localhost:3000` öffnen. In der StudyOS-Preview wird der Prozess von der Webdev-Laufzeit verwaltet.
