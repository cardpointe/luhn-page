# Luhn Utility Page

An attractive and ergonomic replacement for random Luhn utility pages ([example](http://www.ee.unb.ca/cgi-bin/tervo/luhn.pl))


## Basics

- [ ] verifies LUHN for a given number
- [ ] empty: show some examples
- [ ] if len < 16, shows some valid values (Configurable: either random or zero-filled)
- [ ] updates automatically as you type (no need to submit form)
- [ ] if invalid, show the number that passes by updating the last digit
- [ ] configurable length (default=16)

## Features

- [ ] copy to clipboard for input and examples
- [ ] responsive: mobile-friendly
- [ ] updates URL w/number as query param (i.e. sharable URLs)
- [ ] light/dark mode support
- [ ] translations: English and French (ask for contributions for others)
- [ ] Fiserv branding (favicon, title, "powered by" that links to dev docs, etc)
- [ ] font: [Open Sans](https://fonts.google.com/specimen/Open+Sans)

## Tech

- [ ] static website
- [ ] TypeScript
- [ ] React
- [ ] React-router
- [ ] DaisyUI/Tailwind
- [ ] CI job: build
- [ ] CI job: translations up to date (=all have the same keys)
- [ ] open source license (AGPL?) for source code (public repo at github.com/fiserv)
- [ ] available on a public hostname (luhn.fiserv.com?)  [Domain Request Form](https://fiservcorp.sharepoint.com/sites/fuel-fiserv-brand/SitePages/Domain-Request-Form.aspx)
