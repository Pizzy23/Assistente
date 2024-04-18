import * as fs from "fs";
import * as path from "path";
import { Obj } from "../nodejs/interface";
import chalk from "chalk";

export class FileGo {
  createDirectories(obj: Obj, project: string): void {
    const directories = [
      `cmd/${project.toLowerCase()}`,
      "config",
      "db",
      "middleware",
    ];

    obj.name.forEach((pkg) => {
      const internalDir = `internal/${pkg}`;
      const subDirectories = ["handler", "service", "storage"];

      [internalDir].forEach((dir) => {
        directories.push(dir);
        subDirectories.forEach((subDir) => {
          const fullDirPath = `${dir}/${subDir}`;
          directories.push(fullDirPath);
          const baseFileName = `${pkg}.${subDir}.go`;
          const baseFilePath = path.join(obj.dist, fullDirPath, baseFileName);

          fs.mkdirSync(path.join(obj.dist, fullDirPath), { recursive: true });

          const packageDeclaration = `package ${pkg};\n\n`;
          fs.writeFileSync(baseFilePath, packageDeclaration, {
            encoding: "utf-8",
          });
          console.log(chalk.green(`Created base file: ${baseFilePath}`));
        });
      });
    });

    directories.forEach((dir) => {
      const dirPath = path.join(obj.dist, dir);
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(chalk.blue(`Created directory: ${dirPath}`));
    });

    fs.writeFileSync(path.join(obj.dist, `cmd/${project}/main.go`), "", {
      encoding: "utf-8",
    });
    console.log(`Created main.go in cmd/${project}`);
  }
}
