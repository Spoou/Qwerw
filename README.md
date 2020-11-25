<a href="http://iphone.artsy.net"><img src ="docs/screenshots/overview.png"></a>

### Meta

- **State:** production
- **Point People:** [@ashfurrow](https://github.com/ashfurrow), [David Sheldrick](https://github.com/ds300)
- **CI :** [![Build Status](https://circleci.com/gh/artsy/eigen/tree/master.svg?style=shield&circle-token=f7a3e9b08ab306cd01a15da49933c0774d508ecb)](https://circleci.com/gh/artsy/eigen)

This is an [Artsy](https://github.com/artsy) OSS project. Other mobile projects are [Energy](https://github.com/artsy/energy) and [Eidolon](https://github.com/artsy/eidolon), with the retired [Emission](https://github.com/artsy/emission) and [Emergence](https://github.com/artsy/emergence).

Don't know what Artsy is? Check out [this overview](https://github.com/artsy/meta/blob/master/meta/what_is_artsy.md) and [more](https://github.com/artsy/meta/blob/master/README.md), or read our objc.io on [team culture](https://www.objc.io/issues/22-scale/artsy).

Want to know more about Eigen? Read the [mobile](http://artsy.github.io/blog/categories/mobile/) blog posts, or [eigen's](http://artsy.github.io/blog/categories/eigen/) specifically.

### Docs

Get setup [here](docs/getting_started.md). Further documentation can be found in the [documentation folder](docs#readme).

### Work at Artsy?

Instead of `make oss` below, run `make artsy`. You will need [awscli](https://formulae.brew.sh/formula/awscli) to get our ENV vars.

The file `Artsy/App/EchoNew.json` is not checked in (a sample file is included for OSS contributors). When you run `pod install`, the latest `EchoNew.json` file will be downloaded for you. See note in `Podfile`.

### Quick Start

**Note**: We currently require using Xcode 12 for development, with the latest version (12.2.0) recommended. You can find all versions of Xcode from [Apple's Developer Portal 🔐](http://developer.apple.com/download/more/).

You'll need:

- [Node](https://nodejs.org/en/) installed (whichever version is listed as the `engine` [here](https://github.com/artsy/emission/blob/master/package.json)).
- [aws cli](https://formulae.brew.sh/formula/awscli) installed.
- [Yarn](https://yarnpkg.com/en/) installed, too.

Want to get the app running? Run this in your shell:

```sh
git clone https://github.com/artsy/eigen.git
cd eigen
gem install bundler
bundle install --without development

make oss # or make artsy

bundle exec pod install --repo-update
open Artsy.xcworkspace

# finally start the react-native bundler
yarn start
```

This will set you up on our staging server, you will have a running version of the Artsy app by hitting `Product > Run` (or ⌘R).

**Note**: `bundle exec pod install` may fail the first time you run it (due to a [bug](https://github.com/orta/cocoapods-keys/issues/127) in a dependency of ours). Re-running the command should work.

### Deployment

For how we deploy, check out the dedicated documentation:

- [Deploying a beta](docs/deploy_to_beta.md)
- [Deploying to the App Store](docs/deploy_to_app_store.md)

### Thanks

Thanks to all [our contributors](/docs/thanks.md).

## License

MIT License. See [LICENSE](LICENSE).

## About Artsy

<a href="https://www.artsy.net/">
  <img align="left" src="https://avatars2.githubusercontent.com/u/546231?s=200&v=4"/>
</a>

This project is the work of engineers at [Artsy][footer_website], the world's
leading and largest online art marketplace and platform for discovering art.
One of our core [Engineering Principles][footer_principles] is being [Open
Source by Default][footer_open] which means we strive to share as many details
of our work as possible.

You can learn more about this work from [our blog][footer_blog] and by following
[@ArtsyOpenSource][footer_twitter] or explore our public data by checking out
[our API][footer_api]. If you're interested in a career at Artsy, read through
our [job postings][footer_jobs]!

[footer_website]: https://www.artsy.net/
[footer_principles]: https://github.com/artsy/README/blob/master/culture/engineering-principles.md
[footer_open]: https://github.com/artsy/README/blob/master/culture/engineering-principles.md#open-source-by-default
[footer_blog]: https://artsy.github.io/
[footer_twitter]: https://twitter.com/ArtsyOpenSource
[footer_api]: https://developers.artsy.net/
[footer_jobs]: https://www.artsy.net/jobs
