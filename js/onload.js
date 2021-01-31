function isItIE() {
    let user_agent = navigator.userAgent;
    return user_agent.indexOf("MSIE ") > -1 || user_agent.indexOf("Trident/") > -1;
}

function browser_check() {
    if (isItIE()) {
        console.log('It is Internet Explorer');
        window.location = "IE_sucks.html"
    } else {
        console.log('It is not Internet Explorer');
    }
}

browser_check();