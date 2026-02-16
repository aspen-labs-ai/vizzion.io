(function () {
  'use strict';

  var GLOBAL_NAME = 'VizzionWidget';
  var QUEUE_NAME = '__vizzionWidgetQueue';
  var STYLE_ID = 'vizzion-widget-style-v1';
  var INSTANCE_COUNTER = 0;
  var turnstileLoader = null;

  var API_BASE = resolveApiBase();

  function resolveApiBase() {
    try {
      var script =
        document.currentScript ||
        Array.prototype.slice
          .call(document.getElementsByTagName('script'))
          .reverse()
          .find(function (candidate) {
            return /\/widget\.js(?:\?|$)/.test(candidate.src || '');
          });

      if (script && script.src) {
        return new URL(script.src, window.location.href).origin;
      }
    } catch {
      // Fall back to current origin below.
    }

    return window.location.origin;
  }

  function safeJsonParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function requestJson(path, options) {
    var requestOptions = options || {};
    var method = requestOptions.method || 'GET';
    var body = requestOptions.body;

    return fetch(API_BASE + path, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'omit',
    }).then(function (response) {
      return response
        .text()
        .then(function (text) {
          var parsed = text ? safeJsonParse(text) : {};
          return {
            ok: response.ok,
            status: response.status,
            data: parsed || {},
          };
        })
        .catch(function () {
          return {
            ok: response.ok,
            status: response.status,
            data: {},
          };
        });
    });
  }

  function hasGenerationCap(widget) {
    return (
      typeof widget.maxGenerationsPerSession === 'number' ||
      typeof widget.maxGenerationsPerEmailLifetime === 'number'
    );
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function emailLooksValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getSessionStorageKey(embedKey) {
    return 'vizzion_widget_session_' + embedKey;
  }

  function readStoredSession(embedKey) {
    try {
      var raw = window.sessionStorage.getItem(getSessionStorageKey(embedKey));
      if (!raw) {
        return null;
      }

      var parsed = safeJsonParse(raw);
      if (!parsed || typeof parsed.id !== 'string' || typeof parsed.token !== 'string') {
        return null;
      }

      return {
        id: parsed.id,
        token: parsed.token,
      };
    } catch {
      return null;
    }
  }

  function writeStoredSession(embedKey, session) {
    try {
      window.sessionStorage.setItem(getSessionStorageKey(embedKey), JSON.stringify(session));
    } catch {
      // Ignore storage failures.
    }
  }

  function clearStoredSession(embedKey) {
    try {
      window.sessionStorage.removeItem(getSessionStorageKey(embedKey));
    } catch {
      // Ignore storage failures.
    }
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.vz-shell{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0f172a;border:1px solid rgba(148,163,184,0.25);border-radius:14px;padding:18px;color:#e2e8f0;box-shadow:0 20px 35px rgba(2,6,23,0.35)}' +
      '.vz-header{margin:0 0 12px}' +
      '.vz-title{margin:0 0 6px;font-size:1.12rem;line-height:1.25;font-weight:700;color:#f8fafc}' +
      '.vz-subtitle{margin:0;font-size:0.9rem;line-height:1.45;color:#94a3b8}' +
      '.vz-form{display:grid;gap:10px}' +
      '.vz-label{display:block;font-size:0.78rem;color:#94a3b8;margin-bottom:5px}' +
      '.vz-input,.vz-select{width:100%;background:#020617;border:1px solid rgba(148,163,184,0.35);border-radius:10px;padding:11px 12px;color:#f8fafc;font-size:0.95rem;box-sizing:border-box}' +
      '.vz-input:focus,.vz-select:focus{outline:none;border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,0.2)}' +
      '.vz-button{border:0;border-radius:10px;background:#10b981;color:#052e16;font-weight:700;font-size:0.95rem;padding:12px 14px;cursor:pointer;transition:filter 120ms ease,transform 120ms ease}' +
      '.vz-button:hover{filter:brightness(1.05);transform:translateY(-1px)}' +
      '.vz-button[disabled]{opacity:0.6;cursor:not-allowed;transform:none;filter:none}' +
      '.vz-message{margin-top:10px;font-size:0.86rem;line-height:1.45;min-height:20px}' +
      '.vz-message-success{color:#6ee7b7}' +
      '.vz-message-error{color:#fca5a5}' +
      '.vz-message-info{color:#93c5fd}' +
      '.vz-message-warning{color:#fde68a}' +
      '.vz-turnstile{margin-top:2px}' +
      '.vz-blocked{margin-top:12px;border:1px solid rgba(16,185,129,0.35);border-radius:10px;background:rgba(16,185,129,0.07);padding:12px;display:none}' +
      '.vz-blocked-title{font-size:0.96rem;font-weight:700;color:#f8fafc;margin:0 0 6px}' +
      '.vz-blocked-copy{font-size:0.86rem;color:#cbd5e1;margin:0 0 10px}' +
      '.vz-blocked-limits{font-size:0.8rem;color:#94a3b8;display:grid;gap:3px;margin:0 0 10px}' +
      '.vz-cta{display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:#10b981;color:#052e16;text-decoration:none;font-weight:700;padding:9px 12px;font-size:0.84rem}' +
      '.vz-hidden{display:none !important}';

    document.head.appendChild(style);
  }

  function limitReasonCopy(reason) {
    if (reason === 'session_cap') {
      return 'You have reached the maximum previews for this session.';
    }
    if (reason === 'email_cap') {
      return 'This email has reached the preview limit.';
    }
    if (reason === 'ip_hour_cap') {
      return 'Too many preview requests from this network in the last hour.';
    }
    if (reason === 'ip_day_cap') {
      return 'Too many preview requests from this network today.';
    }
    return 'Preview limit reached.';
  }

  function setMessage(instance, message, type) {
    if (!instance.messageEl) {
      return;
    }

    instance.messageEl.className = 'vz-message';
    if (type === 'success') {
      instance.messageEl.classList.add('vz-message-success');
    } else if (type === 'error') {
      instance.messageEl.classList.add('vz-message-error');
    } else if (type === 'warning') {
      instance.messageEl.classList.add('vz-message-warning');
    } else {
      instance.messageEl.classList.add('vz-message-info');
    }

    instance.messageEl.textContent = message;
  }

  function setSubmitting(instance, isSubmitting) {
    if (!instance.submitButton) {
      return;
    }

    instance.submitButton.disabled = !!isSubmitting;
    instance.submitButton.textContent = isSubmitting ? 'Submitting...' : 'Generate preview';
  }

  function showFatal(instance, message) {
    instance.target.innerHTML =
      '<div class="vz-shell"><p class="vz-title" style="margin-bottom:8px">Widget unavailable</p><p class="vz-subtitle" style="color:#fca5a5">' +
      escapeHtml(message) +
      '</p></div>';
  }

  function renderBlocked(instance, payload) {
    if (!instance.formEl || !instance.blockedEl) {
      return;
    }

    var limits = payload && payload.limits ? payload.limits : {};
    var lines = [];

    if (limits.session && typeof limits.session.used === 'number') {
      lines.push('Session: ' + limits.session.used + '/' + limits.session.limit);
    }
    if (limits.emailLifetime && typeof limits.emailLifetime.used === 'number') {
      lines.push('Email lifetime: ' + limits.emailLifetime.used + '/' + limits.emailLifetime.limit);
    }
    if (limits.ipHourly && typeof limits.ipHourly.used === 'number') {
      lines.push('IP hourly: ' + limits.ipHourly.used + '/' + limits.ipHourly.limit);
    }
    if (limits.ipDaily && typeof limits.ipDaily.used === 'number') {
      lines.push('IP daily: ' + limits.ipDaily.used + '/' + limits.ipDaily.limit);
    }

    var ctaUrl = payload && typeof payload.contactCtaUrl === 'string' ? payload.contactCtaUrl.trim() : '';

    var limitsMarkup = lines.length
      ? '<div class="vz-blocked-limits">' +
        lines
          .map(function (line) {
            return '<div>' + escapeHtml(line) + '</div>';
          })
          .join('') +
        '</div>'
      : '';

    var ctaMarkup = ctaUrl
      ? '<a class="vz-cta" href="' + escapeHtml(ctaUrl) + '">Contact us for more previews</a>'
      : '';

    instance.formEl.classList.add('vz-hidden');
    instance.blockedEl.innerHTML =
      '<p class="vz-blocked-title">Preview limit reached</p>' +
      '<p class="vz-blocked-copy">' + escapeHtml(limitReasonCopy(payload && payload.reason)) + '</p>' +
      limitsMarkup +
      ctaMarkup;
    instance.blockedEl.style.display = 'block';

    if (ctaUrl && ctaUrl.charAt(0) === '#') {
      var ctaEl = instance.blockedEl.querySelector('.vz-cta');
      if (ctaEl) {
        ctaEl.addEventListener('click', function (event) {
          var target = document.querySelector(ctaUrl);
          if (!target) {
            return;
          }

          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', ctaUrl);
          }
        });
      }
    }
  }

  function loadTurnstile() {
    if (window.turnstile) {
      return Promise.resolve(window.turnstile);
    }

    if (turnstileLoader) {
      return turnstileLoader;
    }

    turnstileLoader = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = function () {
        if (window.turnstile) {
          resolve(window.turnstile);
          return;
        }

        reject(new Error('Turnstile did not initialize.'));
      };
      script.onerror = function () {
        reject(new Error('Failed to load Turnstile.'));
      };
      document.head.appendChild(script);
    });

    return turnstileLoader;
  }

  function trackEvent(instance, eventType, eventData) {
    if (!instance || !instance.embedKey) {
      return;
    }

    requestJson('/api/public/widget/event', {
      method: 'POST',
      body: {
        embedKey: instance.embedKey,
        sessionId: instance.session ? instance.session.id : null,
        eventType: eventType,
        eventData: eventData || {},
        pageUrl: instance.pageUrl,
      },
    }).catch(function () {
      // Best-effort analytics.
    });
  }

  function normalizeTarget(target) {
    if (!target) {
      return null;
    }

    if (typeof target === 'string') {
      return document.querySelector(target);
    }

    if (target && target.nodeType === 1) {
      return target;
    }

    return null;
  }

  function buildMaterialOptions(instance) {
    var materials = (instance.widgetConfig && instance.widgetConfig.materials) || [];
    if (!materials.length) {
      return '';
    }

    var showNames = !!instance.widgetConfig.showProductNames;

    return materials
      .map(function (material, index) {
        var label = showNames && material.name ? material.name : 'Option ' + (index + 1);
        return '<option value="' + escapeHtml(material.id) + '">' + escapeHtml(label) + '</option>';
      })
      .join('');
  }

  function renderWidget(instance) {
    var materials = (instance.widgetConfig && instance.widgetConfig.materials) || [];
    var hasMaterials = materials.length > 0;

    var materialFieldMarkup = hasMaterials
      ? '<div><label class="vz-label" for="' +
        instance.instanceId +
        '-material">Material</label><select class="vz-select" id="' +
        instance.instanceId +
        '-material">' +
        buildMaterialOptions(instance) +
        '</select></div>'
      : '';

    var captchaMarkup = instance.capped
      ? '<div><label class="vz-label">Verification</label><div class="vz-turnstile"></div></div>'
      : '';

    instance.target.innerHTML =
      '<div class="vz-shell">' +
      '<div class="vz-header">' +
      '<p class="vz-title">Try this visualizer on your project</p>' +
      '<p class="vz-subtitle">Enter your email to request a preview. Demo requests are limited to prevent spam.</p>' +
      '</div>' +
      '<form class="vz-form" novalidate>' +
      materialFieldMarkup +
      '<div><label class="vz-label" for="' +
      instance.instanceId +
      '-email">Email</label><input class="vz-input" id="' +
      instance.instanceId +
      '-email" type="email" autocomplete="email" placeholder="you@company.com" required></div>' +
      captchaMarkup +
      '<button class="vz-button" type="submit">Generate preview</button>' +
      '</form>' +
      '<div class="vz-message" aria-live="polite"></div>' +
      '<div class="vz-blocked"></div>' +
      '</div>';

    instance.formEl = instance.target.querySelector('.vz-form');
    instance.emailInput = instance.target.querySelector('#' + instance.instanceId + '-email');
    instance.materialSelect = instance.target.querySelector('#' + instance.instanceId + '-material');
    instance.submitButton = instance.target.querySelector('.vz-button');
    instance.messageEl = instance.target.querySelector('.vz-message');
    instance.blockedEl = instance.target.querySelector('.vz-blocked');
    instance.turnstileContainer = instance.target.querySelector('.vz-turnstile');

    instance.formEl.addEventListener('submit', function (event) {
      event.preventDefault();
      submitGeneration(instance, true);
    });
  }

  function resetTurnstile(instance) {
    if (
      instance &&
      instance.turnstileWidgetId != null &&
      window.turnstile &&
      typeof window.turnstile.reset === 'function'
    ) {
      window.turnstile.reset(instance.turnstileWidgetId);
      instance.captchaToken = '';
    }
  }

  function setupTurnstile(instance) {
    if (!instance.capped) {
      return Promise.resolve();
    }

    if (!instance.turnstileSiteKey) {
      return Promise.reject(new Error('Turnstile site key is missing for capped widget.'));
    }

    if (!instance.turnstileContainer) {
      return Promise.reject(new Error('Turnstile container not found.'));
    }

    return loadTurnstile().then(function (turnstile) {
      instance.turnstileWidgetId = turnstile.render(instance.turnstileContainer, {
        sitekey: instance.turnstileSiteKey,
        theme: 'dark',
        callback: function (token) {
          instance.captchaToken = token;
        },
        'expired-callback': function () {
          instance.captchaToken = '';
        },
        'error-callback': function () {
          instance.captchaToken = '';
        },
      });
    });
  }

  function createSession(instance) {
    return requestJson('/api/public/widget/session', {
      method: 'POST',
      body: {
        embedKey: instance.embedKey,
        pageUrl: instance.pageUrl,
        referrer: document.referrer || null,
      },
    }).then(function (response) {
      if (!response.ok || !response.data || !response.data.session) {
        return null;
      }

      var session = response.data.session;
      if (typeof session.id !== 'string' || typeof session.token !== 'string') {
        return null;
      }

      var normalized = {
        id: session.id,
        token: session.token,
      };

      writeStoredSession(instance.embedKey, normalized);
      return normalized;
    });
  }

  function ensureSession(instance, forceNew) {
    if (!forceNew && instance.session) {
      return Promise.resolve(instance.session);
    }

    if (!forceNew) {
      var stored = readStoredSession(instance.embedKey);
      if (stored) {
        instance.session = stored;
        return Promise.resolve(stored);
      }
    }

    return createSession(instance).then(function (session) {
      instance.session = session;
      return session;
    });
  }

  function buildGeneratePayload(instance) {
    var email = (instance.emailInput && instance.emailInput.value ? instance.emailInput.value : '').trim();
    var materialId = instance.materialSelect ? instance.materialSelect.value : null;

    return {
      email: email,
      materialId: materialId || null,
      sourcePage: instance.pageUrl,
    };
  }

  function submitGeneration(instance, allowSessionRetry) {
    var payload = buildGeneratePayload(instance);
    if (!emailLooksValid(payload.email)) {
      setMessage(instance, 'Enter a valid email address to continue.', 'error');
      return Promise.resolve();
    }

    setSubmitting(instance, true);
    setMessage(instance, '', 'info');

    return ensureSession(instance, false)
      .then(function (session) {
        if (session && session.id) {
          payload.sessionId = session.id;
        }

        if (instance.capped) {
          if (!session || !session.token) {
            throw new Error('No valid widget session available.');
          }

          if (!instance.captchaToken) {
            throw new Error('Please complete verification before requesting a preview.');
          }

          payload.sessionToken = session.token;
          payload.captchaToken = instance.captchaToken;
        }

        return requestJson('/api/public/widget/generate-email', {
          method: 'POST',
          body: {
            embedKey: instance.embedKey,
            email: payload.email,
            sessionId: payload.sessionId || null,
            sessionToken: payload.sessionToken || null,
            captchaToken: payload.captchaToken || null,
            materialId: payload.materialId,
            sourcePage: payload.sourcePage,
          },
        });
      })
      .then(function (response) {
        if (response.ok) {
          setMessage(instance, 'Check your email. Your preview request was received.', 'success');
          trackEvent(instance, 'generation_requested', {
            status: 'ok',
            leadId: response.data && response.data.lead ? response.data.lead.id : null,
            generatedAt: new Date().toISOString(),
          });
          if (instance.emailInput) {
            instance.emailInput.value = '';
          }
          resetTurnstile(instance);
          return;
        }

        var code = response.data ? response.data.code : null;

        if (response.status === 401 && code === 'invalid_session' && allowSessionRetry) {
          clearStoredSession(instance.embedKey);
          instance.session = null;
          resetTurnstile(instance);
          return submitGeneration(instance, false);
        }

        if (response.status === 429 && code === 'generation_limit_reached') {
          renderBlocked(instance, response.data || {});
          trackEvent(instance, 'generation_limit_reached', {
            reason: response.data ? response.data.reason : 'unknown',
          });
          return;
        }

        if (response.status === 429 && code === 'quota_exceeded') {
          setMessage(instance, response.data && response.data.message ? response.data.message : 'Usage quota exceeded.', 'warning');
          resetTurnstile(instance);
          return;
        }

        if (response.status === 400 && (code === 'captcha_required' || code === 'captcha_failed')) {
          setMessage(
            instance,
            code === 'captcha_required'
              ? 'Verification is required before generating a preview.'
              : 'Verification failed. Please try again.',
            'error'
          );
          resetTurnstile(instance);
          return;
        }

        var fallbackMessage =
          (response.data && (response.data.message || response.data.error)) ||
          'Unable to submit your request right now. Please try again.';
        setMessage(instance, fallbackMessage, 'error');
        resetTurnstile(instance);
      })
      .catch(function (error) {
        setMessage(
          instance,
          error && error.message ? error.message : 'Unable to submit your request right now.',
          'error'
        );
        resetTurnstile(instance);
      })
      .finally(function () {
        setSubmitting(instance, false);
      });
  }

  function loadConfig(instance) {
    var query =
      '?embedKey=' + encodeURIComponent(instance.embedKey) +
      '&pageUrl=' + encodeURIComponent(instance.pageUrl);

    return requestJson('/api/public/widget/config' + query).then(function (response) {
      if (!response.ok || !response.data || !response.data.widget) {
        return null;
      }

      return response.data;
    });
  }

  function initializeInstance(instance) {
    ensureStyles();
    instance.target.innerHTML =
      '<div class="vz-shell"><p class="vz-title" style="margin-bottom:8px">Loading widget...</p><p class="vz-subtitle">Preparing live demo.</p></div>';

    return loadConfig(instance)
      .then(function (configPayload) {
        if (!configPayload) {
          throw new Error('Widget configuration could not be loaded.');
        }

        instance.widgetConfig = configPayload.widget;
        instance.turnstileSiteKey = configPayload.turnstileSiteKey || null;
        instance.capped = hasGenerationCap(instance.widgetConfig);

        return ensureSession(instance, false);
      })
      .then(function (session) {
        if (instance.capped && (!session || !session.token)) {
          throw new Error('Unable to start a session for this widget.');
        }

        renderWidget(instance);

        if (instance.capped) {
          return setupTurnstile(instance);
        }

        return null;
      })
      .then(function () {
        trackEvent(instance, 'widget_rendered', {
          renderedAt: new Date().toISOString(),
          capped: instance.capped,
        });
      })
      .catch(function (error) {
        showFatal(instance, error && error.message ? error.message : 'Unable to load widget.');
      });
  }

  function createInstance(options, target) {
    INSTANCE_COUNTER += 1;

    return {
      instanceId: 'vz-widget-' + INSTANCE_COUNTER,
      embedKey: options.embedKey,
      target: target,
      pageUrl: typeof options.pageUrl === 'string' && options.pageUrl.trim()
        ? options.pageUrl.trim()
        : window.location.href,
      session: null,
      widgetConfig: null,
      capped: false,
      turnstileSiteKey: null,
      turnstileContainer: null,
      turnstileWidgetId: null,
      captchaToken: '',
      formEl: null,
      emailInput: null,
      materialSelect: null,
      submitButton: null,
      messageEl: null,
      blockedEl: null,
    };
  }

  function init(options) {
    var normalized = options || {};
    var embedKey = typeof normalized.embedKey === 'string' ? normalized.embedKey.trim() : '';
    var target = normalizeTarget(normalized.target);

    if (!embedKey) {
      console.error('[VizzionWidget] init failed: embedKey is required.');
      return;
    }

    if (!target) {
      console.error('[VizzionWidget] init failed: target element not found.');
      return;
    }

    var instance = createInstance(
      {
        embedKey: embedKey,
        pageUrl: normalized.pageUrl,
      },
      target,
    );

    initializeInstance(instance);
  }

  function flushQueue() {
    var queue = window[QUEUE_NAME];
    if (!Array.isArray(queue) || queue.length === 0) {
      return;
    }

    while (queue.length > 0) {
      var item = queue.shift();
      if (item) {
        init(item);
      }
    }
  }

  window[GLOBAL_NAME] = {
    init: init,
  };

  flushQueue();
})();
