# My Tailwind Project

This project demonstrates how to set up and use Tailwind CSS with a simple HTML and JavaScript application.

## Installation

To install Tailwind CSS and its dependencies, follow these steps:

1. **Install Tailwind CSS and its dependencies:**
   Run the following command in the project directory:
   ```
   npm install tailwindcss postcss autoprefixer
   ```

2. **Create the Tailwind configuration file:**
   Generate the `tailwind.config.js` file by running:
   ```
   npx tailwindcss init
   ```

3. **Configure PostCSS:**
   In `postcss.config.js`, add the following configuration:
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   };
   ```

4. **Update `src/styles/main.css`:**
   Include Tailwind's base, components, and utilities by adding the following lines:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **Build the CSS:**
   Ensure that your build process compiles the CSS. You may need to add a script in `package.json` to build the CSS using PostCSS.

6. **Link the compiled CSS in `src/index.html`:**
   Make sure the link to the CSS file points to the output of your build process.

## Usage

After completing the installation steps, you can start using Tailwind CSS utility classes in your HTML files. Modify `src/index.html` to include your desired layout and styles.

## License

This project is open source and available under the MIT License.