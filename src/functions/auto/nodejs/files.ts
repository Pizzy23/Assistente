import { exec } from "child_process";
import * as fs from "fs";
import * as fsE from "fs-extra";
import * as path from "path";
import { Obj } from "./interface";
import { ExempleFiles } from "./exempleFiles";
import { Folder } from "./folder";
import chalk from "chalk";
import { FileCopier } from "./copy";

export class File extends Folder {
  file: ExempleFiles;
  copy: FileCopier;
  constructor() {
    super();
    this.file = new ExempleFiles();
    this.copy = new FileCopier();
  }
  async exec(comando) {
    return new Promise((resolve, reject) => {
      exec(comando, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  }
  async commands(obj: Obj) {
    this.starterProject(obj.dist);
    obj.name.forEach((item) => {
      const commands = this.file.instanceFiles(item);
      commands.forEach(async (command) => {
        switch (command.desc) {
          case "service":
            this.createServiceFolder(obj.dist, item);
            await this.filesCreation(item, command);
            break;
          case "entity":
            this.createEntityFolder(obj.dist, item);
            await this.filesCreation(item, command);
            break;
          case "controller":
            this.createControllerFolder(obj.dist, item);
            await this.filesCreation(item, command);
            break;
          case "interface":
            this.createInterfaceFolder(obj.dist, item);
            await this.filesCreation(item, command);
            break;
          case "dto":
            this.createDtoFolder(obj.dist, item);
            await this.filesCreation(item, command);
            break;
          default:
            break;
        }
      });
    });
  }
  async filesCreation(item: any, contents: any) {
    const fileName = `${item}.${contents.desc}.ts`;
    switch (contents.desc) {
      case "service":
        const servicePath = path.join(this.servicePath, item, fileName);
        try {
          this.indexFile(this.servicePath, item, fileName);
          fsE.writeFileSync(servicePath, contents.command, "utf-8");
        } catch (e) {
          console.log(e);
        }
        break;
      case "entity":
        const entityPath = path.join(this.entityPath, item, fileName);
        try {
          this.indexFile(this.entityPath, item, fileName);
          fsE.writeFileSync(entityPath, contents.command, "utf-8");
        } catch (e) {
          console.log(e);
        }
        break;
      case "controller":
        const controllerPath = path.join(this.controllerPath, item, fileName);
        try {
          this.indexFile(this.controllerPath, item, fileName);
          fsE.writeFileSync(controllerPath, contents.command, "utf-8");
        } catch (e) {
          console.log(e);
        }
        break;
      case "interface":
        const interfPath = path.join(this.interfacePath, item, fileName);
        try {
          this.indexFile(this.interfacePath, item, fileName);
          fsE.writeFileSync(interfPath, contents.command, "utf-8");
        } catch (e) {
          console.log(e);
        }
        break;
      case "dto":
        const dtoPath = path.join(this.dtoPath, item, fileName);
        try {
          this.indexFile(this.dtoPath, item, fileName);
          fsE.writeFileSync(dtoPath, contents.command, "utf-8");
        } catch (e) {
          console.log(e);
        }
        break;
      default:
        break;
    }
  }
  async indexFile(filePath, item, fileName) {
    try {
      const indexPath = path.join(filePath, "index.ts");
      const fileReal = await fs.promises.readFile(indexPath, "utf-8");
      const newIndexLine = `export * from './${item}/${path.basename(
        fileName,
        ".ts"
      )}'\n`;
      const index = fileReal + newIndexLine;
      if (!fileReal.includes(newIndexLine)) {
        await fs.promises.appendFile(indexPath, newIndexLine);
      } else {
        console.log(chalk.blue(`Index ${indexPath} já contém a nova linha.`));
      }
    } catch (e) {
      console.error(chalk.red(`Erro: ${e.message}`));
    }
  }

  starterProject(destinationPath) {
    const srcPath = path.join(destinationPath, "src");
    const contextPath = path.join(srcPath, "context");
    const viewPath = path.join(srcPath, "view");
    const contextServicePath = path.join(contextPath, "service");
    const contextEntityPath = path.join(contextPath, "entity");
    const contextControllerPath = path.join(contextPath, "controller");
    const viewDtoPath = path.join(viewPath, "dto");
    const viewInterfacePath = path.join(viewPath, "interface");

    try {
      fsE.ensureDirSync(contextPath);

      this.copy.copyAllFiles(
        "C:\\Users\\luizc\\ProjectWorks\\Automatization\\ProjectAuto\\middlewareExemple",
        srcPath
      );

      fsE.ensureDirSync(viewPath);

      fsE.ensureDirSync(contextServicePath);

      fsE.ensureDirSync(contextEntityPath);

      fsE.ensureDirSync(contextControllerPath);

      fsE.ensureDirSync(viewDtoPath);

      fsE.ensureDirSync(viewInterfacePath);
    } catch (e) {
      console.log(e);
    }
  }
}
