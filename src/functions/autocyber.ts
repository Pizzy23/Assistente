import * as fs from "fs";
import chalk from "chalk";
import { runMain } from "..";
import { SingleBar } from "cli-progress";

export async function processAuto(urls: string[]) {
  const outputFilePath = "output.txt";

  // Verifica se o arquivo existe, se não existir, cria-o
  if (!fs.existsSync(outputFilePath)) {
    try {
      fs.writeFileSync(outputFilePath, "");
    } catch (err) {
      console.error(err);
      return; // Retorna se houver um erro ao criar o arquivo
    }
  }

  let totalPages = 0;
  const promises: Promise<void>[] = [];

  // Primeiro, calcule o número total de páginas
  for (const url of urls) {
    if (url.includes("rule34")) {
      const regex = /pid=(\d+)/;
      const match = url.match(regex);
      const pid = match ? parseInt(match[1]!) : 0;
      totalPages += Math.ceil(pid / 42);
    } else if (url.includes("simpcity")) {
      const regex = /\/page-\d+$/;
      const match = url.match(/\/page-(\d+)$/);
      if (match) {
        totalPages += parseInt(match[1]!) - 1;
      }
    }
  }

  const progressBar = new SingleBar({
    format:
      chalk.blue("Progress: {bar}") +
      " | {percentage}% || Páginas: {value} / {total}",
    barCompleteChar: "\u25AE",
    barIncompleteChar: "\u25AF",
  });

  progressBar.start(totalPages + 1, 0);

  // Em seguida, processe as URLs e atualize a barra de progresso
  for (const url of urls) {
    if (url.includes("rule34")) {
      const regex = /pid=(\d+)/;
      const match = url.match(regex);
      const pid = match ? parseInt(match[1]!) : 0;
      const iterations = Math.ceil(pid / 42);
      for (let i = 0; i < iterations; i++) {
        const newPid = 42 * i;
        const pidUrl = `${url}&pid=${newPid}\n`;
        promises.push(
          new Promise<void>((resolve, reject) => {
            fs.appendFile(outputFilePath, pidUrl, (err) => {
              if (err) {
                console.error(err);
                reject(err);
              }
              progressBar.increment();
              resolve();
            });
          })
        );
      }
    } else if (url.includes("simpcity")) {
      const regex = /\/page-\d+$/;
      const newUrl = url.replace(regex, "");
      new Promise<void>((resolve, reject) => {
        fs.appendFile(outputFilePath, newUrl, (err) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        });
      });
      const match = url.match(/\/page-(\d+)$/);
      if (match) {
        const maxPage = parseInt(match[1]!);
        for (let page = 2; page <= maxPage; page++) {
          const pageUrl = `${url.substring(
            0,
            url.lastIndexOf("/page-")
          )}/page-${page}\n`;
          promises.push(
            new Promise<void>((resolve, reject) => {
              fs.appendFile(outputFilePath, pageUrl, (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                }
                progressBar.increment();
                resolve();
              });
            })
          );
        }
      }
    }
  }

  Promise.all(promises)
    .then(() => {
      progressBar.stop();
      setTimeout(() => {
        fs.open(outputFilePath, "r", (err, fd) => {
          if (err) {
            console.error(err);
            return;
          }
          return;
        });
        runMain();
      }, 4000); // 4 segundos
    })
    .catch((err) => {
      console.error(err);
      progressBar.stop();
      setTimeout(() => {
        fs.open(outputFilePath, "r", (err, fd) => {
          if (err) {
            console.error(err);
            return;
          }
          return;
        });
        runMain();
      }, 4000); // 4 segundos
    });
}
