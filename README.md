# StudyOS

StudyOS ist ein leichtes, zweisprachiges Lern-Cockpit für Laptop und Browser. Deutsch und Englisch lassen sich im Profilmenü auswählen. Der Fokus-/Pausentimer, eine nach Fach und Datum organisierte Aufgabenliste, Schnellnotizen und Lernfortschritt funktionieren lokal; eine Begrüßung verwendet den eingetragenen Namen und passt sich der Tageszeit an.

## Portable Windows-App herunterladen

Die aktuelle Windows-x64-Version gibt es auf der [GitHub-Release-Seite](https://github.com/JPascalH/studyos/releases/latest). Lade **StudyOS-Portable-1.0.0.exe** herunter und starte die Datei. Ein Installationsprogramm ist nicht nötig. StudyOS funktioniert offline; die Lernsuche und die Prüfung auf neue Versionen brauchen Internet.

Die EXE ist derzeit nicht mit einem kostenpflichtigen Windows-Code-Signaturzertifikat signiert. Windows kann deshalb eine Sicherheitswarnung anzeigen. Lade die Datei nur von der verlinkten offiziellen Release-Seite herunter. Eine SHA-256-Prüfsumme wird beim Release mitveröffentlicht.

In der portablen Version werden Aufgaben, Notizen und Profil normalerweise im Ordner **StudyOS-Daten** neben der EXE gespeichert. Zum Übertragen auf einen anderen Laptop kannst du diesen Ordner zusammen mit der EXE kopieren. Alternativ kannst du jederzeit im Bereich **Daten** eine JSON-Sicherung herunterladen und auf dem anderen Gerät importieren. Ist der Ablageort der EXE schreibgeschützt, verwendet StudyOS stattdessen den Windows-Benutzerordner.

## Daten, Profil und Internet

Aufgaben, Notizen, Timerzustand, Lernserie, Name und Sprache werden ausschließlich lokal auf dem Gerät gespeichert. StudyOS benötigt kein E-Mail-/Passwortkonto und synchronisiert keine Daten automatisch in eine Cloud. Die Online-Lernsuche nutzt je nach gewählter Sprache die deutsche oder englische Wikipedia. Der Verbindungsstatus zeigt an, ob der Computer online ist; Aufgaben und Notizen bleiben offline verfügbar.

Die Desktop-App fragt die öffentliche GitHub-Release-Seite nach einer neueren Versionsnummer ab. Bei einer neuen Version erscheint **Update verfügbar**. Ein Klick öffnet die Release-Seite im Browser; die neue EXE muss manuell heruntergeladen werden. Es wird nichts automatisch installiert. Beim Updatecheck werden keine Aufgaben, Notizen oder Profilwerte übertragen.

## Daten auf einen anderen Laptop übertragen

Öffne in StudyOS den Bereich **Daten**, wähle **Sicherung herunterladen** und übertrage die erzeugte JSON-Datei auf den anderen Laptop. Dort wählst du **Sicherung importieren** und öffnest die Datei. Aufgaben, Notizen, Lernserie, Fokus-Sessions, Timerstand, Name und Sprache werden auf dem neuen Gerät wiederhergestellt.

Der Import ersetzt die StudyOS-Daten auf dem Zielgerät und fragt vorher nach einer Bestätigung. Die Sicherungsdatei ist nicht verschlüsselt; bewahre sie sicher auf und teile sie nur mit Personen, denen du vertraust. Es gibt keine automatische Cloud-Synchronisierung: Du entscheidest selbst, wann und wohin du die Datei kopierst.

## Als Desktop-App im Browser installieren

StudyOS ist auch eine installierbare PWA. Öffne die StudyOS-Webseite in Microsoft Edge oder Google Chrome und wähle **App installieren**. Wenn der Browser keinen direkten Installationsdialog anbietet, öffne sein Menü und wähle **StudyOS installieren** beziehungsweise **Installieren**. Danach kannst du StudyOS im Windows-Startmenü suchen und an die Taskleiste anheften.

Die PWA prüft im Hintergrund auf eine neue Website-Version. Wenn ein Service-Worker-Update bereitsteht, erscheint **Update verfügbar**; anklicken installiert die neue PWA-Version und lädt sie neu. Offline werden App-Shell und Symbole weiterverwendet.

## Projekt und Veröffentlichung

Der Quellcode ist öffentlich unter [github.com/JPascalH/studyos](https://github.com/JPascalH/studyos) einsehbar. Neue portable Windows-Builds werden als GitHub-Releases veröffentlicht. Änderungen am GitHub-Code aktualisieren die öffentliche StudyOS-Webseite nicht automatisch; die automatische Website-Veröffentlichung bleibt ausgeschaltet.

## Lokal ausprobieren und bauen

Für die Web-App kann im Projektordner ein statischer Server gestartet werden, zum Beispiel mit `python3 -m http.server 3000 --bind 0.0.0.0`, und anschließend unter `http://localhost:3000` geöffnet werden. Die Webdev-Preview startet den Prozess selbst.

Für die Desktop-Entwicklung wird Node.js 22 oder neuer benötigt. Installiere die festgelegten npm-Abhängigkeiten mit `npm install` und starte die App mit `npm start`. Mit `npm run build:win` wird eine portable Windows-x64-EXE erstellt. Ein Build unter Linux benötigt Wine; auf Windows ist Wine nicht erforderlich.
