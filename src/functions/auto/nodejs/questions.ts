import chalk from "chalk";

export class Questions {
  nameSet: any;
  questions: any;

  _setTypeProject() {
    return (this.questions = [
      {
        type: "input",
        name: "project",
        message: "Tipo de projeto 'Nestjs ou GoLang'",
        default: "",
      },
    ]);
  }
  _setProjectName() {
    return (this.questions = [
      {
        type: "input",
        name: "projectName",
        message: "Qual o nome do projeto em go?",
        default: "",
      },
    ]);
  }
  _setNewProject() {
    return (this.questions = [
      {
        type: "input",
        name: "dist",
        message: "Aonde voce vai criar?",
        default: "C:/",
      },
    ]);
  }
  _setNames() {
    return (this.nameSet = [
      {
        type: "input",
        name: "des",
        message: "Nome para o arquivo separando com | ou / ou ;",
        default: "",
      },
    ]);
  }
}
