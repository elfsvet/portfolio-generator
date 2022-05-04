const inquirer = require("inquirer");
// const fs = require('fs');
// const generateSite = require('./utils/generate-site.js');
//or
const { writeFile, copyFile } = require('./utils/generate-site.js');
const generatePage = require('./src/page-template.js');

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name? (Required)',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter your name!");
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'github',
      message: 'Enter your GitHub Username. (Required)',
      validate: githubInput => {
        if (githubInput) {
          return true;
        } else {
          console.log("Please enter your Github name!");
          return false;
        }
      }
    },
    {
      type: 'confirm',
      name: 'confirmAbout',
      message: 'Would you like to enter some information about yourself for an "About" section?',
      default: true
    },
    {
      type: 'input',
      name: 'about',
      message: 'Provide some information about yourself:',
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      }
    }
  ]);
};

const promptProject = portfolioData => {
  // if there's no 'projects' array property, create one
  if (!portfolioData.projects) {
    portfolioData.projects = [];
  }
  console.log(`
  =================
  Add a New Project
  =================
  `);
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your project? (Required)',
      validate: projectNameInput => {
        if (projectNameInput) {
          return true;
        } else {
          console.log("Please enter your project name!");
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Provide a description of the project (Required)',
      validate: descriptionInput => {
        if (descriptionInput) {
          return true;
        } else {
          console.log("Please enter your project description!");
          return false;
        }
      }
    },
    {
      type: 'checkbox',
      name: 'languages',
      message: 'What did you build this project with? (Check all that apply)',
      choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
    },
    {
      type: 'input',
      name: 'link',
      message: 'Enter the GitHub link to your project. (Required)',
      validate: linkInput => {
        if (linkInput) {
          return true;
        } else {
          console.log("Please enter the Github link to your project!");
          return false;
        }
      }
    },
    {
      type: 'confirm',
      name: 'feature',
      message: 'Would you like to feature this project?',
      default: false
    },
    {
      type: 'confirm',
      name: 'confirmAddProject',
      message: 'Would you like to enter another project?',
      default: false
    }
  ])
    .then(projectData => {
      portfolioData.projects.push(projectData);
      if (projectData.confirmAddProject) {
        return promptProject(portfolioData);
      } else {
        return portfolioData;
      }
    });
};

// don't forget to switch it back
// const pageHTML = generatePage(mockData);
/*
promptUser()
  .then(promptProject)
  .then(portfolioData => {
    // console.log(portfolioData);
    const pageHTML = generatePage(portfolioData);
    // takes path, argument with data and call back handler err
    fs.writeFile('./dist/index.html', pageHTML, err => {
      if (err) throw new Error(err);
      // if no errors gives this message to console.
      console.log('Portfolio complete! Check out index.html to see the output!');
      // and runs copy file.
      fs.copyFile('./src/style.css', './dist/style.css', err => {
        if (err) throw new Error(err);
        console.log('Style sheet copied successfully!')
      });
    });
  });
*/
// to not face call back hell and pyramid of doom we need to use then with functions we will create shortly
promptUser()
// ask user for their information with Inquirer prompts, returns data as an Object if Promise
  .then(promptProject)
  // The promptProject() function captures the returning data from promptUser() and we recursively call promptProject() for as many projects as the user wants to add. Each project will be pushed into a projects array in the collection of portfolio information, and when we're done, the final set of data is returned to the next .then().
  .then(portfolioData => {
    //The finished portfolio data object is returned as portfolioData and sent into the generatePage() function, which will return the finished HTML template code into pageHTML.
    return generatePage(portfolioData);
  })
  .then(pageHTML => {
    //We pass pageHTML into the newly created writeFile() function, which returns a Promise. This is why we use return here, so the Promise is returned into the next .then() method.
    return writeFile(pageHTML);
  })
  .then(writeFileResponse => {
    // Upon a successful file creation, we take the writeFileResponse object provided by the writeFile() function's resolve() execution to log it, and then we return copyFile().
    console.log(writeFileResponse);
    return copyFile();
  })
  .then(copyFileResponse => {
    // The Promise returned by copyFile() then lets us know if the CSS file was copied correctly, and if so, we're all done!
    console.log(copyFileResponse);
  })
  .catch(err => {
    console.log(err);
  });
  //stopped at 956