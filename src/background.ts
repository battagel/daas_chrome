// To add a site to Antonium do the following:
// 1. Add a rule (background.js)
// 2. Add the site to the active_sites list (backgorund.js)
// 3. Add host_permissions for site (manifest.json)

chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed")
    chrome.action.disable();

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        let stackoverflowRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'stackoverflow.com' },
                }),
            ],
            actions: [
                new chrome.declarativeContent.ShowAction(),
            ],
        };
        let confluenceRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'confluence.eng.nimblestorage.com' },
                }),
            ],
            actions: [
                new chrome.declarativeContent.ShowAction(),
            ],
        };
        let rndwikiRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'rndwiki-pro.its.hpecorp.net' },
                }),
            ],
            actions: [
                new chrome.declarativeContent.ShowAction(),
            ],
        };

        let rules = [stackoverflowRule, confluenceRule, rndwikiRule];
        chrome.declarativeContent.onPageChanged.addRules(rules);
    });
});

chrome.tabs.onUpdated.addListener(function (_, changeInfo, tab) {
    console.log("Updated")
    console.log(changeInfo)
    let active_sites = [
        "stackoverflow.com/questions/",
        "confluence.eng.nimblestorage.com/viewpage",
        "confluence.eng.nimblestorage.com/display",
        "rndwiki-pro.its.hpecorp.net/pages/viewpage",
        "rndwiki-pro.its.hpecorp.net/display"
    ]
    if (changeInfo.status == "complete" && tab.id !== undefined && tab.url != undefined) {
        let found = false
        for (var i = 0; i < active_sites.length; i++) {
            if (tab.url.includes(active_sites[i])) {
                found = true
                break
            }
        }
        if (found) {
            console.log("Antonium compatible site found")
            chrome.scripting.executeScript({
                files: ["contentscript.js"],
                target: { tabId: tab.id },
            });
        } else {
            console.log("URL incompatible with Antonium")
        }
    } else {
        console.warn("Incorrect onUpdated message")
    }
});
