var settings = {};

settings.IS_MVP = false;

if (typeof module !== 'undefined' && module.exports) {
        module.exports = settings;
} else {
        window.settings = settings;
}