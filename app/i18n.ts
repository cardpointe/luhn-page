import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

//import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
import translationBN from '../messages/bn.json';
import translationBY from '../messages/by.json';
import translationDE from '../messages/de.json';
import translationEN from '../messages/en.json';
import translationES from '../messages/es.json';
import translationFR from '../messages/fr.json';
import translationHI from '../messages/hi.json';
import translationKR from '../messages/kr.json';
import translationPT from '../messages/pt.json';
import translationTR from '../messages/tr.json';
import translationZH from '../messages/zh.json';

export const locales = ['bn', 'by', 'de', 'en', 'es', 'fr', 'hi', 'kr', 'pt', 'tr', 'zh']; // LATER: is there a way to get the list from i18n after initialization?

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
    //.use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'en',
        debug: true,
        detection: {
            lookupCookie: 'locale',
            lookupQuerystring: 'locale',
            order: ['querystring', 'cookie', 'navigator'],
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            bn: {
                translation: translationBN
            },
            by: {
                translation: translationBY
            },
            de: {
                translation: translationDE
            },
            en: {
                translation: translationEN
            },
            es: {
                translation: translationES
            },
            fr: {
                translation: translationFR
            },
            hi: {
                translation: translationHI
            },
            kr: {
                translation: translationKR
            },
            pt: {
                translation: translationPT
            },
            tr: {
                translation: translationTR
            },
            zh: {
                translation: translationZH
            },
        },
    });


export default i18n;
