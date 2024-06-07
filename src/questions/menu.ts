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

  setMenuItems(arr: string[]): Question[] {
    return [
      {
        type: "list",
        name: "menu",
        message: "Selecione a onde quer ir.",
        choices: arr,
        default: "",
      },
    ];
  }

  setUrls(): Question[] {
    return [
      {
        type: "input",
        name: "des",
        message: "Nome para o arquivo separando com !",
        default: "",
      },
    ];
  }

  setDir(): Question[] {
    return [
      {
        type: "input",
        name: "des",
        message: "Destino que deseja separando com !",
        default: "",
      },
    ];
  }

  setConfig(): Question[] {
    return [
      {
        type: "list",
        name: "menu",
        message: "Selecione a seção que deseja atualizar.",
        choices: ["Personality_Options", "Folders_Config"],
        default: "",
      },
    ];
  }
  setPersonality(): Question[] {
    return [
      { type: "input", name: "name", message: "Nome:", default: "Crowing" },
      { type: "input", name: "tone", message: "Tom:", default: "" },
      { type: "input", name: "language", message: "Idioma:", default: "" },
    ];
  }

  setFolders(): Question[] {
    return [
      {
        type: "input",
        name: "exemples_nest",
        message: "Enter the path to Nest examples:",
        default: "",
      },
      {
        type: "input",
        name: "exemples_go",
        message: "Enter the path to Go examples:",
        default: "",
      },
      {
        type: "input",
        name: "main_folder",
        message: "Enter the path to the main folder:",
        default: "",
      },
      {
        type: "input",
        name: "log_folder",
        message: "Enter the path to the log folder:",
        default: "",
      },
    ];
  }

  setPayaments(): Question[] {
    return [
      {
        type: "number",
        name: "Loan",
        message: "Enter the loan amount:",
        default: "",
      },
      {
        type: "number",
        name: "Total_Card",
        message: "Enter the total amount on card:",
        default: "",
      },
      {
        type: "number",
        name: "Total_For_Pay",
        message: "Enter the total amount for payment:",
        default: "",
      },
    ];
  }

  setQuestionGPT(name: string): Question[] {
    return [
      {
        type: "input",
        name: "des",
        message: `Mande a pergunta para ${name}`,
        default: "",
      },
    ];
  }

  starterQuestion() {
    return [
      {
        type: "input",
        name: "des",
        message: `Aperte enter para continuar`,
        default: "",
      },
    ];
  }
}
