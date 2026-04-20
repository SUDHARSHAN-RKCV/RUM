(function () {
  if (!window.DD_RUM) {
    console.warn('Datadog RUM SDK not loaded');
    return;
  }

  /* ========================
     RUM INITIALIZATION
     ======================== */
  window.DD_RUM.init({
    applicationId: '123456',
    clientToken: 'abcd',
    site: 'datadoghq.eu',
    service: 'Dashboard',
    env: 'PROD',
    version: '3.0.0',

    sessionSampleRate: 100,
    
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,

    defaultPrivacyLevel: 'mask-user-input',
  });

  /* ========================
     USER CONTEXT (OPTIONAL)
     Set from HTML or inline JS
     ======================== */
  if (window.APP_USER && window.APP_USER.id) {
    window.DD_RUM.setUser({
      id: window.APP_USER.id
    });
  }

  /* ========================
     IDLE SESSION HANDLING
     ======================== */
  let idleTimer;
  const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 min

  function endIdleSession() {
    if (!window.DD_RUM) return;

    console.log('Datadog RUM: idle timeout, new session');

    DD_RUM.clearUser();
    DD_RUM.startNewSession();
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(endIdleSession, IDLE_TIMEOUT);
  }

  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event =>
    document.addEventListener(event, resetIdleTimer, { passive: true })
  );

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      DD_RUM.addAction('tab_changed or closed', { path: location.pathname });
    }
  });

  resetIdleTimer();
})();