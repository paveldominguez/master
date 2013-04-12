# Verizon Mobile Life Store
Dev Setup

## Building MLS

We'll be using grunt to build and serve the project. Using grunt will allow us all to have the same dev environment across the board. 

Here are the requirements:

* Node.js (v0.8.22)
* Ruby
* Grunt
* Sass
* Compass
* sassy-math
* modular-scale
* zurb-foundation (3.22)

Windows Users:

- Install Ruby (if you don't already have it installed): http://rubyinstaller.org/
*** Make sure the "Add Ruby executables to your PATH" option is checked. ***

All Users:

If you're using Windows, the following steps assume that you have installed Ruby and RubyGems successfully. 

- For mac users: as a security measure it's a good idea to change ownership on your /usr/local directory to your account. This way you can execute the scripts there without having to use the 'sudo' command. 

To do this issue the following command in a command prompt window: sudo chown -R $USER /usr/local

Please do the following, in order:

- Install the following (Ruby) Gems: compass, sassy-math, modular-scale and zurb-foundation.

Use the following command to perform the gem installation: 

gem install sassy-math modular-scale compass zurb-foundation

- Install NodeJS from here: http://nodejs.org/download/

- After node is installed verify by opening up a command prompt window and type the following (without quotes, lowercase v): "node –v"  and also verify Node Package Manager by typing the following (without quotes, lowercase v): "npm –v" Both of these commands should return some sort of version string (not an error).

- Once you've verified that both node and npm are installed, please install grunt by opening a command prompt window and typing (without quotes): "npm install –g grunt" 

- Once grunt, and any dependencies, finish installing, install grunt-cli (command line interface) by typing (without quotes): "npm install –g grunt-cli" 

- Once grunt-cli is installed, please change directory to the project root and issue the following command (without quotes): "npm install" - this command will install any project-related dependencies and create the node server module to run grunt/node's internal web server.

- After npm install completes, the final command to issue is (without quotes) "grunt server"
