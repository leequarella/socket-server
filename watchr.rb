puts 'Watchr is watching... '

watch /src\/.*\.haml/ do |md|
	puts 'haml file changed at ' + Time.now.strftime("%l:%M:%S%P")
	`thor convert:haml`
end

watch /src\/.*\.rb/ do |md|
  puts 'rb file changed at ' + Time.now.strftime("%l:%M:%S%P")
	`thor convert:haml`
end


watch /src\/.*\.scss/ do |md|
	puts 'scss file changed at ' + Time.now.strftime("%l:%M:%S%P")
	`thor convert:sass`
end


watch /src\/.*\.sass/ do |md|
  puts 'sass file changed at ' + Time.now.strftime("%l:%M:%S%P")
	`thor convert:sass`
end


watch /src\/.*\.coffee/ do |md|
  puts 'coffee file changed at ' + Time.now.strftime("%l:%M:%S%P")
	`thor convert:coffee`
end

