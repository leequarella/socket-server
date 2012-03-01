# JavaScript/CoffeeScript watchers
guard 'jasmine-node', :jasmine_node_bin => File.expand_path(File.dirname(__FILE__) + "/node_modules/jasmine-node/bin/jasmine-node") do
  watch(%r{^spec/(.+)_spec\.(js\.coffee|js|coffee)(?!(\.swp))})  { |m| "spec/#{m[1]}_spec.coffee" }
  watch(%r{^src/(.+)\.coffee(?!(\.swp))})        { |m| "spec/#{m[1]}_spec.coffee" }
  watch(%r{spec/spec_helper\.(js\.coffee|js|coffee)}) { "spec" }
end

# Coffeescript compiling
guard 'coffeescript', :input => 'src', :output => 'public'
