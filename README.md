# StudyOS

StudyOS ist ein leichtes, deutschsprachiges Lern-Cockpit für Laptop und Browser. Es enthält einen Fokus-/Pausentimer, eine nach Fach und Datum organisierte Aufgabenliste, Schnellnotizen sowie einen kleinen Lernfortschritt.

## Daten und Internet

Aufgaben, Notizen, Timerzustand und Lernserie werden mit `localStorage` in diesem Browser gespeichert. Der App-Shell wird nach dem ersten erfolgreichen Laden zusätzlich per Service Worker gecacht. Die Online-Lernsuche fragt die deutschsprachige Wikipedia-API ab und zeigt kurze Zusammenfassungen mit direkten Quellenlinks. Die Suche benötigt eine Internetverbindung; die lokalen Bereiche sollen auch offline nutzbar bleiben.

## Konto ohne E-Mail oder Passwort

StudyOS benötigt kein Online-Konto und sammelt keine Login-Daten. Öffne in der App den Bereich **Daten**, wähle **Sicherung herunterladen** und übertrage die erzeugte JSON-Datei auf den anderen Laptop. Dort wählst du **Sicherung importieren** und öffnest die Datei. Aufgaben, Notizen, Lernserie, Fokus-Sessions und Timerstand werden auf dem neuen Gerät wiederhergestellt.

Der Import ersetzt die auf dem Zielgerät gespeicherten StudyOS-Daten und fragt vorher nach einer Bestätigung. Die Sicherungsdatei ist nicht verschlüsselt; bewahre sie sicher auf und teile sie nur mit Personen, denen du vertraust. Es gibt keine automatische Cloud-Synchronisierung: Du entscheidest selbst, wann und wohin du die Datei kopierst.

## Als App installieren

StudyOS lässt sich nach der öffentlichen Veröffentlichung in Microsoft Edge oder Google Chrome als App installieren. Öffne die StudyOS-Webseite und wähle im Browsermenü **Apps → StudyOS installieren** beziehungsweise **Installieren** (die Bezeichnung kann je nach Browserversion leicht abweichen). In Edge findest du den Befehl meist im Menü **Apps**; in Chrome erscheint er im Menü oder als Installationssymbol in der Adressleiste.

Nach der Installation kannst du StudyOS im Windows-Startmenü suchen, rechtsklicken und **An Taskleiste anheften** wählen. Für den Desktop kannst du im selben Menü **Dateispeicherort öffnen** und die App-Verknüpfung auf den Desktop kopieren, oder im Installationsdialog **Verknüpfung erstellen** auswählen, falls angeboten.

## Aktualisierungen

Neue Änderungen werden erst für andere Besucher sichtbar, wenn eine neue Version veröffentlicht wird. Die automatische Veröffentlichung ist derzeit ausgeschaltet; veröffentliche einen gespeicherten Stand über **Publish**. Bereits installierte StudyOS-Apps laden die neue App-Shell spätestens nach einem Neuladen der Seite. Aufgaben und Notizen bleiben jeweils lokal auf dem eigenen Gerät gespeichert und werden nicht zwischen verschiedenen Besuchern synchronisiert.

## Lokal ausprobieren

Im Projektordner lässt sich die statische App zum Beispiel mit `python3 -m http.server 3000 --bind 0.0.0.0` starten und unter `http://localhost:3000` öffnen. In der StudyOS-Preview wird der Prozess von der Webdev-Laufzeit verwaltet.
