const request = require('request');
const fs = require('fs');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);
const url = args[0];
const localFilePath = args[1];

// If there is no url or file to output to.  Done outside of the request to not break the program.
if (url === undefined || localFilePath === undefined) {

  // If no URL has been entered (i.e "node fetcher.js")
  if (url === undefined) {
    console.log("No user input detected :(\nPlease enter a URL and a file to output to.");
    //Forces the process to end so nothing else runs
    process.exit();
  }

  // If no output file has been specified (i.e "node fetcher.js google.ca")
  if (localFilePath === undefined) {
    console.log("The file to output data to has not been entered :(\nPlease enter a file to output to");
    //Forces the process to end so nothing else runs
    process.exit();
  }
}

request(url, (error, response, body) => {
  // If there is an error from the url, tells the user how to format the url correctly
  if (error) {
    console.log(`${error.message}\nPlease enter the url as http://example.domain`)
    // Stops the program from continuing to read user input
    rl.close();
    return;
  }

  fs.readFile(localFilePath, 'utf-8', (error, data) => {
    // If there is an error with where you want the data saved, tells the user how to format the directory and filename correctly
    if (error) {
      console.log(`${error.message}\nMake sure you're entering the correct directory and filename (including its extension)` +
      `\n (i.e ./index.html    or    ../files/data.txt)`)
      // Stops the program from continuing to read user input
      rl.close();
      return;
    }

    // If there is already existing data in the file
    if (data.length > 0) {

      // Asks if the user wants to override the current files data
      rl.question(`${data.length} bytes of data exist in that file already.  Would you like to overrite it? (Type "Y" to override)  `, (answer) => {

        // IF they want to override the data currently in the file
        if (answer === 'Y') {
          console.log("Overriding the current data ... ");
          // Stops the program from continuing to read user input
          rl.close();

          // Will attempt to override the file
          fs.writeFile(localFilePath, body, error => {
            // If an error occurs while attempting to write 
            if (error) {
              console.log(`${error.message}`);
              return;
            }

            // 1 character is equal to 1 byte so the length of body is the bytes
            console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`);
          });
        }
        
        // If the user doesn't want the data overriden
        else {
          console.log('The data will not be overriden.\nThis program will now stop')
          // Stops the program from continuing to read user input
          rl.close();
          return;
        }
      });
    }

    // If the file is empty
    else if (data.length === 0) {
      fs.writeFile(localFilePath, body, error => {
        // If an error occurs while writing to the file
        if (error) {
          console.log(error.message);
          return;
        }
        rl.close();

        // 1 character is equal to 1 byte so the length of body is the bytes
        console.log(`Downloaded and saved ${body.length} bytes to ${localFilePath}`)
      });
    }
  });
});