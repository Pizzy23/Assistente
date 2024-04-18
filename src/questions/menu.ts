interface Question {
  type: string;
  name: string;
  message: string;
  default?: string;
}

export class MenuQuestions {
  nameSet: any;
  questions: Question[];

  constructor() {
    this.questions = this._setMenuItems();
  }

  _setMenuItems(): Question[] {
    return [
      {
        type: "list",
        name: "menu",
        message: "Selecione a onde quer ir.",
        default: "",
      },
    ];
  }
  _setNames(): Question[] {
    return [
      {
        type: "input",
        name: "des",
        message: "Nome para o arquivo separando com | ou / ou ;",
        default: "",
      },
    ];
  }
}
