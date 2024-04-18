import chalk from "chalk";
import inquirer from "inquirer";
import { exec } from "child_process";
import { File } from "./nodejs/files";
import { FileCopier } from "./nodejs/copy";
import { Questions } from "./nodejs/questions";
import { FileGo } from "./golang/folder";

console.log(chalk.gray("Bem vindo ao sistema automatizado."));

class Cli extends Questions {
  file: File;
  go: FileGo;
  copy: FileCopier;
  names: [any];

  constructor() {
    super();
    this.file = new File();
    this.copy = new FileCopier();
    this.go = new FileGo();
  }

  async starter() {
    this._setNewProject();
    this._setNames();
    this._setTypeProject();
    this._setProjectName();
    await this.noProject();
    return;
  }

  private async noProject() {
    try {
      inquirer.prompt(this._setNewProject()).then(async (answers) => {
        let obj = {
          nameProject: answers.nameProject,
          dist: answers.dist,
          name: [],
        };

        const nameAnswers = await inquirer.prompt(this._setNames());
        const project = await inquirer.prompt(this._setTypeProject());
        if (
          project.project.toLowerCase() == "nestjs" ||
          project.project.toLowerCase() == "nest" ||
          project.project.toLowerCase() == "n"
        ) {
          this.names = nameAnswers.des.split(/[|\/;]/);
          obj.name = this.names;
          await this.file.commands(obj);
          await this.copy.copyAllFiles(
            "C:\\Users\\luizc\\ProjectWorks\\Automatization\\ProjectAuto\\mainExemple",
            obj.dist
          );
        } else if (
          project.project.toLowerCase() == "golang" ||
          project.project.toLowerCase() == "go" ||
          project.project.toLowerCase() == "g"
        ) {
          const nameProject = await inquirer.prompt(this._setProjectName());
          this.names = nameAnswers.des.split(/[|\/;]/);
          obj.name = this.names;
          this.go.createDirectories(obj, nameProject.projectName);
          await this.copy.copyAllFiles(
            "C:\\Users\\luizc\\ProjectWorks\\Automatization\\ProjectAuto\\goExemple",
            obj.dist
          );
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  private error(err: string) {
    if (err == "num") {
      console.log(chalk.red(chalk.bold("Error Apenas numero")));
    }
  }
}

const command = new Cli();
command.starter();
