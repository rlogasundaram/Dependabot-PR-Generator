Dependabot PR Generator.

This portable custom chrome browser extension will help us to fetch the open dependabot PR from proprietary and OSS plugins for Gaia

1. **How it works after enabling the extension in chrome browser:**

   ![image](https://github.com/rlogasundaram/Dependabot-PR-Generator/assets/142486073/af158b44-7cbe-4971-93a5-e9072769a934)

**Steps to generate the git token for Cloudbees proprietary plugin. For OSS plugin we don't need any special access**

1. Go to the settings page in github : https://github.com/settings/apps
   Click the Personal Access Token -> Fine-grained tokens -> Generate New Token.
   
   **Note: Once create the token, copy the token and save it in your local file.**
   ![image](https://github.com/rlogasundaram/Dependabot-PR-Generator/assets/142486073/da467027-2937-4834-8ac1-0ff769e9f472)

After creating a new token. We need to raise the request to ops team to get the approval for this token. Because, we have created the token for "Cloudbees owner". So, we need approval from the ops team. Create a ticket in their kanban board. Make sure you get the approval from them.
https://cloudbees.atlassian.net/jira/software/c/projects/OPS/boards/892

2. Checkout the Dependabot Generator project code from the git repo in local machine:
   https://github.com/rlogasundaram/Dependabot-PR-Generator

3. Open the project code in your editor and open the config.js file and paste your git token.
   ![image](https://github.com/rlogasundaram/Dependabot-PR-Generator/assets/142486073/3521eec6-41d3-49ca-a008-39aba06d1107)
  
4. Open your chrome browser with a new tab and paste the below link:
   
   chrome://extensions/
   
   Make sure the developer mode is on
   
   ![image](https://github.com/rlogasundaram/Dependabot-PR-Generator/assets/142486073/87d1fe45-82c7-4bc2-bb8d-af657ddda707)

5. In your chrome browser tab, click the "Load unpacked" button and select this dependabot project code folder. It will load this code into your chrome browser.

   ![image](https://github.com/rlogasundaram/Dependabot-PR-Generator/assets/142486073/c3a0f5cd-1bba-484b-890c-dbc2af5529ed)
   ![image](https://github.com/rlogasundaram/Dependabot-PR-Generator/assets/142486073/77c7b7ef-85cc-4c30-ac51-4e6aa4dfb776)


6. After loading the code successfully. Open your browser again and click the extension button in top right corner of your browser. The extension will open and you can fetch the PRs.
   
   ![image](https://github.com/rlogasundaram/Dependabot-PR-Generator/assets/142486073/1fbca001-2819-4fcb-8815-144b431645a8)

   

   

   
