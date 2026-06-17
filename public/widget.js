(function () {
  'use strict';

  var GLOBAL_NAME = 'VizzionWidget';
  var QUEUE_NAME = '__vizzionWidgetQueue';
  var STYLE_ID = 'vizzion-widget-style-v4';
  var INSTANCE_COUNTER = 0;
  var turnstileLoader = null;
  var API_BASE = resolveApiBase();

  var ICON_UPLOAD =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M4 14v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"/></svg>';
  var ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4.5 4.5L19 7"/></svg>';
  var ICON_HANDLE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 8l-4 4 4 4"/><path d="M14 8l4 4-4 4"/></svg>';

  var SUBJECT_COPY = {
    home: {
      uploadTitle: 'Upload a photo of your home',
      uploadHint: 'Drag and drop or browse from your device.',
      uploadLabel: 'home photo',
      revealLabel: 'your home',
    },
    vehicle: {
      uploadTitle: 'Upload a photo of your vehicle',
      uploadHint: 'Use a clear side or angled vehicle photo.',
      uploadLabel: 'vehicle photo',
      revealLabel: 'your vehicle',
    },
    body: {
      uploadTitle: 'Upload a photo for placement',
      uploadHint: 'Use a clear photo of the area you want to preview.',
      uploadLabel: 'placement photo',
      revealLabel: 'your photo',
    },
    yard: {
      uploadTitle: 'Upload a photo of your yard',
      uploadHint: 'A front, back, or side yard photo works best.',
      uploadLabel: 'yard photo',
      revealLabel: 'your yard',
    },
    boat: {
      uploadTitle: 'Upload a photo of your boat',
      uploadHint: 'Use a clear shot of the deck area for best results.',
      uploadLabel: 'boat photo',
      revealLabel: 'your boat',
    },
    room: {
      uploadTitle: 'Upload a photo of your room',
      uploadHint: 'Use a bright photo that clearly shows the space.',
      uploadLabel: 'room photo',
      revealLabel: 'your room',
    },
    generic: {
      uploadTitle: 'Upload a photo to begin',
      uploadHint: 'Choose a clear photo for the most realistic preview.',
      uploadLabel: 'project photo',
      revealLabel: 'your project',
    },
  };

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
      // Fall back below.
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

  function requestMultipart(path, formData) {
    return fetch(API_BASE + path, {
      method: 'POST',
      body: formData,
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

  function isEmailDeliveryOnly(instance) {
    return instance.widgetConfig && instance.widgetConfig.deliveryMode === 'email';
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

  function sanitizeColor(value) {
    var color = typeof value === 'string' ? value.trim() : '';
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
      return color;
    }
    return '#10B981';
  }

  function readableTextOn(hex) {
    var color = typeof hex === 'string' ? hex.replace('#', '') : '';
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    if (!/^[0-9a-fA-F]{6}$/.test(color)) {
      return '#04241a';
    }
    var r = parseInt(color.slice(0, 2), 16) / 255;
    var g = parseInt(color.slice(2, 4), 16) / 255;
    var b = parseInt(color.slice(4, 6), 16) / 255;
    var toLinear = function (c) {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    var luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    // Light accents -> near-black text; dark accents -> white text.
    return luminance > 0.45 ? '#06121f' : '#ffffff';
  }

  function normalizeSubjectType(value) {
    if (
      value === 'home' ||
      value === 'vehicle' ||
      value === 'body' ||
      value === 'yard' ||
      value === 'boat' ||
      value === 'room' ||
      value === 'generic'
    ) {
      return value;
    }
    return 'generic';
  }

  function getSubjectCopy(subjectType) {
    var normalized = normalizeSubjectType(subjectType);
    return SUBJECT_COPY[normalized] || SUBJECT_COPY.generic;
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

  function clearPreviewObjectUrl(instance) {
    if (instance.previewObjectUrl) {
      URL.revokeObjectURL(instance.previewObjectUrl);
      instance.previewObjectUrl = null;
    }
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.vz-shell{--vz-brand:#10B981;--vz-on-brand:#04241a;--vz-bg:#0f172a;--vz-bg2:#0b1220;--vz-grad:radial-gradient(130% 130% at 0% 0%,#14213c 0%,var(--vz-bg) 46%,var(--vz-bg2) 100%);--vz-surface:rgba(2,6,23,.5);--vz-surface2:rgba(2,6,23,.62);--vz-line:rgba(148,163,184,.16);--vz-line2:rgba(148,163,184,.3);--vz-strong:#f8fafc;--vz-text:#e8edf4;--vz-muted:#94a3b8;--vz-faint:#64748b;--vz-shadow:rgba(2,6,23,.7);font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--vz-grad);border:1px solid var(--vz-line);border-radius:20px;padding:22px;color:var(--vz-text);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 30px 60px -24px var(--vz-shadow);-webkit-font-smoothing:antialiased;text-align:left}',
      '.vz-shell.vz-theme-light{--vz-bg:#ffffff;--vz-bg2:#eef2f7;--vz-grad:linear-gradient(180deg,#ffffff 0%,#eef2f7 100%);--vz-surface:#f4f6fa;--vz-surface2:#e9eef5;--vz-line:rgba(15,23,42,.1);--vz-line2:rgba(15,23,42,.18);--vz-strong:#0f172a;--vz-text:#27313f;--vz-muted:#5b6472;--vz-faint:#94a3b8;--vz-shadow:rgba(15,23,42,.28)}',
      '.vz-shell *,.vz-shell *::before,.vz-shell *::after{box-sizing:border-box}',
      '.vz-title{margin:0 0 4px;font-size:18px;line-height:1.2;font-weight:700;letter-spacing:-.01em;color:var(--vz-strong)}',
      '.vz-subtitle{margin:0;font-size:13px;line-height:1.45;color:var(--vz-muted)}',
      '.vz-body{animation:vz-fade .28s cubic-bezier(.22,.61,.36,1) both}',
      '@keyframes vz-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
      '.vz-stepper{display:flex;align-items:center;justify-content:center;gap:8px;margin:16px 0 18px}',
      '.vz-step{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:999px;border:1px solid var(--vz-line2);font-size:12px;font-weight:700;color:var(--vz-muted);background:var(--vz-surface);transition:all .2s ease}',
      '.vz-step-active{border-color:var(--vz-brand);color:var(--vz-strong);box-shadow:0 0 0 4px color-mix(in srgb,var(--vz-brand) 16%,transparent)}',
      '.vz-step-done{border-color:var(--vz-brand);background:var(--vz-brand);color:var(--vz-on-brand)}',
      '.vz-step-divider{width:26px;height:2px;background:var(--vz-line2);border-radius:999px;transition:background .2s ease}',
      '.vz-step-divider-done{background:var(--vz-brand)}',
      '.vz-step-title{margin:0 0 12px;font-size:14px;font-weight:600;color:var(--vz-strong)}',
      '.vz-drop{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;border:1.5px dashed var(--vz-line2);background:var(--vz-surface);border-radius:16px;padding:30px 20px;min-height:176px;cursor:pointer;transition:border-color .18s ease,background .18s ease,transform .18s ease}',
      '.vz-drop:hover{border-color:color-mix(in srgb,var(--vz-brand) 55%,var(--vz-line2));background:var(--vz-surface2)}',
      '.vz-drop-active{border-color:var(--vz-brand);background:color-mix(in srgb,var(--vz-brand) 12%,var(--vz-surface));transform:scale(1.01)}',
      '.vz-drop-icon{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:14px;background:color-mix(in srgb,var(--vz-brand) 15%,var(--vz-bg));color:var(--vz-brand)}',
      '.vz-drop-icon svg{width:23px;height:23px}',
      '.vz-drop strong{font-size:14px;color:var(--vz-strong);font-weight:600}',
      '.vz-drop small{font-size:12.5px;color:var(--vz-muted)}',
      '.vz-hidden{display:none!important}',
      '.vz-uploaded{display:flex;align-items:center;gap:12px;border:1px solid var(--vz-line2);background:var(--vz-surface);border-radius:14px;padding:10px;margin-top:12px}',
      '.vz-uploaded-preview{width:84px;height:62px;border-radius:10px;object-fit:cover;border:1px solid var(--vz-line2);flex:none}',
      '.vz-uploaded-meta{display:flex;flex-direction:column;gap:5px;min-width:0;flex:1}',
      '.vz-uploaded-name{font-size:13px;font-weight:500;color:var(--vz-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.vz-uploaded-status{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--vz-brand)}',
      '.vz-uploaded-status svg{width:13px;height:13px}',
      '.vz-progress{height:5px;background:color-mix(in srgb,var(--vz-muted) 22%,transparent);border-radius:999px;overflow:hidden}',
      '.vz-progress>span{display:block;height:100%;border-radius:999px;background:var(--vz-brand);width:45%;animation:vz-load 1.1s ease-in-out infinite}',
      '@keyframes vz-load{0%{margin-left:-45%}100%{margin-left:100%}}',
      '.vz-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
      '.vz-material{position:relative;border:1px solid var(--vz-line2);border-radius:14px;overflow:hidden;background:var(--vz-surface);cursor:pointer;padding:0;transition:border-color .16s ease,transform .16s ease,box-shadow .16s ease}',
      '.vz-material:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--vz-brand) 50%,var(--vz-line2))}',
      '.vz-material-active{border-color:var(--vz-brand);box-shadow:0 0 0 3px color-mix(in srgb,var(--vz-brand) 22%,transparent)}',
      '.vz-material-swatch{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:linear-gradient(135deg,color-mix(in srgb,var(--vz-muted) 22%,var(--vz-surface)),var(--vz-surface))}',
      '.vz-material-name{display:block;padding:9px 10px;font-size:12.5px;font-weight:500;text-align:left;color:var(--vz-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.vz-material-check{position:absolute;top:8px;right:8px;width:22px;height:22px;border-radius:999px;background:var(--vz-brand);color:var(--vz-on-brand);display:none;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(2,6,23,.4)}',
      '.vz-material-check svg{width:13px;height:13px}',
      '.vz-material-active .vz-material-check{display:flex}',
      '.vz-form{display:flex;flex-direction:column;gap:12px}',
      '.vz-label{display:block;font-size:12.5px;font-weight:500;color:var(--vz-muted);margin-bottom:6px}',
      '.vz-input{width:100%;background:var(--vz-surface);border:1px solid var(--vz-line2);border-radius:12px;padding:12px 13px;color:var(--vz-strong);font-size:15px;font-family:inherit;transition:border-color .15s ease,box-shadow .15s ease}',
      '.vz-input::placeholder{color:var(--vz-faint)}',
      '.vz-input:focus{outline:none;border-color:var(--vz-brand);box-shadow:0 0 0 3px color-mix(in srgb,var(--vz-brand) 20%,transparent)}',
      '.vz-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;width:100%;min-height:46px;border:0;border-radius:12px;background:linear-gradient(180deg,color-mix(in srgb,var(--vz-brand) 90%,#fff),var(--vz-brand));color:var(--vz-on-brand);font-weight:700;font-size:14.5px;font-family:inherit;padding:12px 16px;cursor:pointer;transition:filter .14s ease,transform .12s ease,box-shadow .14s ease;box-shadow:0 10px 20px -10px color-mix(in srgb,var(--vz-brand) 70%,transparent)}',
      '.vz-button:hover{filter:brightness(1.04);transform:translateY(-1px)}',
      '.vz-button:active{transform:translateY(0)}',
      '.vz-button[disabled]{opacity:.45;cursor:not-allowed;transform:none;filter:none;box-shadow:none}',
      '.vz-button-secondary{background:none;color:var(--vz-text);border:1px solid var(--vz-line2);box-shadow:none}',
      '.vz-button-secondary:hover{filter:none;background:color-mix(in srgb,var(--vz-muted) 14%,transparent);color:var(--vz-strong)}',
      '.vz-row{display:flex;gap:10px;align-items:center;margin-top:14px}',
      '.vz-row .vz-button{flex:1}',
      '.vz-message{margin-top:12px;font-size:13px;line-height:1.45;min-height:18px}',
      '.vz-message-success{color:color-mix(in srgb,var(--vz-brand) 80%,var(--vz-strong))}.vz-message-error{color:#ef4444}.vz-message-info{color:#3b82f6}.vz-message-warning{color:#d97706}',
      '.vz-consent{margin-top:12px;font-size:11.5px;line-height:1.5;color:var(--vz-faint)}',
      '.vz-consent a{color:var(--vz-muted);text-decoration:underline}',
      '.vz-center{display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center;padding:30px 12px}',
      '.vz-center strong{font-size:15px;color:var(--vz-strong)}.vz-center small{font-size:12.5px;color:var(--vz-muted)}',
      '.vz-spinner{width:42px;height:42px;border-radius:999px;border:3px solid color-mix(in srgb,var(--vz-muted) 28%,transparent);border-top-color:var(--vz-brand);animation:vz-spin .8s linear infinite}',
      '@keyframes vz-spin{to{transform:rotate(360deg)}}',
      '.vz-reveal{display:flex;flex-direction:column;gap:14px}',
      '.vz-badge{align-self:flex-start;display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:color-mix(in srgb,var(--vz-brand) 15%,var(--vz-bg));border:1px solid color-mix(in srgb,var(--vz-brand) 36%,transparent);padding:6px 12px;font-size:12.5px;font-weight:600;color:var(--vz-strong)}',
      '.vz-badge svg{width:13px;height:13px;color:var(--vz-brand)}',
      '.vz-compare{position:relative;width:100%;border-radius:16px;overflow:hidden;border:1px solid var(--vz-line2);background:#020617;cursor:ew-resize;touch-action:none;user-select:none;-webkit-user-select:none}',
      '.vz-compare-after{display:block;width:100%;height:auto}',
      '.vz-compare-before{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--vz-pos,50%)) 0 0);-webkit-clip-path:inset(0 calc(100% - var(--vz-pos,50%)) 0 0);will-change:clip-path}',
      '.vz-compare-before img{display:block;width:100%;height:100%;object-fit:cover}',
      '.vz-compare-tag{position:absolute;top:10px;font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#f8fafc;background:rgba(2,6,23,.62);backdrop-filter:blur(4px);padding:4px 9px;border-radius:999px;pointer-events:none}',
      '.vz-compare-tag-before{left:10px}.vz-compare-tag-after{right:10px}',
      '.vz-compare-divider{position:absolute;top:0;bottom:0;left:var(--vz-pos,50%);width:2px;background:rgba(255,255,255,.92);transform:translateX(-1px);box-shadow:0 0 0 1px rgba(2,6,23,.22);pointer-events:none}',
      '.vz-compare-handle{position:absolute;top:50%;left:var(--vz-pos,50%);transform:translate(-50%,-50%);width:42px;height:42px;border-radius:999px;background:#fff;border:0;color:#0f172a;display:flex;align-items:center;justify-content:center;cursor:ew-resize;box-shadow:0 4px 16px rgba(2,6,23,.55);touch-action:none;padding:0}',
      '.vz-compare-handle:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--vz-brand) 65%,transparent),0 4px 16px rgba(2,6,23,.55)}',
      '.vz-compare-handle svg{width:20px;height:20px}',
      '.vz-upload-input{display:none}',
      '.vz-turnstile-wrap{margin-top:12px}',
      '.vz-popup-launcher{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;border:1px solid var(--vz-line2);background:var(--vz-bg);color:var(--vz-text);padding:11px 18px;font-weight:700;font-size:14px;font-family:inherit;cursor:pointer;transition:transform .12s ease}',
      '.vz-popup-launcher:hover{transform:translateY(-1px)}',
      '.vz-popup-overlay{position:fixed;inset:0;background:rgba(2,6,23,.74);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:20px;z-index:99999;animation:vz-fade .2s ease both}',
      '.vz-popup-overlay.vz-open{display:flex}',
      '.vz-popup-card{position:relative;width:min(560px,100%)}',
      '.vz-popup-close{position:absolute;top:-14px;right:-14px;width:34px;height:34px;border-radius:999px;border:1px solid var(--vz-line2);background:var(--vz-bg);color:var(--vz-text);cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center}',
      '@media (max-width:480px){.vz-shell{padding:16px;border-radius:16px}.vz-title{font-size:16px}.vz-compare-handle{width:38px;height:38px}}',
    ].join('');

    document.head.appendChild(style);
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

  function setupTurnstile(instance) {
    if (!instance.capped) {
      return Promise.resolve();
    }

    if (!instance.turnstileSiteKey) {
      return Promise.reject(new Error('Turnstile site key is missing for this widget.'));
    }

    if (!instance.turnstileContainer) {
      return Promise.reject(new Error('Turnstile container not found.'));
    }

    if (instance.turnstileWidgetId != null) {
      return Promise.resolve();
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

  function trackEvent(instance, eventType, eventData) {
    if (!instance || !instance.resolvedEmbedKey) {
      return;
    }

    requestJson('/api/public/widget/event', {
      method: 'POST',
      body: {
        embedKey: instance.resolvedEmbedKey,
        sessionId: instance.session ? instance.session.id : null,
        eventType: eventType,
        eventData: eventData || {},
        pageUrl: instance.pageUrl,
      },
    }).catch(function () {
      // Best effort analytics.
    });
  }

  function createSession(instance) {
    return requestJson('/api/public/widget/session', {
      method: 'POST',
      body: {
        embedKey: instance.resolvedEmbedKey,
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

      writeStoredSession(instance.resolvedEmbedKey, normalized);
      return normalized;
    });
  }

  function ensureSession(instance, forceNew) {
    if (!instance.resolvedEmbedKey) {
      return Promise.resolve(null);
    }

    if (!forceNew && instance.session) {
      return Promise.resolve(instance.session);
    }

    if (!forceNew) {
      var stored = readStoredSession(instance.resolvedEmbedKey);
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

  function buildConfigQuery(instance) {
    var search = [];

    if (instance.embedKey) {
      search.push('embedKey=' + encodeURIComponent(instance.embedKey));
    } else if (instance.industrySlug) {
      search.push('industrySlug=' + encodeURIComponent(instance.industrySlug));
    }

    search.push('pageUrl=' + encodeURIComponent(instance.pageUrl));

    return '?' + search.join('&');
  }

  function loadConfig(instance) {
    return requestJson('/api/public/widget/config' + buildConfigQuery(instance)).then(function (response) {
      if (!response.ok || !response.data || !response.data.widget) {
        return null;
      }
      return response.data;
    });
  }

  function createInstance(options, target) {
    INSTANCE_COUNTER += 1;

    return {
      instanceId: 'vz-widget-' + INSTANCE_COUNTER,
      embedKey: typeof options.embedKey === 'string' ? options.embedKey.trim() : '',
      industrySlug: typeof options.industrySlug === 'string' ? options.industrySlug.trim() : '',
      target: target,
      renderRoot: null,
      popupOverlay: null,
      popupContent: null,
      popupLauncher: null,
      isPopupOpen: false,
      pageUrl:
        typeof options.pageUrl === 'string' && options.pageUrl.trim()
          ? options.pageUrl.trim()
          : window.location.href,
      session: null,
      widgetConfig: null,
      resolvedEmbedKey: '',
      state: 'loading',
      stateMessage: '',
      upload: null,
      previewObjectUrl: null,
      uploadInProgress: false,
      selectedMaterialId: null,
      emailDraft: '',
      optionalEmailMessage: '',
      emailCaptured: false,
      generationJobId: null,
      revealBeforeUrl: null,
      revealAfterUrl: null,
      comparePercent: 50,
      capped: false,
      turnstileSiteKey: null,
      turnstileContainer: null,
      turnstileWidgetId: null,
      captchaToken: '',
      fallbackTimer: null,
      pollingTimer: null,
      pollingStartedAt: null,
      fallbackTracked: false,
      lastError: '',
    };
  }

  function clearPolling(instance) {
    if (instance.fallbackTimer) {
      clearTimeout(instance.fallbackTimer);
      instance.fallbackTimer = null;
    }
    if (instance.pollingTimer) {
      clearInterval(instance.pollingTimer);
      instance.pollingTimer = null;
    }
    instance.pollingStartedAt = null;
  }

  function setState(instance, state, patch) {
    instance.state = state;
    if (patch && typeof patch === 'object') {
      Object.keys(patch).forEach(function (key) {
        instance[key] = patch[key];
      });
    }
    render(instance);
  }

  function openPopup(instance) {
    if (!instance.popupOverlay) {
      return;
    }
    instance.isPopupOpen = true;
    instance.popupOverlay.classList.add('vz-open');
    if (instance.state !== 'loading') {
      render(instance);
    }
    if (instance.state !== 'loading') {
      trackEvent(instance, 'widget_opened', {
        mode: 'popup',
      });
    }
  }

  function closePopup(instance) {
    if (!instance.popupOverlay) {
      return;
    }
    instance.isPopupOpen = false;
    instance.popupOverlay.classList.remove('vz-open');
  }

  function ensurePopupMount(instance) {
    if (instance.popupOverlay && instance.popupContent && instance.popupLauncher) {
      return;
    }

    var launcherHost = instance.target || document.body;
    var launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'vz-popup-launcher';
    launcher.textContent = 'Try Live Preview';
    launcher.addEventListener('click', function () {
      openPopup(instance);
    });
    launcherHost.appendChild(launcher);

    var overlay = document.createElement('div');
    overlay.className = 'vz-popup-overlay';
    overlay.innerHTML =
      '<div class="vz-popup-card">' +
      '<button class="vz-popup-close" type="button" aria-label="Close">\u00d7</button>' +
      '<div class="vz-popup-content"></div>' +
      '</div>';

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        closePopup(instance);
      }
    });

    var closeButton = overlay.querySelector('.vz-popup-close');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        closePopup(instance);
      });
    }

    document.body.appendChild(overlay);

    instance.popupLauncher = launcher;
    instance.popupOverlay = overlay;
    instance.popupContent = overlay.querySelector('.vz-popup-content');
    instance.renderRoot = instance.popupContent;
  }

  function getRenderRoot(instance) {
    if (instance.widgetConfig && instance.widgetConfig.mode === 'popup') {
      return instance.popupContent;
    }
    return instance.renderRoot;
  }

  function buildStepMarker(step, activeStep, completedStep) {
    var classes = 'vz-step';
    if (step <= completedStep) {
      classes += ' vz-step-done';
    } else if (step === activeStep) {
      classes += ' vz-step-active';
    }

    return '<div class="' + classes + '">' + step + '</div>';
  }

  function renderStepper(activeStep, completedStep) {
    return (
      '<div class="vz-stepper">' +
      buildStepMarker(1, activeStep, completedStep) +
      '<span class="vz-step-divider ' + (completedStep >= 1 ? 'vz-step-divider-done' : '') + '"></span>' +
      buildStepMarker(2, activeStep, completedStep) +
      '<span class="vz-step-divider ' + (completedStep >= 2 ? 'vz-step-divider-done' : '') + '"></span>' +
      buildStepMarker(3, activeStep, completedStep) +
      '</div>'
    );
  }

  function renderBaseFrame(instance, bodyHtml) {
    var brand = sanitizeColor(instance.widgetConfig.brandColor);
    var onBrand = readableTextOn(brand);
    var themeClass = instance.widgetConfig.theme === 'light' ? ' vz-theme-light' : '';
    var title = instance.widgetConfig.name || 'Live Visualizer';

    return (
      '<div class="vz-shell' + themeClass + '" style="--vz-brand:' + escapeHtml(brand) + ';--vz-on-brand:' + escapeHtml(onBrand) + '">' +
      '<div class="vz-head">' +
      '<p class="vz-title">' + escapeHtml(title) + '</p>' +
      '<p class="vz-subtitle">Upload, choose, and reveal a realistic preview.</p>' +
      '</div>' +
      '<div class="vz-body">' + bodyHtml + '</div>' +
      '<div class="vz-message" aria-live="polite">' + escapeHtml(instance.stateMessage || '') + '</div>' +
      '</div>'
    );
  }

  function renderUploadState(instance) {
    var subject = getSubjectCopy(instance.widgetConfig.subjectType);
    var uploadedMarkup = '';

    if (instance.upload && instance.upload.previewUrl) {
      uploadedMarkup =
        '<div class="vz-uploaded">' +
        '<img class="vz-uploaded-preview" src="' + escapeHtml(instance.upload.previewUrl) + '" alt="Uploaded preview">' +
        '<div class="vz-uploaded-meta">' +
        '<div class="vz-uploaded-name">' + escapeHtml(instance.upload.name || subject.uploadLabel) + '</div>' +
        '<div class="vz-uploaded-status">' + ICON_CHECK + 'Photo ready — tap above to change</div>' +
        '</div>' +
        '</div>';
    }

    var dropInner = instance.uploadInProgress
      ? '<div class="vz-drop-icon">' + ICON_UPLOAD + '</div>' +
        '<strong>Uploading your ' + escapeHtml(subject.uploadLabel) + '…</strong>' +
        '<div class="vz-progress" style="width:60%"><span></span></div>'
      : '<div class="vz-drop-icon">' + ICON_UPLOAD + '</div>' +
        '<strong>' + escapeHtml(subject.uploadTitle) + '</strong>' +
        '<small>' + escapeHtml(subject.uploadHint) + '</small>';

    return (
      renderStepper(1, 0) +
      '<p class="vz-step-title">Step 1 · Upload your photo</p>' +
      '<label class="vz-drop" data-role="drop-zone">' +
      '<input class="vz-upload-input" data-role="file-input" type="file" accept="image/jpeg,image/png,image/webp">' +
      dropInner +
      '</label>' +
      uploadedMarkup +
      '<div class="vz-row">' +
      '<button class="vz-button" type="button" data-role="to-select" ' +
      (instance.upload ? '' : 'disabled') +
      '>Continue</button>' +
      '</div>' +
      '<p class="vz-consent">By continuing you agree to our <a href="' + API_BASE + '/terms" target="_blank" rel="noopener">Terms</a> and <a href="' + API_BASE + '/privacy" target="_blank" rel="noopener">Privacy Policy</a>.</p>'
    );
  }

  function renderMaterialCard(material, isActive, index, showNames) {
    var cardClasses = 'vz-material' + (isActive ? ' vz-material-active' : '');
    var name = showNames && material.name ? material.name : 'Option ' + (index + 1);
    var swatch = material.swatch_url
      ? '<img class="vz-material-swatch" src="' + escapeHtml(material.swatch_url) + '" alt="' + escapeHtml(name) + '">'
      : '<div class="vz-material-swatch"></div>';

    return (
      '<button class="' + cardClasses + '" type="button" data-role="material" data-id="' + escapeHtml(material.id) + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' +
      swatch +
      '<span class="vz-material-check">' + ICON_CHECK + '</span>' +
      '<span class="vz-material-name">' + escapeHtml(name) + '</span>' +
      '</button>'
    );
  }

  function renderSelectState(instance) {
    var materials = instance.widgetConfig.materials || [];
    var grid = materials
      .map(function (material, index) {
        return renderMaterialCard(
          material,
          instance.selectedMaterialId === material.id,
          index,
          !!instance.widgetConfig.showProductNames,
        );
      })
      .join('');

    var verificationMarkup = '';
    if (instance.capped && !instance.widgetConfig.requireEmail) {
      verificationMarkup =
        '<div class="vz-turnstile-wrap">' +
        '<label class="vz-label">Verification</label>' +
        '<div class="vz-turnstile" data-role="turnstile"></div>' +
        '</div>';
    }

    var primaryLabel = instance.widgetConfig.requireEmail
      ? 'Continue to email'
      : 'Reveal visualization';

    return (
      renderStepper(instance.widgetConfig.requireEmail ? 2 : 3, 1) +
      '<p class="vz-step-title">Step 2 · Choose your look</p>' +
      '<div class="vz-grid">' + grid + '</div>' +
      verificationMarkup +
      '<div class="vz-row">' +
      '<button class="vz-button vz-button-secondary" type="button" data-role="back-upload">Back</button>' +
      '<button class="vz-button" type="button" data-role="continue-select" ' +
      (instance.selectedMaterialId ? '' : 'disabled') +
      '>' + escapeHtml(primaryLabel) + '</button>' +
      '</div>'
    );
  }

  function renderEmailGateState(instance) {
    var copy = getSubjectCopy(instance.widgetConfig.subjectType);
    var emailOnly = isEmailDeliveryOnly(instance);
    var title = emailOnly
      ? 'Step 3 · Enter your email to receive your visualization'
      : 'Step 3 · Enter your email to reveal ' + copy.revealLabel;
    var buttonLabel = emailOnly ? 'Email me my visualization' : 'Reveal visualization';
    var verificationMarkup = '';
    if (instance.capped) {
      verificationMarkup =
        '<div class="vz-turnstile-wrap">' +
        '<label class="vz-label">Verification</label>' +
        '<div class="vz-turnstile" data-role="turnstile"></div>' +
        '</div>';
    }

    return (
      renderStepper(3, 2) +
      '<p class="vz-step-title">' + escapeHtml(title) + '</p>' +
      '<form class="vz-form" data-role="email-form" novalidate>' +
      '<div>' +
      '<label class="vz-label" for="' + escapeHtml(instance.instanceId) + '-email">Email</label>' +
      '<input class="vz-input" id="' + escapeHtml(instance.instanceId) + '-email" data-role="email-input" type="email" autocomplete="email" placeholder="you@company.com" value="' + escapeHtml(instance.emailDraft || '') + '">' +
      '</div>' +
      verificationMarkup +
      '<div class="vz-row">' +
      '<button class="vz-button vz-button-secondary" type="button" data-role="back-select">Back</button>' +
      '<button class="vz-button" type="submit" data-role="submit-email">' + escapeHtml(buttonLabel) + '</button>' +
      '</div>' +
      '</form>' +
      '<p class="vz-consent">We use your email to deliver your preview and follow up. See our <a href="' + API_BASE + '/privacy" target="_blank" rel="noopener">Privacy Policy</a>.</p>'
    );
  }

  function renderGeneratingState(instance, fallbackMode) {
    var subtitle = isEmailDeliveryOnly(instance)
      ? fallbackMode
        ? 'Still processing your preview. We will email it as soon as it is ready.'
        : 'Generating your visualization now. We will email it to you when it is ready.'
      : fallbackMode
        ? 'Still processing your preview. You can keep this open while we continue checking.'
        : 'Generating your visualization now...';
    var optionalEmailMarkup = '';

    if (fallbackMode && !instance.widgetConfig.requireEmail) {
      optionalEmailMarkup = renderOptionalEmailMarkup(
        instance,
        'Want us to send this as soon as it is ready?',
      );
    }

    return (
      renderStepper(3, 2) +
      '<div class="vz-center">' +
      '<div class="vz-spinner"></div>' +
      '<strong>' + escapeHtml(subtitle) + '</strong>' +
      '<small>Most previews are ready in under a minute.</small>' +
      '</div>' +
      optionalEmailMarkup +
      '<div class="vz-row">' +
      '<button class="vz-button vz-button-secondary" type="button" data-role="restart">Start over</button>' +
      '</div>'
    );
  }

  function renderEmailDeliveryState(instance) {
    return (
      renderStepper(3, 3) +
      '<div class="vz-reveal">' +
      '<span class="vz-badge">' + ICON_CHECK + 'Email sent</span>' +
      '<div class="vz-center" style="align-items:flex-start;text-align:left">' +
      '<strong>Check your inbox for the finished visualization.</strong>' +
      '<small>We sent the result to ' + escapeHtml(instance.emailDraft || 'your email') + '. If it does not arrive shortly, check spam or try again with a different email.</small>' +
      '</div>' +
      '<div class="vz-row">' +
      '<button class="vz-button vz-button-secondary" type="button" data-role="restart">Start over</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderOptionalEmailMarkup(instance, label) {
    if (instance.widgetConfig.requireEmail) {
      return '';
    }

    if (!instance.emailCaptured) {
      var helperMessage = instance.optionalEmailMessage
        ? '<p class="vz-consent">' + escapeHtml(instance.optionalEmailMessage) + '</p>'
        : '';

      return (
        '<form class="vz-form" data-role="optional-email-form" novalidate>' +
        '<label class="vz-label" for="' + escapeHtml(instance.instanceId) + '-optional-email">' +
        escapeHtml(label) +
        '</label>' +
        '<div class="vz-row">' +
        '<input class="vz-input" id="' + escapeHtml(instance.instanceId) + '-optional-email" data-role="optional-email-input" type="email" autocomplete="email" placeholder="you@company.com" value="' + escapeHtml(instance.emailDraft || '') + '">' +
        '<button class="vz-button" type="submit">Email me</button>' +
        '</div>' +
        '</form>' +
        helperMessage
      );
    }

    if (instance.optionalEmailMessage) {
      return '<p class="vz-consent">' + escapeHtml(instance.optionalEmailMessage) + '</p>';
    }

    return '';
  }

  function renderRevealState(instance) {
    var beforeUrl = instance.revealBeforeUrl || (instance.upload ? instance.upload.previewUrl : '');
    var afterUrl = instance.revealAfterUrl || '';
    var percent = typeof instance.comparePercent === 'number' ? instance.comparePercent : 50;
    var pos = Math.max(0, Math.min(100, percent));
    var optionalEmailMarkup = renderOptionalEmailMarkup(instance, 'Want this in your inbox?');

    return (
      renderStepper(3, 3) +
      '<div class="vz-reveal">' +
      '<span class="vz-badge">' + ICON_CHECK + 'Your preview is ready</span>' +
      '<div class="vz-compare" data-role="compare" style="--vz-pos:' + pos + '%">' +
      '<img class="vz-compare-after" src="' + escapeHtml(afterUrl) + '" alt="After preview" draggable="false">' +
      '<div class="vz-compare-before">' +
      '<img src="' + escapeHtml(beforeUrl) + '" alt="Before upload" draggable="false">' +
      '</div>' +
      '<span class="vz-compare-tag vz-compare-tag-before">Before</span>' +
      '<span class="vz-compare-tag vz-compare-tag-after">After</span>' +
      '<div class="vz-compare-divider"></div>' +
      '<button class="vz-compare-handle" type="button" data-role="compare-handle" role="slider" aria-label="Drag to compare before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pos) + '" tabindex="0">' +
      ICON_HANDLE +
      '</button>' +
      '</div>' +
      '<p class="vz-consent" style="margin-top:0">Drag the slider to compare before and after.</p>' +
      optionalEmailMarkup +
      '<div class="vz-row">' +
      '<button class="vz-button vz-button-secondary" type="button" data-role="restart">Start over</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderErrorState(instance) {
    var message = instance.lastError || 'Unable to complete your request right now.';

    return (
      renderStepper(1, 0) +
      '<div class="vz-center">' +
      '<strong>Something went wrong</strong>' +
      '<small>' + escapeHtml(message) + '</small>' +
      '</div>' +
      '<div class="vz-row">' +
      '<button class="vz-button" type="button" data-role="restart">Try again</button>' +
      '</div>'
    );
  }

  function renderLoadingState() {
    return '<div class="vz-shell"><p class="vz-title" style="margin-bottom:8px">Loading widget...</p><p class="vz-subtitle">Preparing live experience.</p></div>';
  }

  function wireTurnstile(instance) {
    instance.turnstileContainer = null;
    instance.turnstileWidgetId = null;
    instance.captchaToken = '';

    var root = getRenderRoot(instance);
    if (!root) {
      return;
    }

    var turnstile = root.querySelector('[data-role="turnstile"]');
    if (!turnstile) {
      return;
    }

    instance.turnstileContainer = turnstile;
    setupTurnstile(instance).catch(function (error) {
      instance.stateMessage = error && error.message ? error.message : 'Verification is unavailable.';
      render(instance);
    });
  }

  function applyStateMessage(root, message, type) {
    var messageEl = root.querySelector('.vz-message');
    if (!messageEl) {
      return;
    }

    messageEl.className = 'vz-message';
    if (type === 'success') {
      messageEl.classList.add('vz-message-success');
    } else if (type === 'error') {
      messageEl.classList.add('vz-message-error');
    } else if (type === 'warning') {
      messageEl.classList.add('vz-message-warning');
    } else {
      messageEl.classList.add('vz-message-info');
    }

    messageEl.textContent = message || '';
  }

  function submitOptionalEmail(instance, email) {
    if (!emailLooksValid(email)) {
      instance.optionalEmailMessage = 'Enter a valid email address to continue.';
      render(instance);
      return;
    }

    requestJson('/api/public/widget/generate', {
      method: 'POST',
      body: {
        embedKey: instance.resolvedEmbedKey,
        email: email,
        sessionId: instance.session ? instance.session.id : null,
        sessionToken: instance.session ? instance.session.token : null,
        materialId: instance.selectedMaterialId,
        sourcePage: instance.pageUrl,
        uploadId: instance.upload ? instance.upload.id : null,
        captureOnly: true,
        generationJobId: instance.generationJobId,
      },
    })
      .then(function (response) {
        if (!response.ok) {
          instance.optionalEmailMessage =
            (response.data && (response.data.message || response.data.error)) ||
            'Unable to save email right now.';
          render(instance);
          return;
        }

        instance.optionalEmailMessage = 'Email saved. We will send updates to your inbox.';
        instance.emailDraft = email;
        instance.emailCaptured = true;
        render(instance);
      })
      .catch(function () {
        instance.optionalEmailMessage = 'Unable to save email right now.';
        render(instance);
      });
  }

  function startPollingGeneration(instance) {
    clearPolling(instance);

    instance.pollingStartedAt = Date.now();
    instance.fallbackTracked = false;

    instance.fallbackTimer = setTimeout(function () {
      if (instance.state !== 'reveal' && instance.state !== 'error') {
        instance.state = 'fallback';
        instance.stateMessage = 'Still processing. Keep this open and we will update automatically.';
        if (!instance.fallbackTracked) {
          instance.fallbackTracked = true;
          trackEvent(instance, 'reveal_fallback_shown', {
            generationJobId: instance.generationJobId,
          });
        }
        render(instance);
      }
    }, 15000);

    function handleSucceeded(payload) {
      clearPolling(instance);
      if (isEmailDeliveryOnly(instance)) {
        instance.state = 'email_delivery';
        instance.stateMessage = '';
        render(instance);
        trackEvent(instance, 'email_delivery_confirmed', {
          generationJobId: instance.generationJobId,
        });
        return;
      }

      instance.revealBeforeUrl =
        (payload.preview && payload.preview.originalUploadUrl) ||
        (instance.upload ? instance.upload.previewUrl : null);
      instance.revealAfterUrl = payload.preview.generatedPreviewUrl;
      instance.state = 'reveal';
      instance.stateMessage = '';
      render(instance);
      trackEvent(instance, 'reveal_rendered', {
        generationJobId: instance.generationJobId,
      });
    }

    function handleFailed(payload) {
      clearPolling(instance);
      instance.state = 'error';
      var reference =
        payload &&
        payload.generationJob &&
        payload.generationJob.errorReference
          ? ' Reference: ' + payload.generationJob.errorReference + '.'
          : '';
      instance.lastError = 'Visualization could not be completed. Please try another photo.' + reference;
      render(instance);
      trackEvent(instance, 'generation_failed', {
        generationJobId: instance.generationJobId,
      });
    }

    function handleEmailDeliveryFailed() {
      clearPolling(instance);
      instance.state = 'error';
      instance.lastError =
        'Your visualization was created, but we could not email it. Please try again or use a different email address.';
      render(instance);
      trackEvent(instance, 'email_delivery_failed', {
        generationJobId: instance.generationJobId,
      });
    }

    function pollOnce() {
      requestJson(
        '/api/public/widget/generation-status?embedKey=' +
          encodeURIComponent(instance.resolvedEmbedKey) +
          '&generationJobId=' +
          encodeURIComponent(instance.generationJobId) +
          '&pageUrl=' +
          encodeURIComponent(instance.pageUrl),
      )
        .then(function (response) {
          if (!response.ok || !response.data || !response.data.generationJob) {
            return;
          }

          var payload = response.data;
          var status = payload.generationJob.status;

          if (status === 'succeeded' && isEmailDeliveryOnly(instance)) {
            var emailStatus = payload.lead && payload.lead.emailStatus;
            if (emailStatus === 'sent') {
              handleSucceeded(payload);
              return;
            }
            if (emailStatus === 'failed') {
              handleEmailDeliveryFailed();
              return;
            }
            return;
          }

          if (
            status === 'succeeded' &&
            payload.preview &&
            typeof payload.preview.generatedPreviewUrl === 'string' &&
            payload.preview.generatedPreviewUrl
          ) {
            handleSucceeded(payload);
            return;
          }

          if (status === 'failed') {
            handleFailed(payload);
            return;
          }

          var elapsed = Date.now() - (instance.pollingStartedAt || Date.now());
          if (isEmailDeliveryOnly(instance) && elapsed >= 180000) {
            clearPolling(instance);
            instance.state = 'error';
            instance.lastError =
              'We created your visualization, but could not confirm the email was sent. Please check your inbox or try again.';
            render(instance);
            trackEvent(instance, 'email_delivery_failed', {
              generationJobId: instance.generationJobId,
              reason: 'timeout',
            });
            return;
          }

          if (isEmailDeliveryOnly(instance) && elapsed >= 60000) {
            instance.state = 'fallback';
            instance.stateMessage = 'Your preview is still processing. We will email it as soon as it is ready.';
            if (!instance.fallbackTracked) {
              instance.fallbackTracked = true;
              trackEvent(instance, 'reveal_fallback_shown', {
                generationJobId: instance.generationJobId,
                reason: 'email_delivery_pending',
              });
            }
            render(instance);
            return;
          }

          if (elapsed >= 60000 && (instance.state === 'generating' || instance.state === 'fallback')) {
            clearPolling(instance);
            instance.state = 'fallback';
            instance.stateMessage = 'Preview is still processing. We will keep checking if you stay on this page.';
            if (!instance.fallbackTracked) {
              instance.fallbackTracked = true;
              trackEvent(instance, 'reveal_fallback_shown', {
                generationJobId: instance.generationJobId,
                reason: 'timeout',
              });
            }
            render(instance);
          }
        })
        .catch(function () {
          // Keep polling until timeout.
        });
    }

    pollOnce();
    instance.pollingTimer = setInterval(pollOnce, 2000);
  }

  function submitGeneration(instance, emailValue) {
    if (!instance.upload || !instance.upload.id) {
      instance.stateMessage = 'Upload a photo before continuing.';
      render(instance);
      return;
    }

    if (!instance.selectedMaterialId) {
      instance.stateMessage = 'Choose an option before continuing.';
      render(instance);
      return;
    }

    if (instance.widgetConfig.requireEmail) {
      if (!emailLooksValid(emailValue || '')) {
        instance.stateMessage = 'Enter a valid email address to continue.';
        render(instance);
        return;
      }
      instance.emailDraft = emailValue;
      trackEvent(instance, 'email_submitted', {
        mode: 'required',
      });
    }

    if (instance.capped && !instance.captchaToken) {
      instance.stateMessage = 'Complete verification before requesting a preview.';
      render(instance);
      return;
    }

    setState(instance, 'generating', {
      stateMessage: '',
      lastError: '',
    });

    requestJson('/api/public/widget/generate', {
      method: 'POST',
      body: {
        embedKey: instance.resolvedEmbedKey,
        email: instance.widgetConfig.requireEmail ? instance.emailDraft : null,
        sessionId: instance.session ? instance.session.id : null,
        sessionToken: instance.session ? instance.session.token : null,
        captchaToken: instance.capped ? instance.captchaToken : null,
        materialId: instance.selectedMaterialId,
        sourcePage: instance.pageUrl,
        uploadId: instance.upload.id,
      },
    })
      .then(function (response) {
        if (!response.ok) {
          var code = response.data ? response.data.code : null;

          if (response.status === 401 && code === 'invalid_session') {
            clearStoredSession(instance.resolvedEmbedKey);
            instance.session = null;
            instance.state = 'error';
            instance.lastError = 'Session expired. Please try again.';
            render(instance);
            return;
          }

          if (response.status === 429 && code === 'generation_limit_reached') {
            instance.state = 'fallback';
            instance.stateMessage =
              (response.data && response.data.message) ||
              'Preview limit reached. Contact this business for more previews.';
            render(instance);
            return;
          }

          if (response.status === 429 && code === 'quota_exceeded') {
            instance.state = 'fallback';
            instance.stateMessage =
              (response.data && response.data.message) ||
              'Preview quota is currently exceeded. Please try again later.';
            render(instance);
            return;
          }

          if (response.status === 400 && (code === 'captcha_required' || code === 'captcha_failed')) {
            instance.state = instance.widgetConfig.requireEmail ? 'email_gate' : 'select';
            instance.stateMessage =
              code === 'captcha_required'
                ? 'Verification is required before requesting a preview.'
                : 'Verification failed. Please try again.';
            resetTurnstile(instance);
            render(instance);
            return;
          }

          instance.state = 'error';
          instance.lastError =
            (response.data && (response.data.message || response.data.error)) ||
            'Unable to submit your request right now.';
          render(instance);
          trackEvent(instance, 'generation_failed', {
            reason: code || 'request_failed',
          });
          return;
        }

        if (response.data && response.data.lead && response.data.lead.id) {
          instance.emailCaptured = true;
        }

        if (!response.data || !response.data.generationJob || !response.data.generationJob.id) {
          instance.state = 'error';
          instance.lastError = 'Generation job could not be created.';
          render(instance);
          return;
        }

        instance.generationJobId = response.data.generationJob.id;
        trackEvent(instance, 'generation_requested', {
          generationJobId: instance.generationJobId,
          materialId: instance.selectedMaterialId,
        });
        startPollingGeneration(instance);
      })
      .catch(function () {
        instance.state = 'error';
        instance.lastError = 'Unable to submit your request right now.';
        render(instance);
      })
      .finally(function () {
        resetTurnstile(instance);
      });
  }

  function handleUpload(instance, file) {
    if (!file) {
      return;
    }

    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      instance.stateMessage = 'Unsupported file type. Use JPG, PNG, or WebP.';
      render(instance);
      return;
    }

    if (file.size < 1 || file.size > 10 * 1024 * 1024) {
      instance.stateMessage = 'File must be between 1 byte and 10 MB.';
      render(instance);
      return;
    }

    trackEvent(instance, 'upload_started', {
      fileName: file.name || null,
      fileSize: file.size,
    });

    instance.uploadInProgress = true;
    instance.stateMessage = '';
    render(instance);

    ensureSession(instance, false)
      .then(function (session) {
        if (instance.capped && (!session || !session.token)) {
          throw new Error('Unable to create a valid session for upload.');
        }

        var formData = new FormData();
        formData.append('embedKey', instance.resolvedEmbedKey);
        formData.append('pageUrl', instance.pageUrl);
        if (session && session.id) {
          formData.append('sessionId', session.id);
        }
        formData.append('file', file);

        return requestMultipart('/api/public/widget/upload', formData);
      })
      .then(function (response) {
        if (!response.ok || !response.data || !response.data.upload) {
          var uploadError =
            (response.data && (response.data.message || response.data.error)) ||
            'Unable to upload image.';
          throw new Error(uploadError);
        }

        clearPreviewObjectUrl(instance);
        instance.previewObjectUrl = URL.createObjectURL(file);
        instance.upload = {
          id: response.data.upload.id,
          name: file.name || 'uploaded-image',
          previewUrl: instance.previewObjectUrl,
          mimeType: file.type,
          size: file.size,
        };
        instance.uploadInProgress = false;
        instance.stateMessage = '';
        trackEvent(instance, 'upload_completed', {
          uploadId: instance.upload.id,
        });
        setState(instance, 'select');
      })
      .catch(function (error) {
        instance.uploadInProgress = false;
        instance.stateMessage = error && error.message ? error.message : 'Unable to upload image.';
        render(instance);
      });
  }

  function restartFlow(instance) {
    clearPolling(instance);
    resetTurnstile(instance);
    instance.stateMessage = '';
    instance.lastError = '';
    instance.optionalEmailMessage = '';
    instance.emailCaptured = false;
    instance.generationJobId = null;
    instance.revealBeforeUrl = null;
    instance.revealAfterUrl = null;
    instance.comparePercent = 50;
    instance.emailDraft = '';
    instance.selectedMaterialId = null;
    instance.upload = null;
    instance.uploadInProgress = false;
    clearPreviewObjectUrl(instance);
    setState(instance, 'upload');
  }

  function wireInteractions(instance) {
    var root = getRenderRoot(instance);
    if (!root) {
      return;
    }

    applyStateMessage(root, instance.stateMessage, instance.state === 'error' ? 'error' : 'info');

    var restartButton = root.querySelector('[data-role="restart"]');
    if (restartButton) {
      restartButton.addEventListener('click', function () {
        restartFlow(instance);
      });
    }

    if (instance.state === 'upload') {
      var fileInput = root.querySelector('[data-role="file-input"]');
      var dropZone = root.querySelector('[data-role="drop-zone"]');
      var toSelectButton = root.querySelector('[data-role="to-select"]');

      if (fileInput) {
        fileInput.addEventListener('change', function (event) {
          var file = event.target && event.target.files ? event.target.files[0] : null;
          handleUpload(instance, file);
        });
      }

      if (dropZone) {
        dropZone.addEventListener('dragover', function (event) {
          event.preventDefault();
          dropZone.classList.add('vz-drop-active');
        });
        dropZone.addEventListener('dragenter', function (event) {
          event.preventDefault();
          dropZone.classList.add('vz-drop-active');
        });
        dropZone.addEventListener('dragleave', function (event) {
          if (event.target === dropZone) {
            dropZone.classList.remove('vz-drop-active');
          }
        });
        dropZone.addEventListener('drop', function (event) {
          event.preventDefault();
          dropZone.classList.remove('vz-drop-active');
          var dropped = event.dataTransfer && event.dataTransfer.files ? event.dataTransfer.files[0] : null;
          handleUpload(instance, dropped);
        });
      }

      if (toSelectButton) {
        toSelectButton.addEventListener('click', function () {
          if (instance.upload) {
            setState(instance, 'select');
          }
        });
      }
    }

    if (instance.state === 'select') {
      var materialButtons = root.querySelectorAll('[data-role="material"]');
      Array.prototype.forEach.call(materialButtons, function (button) {
        button.addEventListener('click', function () {
          var materialId = button.getAttribute('data-id');
          if (!materialId) {
            return;
          }
          instance.selectedMaterialId = materialId;
          trackEvent(instance, 'material_selected', {
            materialId: materialId,
          });
          render(instance);
        });
      });

      var backUpload = root.querySelector('[data-role="back-upload"]');
      if (backUpload) {
        backUpload.addEventListener('click', function () {
          setState(instance, 'upload');
        });
      }

      var continueSelect = root.querySelector('[data-role="continue-select"]');
      if (continueSelect) {
        continueSelect.addEventListener('click', function () {
          if (!instance.selectedMaterialId) {
            return;
          }

          if (instance.widgetConfig.requireEmail) {
            setState(instance, 'email_gate', {
              stateMessage: '',
            });
          } else {
            submitGeneration(instance, null);
          }
        });
      }

      if (instance.capped && !instance.widgetConfig.requireEmail) {
        wireTurnstile(instance);
      }
    }

    if (instance.state === 'email_gate') {
      var emailInput = root.querySelector('[data-role="email-input"]');
      var emailForm = root.querySelector('[data-role="email-form"]');
      var backSelect = root.querySelector('[data-role="back-select"]');

      if (emailInput) {
        emailInput.addEventListener('input', function (event) {
          instance.emailDraft = event.target && event.target.value ? event.target.value.trim() : '';
        });
      }

      if (backSelect) {
        backSelect.addEventListener('click', function () {
          setState(instance, 'select', {
            stateMessage: '',
          });
        });
      }

      if (emailForm) {
        emailForm.addEventListener('submit', function (event) {
          event.preventDefault();
          var value = emailInput && emailInput.value ? emailInput.value.trim() : '';
          submitGeneration(instance, value);
        });
      }

      if (instance.capped) {
        wireTurnstile(instance);
      }
    }

    if (instance.state === 'reveal' || instance.state === 'fallback') {
      var compare = root.querySelector('[data-role="compare"]');
      var handle = root.querySelector('[data-role="compare-handle"]');
      if (compare) {
        var dragging = false;

        var setPct = function (pct) {
          pct = Math.max(0, Math.min(100, pct));
          instance.comparePercent = pct;
          compare.style.setProperty('--vz-pos', pct + '%');
          if (handle) {
            handle.setAttribute('aria-valuenow', String(Math.round(pct)));
          }
        };

        var setFromClientX = function (clientX) {
          var rect = compare.getBoundingClientRect();
          if (!rect.width) {
            return;
          }
          setPct(((clientX - rect.left) / rect.width) * 100);
        };

        compare.addEventListener('pointerdown', function (event) {
          dragging = true;
          if (compare.setPointerCapture) {
            try {
              compare.setPointerCapture(event.pointerId);
            } catch {
              // Capture is best-effort.
            }
          }
          setFromClientX(event.clientX);
          event.preventDefault();
        });
        compare.addEventListener('pointermove', function (event) {
          if (dragging) {
            setFromClientX(event.clientX);
          }
        });
        var endDrag = function () {
          dragging = false;
        };
        compare.addEventListener('pointerup', endDrag);
        compare.addEventListener('pointercancel', endDrag);

        if (handle) {
          handle.addEventListener('keydown', function (event) {
            var step = event.shiftKey ? 10 : 4;
            var current = typeof instance.comparePercent === 'number' ? instance.comparePercent : 50;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
              setPct(current - step);
              event.preventDefault();
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
              setPct(current + step);
              event.preventDefault();
            } else if (event.key === 'Home') {
              setPct(0);
              event.preventDefault();
            } else if (event.key === 'End') {
              setPct(100);
              event.preventDefault();
            }
          });
        }
      }

      var optionalForm = root.querySelector('[data-role="optional-email-form"]');
      var optionalInput = root.querySelector('[data-role="optional-email-input"]');
      if (optionalForm && optionalInput) {
        optionalForm.addEventListener('submit', function (event) {
          event.preventDefault();
          var optionalValue = optionalInput.value ? optionalInput.value.trim() : '';
          submitOptionalEmail(instance, optionalValue);
        });
      }
    }
  }

  function render(instance) {
    var root = getRenderRoot(instance);
    if (!root) {
      return;
    }

    if (!instance.widgetConfig || instance.state === 'loading') {
      root.innerHTML = renderLoadingState();
      return;
    }

    var stateHtml = '';

    if (instance.state === 'upload') {
      stateHtml = renderUploadState(instance);
    } else if (instance.state === 'select') {
      stateHtml = renderSelectState(instance);
    } else if (instance.state === 'email_gate') {
      stateHtml = renderEmailGateState(instance);
    } else if (instance.state === 'generating') {
      stateHtml = renderGeneratingState(instance, false);
    } else if (instance.state === 'fallback') {
      stateHtml = renderGeneratingState(instance, true);
    } else if (instance.state === 'email_delivery') {
      stateHtml = renderEmailDeliveryState(instance);
    } else if (instance.state === 'reveal') {
      stateHtml = renderRevealState(instance);
    } else if (instance.state === 'error') {
      stateHtml = renderErrorState(instance);
    } else {
      stateHtml = renderUploadState(instance);
    }

    root.innerHTML = renderBaseFrame(instance, stateHtml);
    wireInteractions(instance);
  }

  function initializeInstance(instance) {
    ensureStyles();

    if (instance.target) {
      instance.renderRoot = instance.target;
      instance.renderRoot.innerHTML = renderLoadingState();
    }

    return loadConfig(instance)
      .then(function (configPayload) {
        if (!configPayload) {
          throw new Error('Widget configuration could not be loaded.');
        }

        instance.widgetConfig = {
          id: configPayload.widget.id,
          name: configPayload.widget.name,
          embedKey: configPayload.widget.embedKey || instance.embedKey,
          mode: configPayload.widget.mode || 'inline',
          theme: configPayload.widget.theme || 'dark',
          subjectType: configPayload.widget.subjectType || 'generic',
          brandColor: configPayload.widget.brandColor || '#10B981',
          uiVersion: configPayload.widget.uiVersion || 'v2',
          requireEmail: !!configPayload.widget.requireEmail,
          deliveryMode: configPayload.widget.deliveryMode === 'email' ? 'email' : 'instant',
          autoOpenWidget: !!configPayload.widget.autoOpenWidget,
          showProductNames: !!configPayload.widget.showProductNames,
          maxGenerationsPerSession: configPayload.widget.maxGenerationsPerSession,
          maxGenerationsPerEmailLifetime: configPayload.widget.maxGenerationsPerEmailLifetime,
          limitReachedCtaUrl: configPayload.widget.limitReachedCtaUrl || null,
          materials: Array.isArray(configPayload.widget.materials)
            ? configPayload.widget.materials
            : [],
        };
        instance.turnstileSiteKey = configPayload.turnstileSiteKey || null;
        instance.capped = hasGenerationCap(instance.widgetConfig);
        instance.resolvedEmbedKey = instance.widgetConfig.embedKey || instance.embedKey;

        if (!instance.resolvedEmbedKey) {
          throw new Error('Widget configuration is missing an embed key.');
        }

        if (instance.widgetConfig.mode === 'popup') {
          ensurePopupMount(instance);
        } else {
          if (!instance.target) {
            throw new Error('Inline mode requires a target element.');
          }
          instance.renderRoot = instance.target;
        }

        return ensureSession(instance, false);
      })
      .then(function (session) {
        if (instance.capped && (!session || !session.token)) {
          throw new Error('Unable to start a session for this widget.');
        }

        instance.state = 'upload';
        instance.stateMessage = '';

        if (instance.widgetConfig.mode === 'popup') {
          if (instance.widgetConfig.autoOpenWidget) {
            openPopup(instance);
          }
        } else {
          render(instance);
          trackEvent(instance, 'widget_opened', {
            mode: 'inline',
          });
        }
      })
      .catch(function (error) {
        var message = error && error.message ? error.message : 'Unable to load widget.';
        var root = getRenderRoot(instance) || instance.target;
        if (root) {
          root.innerHTML =
            '<div class="vz-shell"><p class="vz-title" style="margin-bottom:8px">Widget unavailable</p><p class="vz-subtitle" style="color:#fca5a5">' +
            escapeHtml(message) +
            '</p></div>';
        }
      });
  }

  function init(options) {
    var normalized = options || {};
    var target = normalizeTarget(normalized.target);
    var embedKey = typeof normalized.embedKey === 'string' ? normalized.embedKey.trim() : '';
    var industrySlug = typeof normalized.industrySlug === 'string' ? normalized.industrySlug.trim() : '';

    if (!embedKey && !industrySlug) {
      console.error('[VizzionWidget] init failed: embedKey or industrySlug is required.');
      return;
    }

    var instance = createInstance(
      {
        embedKey: embedKey,
        industrySlug: industrySlug,
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
