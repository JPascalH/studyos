(() => {
  'use strict';

  const germanToEnglish = {
    'Übersicht': 'Overview', 'Fokus': 'Focus', 'Aufgaben': 'Tasks', 'Notizen': 'Notes', 'Lernsuche': 'Study search', 'Daten': 'Data',
    'Offline zuerst': 'Offline first', 'Deine Daten bleiben bei dir.': 'Your data stays on your device.', 'DEIN PERSÖNLICHER STUDY SPACE': 'YOUR PERSONAL STUDY SPACE',
    'DEIN LERN-CONTROL-CENTER': 'YOUR STUDY CONTROL CENTER', 'GUTEN MORGEN · DEIN LERN-SPACE': 'GOOD MORNING · YOUR STUDY SPACE', 'GUTEN ABEND · DEIN LERN-SPACE': 'GOOD EVENING · YOUR STUDY SPACE',
    'Ein klarer Kopf. Ein kleiner Schritt. Dann der nächste.': 'A clear mind. One small step. Then the next.', 'Fokus starten': 'Start focus', 'Bring dich in den Flow': 'Get into the flow',
    'DEIN NÄCHSTER SCHRITT': 'YOUR NEXT STEP', 'Dein Tag. Dein Tempo.': 'Your day. Your pace.', 'Füge eine Aufgabe hinzu und starte mit einem 25-Minuten-Fokus.': 'Add a task and start a 25-minute focus session.', 'Plan für heute': 'Plan for today',
    'DEINE SERIE': 'YOUR STREAK', 'Tage': 'days', 'Heute kannst du deine Serie starten.': 'Start your streak today.', 'FOKUS-SESSIONS': 'FOCUS SESSIONS', 'abgeschlossen': 'completed', 'Jede Session bringt dich weiter.': 'Every session moves you forward.', 'AUFGABEN HEUTE': 'TASKS TODAY', 'erledigt': 'done', 'Ein Häkchen nach dem anderen.': 'One checkmark at a time.',
    'DEIN FLOW': 'YOUR FLOW', 'Fokus-Timer': 'Focus timer', 'POMODORO': 'POMODORO', 'Pause': 'Break', 'ZEIT FÜR FOKUS': 'TIME TO FOCUS', 'ZEIT FÜR PAUSE': 'TIME FOR A BREAK', 'Ein Schritt nach dem anderen.': 'One step at a time.', 'Kurz durchatmen. Du hast es verdient.': 'Take a breath. You have earned it.', 'Starten': 'Start', 'Timer zurücksetzen': 'Reset timer', 'Dein Fokus-Timer läuft direkt hier im Browser.': 'Your focus timer runs right here in the browser.',
    'KLEINE SCHRITTE, GROẞE WIRKUNG': 'SMALL STEPS, BIG IMPACT', 'Dein Tagesziel': 'Your daily goal', 'Aktionen heute': 'actions today', 'WEITER SO': 'KEEP IT UP', 'Deine Mini-Quest': 'Your mini quest', 'Starte deine erste Fokus-Session.': 'Start your first focus session.', 'Dein Fortschritt bleibt auf diesem Gerät gespeichert.': 'Your progress is saved on this device.',
    'ALLES IM BLICK': 'ALL IN VIEW', 'Deine Aufgaben': 'Your tasks', 'HEUTE': 'TODAY', 'Neue Aufgabe': 'New task', 'Was möchtest du erledigen?': 'What do you want to get done?', 'Fach auswählen': 'Choose a subject', 'Allgemein': 'General', 'Abgabedatum': 'Due date', 'Hinzufügen': 'Add task', 'Deine Aufgaben werden nur in diesem Browser gespeichert.': 'Your tasks are saved only in this browser.',
    'GEDANKENABLAGE': 'THOUGHTS, CAPTURED', 'Schnellnotiz': 'Quick note', 'Deine Notizen': 'Your notes', 'Idee, Merksatz oder To-do — schreib’s dir auf …': 'An idea, reminder or to-do — jot it down …', 'Wird auf diesem Gerät gespeichert': 'Saved on this device', 'Notizen bleiben auch ohne Internet auf deinem Gerät.': 'Your notes stay on your device, even offline.',
    'WISSEN AUF ABRUF': 'KNOWLEDGE ON DEMAND', 'Lernsuche': 'Study search', 'Such einen Begriff und entdecke kurze Zusammenfassungen aus der deutschsprachigen Wikipedia.': 'Search a topic and discover short summaries from Wikipedia.', 'Suchbegriff': 'Search term', 'Zum Beispiel: Photosynthese, Bruchrechnung …': 'For example: photosynthesis, fractions …', 'Im Web suchen': 'Search the web', 'Benötigt Internet. Deine Aufgaben und Notizen funktionieren auch offline.': 'Internet required. Your tasks and notes also work offline.', 'QUELLEN: WIKIPEDIA · DIE TREFFER ÖFFNEN SICH AUF DER ORIGINALSEITE': 'SOURCES: WIKIPEDIA · RESULTS OPEN ON THE ORIGINAL SITE',
    'DEIN KONTO · OHNE E-MAIL ODER PASSWORT': 'YOUR ACCOUNT · NO EMAIL OR PASSWORD', 'Lernstand mitnehmen': 'Take your study data with you', 'Dein StudyOS-Konto bleibt als Sicherungsdatei bei dir. Lade sie auf einem Laptop herunter und importiere sie auf dem anderen.': 'Your StudyOS data stays in a backup file you control. Download it on one laptop and import it on another.', 'Sicherung herunterladen': 'Download backup', 'Sicherung importieren': 'Import backup', 'StudyOS-Sicherungsdatei auswählen': 'Choose StudyOS backup file', 'Die Sicherung enthält Aufgaben, Notizen, Lernserie, Fokus-Sessions und Timerstand.': 'The backup includes tasks, notes, streak, focus sessions and timer state.', 'Der Import ersetzt die Daten auf diesem Gerät. Die JSON-Datei ist nicht verschlüsselt – bewahre sie sicher auf und teile sie nur mit Personen, denen du vertraust.': 'Importing replaces the data on this device. The JSON file is not encrypted — keep it safe and share it only with people you trust.',
    'dein Lern-Cockpit': 'your study cockpit', 'WORKSPACE': 'WORKSPACE', 'Fach auswählen': 'Choose a subject', 'Mathe': 'Math', 'Deutsch': 'German', 'Englisch': 'English', 'Biologie': 'Biology', 'Geschichte': 'History', 'Physik': 'Physics', 'Chemie': 'Chemistry', 'Informatik': 'Computer science', 'Sonstiges': 'Other',
    'Profil & Sprache': 'Profile & language', 'Name': 'Name', 'Sprache': 'Language', 'Wird nur auf diesem Gerät gespeichert.': 'Saved only on this device.', 'App installieren': 'Install app', 'Update verfügbar': 'Update available', 'INSTALLIEREN': 'INSTALL', 'OFFLINE BEREIT': 'OFFLINE READY'
  };

  const messages = {
    de: {
      'connection.online': 'Internet bereit', 'connection.offline': 'Offline-Modus', 'profile.aria': 'Profil- und Spracheinstellungen', 'profile.namePlaceholder': 'Dein Name', 'profile.initial': 'S',
      'date.today': 'Heute', 'date.title': 'StudyOS — dein Lern-Cockpit', 'date.weekday': 'de-DE',
      'greeting.morning': 'Guten Morgen', 'greeting.day': 'Guten Tag', 'greeting.evening': 'Guten Abend', 'greeting.kicker': 'DEIN LERN-CONTROL-CENTER', 'greeting.name': '{greeting}, {name}!', 'greeting.noName': '{greeting}!',
      'summary.streak': 'Stark — bleib im Flow.', 'summary.streakStart': 'Heute kannst du deine Serie starten.', 'summary.tasksDone': 'Nice — das hast du heute geschafft.', 'summary.tasksEmpty': 'Ein Häkchen nach dem anderen.',
      'quest.done': 'Tagesziel geschafft — richtig stark!', 'quest.one': 'Noch eine kleine Aktion bis zum Tagesziel.', 'quest.two': 'Zwei kleine Aktionen bis zum Tagesziel.', 'quest.start': 'Starte deine erste Fokus-Session.',
      'next.waiting': 'Dein nächster Schritt wartet.', 'next.titleDefault': 'Dein Tag. Dein Tempo.', 'next.one': 'Du hast {count} offene Aufgabe. Such dir eine aus und leg los.', 'next.many': 'Du hast {count} offene Aufgaben. Such dir eine aus und leg los.', 'next.default': 'Füge eine Aufgabe hinzu und starte mit einem 25-Minuten-Fokus.',
      'timer.focus': 'ZEIT FÜR FOKUS', 'timer.break': 'ZEIT FÜR PAUSE', 'timer.hintFocus': 'Ein Schritt nach dem anderen.', 'timer.hintBreak': 'Kurz durchatmen. Du hast es verdient.', 'timer.pause': 'Pause', 'timer.start': 'Starten', 'timer.title': 'StudyOS — dein Lern-Cockpit',
      'due.today': 'Heute fällig', 'due.tomorrow': 'Morgen fällig', 'due.yesterday': 'Seit gestern fällig', 'task.open': 'Als offen markieren: {title}', 'task.done': 'Als erledigt markieren: {title}', 'task.delete': 'Aufgabe löschen: {title}', 'task.statusDone': 'FERTIG', 'task.subjectDefault': 'Allgemein',
      'tasks.emptyTitle': 'Dein Board ist noch leer.', 'tasks.emptyCopy': 'Füge oben deine erste Aufgabe hinzu. Kleine Schritte zählen.', 'tasks.savedBrowser': 'Deine Aufgaben werden nur in diesem Browser gespeichert.', 'toast.timerFocus': 'Fokus-Session geschafft. Zeit für eine kurze Pause.', 'toast.timerBreak': 'Pause vorbei. Bereit für den nächsten Fokus?', 'toast.taskAdded': 'Aufgabe hinzugefügt. Du schaffst das.', 'toast.taskDone': 'Aufgabe erledigt — nice!', 'toast.taskReopened': 'Aufgabe wieder geöffnet.', 'toast.taskDeleted': 'Aufgabe gelöscht.',
      'search.summaryFallback': 'Öffne den Artikel, um mehr über dieses Thema zu erfahren.', 'search.source': 'Quelle auf Wikipedia öffnen ↗', 'search.loading': 'Suche läuft …', 'search.unreachable': 'Die Online-Suche ist gerade nicht erreichbar.', 'search.none': 'Keine Treffer für „{query}“ gefunden.', 'search.found': '{count} kurze Zusammenfassungen gefunden.', 'search.failedOnline': 'Die Suche konnte gerade nicht geladen werden. Prüfe deine Verbindung oder versuche es später noch einmal.', 'search.failedOffline': 'Du bist offline. Aufgaben und Notizen funktionieren weiter; für die Lernsuche brauchst du Internet.',
      'backup.done': 'Sicherung heruntergeladen. Übertrage die Datei auf deinen anderen Laptop.', 'backup.createFail': 'Die Sicherung konnte nicht erstellt werden. Prüfe den verfügbaren Speicherplatz.', 'backup.tooLarge': 'Die Sicherungsdatei ist zu groß. Erlaubt sind höchstens 2 MB.', 'backup.invalid': 'Diese Datei ist keine unterstützte StudyOS-Sicherung.', 'backup.confirm': 'Die Sicherung ersetzt Aufgaben, Notizen und Fortschritt, die derzeit in diesem Browser gespeichert sind. Möchtest du fortfahren?', 'backup.cancel': 'Import abgebrochen. Deine bisherigen Daten sind unverändert.', 'backup.importing': 'Import erfolgreich. StudyOS wird mit deinem übertragenen Lernstand neu geladen …', 'backup.corrupt': 'Die Datei ist beschädigt oder kein gültiges StudyOS-Backup.', 'backup.importFail': 'Die Sicherung konnte nicht importiert werden.', 'backup.invalidData': 'Die Sicherung ist unvollständig oder enthält ungültige Daten.', 'backup.invalidTask': 'Eine Aufgabe in der Sicherung ist ungültig.', 'backup.invalidDue': 'Ein Aufgabendatum in der Sicherung ist ungültig.', 'backup.invalidCompleted': 'Ein Abschlussdatum in der Sicherung ist ungültig.', 'backup.invalidProgress': 'Der Lernfortschritt in der Sicherung ist ungültig.', 'backup.tooManyEntries': 'Die Sicherung enthält zu viele Fortschrittseinträge.', 'backup.invalidEntry': 'Ein Fortschrittseintrag in der Sicherung ist ungültig.',
      'storage.unavailable': 'Speichern ist in diesem Browser gerade nicht verfügbar.', 'notes.saving': 'Speichert …', 'notes.saved': 'Auf diesem Gerät gespeichert', 'install.help': 'Öffne das Browsermenü und wähle „StudyOS installieren“ oder „App installieren“. Danach kannst du StudyOS im Startmenü an die Taskleiste anheften.', 'install.done': 'StudyOS ist jetzt als Desktop-App installiert.', 'update.available': 'Update verfügbar', 'update.installing': 'Update wird installiert …', 'title.running': '{time} · StudyOS'
    },
    en: {
      'connection.online': 'Internet connected', 'connection.offline': 'Offline mode', 'profile.aria': 'Profile and language settings', 'profile.namePlaceholder': 'Your name', 'profile.initial': 'S',
      'date.today': 'Today', 'date.title': 'StudyOS — your study cockpit', 'date.weekday': 'en-GB',
      'greeting.morning': 'Good morning', 'greeting.day': 'Hello', 'greeting.evening': 'Good evening', 'greeting.kicker': 'YOUR STUDY CONTROL CENTER', 'greeting.name': '{greeting}, {name}!', 'greeting.noName': '{greeting}!',
      'summary.streak': 'Great work — keep the momentum.', 'summary.streakStart': 'Start your streak today.', 'summary.tasksDone': 'Nice — you got that done today.', 'summary.tasksEmpty': 'One checkmark at a time.',
      'quest.done': 'Daily goal complete — fantastic!', 'quest.one': 'One more small action to reach your daily goal.', 'quest.two': 'Two small actions to reach your daily goal.', 'quest.start': 'Start your first focus session.',
      'next.waiting': 'Your next step is waiting.', 'next.titleDefault': 'Your day. Your pace.', 'next.one': 'You have {count} open task. Pick one and get started.', 'next.many': 'You have {count} open tasks. Pick one and get started.', 'next.default': 'Add a task and start a 25-minute focus session.',
      'timer.focus': 'TIME TO FOCUS', 'timer.break': 'TIME FOR A BREAK', 'timer.hintFocus': 'One step at a time.', 'timer.hintBreak': 'Take a breath. You have earned it.', 'timer.pause': 'Pause', 'timer.start': 'Start', 'timer.title': 'StudyOS — your study cockpit',
      'due.today': 'Due today', 'due.tomorrow': 'Due tomorrow', 'due.yesterday': 'Overdue since yesterday', 'task.open': 'Mark as open: {title}', 'task.done': 'Mark as complete: {title}', 'task.delete': 'Delete task: {title}', 'task.statusDone': 'DONE', 'task.subjectDefault': 'General',
      'tasks.emptyTitle': 'Your board is still empty.', 'tasks.emptyCopy': 'Add your first task above. Small steps count.', 'tasks.savedBrowser': 'Your tasks are saved only in this browser.', 'toast.timerFocus': 'Focus session complete. Time for a short break.', 'toast.timerBreak': 'Break over. Ready for your next focus session?', 'toast.taskAdded': 'Task added. You’ve got this.', 'toast.taskDone': 'Task complete — nice!', 'toast.taskReopened': 'Task reopened.', 'toast.taskDeleted': 'Task deleted.',
      'search.summaryFallback': 'Open the article to learn more about this topic.', 'search.source': 'Open source on Wikipedia ↗', 'search.loading': 'Searching …', 'search.unreachable': 'The online search is currently unavailable.', 'search.none': 'No results found for “{query}”.', 'search.found': 'Found {count} short summaries.', 'search.failedOnline': 'Search could not be loaded. Check your connection or try again later.', 'search.failedOffline': 'You are offline. Tasks and notes still work; study search needs internet.',
      'backup.done': 'Backup downloaded. Transfer the file to your other laptop.', 'backup.createFail': 'The backup could not be created. Check the available storage space.', 'backup.tooLarge': 'The backup file is too large. The limit is 2 MB.', 'backup.invalid': 'This file is not a supported StudyOS backup.', 'backup.confirm': 'This backup will replace tasks, notes and progress currently stored in this browser. Do you want to continue?', 'backup.cancel': 'Import cancelled. Your existing data is unchanged.', 'backup.importing': 'Import successful. StudyOS is reloading your transferred study data …', 'backup.corrupt': 'The file is damaged or is not a valid StudyOS backup.', 'backup.importFail': 'The backup could not be imported.', 'backup.invalidData': 'The backup is incomplete or contains invalid data.', 'backup.invalidTask': 'A task in the backup is invalid.', 'backup.invalidDue': 'A task due date in the backup is invalid.', 'backup.invalidCompleted': 'A task completion date in the backup is invalid.', 'backup.invalidProgress': 'The study progress in the backup is invalid.', 'backup.tooManyEntries': 'The backup contains too many progress entries.', 'backup.invalidEntry': 'A progress entry in the backup is invalid.',
      'storage.unavailable': 'Saving is currently unavailable in this browser.', 'notes.saving': 'Saving …', 'notes.saved': 'Saved on this device', 'install.help': 'Open the browser menu and choose “Install StudyOS” or “Install app”. Then you can pin StudyOS to your taskbar from the Start menu.', 'install.done': 'StudyOS is now installed as a desktop app.', 'update.available': 'Update available', 'update.installing': 'Installing update …', 'title.running': '{time} · StudyOS'
    }
  };

  const attributes = {
    de: {
      title: 'StudyOS — dein Lern-Cockpit', description: 'StudyOS — dein leichtes Lern-Cockpit. Offline für Aufgaben und Notizen, online für deine Lernrecherche.',
      'task-title': 'Was möchtest du erledigen?', 'task-subject': 'Fach auswählen', 'task-due': 'Abgabedatum (optional)', 'notes-input': 'Idee, Merksatz oder To-do — schreib’s dir auf …', 'search-query': 'Zum Beispiel: Photosynthese, Bruchrechnung …',
      'search-button': 'Im Web suchen', 'backup-file': 'StudyOS-Sicherungsdatei auswählen', 'timer-reset': 'Timer zurücksetzen', 'install-app': 'StudyOS als App installieren'
    },
    en: {
      title: 'StudyOS — your study cockpit', description: 'StudyOS — your lightweight study cockpit. Tasks and notes offline, study research online.',
      'task-title': 'What do you want to get done?', 'task-subject': 'Choose a subject', 'task-due': 'Due date (optional)', 'notes-input': 'An idea, reminder or to-do — jot it down …', 'search-query': 'For example: photosynthesis, fractions …',
      'search-button': 'Search the web', 'backup-file': 'Choose StudyOS backup file', 'timer-reset': 'Reset timer', 'install-app': 'Install StudyOS as an app'
    }
  };

  const subjects = { Allgemein: 'General', Mathe: 'Math', Deutsch: 'German', Englisch: 'English', Biologie: 'Biology', Geschichte: 'History', Physik: 'Physics', Chemie: 'Chemistry', Informatik: 'Computer science', Sonstiges: 'Other' };

  function t(key, values = {}) {
    const language = document.documentElement.lang === 'en' ? 'en' : 'de';
    const template = messages[language][key] || messages.de[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] == null ? '' : String(values[name]));
  }

  function applyLanguage(language) {
    const lang = language === 'en' ? 'en' : 'de';
    document.documentElement.lang = lang;
    const lookup = lang === 'en' ? germanToEnglish : Object.fromEntries(Object.entries(germanToEnglish).map(([de, en]) => [en, de]));
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.parentElement?.closest('#task-list, #search-results, #welcome-heading, #toast, #search-status')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const original = node.nodeValue;
      const trimmed = original.trim();
      if (lookup[trimmed]) node.nodeValue = original.replace(trimmed, lookup[trimmed]);
    }

    Object.entries(attributes[lang]).forEach(([key, value]) => {
      if (key === 'title') document.title = value;
      else if (key === 'description') document.querySelector('meta[name="description"]')?.setAttribute('content', value);
      else {
        const element = document.getElementById(key);
        if (!element) return;
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.placeholder = value;
          if (element instanceof HTMLInputElement && (element.type === 'date' || element.type === 'file')) element.setAttribute('aria-label', value);
        } else element.setAttribute('aria-label', value);
      }
    });
    document.querySelectorAll('#task-subject option').forEach((option) => {
      const german = option.value || option.textContent.trim();
      option.textContent = lang === 'en' ? (subjects[german] || german) : german;
    });
    document.querySelector('#profile-menu summary')?.setAttribute('aria-label', messages[lang]['profile.aria']);
    document.querySelector('#profile-name')?.setAttribute('placeholder', messages[lang]['profile.namePlaceholder']);
    document.querySelector('#profile-note')?.replaceChildren(document.createTextNode(lang === 'en' ? 'Saved only on this device.' : 'Wird nur auf diesem Gerät gespeichert.'));
  }

  window.StudyOSI18n = { t, applyLanguage, subjects };
})();
