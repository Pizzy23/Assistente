import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

export class FileCopier {
  private dist;
  private path;

  public async copyFiles(origem: string, destino: string) {
    const origemDir = path.join(this.path, origem);
    const destinoDir = path.join(this.dist, destino);

    if (!fs.existsSync(destinoDir)) {
      fs.mkdirSync(destinoDir, { recursive: true });
    }

    const items = fs.readdirSync(origemDir);

    for (const item of items) {
      const origemItem = path.join(origemDir, item);
      const destinoItem = path.join(destinoDir, item);

      if (fs.statSync(origemItem).isDirectory()) {
        this.copyFiles(path.join(origem, item), path.join(destino, item));
        console.log(chalk.yellow(`Preset: ${origemItem} created.`))
      } else {
        fs.copyFileSync(origemItem, destinoItem);
      }
    }
  }

  public async copyAllFiles(path: string, dist: string) {
    this.dist = dist;
    this.path = path;
    this.copyFiles("", "");
  }
}
