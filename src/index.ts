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
import { GPT } from "./functions/chatgpt";
import { EsoBuilder, getSets } from "./functions/eso";

interface Slip {
  Name: string;
  Value: number;
}

interface InputGpt {
  personality: string;
  message: string;
}

interface PaymentConfig {
  Loan: number;
  Total_Card: number;
  Total_For_Pay: number;
  slips: Slip[];
}

class Main {
  colors: Colors;
  config: ConfigInt;
  questions: MenuQuestions;
  configManager: ConfigManager;
  gpt: GPT;
  eso: EsoBuilder;
  firstTime: boolean;

  constructor(config: ConfigInt) {
    this.colors = new Colors();
    this.config = config;
    this.questions = new MenuQuestions();
    this.eso = new EsoBuilder();
    this.configManager = new ConfigManager();
    this.gpt = new GPT();
  }

  async run() {
    if (this.firstTime == true) {
      await this.runProject();
    }
    await inquirer.prompt(this.questions.starterQuestion());
    clearConsole();
    this.firstTime = true;
    await this.runProject();
  }

  async runProject() {
    const log = this.colors.log("cyan");
    log(
      `Bem vindo ao sistema de assistente "${this.config.Personality_Options.name}"`
    );
    const answers = await inquirer.prompt(
      this.questions.setMenuItems(this.config.Configs_Global.choices)
    );
    let option = answers.menu;
    switch (option) {
      case "Projeto Automatico":
        const command = new Cli();
        await command.starter();
        break;
      case "Cyber-Scraper":
        const autocyber = await inquirer.prompt(this.questions.setUrls());
        const autocyberPieces = autocyber.des.split(/[!]/);
        processAuto(autocyberPieces);
        break;
      case "Midia Organizador":
        const dirs = await inquirer.prompt(this.questions.setDir());
        const dirPiece = dirs.des.split(/[!]/);
        processFiles(dirPiece);
        break;
      case "Assistente":
        await this.runAssistant();
        break;
      case "Eso Builder":
        await getSets();
        break;
      case "Pagamentos":
        let config = await inquirer.prompt(this.questions.setPayaments());
        const slips = await this.getSlipsInput();
        this.configManager.updateConfig({
          Payment_Config: { ...config, slips },
        });
        break;
      case "Opções":
        const newOption = await inquirer.prompt(this.questions.setConfig());
        switch (newOption.menu) {
          case "Personality_Options":
            config = await inquirer.prompt(this.questions.setPersonality());
            this.configManager.updateConfig({ Personality_Options: config });
            break;
          case "Folders_Config":
            config = await inquirer.prompt(this.questions.setFolders());
            this.configManager.updateConfig({ Folders_Config: config });
            break;
        }

        break;
      default:
        console.log("Opção inválida");
    }
  }

  async runAssistant() {
    let continueChat = true;
    while (continueChat) {
      const answer = await inquirer.prompt(
        this.questions.setQuestionGPT(this.config.Personality_Options.name)
      );
      const input: InputGpt = {
        personality: this.config.Personality_Options.tone,
        message: answer.message,
      };
      try {
        const response = await this.gpt.gptResume(input);
        console.log(chalk.green(response));
      } catch (error: any) {
        console.error(chalk.red(`Erro ao chamar GPT: ${error.message}`));
      }

      const anotherQuestion = await inquirer.prompt({
        type: "confirm",
        name: "askAgain",
        message: "Gostaria de fazer outra pergunta?",
        default: true,
      });

      continueChat = anotherQuestion.askAgain;
    }
  }

  async getSlipsInput(): Promise<Slip[]> {
    const slips: Slip[] = [];
    let addMore = true;

    console.log(
      "Enter details for each slip. Press when you're done adding slips."
    );

    while (addMore) {
      const slip: Slip = await inquirer.prompt([
        {
          type: "input",
          name: "Name",
          message: "Enter the name of the slip:",
          default: "",
        },
        {
          type: "number",
          name: "Value",
          message: "Enter the value of the slip:",
          default: 0,
          validate: (input) => {
            return !isNaN(parseFloat(input)) || "Please enter a valid number";
          },
        },
      ]);

      slips.push(slip);

      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "addAnother",
          message: "Would you like to add another slip?",
          default: false,
        },
      ]);

      addMore = answer.addAnother;
    }

    return slips;
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
