// background.js —— 强制在所有 hcf2023.top 请求中发送完整 Client Hints

const FULL_CLIENT_HINTS = {
    "Sec-CH-UA": '"Google Chrome";v="129", "Not=A?Brand";v="99"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"macOS"',
    "Sec-CH-UA-Platform-Version": '"15.0.0"',  // 必须！macOS 版本
    "Sec-CH-UA-Arch": '"x86"',                 // 必须！架构
    "Sec-CH-UA-Model": '""',                   // macOS 通常为空
    "Sec-CH-UA-Full-Version-List": '"Google Chrome";v="129.0.0.0", "Not=A?Brand";v="99.0.0.0"'
};

browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        // 仅处理 hcf2023.top
        if (!details.url.includes('hcf2023.top')) return;

        // 移除原始 CH 头（防止 Windows 泄露）
        let headers = details.requestHeaders.filter(h => !h.name.startsWith("Sec-CH-"));

        // 注入完整的 macOS Client Hints
        for (let [name, value] of Object.entries(FULL_CLIENT_HINTS)) {
            headers.push({ name, value });
        }

        return { requestHeaders: headers };
    },
    { urls: ["*://hcf2023.top/*"] },
    ["blocking", "requestHeaders"]
);