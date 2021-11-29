class Translator {
    constructor(options = {}) {
        this._options = Object.assign({}, this.defaultConfig, options);
        this._lang = this.getLanguage();
        this._elements = document.querySelectorAll("[data-i18n]");
    }

    getLanguage() {
        if (!this._options.detectLanguage) {
            return this._options.defaultLanguage;
        }

        var stored = localStorage.getItem("language");

        if (this._options.persist && stored) {
            return stored;
        }

        var lang = navigator.languages ? navigator.languages[0] : navigator.language;

        return lang.substr(0, 2);
    }

    load(lang = null) {
        console.log("translator load", lang)

        if (lang) {
            if (!this._options.languages.includes(lang)) {
                return;
            }

            this._lang = lang;
        }

        var path = `${this._options.filesLocation}/${this._lang}.json`;
        console.log("path", path);
        fetch(path)
            .then((response) => response.json())
            .then((translation) => {
                this.translate(translation);
                this.toggleLangTag();

                if (this._options.persist) {
                    localStorage.setItem("language", this._lang);
                }
            })
            .catch(() => {
                console.error(`Could not load ${path}. Please make sure that the path is correct.`);
            });
    }

    toggleLangTag() {
        if (document.documentElement.lang !== this._lang) {
            document.documentElement.lang = this._lang;
        }
    }

    translate(translation) {
        function replace(element) {
            const text = element.dataset.i18n.split('.').reduce((obj, i) => obj[i], translation);
            let innerElement = '';
            if (element.children.length > 0) {
                innerElement = element.children[0].outerHTML;
            }

            if (text) {
                element.innerHTML = text + innerElement;
            }
        }

        this._elements.forEach(replace);
    }

    get defaultConfig() {
        return {
            persist: false,
            languages: ["EN", "TR"],
            defaultLanguage: "EN",
            detectLanguage: true,
            filesLocation: "./i18n"
        };
    }
}

var translator = new Translator({
    persist: false,
    languages: ["EN", "TR"],
    defaultLanguage: "EN",
    detectLanguage: true,
    filesLocation: "./i18n"
});

function setLang(lang) {
    translator.load(lang);
}
