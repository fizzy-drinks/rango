# rango
> Food guessing game inspired by Wordle

[![Netlify Status](https://api.netlify.com/api/v1/badges/8cef2060-d234-4c5e-b465-802e487370d5/deploy-status)](https://app.netlify.com/sites/cerulean-shortbread-48e3cd/deploys)

## Running locally

The food of the day is based on a little formula located [here](data/services/getWotd.ts). To shuffle the
array, provide a numerical `SEED` in a `.env` file in the root directory.

## Contributing

### New food

If you want to add new food, edit [the foods.ts file](data/foods.ts). Any addition is welcome!

### New locales

Currently we only support Portuguese, but a locale feature, and the English language, will soon be added.
Foods will also be different depending on locale, so we can keep only what's popular to a certain portion
of the people!

There will be instructions on how to add locales when the locale feature is implemented.

### Improvements

You can start by picking up some of the [issues](https://github.com/fizzy-drinks/rango/issues), but
that is more of a suggestion -- you can propose any change you like and we may discuss it!

### Credits

Twemoji graphics made by Twitter and other contributors, licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
