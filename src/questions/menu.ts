interface Question {
  type: string;
  name: string;
  choices?: string[];
  message: string;
  default?: string;
}

export class MenuQuestions {
  nameSet: any;
  questions: Question[];

  setMenuItems(): Question[] {
    return [
      {
        type: "list",
        name: "menu",
        message: "Selecione a onde quer ir.",
        choices: ["project", "auto", "organization", "gpt"],
        default: "",
      },
    ];
  }

  setUrls(): Question[] {
    return [
      {
        type: "input",
        name: "des",
        message: "Nome para o arquivo separando com ! ou &",
        default: "",
      },
    ];
  }
  setDir(): Question[] {
    return [
      {
        type: "input",
        name: "des",
        message: "Destino que deseja separando com ! ou &",
        default: "",
      },
    ];
  }
}
