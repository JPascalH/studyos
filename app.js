(() => {
  'use strict';

  const STORAGE_KEY = 'studyos-v1';
  const FOCUS_SECONDS = 25 * 60;
  const BREAK_SECONDS = 5 * 60;
  const CIRCUMFERENCE = 2 * Math.PI * 106;
  const defaults = {
    tasks: [],
    notes: '',
    activityDays: {},
    focusSessions: 0,
    timer: { mode: 'focus', remaining: FOCUS_SECONDS, running: false, endsAt: null }
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        ...defaults,
        ...parsed,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        activityDays: parsed.activityDays && typeof parsed.activityDays === 'object' ? parsed.activityDays : {},
        timer: { ...defaults.timer, ...(parsed.timer || {}) }
      };
    } catch (_) {
      return { ...defaults, timer: { ...defaults.timer } };
    }
  }

  const state = loadState();
  const $ = (selector) => document.querySelector(selector);
  const refs = {
    connection: $('#connection-status'), connectionLabel: $('#connection-label'), date: $('#today-label'),
    welcomeKicker: $('#welcome-kicker'), nextTitle: $('#next-step-title'), nextCopy: $('#next-step-copy'),
    streak: $('#streak-value'), streakNote: $('#streak-note'), focusTotal: $('#focus-total'),
    tasksToday: $('#tasks-today-value'), tasksTodayNote: $('#tasks-today-note'), goalCount: $('#goal-count'),
    goalProgress: $('#goal-progress'), goalPercent: $('#goal-percent'), miniQuest: $('#mini-quest-copy'),
    timerProgress: $('#timer-progress'), timerDisplay: $('#timer-display'), timerModeLabel: $('#timer-mode-label'),
    timerHint: $('#timer-hint'), timerToggle: $('#timer-toggle'), timerToggleIcon: $('#timer-toggle-icon'),
    timerToggleLabel: $('#timer-toggle-label'), taskForm: $('#task-form'), taskTitle: $('#task-title'),
    taskSubject: $('#task-subject'), taskDue: $('#task-due'), taskList: $('#task-list'), taskCount: $('#task-count'),
    taskListDate: $('#task-list-date'), taskFooter: $('#task-footer-copy'), notes: $('#notes-input'),
    notesStatus: $('#notes-save-status'), notesCount: $('#notes-count'), searchForm: $('#search-form'),
    searchQuery: $('#search-query'), searchButton: $('#search-button'), searchStatus: $('#search-status'),
    searchResults: $('#search-results'), toast: $('#toast')
  };

  let toastTimer = null;
  let notesTimer = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      refs.taskFooter.textContent = 'Deine Aufgaben werden nur in diesem Browser gespeichert.';
      return true;
    } catch (_) {
      refs.taskFooter.textContent = 'Speichern ist in diesem Browser gerade nicht verfügbar.';
      return false;
    }
  }

  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseDateKey(key) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function recordActivity({ focus = false } = {}) {
    const key = dateKey();
    state.activityDays[key] = (Number(state.activityDays[key]) || 0) + 1;
    if (focus) state.focusSessions = (Number(state.focusSessions) || 0) + 1;
  }

  function countStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let cursor = new Date(today);
    if (!state.activityDays[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (state.activityDays[dateKey(cursor)]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function showToast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => refs.toast.classList.remove('show'), 2800);
  }

  function updateDate() {
    const now = new Date();
    refs.date.textContent = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }).format(now);
    const hour = now.getHours();
    refs.welcomeKicker.textContent = hour < 11 ? 'GUTEN MORGEN · DEIN LERN-SPACE' : hour < 18 ? 'DEIN LERN-CONTROL-CENTER' : 'GUTEN ABEND · DEIN LERN-SPACE';
    refs.taskListDate.textContent = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(now).toUpperCase();
  }

  function updateConnection() {
    const online = navigator.onLine;
    refs.connection.classList.toggle('online', online);
    refs.connection.classList.toggle('offline', !online);
    refs.connectionLabel.textContent = online ? 'Internet bereit' : 'Offline-Modus';
  }

  function renderSummary() {
    const today = dateKey();
    const todayCompleted = state.tasks.filter((task) => task.completed && task.completedAt === today).length;
    const activity = Number(state.activityDays[today]) || 0;
    const streak = countStreak();
    const goal = Math.min(activity, 3);
    const percent = Math.round((goal / 3) * 100);

    refs.streak.textContent = String(streak);
    refs.streakNote.textContent = streak ? 'Stark — bleib im Flow.' : 'Heute kannst du deine Serie starten.';
    refs.focusTotal.textContent = String(Number(state.focusSessions) || 0);
    refs.tasksToday.textContent = String(todayCompleted);
    refs.tasksTodayNote.textContent = todayCompleted ? 'Nice — das hast du heute geschafft.' : 'Ein Häkchen nach dem anderen.';
    refs.goalCount.textContent = String(goal);
    refs.goalProgress.style.width = `${percent}%`;
    refs.goalPercent.textContent = `${percent}%`;
    refs.miniQuest.textContent = activity >= 3 ? 'Tagesziel geschafft — richtig stark!' : activity === 2 ? 'Noch eine kleine Aktion bis zum Tagesziel.' : activity === 1 ? 'Zwei kleine Aktionen bis zum Tagesziel.' : 'Starte deine erste Fokus-Session.';

    const incomplete = state.tasks.filter((task) => !task.completed).length;
    refs.nextTitle.textContent = incomplete ? 'Dein nächster Schritt wartet.' : 'Dein Tag. Dein Tempo.';
    refs.nextCopy.textContent = incomplete ? `Du hast ${incomplete} offene${incomplete === 1 ? ' Aufgabe' : ' Aufgaben'}. Such dir eine aus und leg los.` : 'Füge eine Aufgabe hinzu und starte mit einem 25-Minuten-Fokus.';
  }

  function remainingSeconds() {
    if (state.timer.running && state.timer.endsAt) {
      return Math.max(0, Math.ceil((state.timer.endsAt - Date.now()) / 1000));
    }
    return Math.max(0, Number(state.timer.remaining) || 0);
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function renderTimer() {
    const duration = state.timer.mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
    const remaining = remainingSeconds();
    const progress = Math.min(1, Math.max(0, remaining / duration));
    refs.timerDisplay.textContent = formatTime(remaining);
    refs.timerProgress.style.strokeDasharray = String(CIRCUMFERENCE);
    refs.timerProgress.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
    refs.timerProgress.style.stroke = state.timer.mode === 'focus' ? 'var(--cyan)' : 'var(--violet)';
    refs.timerModeLabel.textContent = state.timer.mode === 'focus' ? 'ZEIT FÜR FOKUS' : 'ZEIT FÜR PAUSE';
    refs.timerHint.textContent = state.timer.mode === 'focus' ? 'Ein Schritt nach dem anderen.' : 'Kurz durchatmen. Du hast es verdient.';
    refs.timerToggleIcon.textContent = state.timer.running ? 'Ⅱ' : '▶';
    refs.timerToggleLabel.textContent = state.timer.running ? 'Pause' : 'Starten';
    document.title = state.timer.running ? `${formatTime(remaining)} · StudyOS` : 'StudyOS — dein Lern-Cockpit';
    document.querySelectorAll('.mode-button').forEach((button) => {
      const selected = button.dataset.mode === state.timer.mode;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function dueLabel(due) {
    if (!due) return '';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = parseDateKey(due);
    const diff = Math.round((dueDate.getTime() - now.getTime()) / 86400000);
    if (diff === 0) return 'Heute fällig';
    if (diff === 1) return 'Morgen fällig';
    if (diff === -1) return 'Seit gestern fällig';
    return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' }).format(dueDate);
  }

  function createTaskNode(task) {
    const item = document.createElement('article');
    item.className = `task-item${task.completed ? ' completed' : ''}`;
    const check = document.createElement('button');
    check.type = 'button';
    check.className = 'task-check';
    check.dataset.taskToggle = task.id;
    check.setAttribute('aria-label', task.completed ? `Als offen markieren: ${task.title}` : `Als erledigt markieren: ${task.title}`);
    check.textContent = '✓';

    const copy = document.createElement('div');
    copy.className = 'task-copy';
    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;
    const meta = document.createElement('span');
    meta.className = 'task-meta';
    const subject = document.createElement('span');
    subject.className = 'subject-tag';
    subject.textContent = task.subject || 'Allgemein';
    meta.append(subject);
    if (task.due) {
      const due = document.createElement('span');
      due.className = 'task-due';
      if (!task.completed && task.due < dateKey()) due.classList.add('overdue');
      due.textContent = dueLabel(task.due);
      meta.append(due);
    }
    copy.append(title, meta);

    const status = document.createElement('span');
    status.className = 'task-status';
    status.textContent = task.completed ? 'FERTIG' : '';
    status.style.cssText = 'color:#73dfb3;font-size:7px;font-weight:800;letter-spacing:.7px;';

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'task-delete';
    remove.dataset.taskDelete = task.id;
    remove.setAttribute('aria-label', `Aufgabe löschen: ${task.title}`);
    remove.textContent = '×';
    item.append(check, copy, status, remove);
    return item;
  }

  function renderTasks() {
    refs.taskList.replaceChildren();
    const tasks = [...state.tasks].sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
      if (a.due && b.due) return a.due.localeCompare(b.due);
      if (a.due) return -1;
      if (b.due) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
    refs.taskCount.textContent = String(state.tasks.filter((task) => !task.completed).length);

    if (!tasks.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-tasks';
      const icon = document.createElement('span');
      icon.className = 'empty-icon';
      icon.textContent = '✦';
      const title = document.createElement('strong');
      title.textContent = 'Dein Board ist noch leer.';
      const copy = document.createElement('span');
      copy.textContent = 'Füge oben deine erste Aufgabe hinzu. Kleine Schritte zählen.';
      empty.append(icon, title, copy);
      refs.taskList.append(empty);
      return;
    }
    tasks.forEach((task) => refs.taskList.append(createTaskNode(task)));
  }

  function renderNotes() {
    if (refs.notes.value !== state.notes) refs.notes.value = state.notes;
    refs.notesCount.textContent = `${state.notes.length} / 1200`;
  }

  function chooseTimerMode(mode) {
    if (!['focus', 'break'].includes(mode)) return;
    state.timer.mode = mode;
    state.timer.remaining = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
    state.timer.running = false;
    state.timer.endsAt = null;
    saveState();
    renderTimer();
  }

  function toggleTimer() {
    if (state.timer.running) {
      state.timer.remaining = remainingSeconds();
      state.timer.running = false;
      state.timer.endsAt = null;
    } else {
      if (remainingSeconds() <= 0) state.timer.remaining = state.timer.mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
      state.timer.running = true;
      state.timer.endsAt = Date.now() + state.timer.remaining * 1000;
    }
    saveState();
    renderTimer();
  }

  function resetTimer() {
    state.timer.running = false;
    state.timer.endsAt = null;
    state.timer.remaining = state.timer.mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
    saveState();
    renderTimer();
  }

  function completeTimer() {
    const completedMode = state.timer.mode;
    state.timer.running = false;
    state.timer.endsAt = null;
    if (completedMode === 'focus') {
      recordActivity({ focus: true });
      state.timer.mode = 'break';
      state.timer.remaining = BREAK_SECONDS;
      showToast('Fokus-Session geschafft. Zeit für eine kurze Pause.');
    } else {
      state.timer.mode = 'focus';
      state.timer.remaining = FOCUS_SECONDS;
      showToast('Pause vorbei. Bereit für den nächsten Fokus?');
    }
    saveState();
    renderTimer();
    renderSummary();
  }

  function timerTick() {
    if (state.timer.running && remainingSeconds() <= 0) {
      completeTimer();
    } else if (state.timer.running) {
      renderTimer();
    }
  }

  function handleTaskSubmit(event) {
    event.preventDefault();
    const title = refs.taskTitle.value.trim();
    if (!title) return;
    state.tasks.push({
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      subject: refs.taskSubject.value || 'Allgemein',
      due: refs.taskDue.value || '',
      completed: false,
      completedAt: null,
      createdAt: Date.now()
    });
    saveState();
    renderTasks();
    renderSummary();
    refs.taskForm.reset();
    refs.taskTitle.focus();
    showToast('Aufgabe hinzugefügt. Du schaffst das.');
  }

  function handleTaskListClick(event) {
    const toggle = event.target.closest('[data-task-toggle]');
    const remove = event.target.closest('[data-task-delete]');
    if (toggle) {
      const task = state.tasks.find((item) => item.id === toggle.dataset.taskToggle);
      if (!task) return;
      task.completed = !task.completed;
      task.completedAt = task.completed ? dateKey() : null;
      if (task.completed) recordActivity();
      saveState();
      renderTasks();
      renderSummary();
      showToast(task.completed ? 'Aufgabe erledigt — nice!' : 'Aufgabe wieder geöffnet.');
    } else if (remove) {
      state.tasks = state.tasks.filter((item) => item.id !== remove.dataset.taskDelete);
      saveState();
      renderTasks();
      renderSummary();
      showToast('Aufgabe gelöscht.');
    }
  }

  function renderSearchResults(pages) {
    refs.searchResults.replaceChildren();
    pages.forEach((page) => {
      const article = document.createElement('article');
      article.className = 'result-card';
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = page.fullurl || `https://de.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = page.title;
      heading.append(link);
      const summary = document.createElement('p');
      summary.textContent = page.extract || 'Öffne den Artikel, um mehr über dieses Thema zu erfahren.';
      const source = document.createElement('a');
      source.className = 'result-link';
      source.href = link.href;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = 'Quelle auf Wikipedia öffnen ↗';
      article.append(heading, summary, source);
      refs.searchResults.append(article);
    });
  }

  async function searchWikipedia(query) {
    refs.searchStatus.className = 'search-status';
    refs.searchStatus.textContent = 'Suche läuft …';
    refs.searchResults.replaceChildren();
    refs.searchButton.disabled = true;
    const params = new URLSearchParams({
      action: 'query', generator: 'search', gsrsearch: query, gsrnamespace: '0', gsrlimit: '4',
      prop: 'extracts|info', exintro: '1', explaintext: '1', inprop: 'url', format: 'json', origin: '*', formatversion: '2'
    });
    try {
      const response = await fetch(`https://de.wikipedia.org/w/api.php?${params.toString()}`, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error('Die Online-Suche ist gerade nicht erreichbar.');
      const data = await response.json();
      const pages = Array.isArray(data?.query?.pages) ? data.query.pages : [];
      pages.sort((a, b) => (a.index || 0) - (b.index || 0));
      if (!pages.length) {
        refs.searchStatus.textContent = `Keine Treffer für „${query}“ gefunden.`;
        return;
      }
      renderSearchResults(pages);
      refs.searchStatus.textContent = `${pages.length} kurze Zusammenfassungen gefunden.`;
    } catch (error) {
      refs.searchStatus.className = 'search-status error';
      refs.searchStatus.textContent = navigator.onLine
        ? 'Die Suche konnte gerade nicht geladen werden. Prüfe deine Verbindung oder versuche es später noch einmal.'
        : 'Du bist offline. Aufgaben und Notizen funktionieren weiter; für die Lernsuche brauchst du Internet.';
    } finally {
      refs.searchButton.disabled = false;
    }
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Preview environments may restrict worker installation; local data still remains available.
      });
    }
  }

  function wireNavigation() {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  refs.taskForm.addEventListener('submit', handleTaskSubmit);
  refs.taskList.addEventListener('click', handleTaskListClick);
  refs.timerToggle.addEventListener('click', toggleTimer);
  $('#timer-reset').addEventListener('click', resetTimer);
  document.querySelectorAll('.mode-button').forEach((button) => button.addEventListener('click', () => chooseTimerMode(button.dataset.mode)));
  refs.notes.addEventListener('input', () => {
    state.notes = refs.notes.value;
    refs.notesCount.textContent = `${state.notes.length} / 1200`;
    refs.notesStatus.textContent = 'Speichert …';
    window.clearTimeout(notesTimer);
    notesTimer = window.setTimeout(() => {
      saveState();
      refs.notesStatus.textContent = 'Auf diesem Gerät gespeichert';
    }, 250);
  });
  refs.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = refs.searchQuery.value.trim();
    if (query) searchWikipedia(query);
  });
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  window.addEventListener('beforeunload', () => {
    if (state.timer.running) state.timer.remaining = remainingSeconds();
    saveState();
  });

  updateDate();
  updateConnection();
  renderSummary();
  renderTimer();
  renderTasks();
  renderNotes();
  wireNavigation();
  registerServiceWorker();
  window.setInterval(timerTick, 250);
})();
