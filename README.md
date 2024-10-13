# Aletheia
This is a web extension made to reveal online food drive nutriscore and carbone impact.

## How to Build

Follow these steps to build Aletheia:

1. Ensure you have [Node.js](https://nodejs.org/) (version 12 or higher) installed on your system.

2. Clone the Aletheia repository:
git clone https://github.com/yourusername/aletheia.git
cd aletheia

markdown
Copier le code

3. Install the project dependencies:
npm install

markdown
Copier le code

4. Build the extension:
npm run build

vbnet
Copier le code

This command will create a `dist` folder containing the built extension.

5. For development with auto-rebuilding on file changes, use:
npm run watch

markdown
Copier le code

## Loading Aletheia in Your Browser

### Chrome

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the `dist` folder from the Aletheia project.

### Firefox

1. Open Firefox and navigate to `about:debugging`.
2. Click "This Firefox" in the left sidebar.
3. Click "Load Temporary Add-on" and select any file in the `dist` folder of Aletheia.

## Development

- Make changes to the TypeScript files in the `src` folder.
- The extension will automatically rebuild if you're running `npm run watch`.
- Reload the extension in your browser to see the changes.