ROOT =  File.expand_path(File.dirname(__FILE__) + "/")
puts "THOR ONLINE!!!!"

class Convert < Thor
  #desc "haml", "converts and puts haml in www"
  #def haml
  #  `haml -r #{ROOT}/src/haml/helpers.rb #{ROOT}/public/index.haml #{ROOT}/public/index.html`
  #end

  #desc "sass", "converts and puts sass in www"
  #def sass
  #  `sass --update #{ROOT}/src/scss:#{ROOT}/assets/www/stylesheets`
  #end

  desc "coffee", "converts and puts coffeescript in www"
  def coffee
    `coffee -o #{ROOT}/public/ -c #{ROOT}/src/coffee_script/`
  end

  desc "all", "Convert haml, sass and coffee"
  def all
    #invoke :haml
    #invoke :sass
    invoke :coffee
  end

  desc "watch", "Start watchr to convert haml, sass and coffee source as it is modified"
  def watch
    invoke :all
    system "cd #{ROOT} && watchr tasks/converters.watchr"
  end
end

