const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const { Manager, Engineer, Intern } = require("./lib");
const render = require("./src/page-template.js");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const team = [];

const ensureDirectoryExists = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

async function addEmployee(role) {
  const questions = [
    { type: "input", name: "name", message: `Input ${role}'s Name` },
    { type: "input", name: "id", message: `Input ${role}'s ID Number` },
    { type: "input", name: "email", message: `Input ${role}'s Email` },
    { type: "input", name: "extra", message: `Input ${role}'s ${role === "Manager" ? "Office Number" : role === "Engineer" ? "GitHub Username" : "Current School"}` },
  ];

  const answers = await inquirer.prompt(questions);
  const employee = new (role === "Manager" ? Manager : role === "Engineer" ? Engineer : Intern)(answers.name, answers.id, answers.email, answers.extra);
  team.push(employee);
  
  await promptUser();
}

async function promptUser() {
  const userChoice = await inquirer.prompt([
    { type: "list", name: "menu", message: "What would you like to do?", choices: ["Add a Manager", "Add an Engineer", "Add an Intern", "Finish building the team"] },
  ]);

  if (userChoice.menu.startsWith("Add")) {
    const role = userChoice.menu.split(" ").pop();
    await addEmployee(role);
  } else {
    generateHTML();
  }
}

async function generateHTML() {
  const html = render(team);
  ensureDirectoryExists(outputPath); // Ensure directory exists
  fs.writeFileSync(outputPath, html);
  console.log("HTML successfully generated!");
}

promptUser();
