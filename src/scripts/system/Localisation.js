import * as PIXI from "pixi.js";
import { App } from "./App";

export class Localisation {
    constructor() {
        this.onLanguageChanged = new Event("onLanguageChanged");
    }


    async load(languageName) {
        if (this.loadedLanguage == languageName) return;

        if (this.bundle) {
            PIXI.Assets.removeBundle('lg_' + this.loadedLanguage);
        }
        this.bundle = await PIXI.Assets.loadBundle('lg_' + languageName);
        this.assets = this.bundle.file;
        this.loadedLanguage = languageName;
    }

    async loadFrench() {
        await this.load('fr');
    }
    async loadEnglish() {
        await this.load('en');
    }

    // Maybe can be optimised ?
    getText(key) {
        const v = this.assets.entries.find(x => x.key == key);
        if (v) return v.value;
        return "LocaMissing";
    }
}