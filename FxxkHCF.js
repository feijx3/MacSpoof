// ==UserScript==
// @name         FxxkHCF
// @namespace    https://hcf2023.top
// @match        *://hcf2023.top/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const fakeUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
    const fakePlatform = 'MacIntel';
    const fakeOscpu = 'Intel Mac OS X 10.15.7';

    const fakeUAData = {
        platform: 'macOS',
        architecture: 'x86',
        model: '',
        platformVersion: '15.0.0',
        fullVersionList: [{ brand: 'Safari', version: '17.0' }],
        mobile: false,
        getHighEntropyValues: () => Promise.resolve({
            platform: 'macOS',
            architecture: 'x86',
            platformVersion: '15.0.0',
            model: '',
            fullVersion: '17.0'
        })
    };
    console.log('[MacSpoof] Spoof UA')
    try {
        Object.defineProperties(navigator, {
            userAgent: { value: fakeUA, writable: false, configurable: false },
            platform: { value: fakePlatform, writable: false, configurable: false },
            oscpu: { value: fakeOscpu, writable: false, configurable: false }
        });
        Object.defineProperty(navigator, 'userAgentData', {
            value: fakeUAData,
            writable: false,
            configurable: false
        });
    } catch (e) {}

    if (typeof window.ApplePaySession === 'undefined') {
        function ApplePaySession(version, request) {
            this.version = version;
            this.request = request;
        }
        ApplePaySession.canMakePayments = () => true;
        ApplePaySession.supportsVersion = (v) => v <= 3;
        ApplePaySession.STATUS_SUCCESS = 0;
        ApplePaySession.STATUS_FAILURE = 1;

        Object.defineProperty(window, 'ApplePaySession', {
            value: ApplePaySession,
            writable: false,
            configurable: false,
            enumerable: true
        });
    }
    console.log('[MacSpoof] Spoof ApplePay')

    if (typeof window.safari === 'undefined') {
        const pushNotification = {
            permission: () => ({ permission: 'granted', deviceToken: null }),
            requestPermission: (name, domain, callback) => {
                const result = { permission: 'granted', deviceToken: null };
                if (typeof callback === 'function') callback(result);
                return result;
            }
        };
        const safari = { pushNotification: pushNotification };
        Object.defineProperty(window, 'safari', {
            value: safari,
            writable: false,
            configurable: false,
            enumerable: true
        });
    }

    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        const ctx = origGetContext.call(this, type, ...args);
        if ((type === 'webgl' || type === 'experimental-webgl') && ctx && ctx.getParameter) {
            const origGetParameter = ctx.getParameter;
            ctx.getParameter = function (pname) {
                switch (pname) {
                    case 0x1F00: return 'Apple Inc.';
                    case 0x1F01: return 'Apple GPU';
                    case 0x9246: return 'Apple Inc.';
                    case 0x9247: return 'Apple GPU';
                    default: return origGetParameter.call(this, pname);
                }
            };
        }
        return ctx;
    };

    console.log('[MacSpoof] Bypassed.');
})();
(function () {
    'use strict';

    const TARGET_TEXT = '受MacSpoof保护';
    console.log('[MacSpoof] Hide IP');
    const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'textContent');
    if (originalTextContentDescriptor && originalTextContentDescriptor.set) {
        const originalSet = originalTextContentDescriptor.set;
        Object.defineProperty(Element.prototype, 'textContent', {
            set(value) {
                if (this.id === 'userIP') {
 
                    return originalSet.call(this, TARGET_TEXT);
                }
                return originalSet.call(this, value);
            },
            get() {
                return originalTextContentDescriptor.get ? originalTextContentDescriptor.get.call(this) : '';
            },
            configurable: true
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
            if (mut.type === 'childList') {
                const el = document.getElementById('userIP');
                if (el && el.textContent !== TARGET_TEXT) {
                    el.textContent = TARGET_TEXT;
                }
            } else if (mut.type === 'attributes' && mut.target.id === 'userIP') {
                if (mut.target.textContent !== TARGET_TEXT) {
                    mut.target.textContent = TARGET_TEXT;
                }
            }
        }
    });

    observer.observe(document, { childList: true, subtree: true, attributes: true });

    if (document.getElementById('userIP')) {
        document.getElementById('userIP').textContent = TARGET_TEXT;
    }
})();
