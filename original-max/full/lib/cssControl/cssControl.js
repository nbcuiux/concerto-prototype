function findCssLink(cssFileName) {
    var cssLink = [].slice.call(document.getElementsByTagName('link')).filter(function(l) {
        return l.href.includes(cssFileName);
    })[0];

    return cssLink;
}
function switchCssOn(cssFileName) {
    cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = cssFileName;
    document.getElementsByTagName("head").item(0).appendChild(cssLink);
    if (cssFileName === 'app-s.css') {document.body.classList.add('t-style');}
    if (cssFileName === 'app-a.css') {document.body.classList.add('t-animation');}

}
function switchCssOff(cssFileName) {
    var cssLink = findCssLink(cssFileName);
    if (cssLink) {
        cssLink.parentNode.removeChild(cssLink);
    }
    if (cssFileName === 'app-s.css') {document.body.classList.remove('t-style');}
    if (cssFileName === 'app-a.css') {document.body.classList.remove('t-animation');}
}


function handleCssToggleClick(e) {
    var cssId = e.target.id.split('_')[0],
        cssFileName = 'app-' + cssId.split('-')[1].slice(0,1) + '.css',
        cssState = window.localStorage.getItem(cssId);

    if (cssState === 'off' || !cssState) {
        switchCssOn(cssFileName);
        window.localStorage.setItem(cssId, 'on');
    } else if (cssState === 'on') {
        switchCssOff(cssFileName);
        window.localStorage.setItem(cssId, 'off');
    }
}

function initializeCss() {
    var layout = window.localStorage.getItem('css-layout'),
        layoutFileName = 'app-l.css',
        layoutLink = findCssLink(layoutFileName),

        style = window.localStorage.getItem('css-style'),
        styleFileName = 'app-s.css',
        styleLink = findCssLink(styleFileName),

        animation = window.localStorage.getItem('css-animation'),
        animationFileName = 'app-a.css',
        animationLink = findCssLink(animationFileName);

    if (style === 'on' && !styleLink) {
        switchCssOn(styleFileName);
    } else if (style === 'off' && styleLink) {
        switchCssOff(styleFileName);
    }
    if (animation === 'on' && !animationLink) {
        switchCssOn(animationFileName);
    } else if (animation === 'off' && animationLink) {
        switchCssOff(animationFileName);
    }
}
function initCssControls() {
    var controlsPanel = document.createElement('div'),
        styleCheckbox = document.createElement('input'),
        animationCheckbox = document.createElement('input');

    controlsPanel.classList.add('cc__panel');

    styleCheckbox.type = 'checkbox';
    styleCheckbox.id = 'css-style_checkbox';
    styleCheckbox.title = 'Switch styles on/off';
    styleCheckbox.checked = findCssLink('app-s.css') ? true : false;
    styleCheckbox.classList.add('cc__toggle', 'cc__style-toggle');
    styleCheckbox.addEventListener('click', handleCssToggleClick);

    animationCheckbox.type = 'checkbox';
    animationCheckbox.id = 'css-animation_checkbox';
    animationCheckbox.title = 'Switch animation on/off';
    animationCheckbox.checked = findCssLink('app-a.css') ? true : false;
    animationCheckbox.classList.add('cc__toggle', 'cc__animation-toggle');
    animationCheckbox.addEventListener('click', handleCssToggleClick);

    controlsPanel.appendChild(styleCheckbox);
    controlsPanel.appendChild(animationCheckbox);
    document.body.appendChild(controlsPanel);
}

function init() {
    initializeCss();
    initCssControls();
}

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    init();
  }
};
