# Unreal Mart
##Introduction
This website is a fake mart that sell mostly non-existent things (real or abstract): its _only purpose_ is to show how to use some web development techniques.
##Technical details
This site uses a mix of technologies for the different parts of the application, but broadly speaking it can be defined as a MVC structure with the Express NodeJS framework and MongoDB:
* the "View" has Express (back-end) use web templates for showing the various elements (stores, items, cart, etc.);
* the "Controller" is managed by Express using routes over HTTP methods
* the "Model" sees  all data stored in a MongoDB database, accessed via JavaScript-based DAO interfaces, without ODM
One exception (another MVC way) is the administration panel (back-end), which is a single page using [jQuery](http://jquery.com/) script as the "Controller" between the "Model" and the "View", using AJAX.
##Possibile improvements
Many things yet to do....
##How to use it
For now there is only a pre-logged anonoymous user with his cart
##License