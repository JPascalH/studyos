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
    timer: { mode: 'focus', remaining: FOCUS_SECONDS, running: false, endsAt: null },
    name: '',
    language: 'de'
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        ...defaults,
        ...parsed,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        activityDays: parsed.activityDays && typeof parsed.activityDays === 'object' ? parsed.activityDays : {},
        timer: { ...defaults.timer, ...(parsed.timer || {}) },
        name: typeof parsed.name === 'string' ? parsed.name.slice(0, 40) : defaults.name,
        language: parsed.language === 'en' ? 'en' : 'de'
      };
    } catch (_) {
      return { ...defaults, timer: { ...defaults.timer } };
    }
  }

  const state = loadState();
  const $ = (selector) => document.querySelector(selector);
  const { t, applyLanguage, subjects } = window.StudyOSI18n;
  const refs = {
    connection: $('#connection-status'), connectionLabel: $('#connection-label'), date: $('#today-label'),
    welcomeKicker: $('#welcome-kicker'), welcomeHeading: $('#welcome-heading'), welcomeCopy: $('.welcome-copy'), nextTitle: $('#next-step-title'), nextCopy: $('#next-step-copy'),
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
    searchResults: $('#search-results'), toast: $('#toast'), backupExport: $('#backup-export'),
    backupImport: $('#backup-import'), backupFile: $('#backup-file'), backupStatus: $('#backup-status'),
    profileName: $('#profile-name'), profileLanguage: $('#profile-language'), avatarInitial: $('#avatar-initial'),
    installButton: $('#install-app'), updateButton: $('#update-pill')
  };

  let toastTimer = null;
  let notesTimer = null;
  let deferredInstallPrompt = null;
  let serviceWorkerRegistration = null;
  let applyingUpdate = false;

  function subjectLabel(subject) {
    return state.language === 'en' ? (subjects[subject] || subject) : subject;
  }

  function renderGreeting() {
    const hour = new Date().getHours();
    const greeting = hour < 11 ? t('greeting.morning') : hour < 18 ? t('greeting.day') : t('greeting.evening');
    refs.welcomeKicker.textContent = hour < 11 ? (state.language === 'en' ? 'GOOD MORNING · YOUR STUDY SPACE' : 'GUTEN MORGEN · DEIN LERN-SPACE') : hour < 18 ? t('greeting.kicker') : (state.language === 'en' ? 'GOOD EVENING · YOUR STUDY SPACE' : 'GUTEN ABEND · DEIN LERN-SPACE');
    refs.welcomeHeading.textContent = state.name ? t('greeting.name', { greeting, name: state.name }) : t('greeting.noName', { greeting });
    const firstLetter = [...(state.name || '')][0];
    refs.avatarInitial.textContent = firstLetter ? firstLetter.toLocaleUpperCase(state.language === 'en' ? 'en-GB' : 'de-DE') : 'S';
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      refs.taskFooter.textContent = t('tasks.savedBrowser');
      return true;
    } catch (_) {
      refs.taskFooter.textContent = t('storage.unavailable');
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
    const locale = state.language === 'en' ? 'en-GB' : 'de-DE';
    refs.date.textContent = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(now);
    refs.taskListDate.textContent = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(now).toUpperCase();
    renderGreeting();
  }

  function updateConnection() {
    const online = navigator.onLine;
    refs.connection.classList.toggle('online', online);
    refs.connection.classList.toggle('offline', !online);
    refs.connectionLabel.textContent = online ? t('connection.online') : t('connection.offline');
  }

  function renderSummary() {
    const today = dateKey();
    const todayCompleted = state.tasks.filter((task) => task.completed && task.completedAt === today).length;
    const activity = Number(state.activityDays[today]) || 0;
    const streak = countStreak();
    const goal = Math.min(activity, 3);
    const percent = Math.round((goal / 3) * 100);

    refs.streak.textContent = String(streak);
    refs.streakNote.textContent = streak ? t('summary.streak') : t('summary.streakStart');
    refs.focusTotal.textContent = String(Number(state.focusSessions) || 0);
    refs.tasksToday.textContent = String(todayCompleted);
    refs.tasksTodayNote.textContent = todayCompleted ? t('summary.tasksDone') : t('summary.tasksEmpty');
    refs.goalCount.textContent = String(goal);
    refs.goalProgress.style.width = `${percent}%`;
    refs.goalPercent.textContent = `${percent}%`;
    refs.miniQuest.textContent = activity >= 3 ? t('quest.done') : activity === 2 ? t('quest.one') : activity === 1 ? t('quest.two') : t('quest.start');

    const incomplete = state.tasks.filter((task) => !task.completed).length;
    refs.nextTitle.textContent = incomplete ? t('next.waiting') : t('next.titleDefault');
    refs.nextCopy.textContent = incomplete ? t(incomplete === 1 ? 'next.one' : 'next.many', { count: incomplete }) : t('next.default');
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
    refs.timerModeLabel.textContent = t(state.timer.mode === 'focus' ? 'timer.focus' : 'timer.break');
    refs.timerHint.textContent = t(state.timer.mode === 'focus' ? 'timer.hintFocus' : 'timer.hintBreak');
    refs.timerToggleIcon.textContent = state.timer.running ? 'Ⅱ' : '▶';
    refs.timerToggleLabel.textContent = t(state.timer.running ? 'timer.pause' : 'timer.start');
    document.title = state.timer.running ? t('title.running', { time: formatTime(remaining) }) : t('timer.title');
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
    if (diff === 0) return t('due.today');
    if (diff === 1) return t('due.tomorrow');
    if (diff === -1) return t('due.yesterday');
    return new Intl.DateTimeFormat(state.language === 'en' ? 'en-GB' : 'de-DE', { day: 'numeric', month: 'short' }).format(dueDate);
  }

  function createTaskNode(task) {
    const item = document.createElement('article');
    item.className = `task-item${task.completed ? ' completed' : ''}`;
    const check = document.createElement('button');
    check.type = 'button';
    check.className = 'task-check';
    check.dataset.taskToggle = task.id;
    check.setAttribute('aria-label', t(task.completed ? 'task.open' : 'task.done', { title: task.title }));
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
    subject.textContent = subjectLabel(task.subject || 'Allgemein');
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
    status.textContent = task.completed ? t('task.statusDone') : '';
    status.style.cssText = 'color:#73dfb3;font-size:7px;font-weight:800;letter-spacing:.7px;';

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'task-delete';
    remove.dataset.taskDelete = task.id;
    remove.setAttribute('aria-label', t('task.delete', { title: task.title }));
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
      title.textContent = t('tasks.emptyTitle');
      const copy = document.createElement('span');
      copy.textContent = t('tasks.emptyCopy');
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
      showToast(t('toast.timerFocus'));
    } else {
      state.timer.mode = 'focus';
      state.timer.remaining = FOCUS_SECONDS;
      showToast(t('toast.timerBreak'));
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
    showToast(t('toast.taskAdded'));
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
      showToast(t(task.completed ? 'toast.taskDone' : 'toast.taskReopened'));
    } else if (remove) {
      state.tasks = state.tasks.filter((item) => item.id !== remove.dataset.taskDelete);
      saveState();
      renderTasks();
      renderSummary();
      showToast(t('toast.taskDeleted'));
    }
  }

  function renderSearchResults(pages) {
    refs.searchResults.replaceChildren();
    pages.forEach((page) => {
      const article = document.createElement('article');
      article.className = 'result-card';
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = page.fullurl || `https://${state.language === 'en' ? 'en' : 'de'}.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = page.title;
      heading.append(link);
      const summary = document.createElement('p');
      summary.textContent = page.extract || t('search.summaryFallback');
      const source = document.createElement('a');
      source.className = 'result-link';
      source.href = link.href;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = t('search.source');
      article.append(heading, summary, source);
      refs.searchResults.append(article);
    });
  }

  async function searchWikipedia(query) {
    refs.searchStatus.className = 'search-status';
    refs.searchStatus.textContent = t('search.loading');
    refs.searchResults.replaceChildren();
    refs.searchButton.disabled = true;
    const language = state.language === 'en' ? 'en' : 'de';
    const params = new URLSearchParams({
      action: 'query', generator: 'search', gsrsearch: query, gsrnamespace: '0', gsrlimit: '4',
      prop: 'extracts|info', exintro: '1', explaintext: '1', inprop: 'url', format: 'json', origin: '*', formatversion: '2'
    });
    try {
      const response = await fetch(`https://${language}.wikipedia.org/w/api.php?${params.toString()}`, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error(t('search.unreachable'));
      const data = await response.json();
      const pages = Array.isArray(data?.query?.pages) ? data.query.pages : [];
      pages.sort((a, b) => (a.index || 0) - (b.index || 0));
      if (!pages.length) {
        refs.searchStatus.textContent = t('search.none', { query });
        return;
      }
      renderSearchResults(pages);
      refs.searchStatus.textContent = t('search.found', { count: pages.length });
    } catch (error) {
      refs.searchStatus.className = 'search-status error';
      refs.searchStatus.textContent = navigator.onLine
        ? t('search.failedOnline')
        : t('search.failedOffline');
    } finally {
      refs.searchButton.disabled = false;
    }
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        serviceWorkerRegistration = registration;
        const showUpdate = () => { refs.updateButton.hidden = false; };
        if (registration.waiting && navigator.serviceWorker.controller) showUpdate();
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state !== 'installed') return;
            if (navigator.serviceWorker.controller) showUpdate();
            else worker.postMessage({ type: 'SKIP_WAITING' });
          });
        });
        const checkForUpdates = () => { if (navigator.onLine) registration.update().catch(() => {}); };
        window.setInterval(checkForUpdates, 30 * 60 * 1000);
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkForUpdates(); });
        window.addEventListener('online', checkForUpdates);
      }).catch(() => {
        // Preview environments may restrict worker installation; local data still remains available.
      });
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (applyingUpdate) window.location.reload();
      });
    }
  }

  function isPlainObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function isValidDateKey(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }

  function normalizeBackupState(source) {
    if (!isPlainObject(source) || !Array.isArray(source.tasks) || source.tasks.length > 1000 || typeof source.notes !== 'string' || source.notes.length > 1200) {
      throw new Error(t('backup.invalidData'));
    }

    const usedIds = new Set();
    const tasks = source.tasks.map((task, index) => {
      if (!isPlainObject(task) || typeof task.title !== 'string' || !task.title.trim() || task.title.length > 90 || typeof task.completed !== 'boolean') {
        throw new Error(t('backup.invalidTask'));
      }
      const due = typeof task.due === 'string' ? task.due : '';
      if (due && !isValidDateKey(due)) throw new Error(t('backup.invalidDue'));
      const completedAt = task.completedAt == null ? null : task.completedAt;
      if (completedAt !== null && !isValidDateKey(completedAt)) throw new Error(t('backup.invalidCompleted'));
      let id = typeof task.id === 'string' && task.id.length > 0 && task.id.length <= 100 ? task.id : '';
      if (!id || usedIds.has(id)) id = `import-${Date.now()}-${index}`;
      usedIds.add(id);
      const subject = typeof task.subject === 'string' && task.subject.length <= 40 ? task.subject : 'Allgemein';
      const createdAt = Number.isFinite(task.createdAt) && task.createdAt >= 0 ? task.createdAt : Date.now();
      return { id, title: task.title.trim(), subject, due, completed: task.completed, completedAt, createdAt };
    });

    if (source.activityDays !== undefined && !isPlainObject(source.activityDays)) throw new Error(t('backup.invalidProgress'));
    const activityEntries = Object.entries(source.activityDays || {});
    if (activityEntries.length > 3650) throw new Error(t('backup.tooManyEntries'));
    const activityDays = {};
    activityEntries.forEach(([date, count]) => {
      if (!isValidDateKey(date) || !Number.isFinite(count) || count < 0 || count > 1000000) {
        throw new Error(t('backup.invalidEntry'));
      }
      if (count > 0) activityDays[date] = count;
    });

    const focusSessions = Number.isSafeInteger(source.focusSessions) && source.focusSessions >= 0 ? source.focusSessions : 0;
    const timerSource = isPlainObject(source.timer) ? source.timer : {};
    const mode = timerSource.mode === 'break' ? 'break' : 'focus';
    const duration = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
    let remaining = Number(timerSource.remaining);
    if (timerSource.running && Number.isFinite(timerSource.endsAt)) remaining = Math.ceil((timerSource.endsAt - Date.now()) / 1000);
    if (!Number.isFinite(remaining)) remaining = duration;
    remaining = Math.max(0, Math.min(duration, Math.floor(remaining)));

    return {
      tasks,
      notes: source.notes,
      activityDays,
      focusSessions,
      name: typeof source.name === 'string' ? source.name.slice(0, 40) : '',
      language: source.language === 'en' ? 'en' : 'de',
      timer: { mode, remaining, running: false, endsAt: null }
    };
  }

  function downloadBackup() {
    try {
      const snapshot = JSON.parse(JSON.stringify(state));
      snapshot.timer = { ...snapshot.timer, remaining: remainingSeconds(), running: false, endsAt: null };
      const backup = {
        app: 'StudyOS',
        format: 'studyos-backup',
        version: 1,
        exportedAt: new Date().toISOString(),
        state: snapshot
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studyos-sicherung-${dateKey()}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      refs.backupStatus.textContent = t('backup.done');
    } catch (_) {
      refs.backupStatus.textContent = t('backup.createFail');
    }
  }

  async function importBackup(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      refs.backupStatus.textContent = t('backup.tooLarge');
      return;
    }
    try {
      const payload = JSON.parse(await file.text());
      if (!isPlainObject(payload) || payload.app !== 'StudyOS' || payload.format !== 'studyos-backup' || payload.version !== 1) {
        throw new Error(t('backup.invalid'));
      }
      const restored = normalizeBackupState(payload.state);
      const confirmed = window.confirm(t('backup.confirm'));
      if (!confirmed) {
        refs.backupStatus.textContent = t('backup.cancel');
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
      refs.backupStatus.textContent = t('backup.importing');
      window.setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      refs.backupStatus.textContent = error instanceof SyntaxError
        ? t('backup.corrupt')
        : error.message || t('backup.importFail');
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
      refs.notesStatus.textContent = t('notes.saving');
    window.clearTimeout(notesTimer);
    notesTimer = window.setTimeout(() => {
      saveState();
      refs.notesStatus.textContent = t('notes.saved');
    }, 250);
  });
  refs.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = refs.searchQuery.value.trim();
    if (query) searchWikipedia(query);
  });
  refs.backupExport.addEventListener('click', downloadBackup);
  refs.backupImport.addEventListener('click', () => refs.backupFile.click());
  refs.backupFile.addEventListener('change', () => {
    const file = refs.backupFile.files && refs.backupFile.files[0];
    importBackup(file);
    refs.backupFile.value = '';
  });
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  refs.profileName.value = state.name;
  refs.profileLanguage.value = state.language;
  applyLanguage(state.language);
  refs.installButton.hidden = Boolean(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  refs.profileName.addEventListener('input', () => {
    state.name = refs.profileName.value.trim().slice(0, 40);
    saveState();
    renderGreeting();
  });
  refs.profileLanguage.addEventListener('change', () => {
    state.language = refs.profileLanguage.value === 'en' ? 'en' : 'de';
    saveState();
    applyLanguage(state.language);
    updateDate();
    updateConnection();
    renderSummary();
    renderTimer();
    renderTasks();
    refs.notesStatus.textContent = t('notes.saved');
    if (!refs.updateButton.hidden) refs.updateButton.lastElementChild.textContent = t('update.available');
  });
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    refs.installButton.hidden = false;
  });
  refs.installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
      showToast(t('install.help'));
      return;
    }
    const prompt = deferredInstallPrompt;
    deferredInstallPrompt = null;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice && choice.outcome === 'accepted') refs.installButton.hidden = true;
  });
  window.addEventListener('appinstalled', () => {
    refs.installButton.hidden = true;
    showToast(t('install.done'));
  });
  refs.updateButton.addEventListener('click', () => {
    const waitingWorker = serviceWorkerRegistration && serviceWorkerRegistration.waiting;
    if (!waitingWorker) return;
    applyingUpdate = true;
    refs.updateButton.disabled = true;
    refs.updateButton.lastElementChild.textContent = t('update.installing');
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  });
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
