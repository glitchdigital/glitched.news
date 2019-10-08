# Read Me

This is the source code for https://glitched.news

It was originally created as an example project for TechCamp Tutzing, 2019.

* English https://en.glitched.news
* German https://de.glitched.news (work in progress)

It is free software released under the Internet Software Consortium licence.

## How to run

Run `npm run dev` to start in development mode.

## How to deploy

Run `npm run deploy` to deploy to the cloud (requires https://now.sh account).

## API

The API endpoint at `/api/article` is a REST API that takes a single argument `url`, which should be a fully qualified URL of an article. Results for individual URLs are cached for up to one hour.

e.g. https://glitched.news/api/article?url=https://www.apnews.com/dc3a143f9b2a4c92887cc3f5a7f604ec

## Contributing

Contributions in the form of feedback, bug reports, feature requests and pull requests are welcome.

### Adding language support

You can run `npm run extract` to update the list of strings the language translation software knows about; these strings are extracted and stored in the the `locales` directory.

e.g.

* You would update `locales/en/messages.json` to update the English language strings.
* You would `locales/de/messages.json` to update the German language strings.

You can run `npm run compile` to build the language files after you have edited them (you will need to do this to try them out).

You can run `npm run add-locale` to add a new locale if you would like to do this.

Note: Currently there is not much localization being done. If there is interest in assisting with translations I am happy to do the work to provide full coverage for all strings to assist with translating the interface.
