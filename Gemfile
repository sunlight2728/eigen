source 'https://rubygems.org'

gem 'cocoapods', :git => "https://github.com/CocoaPods/CocoaPods.git", :branch => "mr-static-link-aggregate-target"
gem 'cocoapods-keys'
gem 'cocoapods-deintegrate'

group :development do
  gem 'houston'
  # Depends on older xcodeproj gem that is incompatible with current CocoaPods.
  #gem 'synx', :git => "https://github.com/orta/synx", :branch => "spaces_to-underscores"
end

group :test do
  gem 'fui'
  gem 'xcpretty'
  gem 'second_curtain', :git => 'https://github.com/ashfurrow/second_curtain.git', :branch => 'improved_parse'
end

group :distribution do
  gem 'shenzhen'
  gem 'fastlane'
end
