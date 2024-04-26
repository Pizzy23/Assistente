import chalk from "chalk";
import inquirer from "inquirer";
import { exec } from "child_process";
import clear from "clear-screen";

import { Colors } from "./util/colors";
import { ConfigInt, ConfigManager } from "./config/configLoader";
import { MenuQuestions } from "./questions/menu";
import { Cli } from "./functions/auto/cli";
import { processAuto } from "./functions/autocyber";
import { processFiles } from "./functions/organization";

class Main {
  colors: Colors;
  config: ConfigInt;
  questions: MenuQuestions;

  constructor(config: ConfigInt) {
    this.colors = new Colors();
    this.config = config;
    this.questions = new MenuQuestions();
  }

  async run() {
    await this.runProject();
  }

  async runProject() {
    var log = this.colors.log("cyan");
    log(
      `Bem vindo ao sistema de assistente "${this.config.Personality_Options.name}"`
    );
    const answers = await inquirer.prompt(this.questions.setMenuItems());
    let option = answers.menu;
    switch (option) {
      case "project":
        const command = new Cli();
        await command.starter();
        break;
      case "auto":
        const autocyber = await inquirer.prompt(this.questions.setUrls());
        const autocyberPieces = autocyber.des.split(/[!&]/);
        processAuto(autocyberPieces);
        break;
      case "organization":
        const dirs = await inquirer.prompt(this.questions.setUrls());
        const dirPiece = dirs.des.split(/[!&]/);
        processFiles(dirPiece);
        break;
      case "gpt":
        break;
      default:
        console.log("Opção inválida");
    }
  }
}

const configManager = new ConfigManager();
const config = configManager.configData;

const main = new Main(config);
main.run();

export async function runMain() {
  console.clear();
  clearConsole();
  await main.run();
}

function clearConsole(): void {
  const isWindows = process.platform === "win32";
  const command = isWindows ? "cls" : "clear";
  require("child_process").execSync(command);
}
