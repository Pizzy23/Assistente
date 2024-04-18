import chalk from "chalk";
export class Colors {
  log(color: string) {
    const validColors = [
      "black",
      "red",
      "green",
      "yellow",
      "blue",
      "magenta",
      "cyan",
      "white",
      "gray",
    ];
    if (!validColors.includes(color)) {
      console.error(
        "Invalid Color: black, red, green, yellow, blue, magenta, cyan, white, gray"
      );
      return;
    }

    return function (message: string) {
      console.log(chalk[color](message));
    };
  }
}
