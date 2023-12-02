# Semester-Project-2

1. Download the Repository:
   Unzip the downloaded folder.

2. Open in VS Code:
   Open Visual Studio Code.
   Navigate to File > Open Folder and select the unzipped folder to open in VS Code.

3. Change Directory:
   In the VS Code terminal, navigate to the project directory.

4. Install Dependencies:

- Frontend part:
  • npm install
  • npm start

- Strapi part:
  • npm install
  • install graphql:
    1. Terminal method
      § cd Strapi folder
      § npm run strapi install graphql
      § npm run develop
    2. Amin UI method
      § cd Strapi folder
      § npm run develop
      § Open Admin UI and login: http://localhost:1337/admin
      § Go to “Marketplace”
      § Download GRAPHQL
      § Restart server via terminal, click CTRL+C to stop server
      § Then, npm run develop

# Troubleshoots

Issue 01 – Frontend starts and shows only navbar!
  • Localstorage is saving an old token so you have to clear the localstorage in the developer tools and refresh the page.
  • Graphql is not installed properly, so the frontend server can’t reach the backend server, try to restart the Strapi server or re-install GraphQL.

Issue 02 – Can’t upload images when trying to add a new product! Strapi prevents upload by default for any user with any role so you need to authorize authenticated users to upload files:
  • Go to Admin UI
  • Click on Settings
  • Click on "Roles" under "Users & Permissions" plugin
  • Choose Authenticated
  • Scroll down to "Upload"
  • Check "Select all" to authorize CRUD (Create, Read, Update & Delete)
  • Click "Save"
