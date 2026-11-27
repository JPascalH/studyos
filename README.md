# StudyOS

StudyOS ist ein leichtes, zweisprachiges Lern-Cockpit für Laptop und Browser. Deutsch und English lassen sich im Profilmenü auswählen. Der Fokus-/Pausentimer, eine nach Fach und Datum organisierte Aufgabenliste, Schnellnotizen und Lernfortschritt funktionieren lokal; eine Begrüßung verwendet den eingetragenen Namen und passt sich der Tageszeit an.

## Daten, Profil und Internet

Aufgaben, Notizen, Timerzustand, Lernserie, Name und Sprache werden lokal im Browser gespeichert. StudyOS benötigt kein E-Mail-/Passwortkonto und synchronisiert keine Daten automatisch in eine Cloud. Die Online-Lernsuche nutzt je nach gewählter Sprache die deutsche oder englische Wikipedia. Der Verbindungsstatus zeigt an, ob der Browser online ist; Aufgaben und Notizen bleiben offline verfügbar.

## Daten auf einen anderen Laptop übertragen

Öffne in der App den Bereich **Daten**, wähle **Sicherung herunterladen** und übertrage die erzeugte JSON-Datei auf den anderen Laptop. Dort wählst du **Sicherung importieren** und öffnest die Datei. Aufgaben, Notizen, Lernserie, Fokus-Sessions, Timerstand, Name und Sprache werden auf dem neuen Gerät wiederhergestellt.

Der Import ersetzt die StudyOS-Daten auf dem Zielgerät und fragt vorher nach einer Bestätigung. Die Sicherungsdatei ist nicht verschlüsselt; bewahre sie sicher auf und teile sie nur mit Personen, denen du vertraust. Es gibt keine automatische Cloud-Synchronisierung: Du entscheidest selbst, wann und wohin du die Datei kopierst.

## Als Desktop-App installieren

StudyOS ist eine installierbare PWA. Öffne die veröffentlichte StudyOS-Webseite in Microsoft Edge oder Google Chrome und wähle **App installieren**. Wenn der Browser keinen direkten Installationsdialog anbietet, öffne sein Menü und wähle **StudyOS installieren** beziehungsweise **Installieren**. Danach kannst du StudyOS im Windows-Startmenü suchen und an die Taskleiste anheften.

Ein separater Windows-`.exe`-Installer wird derzeit **nicht** bereitgestellt. Die PWA-Installation fügt StudyOS als Desktop-App hinzu, ohne eine eigenständige EXE-Datei herunterzuladen.

## Updates

StudyOS prüft im Hintergrund auf eine neu bereitgestellte App-Version. Wenn ein Service-Worker-Update bereitsteht, erscheint **Update verfügbar**; anklicken installiert die neue App-Version und lädt sie neu. Offline werden die App-Shell und Symbole weiterverwendet.

Änderungen am GitHub-Quellcode werden erst für Besucher der Website sichtbar, wenn die Version auch veröffentlicht wird. Automatische Veröffentlichung ist ausgeschaltet; ein GitHub-Push veröffentlicht die Website nicht automatisch. Aufgaben und Notizen bleiben auf jedem Gerät lokal und werden nicht zwischen Besuchern synchronisiert.

## Lokal ausprobieren

Im Projektordner lässt sich die statische App zum Beispiel mit `python3 -m http.server 3000 --bind 0.0.0.0` starten und unter `http://localhost:3000` öffnen. In der StudyOS-Preview wird der Prozess von der Webdev-Laufzeit verwaltet.
