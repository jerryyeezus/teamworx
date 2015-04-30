# Teamworx

Teamworx is a team recommender and management site. It is for school project.

This is the front-end repository for Teamworx. We have a separate repository for the backend code [here](https://github.com/jerryyeezus/teamworx-REST).

### Public URL
http://goo.gl/bBf92W
  
### Dependencies
Backend
  - Django
  
Frontend
  - Bower
  
### Running it

  You can use the [public url](http://goo.gl/bBf92W) if you just want to view the site.
  
  If for some reason you wanna run it yourself, follow the steps: clone the two repos (this one and backend one). 
  
In the front-end directory, install angular dependencies with bower:
  
    bower install
    
If you wanna run the backend on your machine instead of my hosted AWS, after cloning the server repository, in the front-end's js/app.js change the line

    DEBUG = true
to

    DEBUG = false
    
Then run:

    python manage.py runserver 0:8000
  

Now, import the frontend into an IDE such as Webstorm or similar (needed in order to make the http requests work). Run that as a server on a different port <your_port>. You can goto http://localhost:<your_port> to view.

### Documentation
User docs are available in ./documentation

### Import Roster feature
The .csv file for importing follows the structure in this sample file. You can use it as a sample.

  - https://github.com/jerryyeezus/teamworx/blob/master/roster.csv
  
### Members

  - Jerry Yee

  - Thang Nguyen

  - Joe Murphy
