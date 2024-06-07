import ExcelJS from "exceljs";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { runMain } from "..";
import inquirer from "inquirer";

interface Data {
  DB: {
    items: string[];
  };
}

export class EsoBuilder {
  private workbook = new ExcelJS.Workbook();
  private filePath = "./cache.yaml";
  private worksheet: ExcelJS.Worksheet;

  Start(items: string[]) {
    this.worksheet = this.workbook.addWorksheet("Sheet 1");

    this.worksheet.columns = [
      { header: "Set", key: "set", width: 20 },
      { header: "Essencial", key: "essencial", width: 20 },
      { header: "Type", key: "type", width: 20 },
      { header: "Use", key: "use", width: 20 },
    ];

    items.forEach((set, index) => {
      this._createCells(set, index + 2);
    });

    this._colors(items.length + 1);
    items.forEach((set) => this._setCache(this.filePath, set));

    this._applyHeaderStyle();
    return this.workbook;
  }

  private _createCells(set: string, rowIndex: number) {
    const parts = set.split(/\//);

    this.worksheet.addRow({
      set: parts[0] || "",
      essencial: parts[1] || "",
      type: parts[2] || "",
      use: parts[3] || "",
    });
  }

  private _colors(length: number) {
    const A: Partial<ExcelJS.FillPattern> = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF538DD5" },
    };
    const B: Partial<ExcelJS.FillPattern> = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF75AAE5" },
    };
    const C: Partial<ExcelJS.FillPattern> = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF84B4E8" },
    };
    const D: Partial<ExcelJS.FillPattern> = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF7AB3F2" },
    };

    for (let i = 2; i <= length; i++) {
      this.worksheet.getCell(`A${i}`).fill = A as ExcelJS.Fill;
      this.worksheet.getCell(`B${i}`).fill = B as ExcelJS.Fill;
      this.worksheet.getCell(`C${i}`).fill = C as ExcelJS.Fill;
      this.worksheet.getCell(`D${i}`).fill = D as ExcelJS.Fill;
    }
  }

  private _applyHeaderStyle() {
    const headerStyle: Partial<ExcelJS.FillPattern> = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF79D53" },
    };

    this.worksheet.getCell(`A1`).fill = headerStyle as ExcelJS.Fill;
    this.worksheet.getCell(`B1`).fill = headerStyle as ExcelJS.Fill;
    this.worksheet.getCell(`C1`).fill = headerStyle as ExcelJS.Fill;
    this.worksheet.getCell(`D1`).fill = headerStyle as ExcelJS.Fill;
  }

  private _setCache(filePath: string, newItem: string): void {
    try {
      const data = this._getCache(filePath);

      data.DB.items.push(newItem);

      const newYamlContent = yaml.dump(data);

      fs.writeFileSync(filePath, newYamlContent, "utf8");

      console.log(`Novo Set adicionado: "${newItem}"`);
    } catch (e) {
      console.error("Erro ao adicionar item ao arquivo YAML:", e);
    }
  }

  private _getCache(filePath: string): Data {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const data = yaml.load(fileContent) as Data;

      if (!data.DB.items) {
        data.DB.items = [];
      }

      return data;
    } catch (e) {
      console.error("Erro ao carregar o arquivo YAML:", e);
      return { DB: { items: [] } };
    }
  }
}

const setEsoQuestions = [
  {
    type: "input",
    name: "des",
    message: `
    Coloque o novo set "Set/Tank/Heal/debuffer" separando por "/".
    Set: Seria o nome do set que deseja adicionar.
    Que tipo de categoria é, se for de cura, tank ou algum pra debuffer ou buffer.
    Exemplo: Set/Tank/Heal/debuffer`,
    default: "",
  },
];

export async function getSets() {
  const esoBuilder = new EsoBuilder();
  let continueChat = true;
  let sets: string[] = [];

  while (continueChat) {
    const set = await inquirer.prompt(setEsoQuestions);
    sets.push(set.des);
    const anotherQuestion = await inquirer.prompt({
      type: "confirm",
      name: "askAgain",
      message: "Gostaria de adicionar mais armaduras?",
      default: true,
    });

    continueChat = anotherQuestion.askAgain;
  }

  const excel = esoBuilder.Start(sets);
  excel.xlsx
    .writeFile("esoBuilder.xlsx")
    .then(() => {
      console.log("Arquivo Excel criado com sucesso!");
    })
    .catch((err: Error) => {
      console.error("Erro ao criar o arquivo Excel:", err);
    });
}
