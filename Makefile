WORKSPACE = Artsy.xcworkspace
SCHEME = Artsy
SCHEME_INTEGRATION_TESTS = 'Artsy Integration Tests'
CONFIGURATION = Beta
APP_PLIST = Artsy/App_Resources/Artsy-Info.plist
STICKER_PLIST = Artsy\ Stickers/Info.plist
PLIST_BUDDY = /usr/libexec/PlistBuddy
DEVICE_HOST = platform='iOS Simulator',OS='9.0',name='iPhone 6'
# Disable warnings as errors for now, because we’re currently not getting the same errors during dev as deploy.
# OTHER_CFLAGS = OTHER_CFLAGS="\$$(inherited) -Werror"


GIT_COMMIT_REV = $(shell git log -n1 --format='%h')
GIT_COMMIT_SHA = $(shell git log -n1 --format='%H')
GIT_REMOTE_ORIGIN_URL = $(shell git config --get remote.origin.url)

DATE_MONTH = $(shell date "+%e %h" | tr "[:lower:]" "[:upper:]")
DATE_VERSION = $(shell date "+%Y.%m.%d.%H")

CHANGELOG = CHANGELOG.md

LOCAL_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
BRANCH = $(shell echo host=github.com | git credential fill | sed -E 'N; s/.*username=(.+)\n?.*/\1/')-$(shell git rev-parse --abbrev-ref HEAD)

## Allows us to determine how long it takes to compile a
SWIFT_BUILD_FLAGS = OTHER_SWIFT_FLAGS="-Xfrontend -debug-time-function-bodies"
## Lets us use circle caching for build artifacts
DERIVED_DATA = -derivedDataPath derived_data
RESULT_BUNDLE = -resultBundlePath derived_data/result_bundle

.PHONY: all build ci test oss pr artsy

all: ci

### Aliases

appstore: update_bundle_version set_git_properties change_version_to_date ship_appstore
next: update_bundle_version set_git_properties change_version_to_date

### General setup

oss:
	git submodule update --init
	bundle exec pod repo update
	bundle exec pod keys set "ArtsyAPIClientSecret" "3a33d2085cbd1176153f99781bbce7c6" Artsy
	bundle exec pod keys set "ArtsyAPIClientKey" "e750db60ac506978fc70"
	bundle exec pod keys set "ArtsyFacebookAppID" "-"
	bundle exec pod keys set "ArtsyTwitterKey" "-"
	bundle exec pod keys set "ArtsyTwitterSecret" "-"
	bundle exec pod keys set "ArtsyTwitterStagingKey" "-"
	bundle exec pod keys set "ArtsyTwitterStagingSecret" "-"
	bundle exec pod keys set "SegmentProductionWriteKey" "-"
	bundle exec pod keys set "SegmentDevWriteKey" "-"
	bundle exec pod keys set "AdjustProductionAppToken" "-"
	bundle exec pod keys set "ArtsyEchoProductionToken" "-"
	bundle exec pod keys set "SentryProductionDSN" "-"
	bundle exec pod keys set "SentryStagingDSN" "-"

artsy:
	git submodule update --init
	config/spacecommander/setup-repo.sh
	brew install swiftgen
	brew install swiftlint
	git update-index --assume-unchanged Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m
	config/setup_swiftlint_precommit_hook.rb

certs:
	echo "Don't log in with it@artsymail.com, use your account on our Artsy team."
	bundle exec match appstore

distribute:  change_version_to_date set_git_properties setup_fastlane_env
	brew install getsentry/tools/sentry-cli || true
	bundle exec fastlane update_plugins
	bundle exec fastlane ship_beta

setup_fastlane_env:
	rm -f Gemfile.lock Gemfile
	cp fastlane/Gemfile .
	bundle install

### General Xcode tooling

build:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration '$(CONFIGURATION)' -sdk iphonesimulator build -destination $(DEVICE_HOST) $(SWIFT_BUILD_FLAGS) $(DERIVED_DATA) | tee $(CIRCLE_ARTIFACTS)/xcode_build_raw.log | bundle exec xcpretty -c

test:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME) -configuration Debug test -sdk iphonesimulator -destination $(DEVICE_HOST) $(DERIVED_DATA) $(OTHER_CFLAGS) | bundle exec second_curtain 2>&1 | tee $(CIRCLE_ARTIFACTS)/xcode_test_raw.log  | bundle exec xcpretty -c --test --report junit --output $(CIRCLE_TEST_REPORTS)/xcode/results.xml

# This is currently not being called from our CI yaml file [!]
uitest:
	set -o pipefail && xcodebuild -workspace $(WORKSPACE) -scheme $(SCHEME_INTEGRATION_TESTS) -configuration Debug test -sdk iphonesimulator -destination $(DEVICE_HOST) $(DERIVED_DATA) $(RESULT_BUNDLE) | bundle exec second_curtain 2>&1 | tee $(CIRCLE_ARTIFACTS)/xcode_test_raw.log  | bundle exec xcpretty -c --test --report junit --output $(CIRCLE_TEST_REPORTS)/xcode/results.xml

### CI

ci: CONFIGURATION = Debug
ci: build

deploy_if_beta_branch:
	if [ "$(LOCAL_BRANCH)" == "beta" ]; then make distribute; fi

deploy:
	git push origin "$(LOCAL_BRANCH):beta" -f

### Utility functions

update_bundle_version:
	@printf 'What is the new human-readable release version? '; \
		read HUMAN_VERSION; \
		$(PLIST_BUDDY) -c "Set CFBundleShortVersionString $$HUMAN_VERSION" $(APP_PLIST); \
		$(PLIST_BUDDY) -c "Set CFBundleShortVersionString $$HUMAN_VERSION" $(STICKER_PLIST)

stamp_date:
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x.png --text "$(DATE_MONTH)"
	config/stamp --input Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --output Artsy/Resources/Images.xcassets/AppIcon.appiconset/Icon-Small-40@2x-1.png --text "$(DATE_MONTH)"

change_version_to_date:
	$(PLIST_BUDDY) -c "Set CFBundleVersion $(DATE_VERSION)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set CFBundleVersion $(DATE_VERSION)" $(STICKER_PLIST)

set_git_properties:
	$(PLIST_BUDDY) -c "Set GITCommitRev $(GIT_COMMIT_REV)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set GITCommitSha $(GIT_COMMIT_SHA)" $(APP_PLIST)
	$(PLIST_BUDDY) -c "Set GITRemoteOriginURL $(GIT_REMOTE_ORIGIN_URL)" $(APP_PLIST)

update_echo:
	curl https://echo-api-production.herokuapp.com/accounts/1 --header "Http-Authorization: $(shell bundle exec pod keys get ArtsyEchoProductionToken Artsy)" --header "Accept: application/vnd.echo-v2+json" > Artsy/App/Echo.json

storyboards:
	swiftgen storyboards Artsy --output Artsy/Tooling/Generated/StoryboardConstants.swift
	swiftgen images Artsy --output Artsy/Tooling/Generated/StoryboardImages.swift

### Useful commands

synxify:
	bundle exec synx --spaces-to-underscores -e "/Documentation" Artsy.xcodeproj

pr:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not PRing"; else git push -u origin "$(LOCAL_BRANCH):$(BRANCH)"; open "https://github.com/artsy/eigen/pull/new/artsy:master...$(BRANCH)"; fi

push:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not pushing"; else git push origin $(LOCAL_BRANCH):$(BRANCH); fi

fpush:
	if [ "$(LOCAL_BRANCH)" == "master" ]; then echo "In master, not pushing"; else git push origin $(LOCAL_BRANCH):$(BRANCH) --force; fi
