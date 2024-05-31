Here's the Markdown code for the README you requested:

## README: 🪄 File Renamer Script 🪄

**Description:**

This script automates the process of renaming files based on user input, making it easier to manage and organize your files. It's particularly useful when dealing with a large number of files that require consistent naming conventions.

**Features:**

- ‍♀️ **Environment Selection:** Choose between "Homologation" or "Production" mode to ensure appropriate modifications for your environment.
-  **MULTI Replacement:** Replace occurrences of "MULTI" with a user-specified value.
-  **FSYFCISP Replacement:** Replace occurrences of "FSYFCISP" with "FSYFCISH" in Homologation mode.
-  **H07000 Increment:** Increment the last digit of "H07000" for each file, ensuring unique filenames.
-  **TO_ Preservation:** Preserve the "TO_" prefix in filenames if it exists.
-  **File Existence Check:** Avoid duplicate filenames by checking for existing files before renaming.

**How to Use:**

1.  **Install Node.js:** Ensure you have Node.js installed on your system.
2.  **Clone the Script:** Clone or download the script repository to your local machine.
3. ⌨️ **Run the Script:** Open a terminal window, navigate to the script directory, and run the following command:
   ```bash
   node run.js
   ```
4. ➡️ **Follow the Prompts:** The script will guide you through the process, asking for environment selection, MULTI value, and confirmation.
5. 🪄 **File Renaming:** The script will then rename your files according to your input and the specified rules.

**Example Usage:**

```
Choose environment (Homologation or Production): Homologation
Enter the new value for "MULTI": MultiTest
File names modified for Homologation environment.
File renamed: FSYFCISP0001.txt -> FSYFCISH0001.txt
File renamed: TO_MULTI0002.txt -> TO_MultiTest0002.txt
File renamed: H070001.txt -> H070002.txt
```

**Benefits:**

- ⏱️ **Saves Time:** Automate repetitive file renaming tasks, saving you time and effort.
- ️ **Improves Organization:** Maintain consistent and organized file naming conventions for better file management.
- ️ **Reduces Errors:** Minimize the risk of manual errors and ensure consistent filenames.

**Emoji Guide:**

- 🪄: Represents the magic of automated file renaming.
- : Symbolizes the replacement and modification of file names.
- : Indicates the incrementing of the H07000 value.
- : Emphasizes the preservation of the TO_ prefix.
- : Highlights the file existence check to prevent duplicates.
- : Represents the Node.js environment for running the script.
- ️: Depicts the organization and management of files.
- ️: Symbolizes the reduction of errors and maintenance of consistency.

**Additional Notes:**

- For enhanced security, consider using the script in a controlled environment and avoiding direct access to sensitive data.
- Regularly back up your files before making any modifications.
- Feel free to customize the script to suit your specific needs and preferences.

**Happy File Renaming!**
