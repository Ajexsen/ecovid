function isItIE() {
    let user_agent = navigator.userAgent;
    return user_agent.indexOf("MSIE ") > -1 || user_agent.indexOf("Trident/") > -1;
}

function browser_check() {
    if (isItIE()) {
        console.log('It is Internet Explorer');
        window.location = "redirect_ie.html"
    }
}

browser_check();