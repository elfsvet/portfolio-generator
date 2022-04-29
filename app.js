const profileDataArgs = process.argv.slice(2, process.argv.length);


// Notice the lack of parentheses around the `profileDataArr` parameter?
const printProfileData = profileDataArr => {
    for (let i = 0; i < profileDataArr.length; i++) {
      console.log(profileDataArr[i]);
    }
  };
  printProfileData(profileDataArgs)