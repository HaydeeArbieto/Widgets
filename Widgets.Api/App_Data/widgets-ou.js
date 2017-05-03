
let widgetDelay;
let shownWidgets = new Map();

$.fn.ungapped.timers = [];

$.fn.ungapped.user = {
    sessionStarted: null,
    pageLoaded: new Date(),
    contactId: null,
    newVisitor: null
};

const ready = (fn) => {
     var d = document; (d.readyState == 'loading') ? d.addEventListener('DOMContentLoaded', fn) : fn(); 
}

ready(function () {
    init();
    setupWidgets();
});

const init = () => {
    $.fn.ungapped.user.sessionStarted = getCookie('ungapped_session_started') || null;
    if ($.fn.ungapped.user.sessionStarted == null) {
        $.fn.ungapped.user.sessionStarted = new Date();
        setCookie('ungapped_session_started', $.fn.ungapped.user.sessionStarted);
    } else 
        $.fn.ungapped.user.sessionStarted = new Date($.fn.ungapped.user.sessionStarted);

    // Check contactId
    var contactId = getQueryVariable("utm_custom[ungapped]");
    if (contactId) {
        setCookie('ungapped_contact_Id', $.fn.ungapped.user.contactId);
        console.log("JA", getCookie('ungapped_contact_Id'));
    }
    $.fn.ungapped.user.contactId = getCookie('ungapped_contact_Id') || null;

    // Set cookie for return visitor
    /*var contactId = getQueryVariable("utm_custom[ungapped]");
    if (contactId) 
         setCookie('ungapped_contact_Id', $.fn.ungapped.user.contactId);*/

    $.fn.ungapped.user.newVisitor = getCookie('ungapped_new_visitor');
    if ($.fn.ungapped.user.newVisitor == null || $.fn.ungapped.user.newVisitor == undefined) {
        setCookie('ungapped_new_visitor', $.fn.ungapped.user.newVisitor, 86400); //en dag
        console.log("new visitor", getCookie('ungapped_new_visitor'));
    } else
        console.log("Is not a returning visitor", getCookie("ungapped_new_visitor"));
}

const setupWidgets = () => {
    
    // Setup all widgets to run on load, scroll and timer events
    $.fn.ungapped.settings.widgets.forEach(function (widget) {
        console.log("Setting up widget: ", widget);
       
        widget.triggers.forEach(function (trigger) {
            switch (trigger.type.toLowerCase()) {
                case 'url':
                case 'referrer':
                    console.log('Found widget for onready', widget);
                    window.addEventListener("load", function () {
                        runWidget(widget)
                    });
                    break;
                case 'scroll':
                case 'scrollintoview':
                    console.log('Found widget for scroll', widget);
                    window.addEventListener('scroll', function() {
                        clearTimeout($.fn.ungapped.timers[widget.widgetId]);
                        $.fn.ungapped.timers[widget.widgetId] = setTimeout(function () {
                            runWidget(widget)
                        }, 300);
                    });
                    break;
                case 'timeonpage':
                case 'timeonsite':
                    console.log('Found widget for timer', widget);
                    setInterval(function () {
                        runWidget(widget)
                    }, 1000);
                    break;
                case 'exitintent':
                    console.log('Found widget for exit intent', widget);
                    $(document).on('mouseleave', function (e) {
                        if( e.clientY < 0 ) {
                            runWidget(widget);
                        }
                    });
                    break;
                }
            });
     });
}

const runWidget = (widget) => {
    // Check if ANY audience is true
    var inAudience = checkAudiences(widget.audiences);
    console.log("inAudience", inAudience);
    if (!inAudience)
        return;

    // Check if ANY trigger is true
    var triggered = checkTriggers(widget.triggers);
    console.log("triggered", triggered);
    if (!triggered)
        return;

    // Check recurrence
    var recurrence = checkRecurrences(widget);
    console.log("recurrence:", recurrence);
    if (!recurrence)
        return;

    showWidget(widget);
};

const checkTriggers = (triggers) => {
    console.log('Checking triggers', triggers);

    if (triggers === null || triggers.length === 0)
        return false;

    for (var i = 0; i < triggers.length; i++)
        if (checkTrigger(triggers[i])) {
            return true;
        }
    return false;
};

