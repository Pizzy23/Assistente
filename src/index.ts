import chalk from "chalk";
import inquirer from "inquirer";
import { exec } from "child_process";
import { Colors } from "./util/colors";
import { ConfigInt, ConfigManager } from "./config/configLoader";

class Main {
  colors: Colors;
  config: ConfigInt;

  constructor(config: ConfigInt) {
    this.colors = new Colors();
    this.config = config;
  }
  async runProject() {
    var log = this.colors.log("cyan");
    log(
      `Bem vindo ao sistema de assistente "${this.config.Personality_Options.name}"`
    );
  }
}

const configManager = new ConfigManager();
const config = configManager.configData;

const main = new Main(config);
main.runProject();
