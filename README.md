# soundxtreamapp

##Installation

    1. Download repository with git clone https://github.com/xavierpandis/soundxtreamRS
    2. User bower to install all required dependencies with bower install
    
    ```sh
    $ bower install or $ bower install --allow-root
    ````
    > If Bower asks you which version of angular want to use , choose the most recent.
        
    3. Create a database called soundxtreamapp (password can be changed in /src/main/resources/config/application-dev.yml)
    
    4. Run the application mvn spring-boot:run
    
    ```sh
    $ mvn spring-boot:run
    ```
    
##Edit application

If you want to customize de application you have to download:

    1. Install Java from the Oracle website.
    2. (Optional) Install a Java build tool.
    
    3. Install Node.js from the Node.js website. This will also install npm, which is the node package manager we are using in the next commands.
    4. Install Yeoman: npm install -g yo
    5. Install Bower: npm install -g bower
    6. npm install -g grunt-cli.
    7. Install JHipster: npm install -g generator-jhipster@2.27.2

    For building the application use mvn spring-boot:run or 

    - [Node.js][]: We use Node to run a development web server and build the project.
       Depending on your system, you can install Node either from source or as a pre-packaged bundle.
       
    - npm install -g grunt-cli
    
    - Run the following commands in two separate terminals to create a blissful development experience where your browser
    auto-refreshes when files change on your hard drive.
    
        mvn
        grunt
       
    - Bower is used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
      specifying a newer version in `bower.json`. You can also run `bower update` and `bower install` to manage dependencies.
      Add the `-h` flag on any command to see how you can use it. For example, `bower update -h`.
      
    

------

[JHipster]: https://jhipster.github.io/
[Node.js]: https://nodejs.org/
[Bower]: http://bower.io/
[Grunt]: http://gruntjs.com/
[Maven]: https://maven.apache.org/
