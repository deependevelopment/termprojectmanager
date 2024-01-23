var readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout),
  prefix = '> ';
const fs = require('node:fs');
const { exec } = require('child_process');
const config = require('./config.json');
const chalk = require('chalk');

if (!config.system) {
  console.error('Please specify a system.');
}

rl.on('line', function(line) {
  function check(substring) {
    return line.includes(substring);
  }
  switch(line.trim()) {
    case '.help':
      console.log(`.setProject {name} ?p {path} - Add/Edit a project in the Database.\n\n.delProject {name} - Deletes the project from the Database.\n\n.listProjects - List all availible projects.\n\n.start {name} - Start the project specified.`);
      break;
  }
  switch (true) {
    case check('.setProject'):
      const path = line.split(' ?p ')[1];
      // const command = line.split(' ?c ')[1];
      const name = line.split(' ')[1];
      if (config.system === "mac") {
        const cmd = `osascript -e 'tell app "Terminal" to do script "node ${path}"'`
        fs.writeFile(`commands/${name}.sh`, cmd, (err) => {
          if (err) {
            console.error('Error writing to the file:', err);
          } else {
            console.log('Project added.');
          }
        });
      } else if (config.system === "windows") {
        const cmd = `start cmd.exe /K node ${path}`
        fs.writeFile(`commands/${name}.bat`, cmd, (err) => {
          if (err) {
            console.error('Error writing to the file:', err);
          } else {
            console.log('Project added.');
          }
        });
      }
      
      break;
    case check('.start'):
      const projectName = line.split(' ')[1];
      if (config.system === 'mac') {
        exec(`sh commands/${projectName}.sh`, (error, stdout, stderr) => {
          if (error) {
          console.error(`exec error: ${error}`);
          return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          })
        // exec(`code ${projectName}.sh`, (error, stdout, stderr) => {
        //   if (error) {
        //   console.error(`exec error: ${error}`);
        //   return;
        // }
        //   console.log(`stdout: ${stdout}`);
        //   console.error(`stderr: ${stderr}`);
        // })
      } else if (config.system === "windows") {
        exec(`commands/${projectName}.bat`, (error, stdout, stderr) => {
          if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        })
        // exec(`code ${projectName}`, (error, stdout, stderr) => {
        //   if (error) {
        //   console.error(`exec error: ${error}`);
        //   return;
        // }
        //   console.log(`stdout: ${stdout}`);
        //   console.error(`stderr: ${stderr}`);
        // })
      }
      break;
  }
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  console.log('Thank you for using the ProjectManagerCLI.');
  process.exit(0);
});
console.log('Welcome to the Deepen Development ProjectManagerCLI.\nDo `.help` for more information.');
rl.setPrompt(prefix, prefix.length);
rl.prompt();