import chalk from "chalk";
import inquirer from "inquirer";
import { exec } from "child_process";
import { File } from "./nodejs/files";
import { FileCopier } from "./nodejs/copy";
import { Questions } from "./nodejs/questions";
import { FileGo } from "./golang/folder";
import { ConfigManager } from "../../config/configLoader";
import { runMain } from "../..";
import { SingleBar } from "cli-progress";

export class Cli extends Questions {
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
    await this.noProject();
    return;
  }

  private async noProject() {
    try {
      const answers = await inquirer.prompt(this._setNewProject());

      let obj = {
        nameProject: answers.nameProject,
        dist: answers.dist,
        name: [],
      };

      const nameAnswers = await inquirer.prompt(this._setNames());

      const project = await inquirer.prompt(this._setTypeProject());

      const progressBar = new SingleBar({
        format:
          chalk.blue("Progress: {bar}") +
          " | {percentage}% || Arquivos: {value} / {total}",
          barCompleteChar: "\u25AE",
          barIncompleteChar: "\u25AF",
      });

      let totalProgress = 0;
      let totalSteps = 0;

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

        const progress = this.names.length * 5 + 22;
        totalSteps = progress;
        progressBar.start(totalSteps, totalProgress);

        for (let i = 1; i <= progress; i++) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          totalProgress++;
          progressBar.update(totalProgress);
        }
        console.log(chalk.green("Projeto Criado com sucesso"));
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

        const progress = this.names.length * 3 + 11;
        totalSteps = progress;

        progressBar.start(totalSteps, totalProgress);

        for (let i = 1; i <= progress; i++) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          totalProgress++;
          progressBar.update(totalProgress);
        }
      }
      progressBar.stop();
      console.log(chalk.green("Projeto Criado com sucesso"));
      setTimeout(() => {
        runMain();
      }, 500);
    } catch (e) {
      console.log(e);
      runMain();
    }
  }
}