const checkTrigger = (trigger) => {
    console.log('Checking ONE trigger', trigger);

    widgetDelay = (trigger.delay) * 1000;
   
    switch (trigger.type) {
        case 'TimeOnPage':
            var time = new Date().getTime();
            var timeOnPage = $.fn.ungapped.user.pageLoaded.getTime();
            console.log('Time on page', time, timeOnPage, trigger.time, time - timeOnPage / 1000);
            return ((time - timeOnPage) / 1000 > trigger.time);
        case 'Url':
            return (location.href.match(trigger.pattern));
        case 'Referrer':
            console.log('Current referrer: ', document.referrer);
            return document.referrer.match(trigger.pattern);
        case 'TimeOnSite':
            var time = new Date().getTime();
            var timeOnSite = $.fn.ungapped.user.sessionStarted.getTime();
            return ((time - timeOnSite)/1000 > trigger.time);
        case 'ExitIntent':
            return true;
        case 'Scroll':
            const getDocHeight = () => {
                return Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                )
            }
            let docHeight = getDocHeight()
            let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
            var winHeight = window.innerHeight || (document.documentElement || document.body).clientHeight;
            let scrollPercent = (scrollTop) / (docHeight - winHeight);
            let scrollPercentRounded = Math.round(scrollPercent * 100);
            console.log("scrollPercent", scrollPercentRounded);
            return (scrollPercentRounded >= trigger.scroll);
        case 'ScrollIntoView':
            let selector = document.querySelector(trigger.selector);
            console.log("selectorWidget", selector);
            
            let lastScrollTop = 0;
            selector = window.pageYOffset || document.documentElement.scrollTop;
            return ((((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) && (selector >= lastScrollTop)) 
    }
    return false;
};

const checkAudiences = (audiences) => {
    if (audiences === null || audiences.length === 0)
        return false;

    for (var i = 0; i < audiences.length; i++)
        if (checkAudience(audiences[i]))
            return true;
    return false;
};

const checkAudience = (audience) => {
    console.log('checking audience', audience);
    switch (audience.type) {
        case 'UserAgent':
            console.log('audience', audience.pattern, navigator.userAgent)
            return new RegExp(audience.pattern).test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !(/OPR/.test(navigator.userAgent));
        case 'NewVisitor':
            //deleteCookie('ungapped_new_visitor');
            console.log("newVisitor: ", getCookie($.fn.ungapped.user.newVisitor));
            return $.fn.ungapped.user.newVisitor == null;
        case 'ReturningVisitor':
            if (!$.fn.ungapped.user.newVisitor)
                return true;
        case 'IsAnonymous':
            return $.fn.ungapped.user.contactId === null;
        case 'IsIdentified':
            return $.fn.ungapped.user.contactId !== null;
    }
    return false;
};

const checkRecurrences = (widget) => {
    console.log('recurring', widget);
    var recurrences = widget.recurrences;
    if (recurrences === null || recurrences.length === 0)
        return false;

    for (let i = 0; i < recurrences.length; i++)
        if (checkRecurrence(widget, recurrences[i]))
            return true;
    return false;
};

const checkRecurrence = (widget, recurrence) => {
    switch (recurrence.type) {
        case 'page':
            return shownWidgets[widget.widgetId] !== true;
        case 'once':
            $.fn.ungapped.user.userName = setCookie('ungapped_user', $.fn.ungapped.user.userName, 1);
            //if (document.cookie.replace(/(?:(?:^|.*;\s*)cookieName\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
            //    document.cookie = "cookieName==true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
            //}
            return $.fn.ungapped.user.userName;
        case 'repeat': //X
            return getCookie("ungapped_user");
        case 'session': // ej expiration datum...
            return $.fn.ungapped.user.sessionStarted;
        case 'expires': //max-age : sekunder
            let expires = (recurrence.days * 24 * 60 * 60) + (recurrence.hours * 60 * 60) + (recurrence.minutes * 60) + recurrence.seconds;
            let expiresUser = setCookie("ungapped_user", $.fn.ungapped.user.sessionStarted, expires);
            //return getCookie(expiresUser);
            return true;
    }
    return false;
};

const showWidget = (widget) => {
    var widgetId = widget.widgetId;
    if (shownWidgets.get(widgetId) === true)
        return;

    //Shown widgets 
    shownWidgets.set(widgetId, true);
    
    switch (widget.type) {
        case 'Modal':
            setTimeout(function () {
                showModal(widget);
            }, widgetDelay);
            break;
        case 'Banner':
            showBanner(widget);
            break;
        case 'CallOut':
            setTimeout(function () {
                showCallout(widget);
            }, widgetDelay);
            break;
    }
};

const showModal = (widget) => {
    //let backdrop = document.createElement('div');
    let backdrop = $('<div>')
        .css({ height: '100%', width: '100%', position: 'fixed', top: 0, zIndex: 999 })
        .css('background-color', 'rgba(126,126,126,0.5)')
        .css(widget.backdropCss);

    //let modal = document.createElement('div')
    let modal = $('<div>')
        .css('margin', 'auto')
        .css(widget.css)
        .appendTo(backdrop);

    //let iframe = document.createElement('iframe');
    let iframe = $('<iframe width="100%" height="100%" frameborder="0" border="0">')
           .attr('src', widget.contentUrl)
           .css(widget.css)
           .appendTo(modal);
    $('body').append(backdrop);

    let closeButton = $('<input type="button" value="Close" id="close"/>')
          .appendTo(modal);

    $('#close').click(function () {
        backdrop.remove();
    });
}

const showBanner = (widget) => {
    let backdrop = $('<div>')
        .css({ height: '50%', width: '100%', position: 'relative' })
        .css(widget.position);

    let bannerDialog = $('<div>')
        .css('margin', 'auto')
        .css(widget.css)
        .appendTo(backdrop);

    let bannerContent = $('<iframe width ="100%" height="50%">')
         .attr("src", widget.contentUrl)
         .appendTo(bannerDialog);
    $('body').append(backdrop)
};

const showCallout = (widget) => {
    let backdrop = $('<div>')
        .css({ top: 0, position: 'absolute' })
        .css(widget.position)

    let callOutDialog = $('<div>')
        .css('margin', 'auto')
        .css(widget.css)
        .appendTo(backdrop);

    let callOutContent = $('<iframe width="100%" height="100%">')
        .attr("src", widget.contentUrl)
        .appendTo(callOutDialog);
    $('body').append(backdrop);
};

const setCookie = (cookieName, cookieValue, expiresDays) => {
    var date = new Date();
    date.setTime(date.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    return document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
};

const getCookie = (name) => {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
};

const deleteCookie = (name) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

const getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=', 2);
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}