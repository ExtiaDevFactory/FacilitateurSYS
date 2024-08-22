const fs = require('fs').promises;
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = require('colors');

const HOMOLOGATION = 'Homologation';
const PRODUCTION = 'Production';

const HOMOLOGATION_COLORED = HOMOLOGATION.green;
const PRODUCTION_COLORED = PRODUCTION.red;

const welcomeArt = `
${'.'.repeat(40).cyan}
  _   _ _____  _   _ _____ 
 | | | |  _  || | | |  ___|
 | |_| | | | || | | | |_  
 |  _  | | | || | | |  _| 
 | | | | |_| || |_| | |   
 |_| |_|_____||_____|_|   
${'.'.repeat(40).cyan}

`;

const recipients = {
  "Adyen": "73829",
  "Arkea": "15589",
  "BNPP": "30004",
  "BPCE BP": "30007",
  "BPCE CE": "19505",
  "CAPS": "30007",
  "Checkout": "17208",
  "CIC": "30066",
  "CM": "45539",
  "HSBC": "30056",
  "LBP": "20041",
  "LCL": "30002",
  "Monext": "17028",
  "CB - PARIS": "??",
  "STET": "??",
  "Société Générale": "30003",
  "Stripe": "75491",
  "VEF": "??",
  "Worldline": "??",
  "CB-Claranet": "??",
  "CB-DSCB": "??",
  "CB-SITEL": "??",
  "UPI": "??"
};

const checkFileExistence = async () => {
  try {
    await fs.access('fichier');
    console.log('Directory "fichier" found.'.green);

    const files = await fs.readdir('fichier');
    if (files.length === 0) {
      console.error('No files found in "fichier" directory. Exiting script.'.red);
      process.exit(1);
    } else {
      console.log('Files found in "fichier" directory.'.green);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Directory "fichier" not found. Please ensure it exists before running the script.`.red);
      process.exit(1);
    } else {
      console.error(error.red);
    }
  }
};

const getEnvironment = async () => {
  console.log(welcomeArt);
  return new Promise((resolve, reject) => {
    readline.question(`Choose environment (${HOMOLOGATION_COLORED} or ${PRODUCTION_COLORED}): `, (environment) => {
      if (environment.toLowerCase() === HOMOLOGATION.toLowerCase()) {
        resolve(HOMOLOGATION);
      } else if (environment.toLowerCase() === PRODUCTION.toLowerCase()) {
        resolve(PRODUCTION);
      } else {
        reject(new Error('Invalid environment'.red));
      }
    });
  });
};

const getRecipientChoice = async () => {
  console.log('Please select a recipient:'.cyan);
  const options = Object.keys(recipients);
  options.forEach((option, index) => {
    console.log(`${index + 1}: ${option} (${recipients[option]})`.yellow);
  });

  return new Promise((resolve, reject) => {
    readline.question('Enter the number corresponding to your choice: ', (choice) => {
      const index = parseInt(choice) - 1;
      if (index >= 0 && index < options.length) {
        resolve(recipients[options[index]]);
      } else {
        reject(new Error('Invalid choice'.red));
      }
    });
  });
};

const modifyFileNames = async (environment, multiValue) => {
  try {
    const files = await fs.readdir('fichier');
    console.log('Files found in "fichier" directory.'.green);

    const multiRegex = /MULTI/gi;
    const fsyfcispRegex = /FSYFCISP/g;
    const h07000Regex = /H07000\d$/g;

    let lastH07000Value = 0;

    for (const fileName of files) {
      let newFileName = fileName;

      if (environment === HOMOLOGATION) {
        newFileName = newFileName.replace(multiRegex, multiValue);
        newFileName = newFileName.replace(fsyfcispRegex, 'FSYFCISH');

        if (newFileName.startsWith('TO_')) {
          newFileName = newFileName.replace(/^TO_/, 'TO_' + multiValue);
        }

        const h07000Match = newFileName.match(h07000Regex);
        if (h07000Match) {
          let newLastDigit = parseInt(h07000Match[0].slice(-1)) + 1;

          while (await fs.access(`fichier/${newFileName.replace(h07000Regex, `H07000${newLastDigit}`)}`).catch(() => { })) {
            console.log(`File already exists: ${newFileName.replace(h07000Regex, `H07000${newLastDigit}`)}`.yellow);
            newLastDigit++;
          }

          newFileName = newFileName.replace(h07000Regex, `H07000${newLastDigit}`);
          lastH07000Value = newLastDigit;
        }
      } else {
        console.log(`Skipping modifications for ${PRODUCTION} environment.`.yellow);
      }

      if (newFileName !== fileName) {
        await fs.rename(`fichier/${fileName}`, `fichier/${newFileName}`);
        console.log(`File renamed: ${fileName} -> ${newFileName}`.green);
      }
    }
  } catch (error) {
    console.error(error.red);
  }
};

(async () => {
  try {
    await checkFileExistence(); // Check for directory and files
    const environment = await getEnvironment();
    const multiValue = await getRecipientChoice();
    await modifyFileNames(environment, multiValue);
  } catch (error) {
    console.error(error.red);
  } finally {
    readline.close();
  }
})();
