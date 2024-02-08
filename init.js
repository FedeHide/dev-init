const fs = require('fs').promises;
const path = require('path');

// Reads the output directory from the command line arguments.
const outputDirectory = process.argv[2];

if (!outputDirectory) {
    console.error('Error: It is required to specify an output directory.');
    process.exit(1);
}

async function createFiles(outputDirectory) {
    try {
        // To check if the output directory exists, oterwise, create it
        await fs.mkdir(outputDirectory, { recursive: true });

        // Read the content of the file template.json and parse it.
        const data = await fs.readFile('template.json', 'utf8');
        const templateData = JSON.parse(data);

        const files = [
            { fileName: 'package.json', content: templateData['package.json'] },
            { fileName: '.eslintignore', content: templateData['.eslintignore'] },
            { fileName: '.eslintrc.json', content: templateData['.eslintrc.json'] },
            { fileName: '.prettierignore', content: templateData['.prettierignore'] },
            { fileName: '.prettierrc.json', content: templateData['.prettierrc.json'] },
            { fileName: 'CODE_OF_CONDUCT.md', content: templateData['CODE_OF_CONDUCT.md'] },
            { fileName: 'LICENSE', content: templateData['LICENSE'] },
            { fileName: '.gitignore', content: templateData['.gitignore'] },
            { fileName: 'CHANGELOG.md', content: templateData['CHANGELOG.md'] },
            { fileName: 'README.md', content: templateData['README.md'] },
            { fileName: '_reset.scss', content: templateData['reset.scss'] },
            { fileName: 'index.html', content: templateData['index.html'] }
        ];

        // Process each file in parallel
        await Promise.all(files.map(async ({ fileName, content }) => {
            try {
                const fileContent = typeof content === 'object' ? JSON.stringify(content, null, 4) : content;
                const filePath = path.join(outputDirectory, fileName);
                await fs.writeFile(filePath, fileContent, 'utf8');
                console.log(`The file ${filePath} has been created successfully..`);
            } catch (err) {
                console.error(`Error writing to ${fileName}:`, err);
            }
        }));

        // Copy the update-tsconfig.mjs file to the output directory
        const sourceFilePath = 'update-tsconfig.mjs';
        const destinationFilePath = path.join(outputDirectory, sourceFilePath);
        await fs.copyFile(sourceFilePath, destinationFilePath);
        console.log(`The file ${sourceFilePath} has been copied to the output directory.`);

        console.log('All files have been created successfully 🚀');

    } catch (err) {
        console.error('Error creating the output directory or reading the template.json file.:', err);
    }
}

createFiles(outputDirectory);
