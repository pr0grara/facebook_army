# facebook_army
### from terminal
0. ### npm install (chromium should take about a minute)
### inside autoLike.js
1. ### add your account credentials in the "users" object
2. ### add a target url in the "targetUrl" variable 
#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**NOTE facebook has many different types of content, autoLike will currently** 
#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**only work on posts [like this](https://www.facebook.com/watch/?v=257467945464976&external_log_id=a60e280e-1708-4a4f-96ec-841d329d6426&q=kitten)** 
3. ### run autoLike.js
###### &nbsp;&nbsp;
# autolike will run the main function for every user of the "users" object  
## autoLike will open a new browser instance inside chromium from which it will:
1. ### navigate to facebook login
2. ### enter user credentials and submit
3. ### navigate to the target post
4. ### Open comments
5. ### Click on the "See More Comments" button N times
6. ### Iterate through every comment and click "See More" where applicable
7. ### Iterate again through every comment and run the text through our check functions
8. ### Any comment found to be favorable will then be "liked"
9. ### After completion the console will report number of likes given and the browser will be closed
10. ### This process will be repeated for every user in "users" object
&nbsp;&nbsp;
#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; *godspeed general*