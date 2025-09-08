# Contributing

For licensing reasons, contributions are only accepted from [Fiserv](https://www.fiserv.com) employees.

## Adding a language

> [!TIP]
> Github Copilot auto-complete works really well on the translation files!

For `XX` is the 2-letter [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) language code.

1. Create a `XX.json` file in the `messages` directory.
2. Add the translations for everything in `messages/en.json`.
3. In every other language translation, add a `settings_locale_XX` entry.
4. In `app/i18n.ts`:
	1. Import the `XX.json` file.
	2. Add the language code to the `locales` array.
	3. Add the imported json variable to the `resources` map in the call to `init()`.
