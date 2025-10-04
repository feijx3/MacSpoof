const FULL_CLIENT_HINTS = {
    "Sec-CH-UA": '"Google Chrome";v="129", "Not=A?Brand";v="99"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"macOS"',
    "Sec-CH-UA-Platform-Version": '"15.0.0"',  
    "Sec-CH-UA-Arch": '"x86"',                
    "Sec-CH-UA-Model": '""',                  
    "Sec-CH-UA-Full-Version-List": '"Google Chrome";v="129.0.0.0", "Not=A?Brand";v="99.0.0.0"'
};

browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        if (!details.url.includes('hcf2023.top')) return;

        let headers = details.requestHeaders.filter(h => !h.name.startsWith("Sec-CH-"));

        for (let [name, value] of Object.entries(FULL_CLIENT_HINTS)) {
            headers.push({ name, value });
        }

        return { requestHeaders: headers };
    },
    { urls: ["*://hcf2023.top/*"] },
    ["blocking", "requestHeaders"]

);
