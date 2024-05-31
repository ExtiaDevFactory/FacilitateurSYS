const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const HOMOLOGATION = 'Homologation';
const PRODUCTION = 'Production';

const getEnvironment = () => {
  return new Promise((resolve, reject) => {
    readline.question(`Choose environment (${HOMOLOGATION} or ${PRODUCTION}): `, (environment) => {
      if (environment.toLowerCase() === HOMOLOGATION.toLowerCase()) {
        resolve(HOMOLOGATION);
      } else if (environment.toLowerCase() === PRODUCTION.toLowerCase()) {
        resolve(PRODUCTION);
      } else {
        reject(new Error('Invalid environment'));
      }
    });
  });
};

const modifyFileNames = async (environment, multiValue) => {
  const files = await fs.promises.readdir('fichier');
  const multiRegex = /MULTI/gi; // Case-insensitive global search for "MULTI"
  const fsyfcispRegex = /FSYFCISP/g; // Case-insensitive global search for "FSYFCISP"
  const h07000Regex = /H07000\d$/g; // Case-insensitive global search for "H07000" followed by a digit

  let lastH07000Value = 0; // Initialize a counter for the last H07000 value

  for (const fileName of files) {
    let newFileName = fileName; // Start with the original filename

    // Apply modifications based on environment:
    if (environment === HOMOLOGATION) {
      newFileName = newFileName.replace(multiRegex, multiValue);
      newFileName = newFileName.replace(fsyfcispRegex, 'FSYFCISH');

      // Ensure "TO_" is preserved:
      if (newFileName.startsWith('TO_')) {
        newFileName = newFileName.replace(/^TO_/, 'TO_' + multiValue);
      }

      // Modify H07000 portion:
      const h07000Match = newFileName.match(h07000Regex);
      if (h07000Match) {
        let newLastDigit = parseInt(h07000Match[0].slice(-1)) + 1; // Increment the last digit

        // Check if a file with the modified H07000 value already exists:
        let fileAlreadyExists = true;
        while (fileAlreadyExists) {
          const modifiedFileName = newFileName.replace(h07000Regex, `H07000${newLastDigit}`);
          try {
            await fs.promises.access(`fichier/${modifiedFileName}`);
            console.log(`File already exists: ${modifiedFileName}`);
            newLastDigit++; // Increment the last digit again
          } catch (error) {
            if (error.code === 'ENOENT') { // File doesn't exist
              fileAlreadyExists = false;
            } else {
              console.error(error);
              break; // Exit the loop if there's an unexpected error
            }
          }
        }

        newFileName = newFileName.replace(h07000Regex, `H07000${newLastDigit}`);

        // Update the counter for the next file:
        lastH07000Value = newLastDigit;
      }
    } else {
      console.log(`Skipping modifications for Production environment.`);
    }

    if (newFileName !== fileName) {
      await fs.promises.rename(`fichier/${fileName}`, `fichier/${newFileName}`);
      console.log(`File renamed: ${fileName} -> ${newFileName}`);
    }
  }
};

(async () => {
  try {
    const environment = await getEnvironment();

    // Get user input for MULTI value
    const multiValue = await new Promise((resolve) => {
      readline.question('Enter the new value for "MULTI": ', resolve);
    });

    await modifyFileNames(environment, multiValue);
  } catch (error) {
    console.error(error);
  } finally {
    readline.close();
  }
})();
