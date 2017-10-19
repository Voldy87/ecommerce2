# ecommerce2
##Introduction
This website is a fake mart that sell mostly non-existent things (real or abstract): its _only purpose_ is to show how to use some web development techniques.
##Technical details
This site uses a mix of technologies for the different parts of the application:
* web templates for showing the stores, items and cart; every page is entirely loaded interacting with the Express back-end
* the administration panel is a single page with bootstrap and [jQuery](http://jquery.com/): the latter loads data from Express using AJAX methods
* all data are stored in a MongoDB database, accessed via JavaScript-based DAO interfaces
##Possibile improvements
Many things yet to do....
##How to use it
For now there is only a pre-logged anonoymous user with his cart
