source 'https://rubygems.org'

gem 'cocoapods', '~> 1.7.2'

# So we know if we need to run `pod install`
gem 'cocoapods-check'
gem 'cocoapods-keys' # So we don't leak ENV vars
gem 'psych' # So our Podfile.lock is consistent
gem 'down'

group :development do
  gem 'lowdown' # For handling notifications + certs
end

group :test do
  gem 'danger' # Stop saying 'you forgot to...', used only on Circle CI
  gem 'xcode-install' # To ensure we have the right SDK installed for running tests
  gem 'nokogiri', '>= 1.10.4' # For CVE-2019-5477
  gem 'second_curtain' # to upload snapshot fails
  gem 'xcpretty' # Makes CI readable
end
