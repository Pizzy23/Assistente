import * as fs from "fs";
import * as yaml from "js-yaml";

export type ConfigInt = {
  Personality_Options: {
    name: string;
    tone: string;
    language: string;
  };
  Folders_Config: {
    main_folder: string;
    log_folder: string;
    exemples_nest: string;
    exemples_go: string;
  };
  Configs_Global: {
    choices: string[];
  };
  Payment_Config: {
    Loan: number;
    Total_Card: number;
    Total_For_Pay: number;
    slips: {
      Name: string;
      Value: number;
    }[];
  };
};

export class ConfigManager {
  private filePath = "./config.yaml";
  public configData: ConfigInt;

  constructor() {
    this.configData = this.loadConfig();
  }

  private loadConfig(): ConfigInt {
    try {
      const fileContents = fs.readFileSync(this.filePath, "utf8");
      return yaml.load(fileContents) as ConfigInt;
    } catch (e) {
      console.error(e);
      throw new Error("Failed to read or parse the config file");
    }
  }

  updateConfig(updates: Partial<ConfigInt>): void {
    this.configData = { ...this.configData, ...updates };
    const newYamlContent = yaml.dump(this.configData);
    fs.writeFileSync(this.filePath, newYamlContent, "utf8");
    console.log("Configuration updated and saved.");
  }
}
