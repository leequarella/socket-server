guard 'coffeescript', :input => 'src', :output => 'public'
guard 'coffeescript', :input => 'src/coffee', :output => 'public/javascripts'

guard 'haml', :output => 'public/views', :input => 'src/haml' do
  watch %r{^src/haml/.+(\.html\.haml)(?!(\.swp))}
end
