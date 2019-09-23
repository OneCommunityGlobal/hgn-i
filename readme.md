##HGN TIME Tracking Application Integrated with React Frontend and Nodejs Backend##
## This File needs updating to be sure processes are correct ##

To get started, make sure you have:

1. Node vx.x? or higher installed on your machine.
2. A decent code editor like VS Code or Atom. (VS Code is best)
3. Git

Step1: Get the App
Note: The default directory is "hgn" so if you change that name you will have to change the config file as well.
a) Using GIT : Using your IDE of choice use GIT to clone : https://github.com/OneCommunityGlobal/newnamehere, or use GIT from a command prompt to clone the app.
b) Using Zip. If you just want a copy of the app and don't plan on contributing, you can go to //urlhere on Github and download a zipped version and unzip to your desired directory.

Step2: Install dependencies
a) Change to the app directory. Run npm install.
b) Change to the server directory. Run npm install.

Step3: Setup the Mongo Database
Step3b: Create a Mongodb database called "hgn" (that is the default). Change the config file if you change this.
Step3c: Create the 6 collections. messages, projects, tasks, teams, timesheets, users.
Step3a: Run the indexing file assets/database/add-indexes.js in your Mongo environment to add indexes.
Step3d: Load the demo data if desired found under assets/database/demo-data (you need to keep the same _id's that are in the file
		else you will have to change them in any collection where they are referenced e.g. team _ids in the user record.

Step4: Start the app:
a) Change to the server directory. Run npm start.
b) Change to the app directory. Run npm start.
The application, by default, starts on port 3000. If 3000 is busy, then the start process will suggest another port and you can choose that. The url, by default, will be http://localhost:3000.

Step 4: Login. If you loaded the demo data, the admin user email is "none@none.com" and the password is "password". There is a non-admin user
	and the email is "fredvol@none.com" password is "password".

Info on how to contribute goes here (someone improve this to reflect actual process):
Step 1: Using GIT create new branch using meaningful name that describes changes you are making.
Step 2: Make your changes.
Step 3: Push your branch up to the Github server.
Step 4: Have someone verify and ok your changes.
Step 5: The admin will merge your branch into main if it is ok.
Step 6: Pull the new version of main down.
Wash, rinse, repeat. 