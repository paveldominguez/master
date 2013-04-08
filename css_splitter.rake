require 'rake'
require 'css_splitter'
 
desc 'split css files'
namespace :css do
 
  task :split do
    infile = ENV['infile'] || raise("missing infile")
    outdir = ENV['outdir'] || File.dirname(infile)
    max_selectors = ENV['max_selectors'] || 4095
 
    CssSplitter.split(infile, outdir, max_selectors)
  end
 
  task :count_selectors do
    css_file = ENV['css_file'] || raise("missing css file")
 
    CssSplitter.count_selectors(css_file)
  end
 
end