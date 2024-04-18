import * as fs from "fs";
import * as fsE from "fs-extra";
import * as path from "path";
import chalk from "chalk";

export class Folder {
  controllerPath: any;
  servicePath: any;
  entityPath: any;
  dtoPath: any;
  interfacePath: any;
  folder: any;
  createControllerFolder(folder: any, item: any): void {
    let controllerPath = path.join(folder, "src", "context", "controller");
    const subfolderName = item;
    const subfolderPath = path.join(controllerPath, subfolderName);
    this.controllerPath = controllerPath;
    try {
      fsE.ensureDirSync(subfolderPath);
      console.log(chalk.blue(`Subfolder ${subfolderPath} created.`));
      this.indexCreate(controllerPath);
    } catch (e) {
      console.log(e);
    }
  }

  createServiceFolder(folder: any, item: any): void {
    const servicePath = path.join(folder, "src", "context", "service");
    const subfolderName = item;
    const subfolderPath = path.join(servicePath, subfolderName);
    this.servicePath = servicePath;
    try {
      fsE.ensureDirSync(subfolderPath);
      console.log(chalk.blue(`Subfolder ${subfolderPath} created.`));
      this.indexCreate(servicePath);
    } catch (e) {
      console.log(e);
    }
  }

  createEntityFolder(folder: any, item: any): void {
    const entityPath = path.join(folder, "src", "context", "entity");
    const subfolderName = item;
    const subfolderPath = path.join(entityPath, subfolderName);
    this.entityPath = entityPath;
    try {
      fsE.ensureDirSync(subfolderPath);
      console.log(chalk.blue(`Subfolder ${subfolderPath} created.`));
      this.indexCreate(entityPath);
    } catch (e) {
      console.log(e);
    }
  }

  createDtoFolder(folder: any, item: any): void {
    const dtoPath = path.join(folder, "src", "view", "dto");
    const subfolderName = item;
    const subfolderPath = path.join(dtoPath, subfolderName);
    this.dtoPath = dtoPath;
    try {
      fsE.ensureDirSync(subfolderPath);
      console.log(chalk.blue(`Subfolder ${subfolderPath} created.`));
      this.indexCreate(dtoPath);
    } catch (e) {
      console.log(e);
    }
  }

  createInterfaceFolder(folder: any, item: any): void {
    const interfacePath = path.join(folder, "src", "view", "interface");
    const subfolderName = item;
    const subfolderPath = path.join(interfacePath, subfolderName);
    this.interfacePath = interfacePath;
    try {
      fsE.ensureDirSync(subfolderPath);
      console.log(chalk.blue(`Subfolder ${subfolderPath} created.`));
      this.indexCreate(interfacePath);
    } catch (e) {
      console.log(e);
    }
  }

  createFoldersView(item) {
    const folderPath = path.join("./src/view", item);

    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Folder ${folderPath} created.`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  indexCreate(pathFile) {
    try {
      const indexPath = path.join(pathFile, "index.ts");
      if (!fs.existsSync(indexPath)) {
        fsE.writeFileSync(indexPath, "", "utf-8");
        console.log(chalk.magentaBright(`Index ${indexPath} created.`));
      }
      return;
    } catch (error) {
      console.log("An error occurred:", error);
    }
  }
  copyPast(item) {
    const folderPath = path.join(".", item);

    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Folder ${folderPath} created.`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}
