import * as fs from "fs";
import chalk from "chalk";
import { runMain } from "..";
import { SingleBar } from "cli-progress";

export async function processAuto(urls: string[]) {
  try {
    fs.unlinkSync("output.txt");
  } catch (err) {
    if (err.code === "ENOENT") {
    } else {
      console.error(err);
    }
  }

  const progressBar = new SingleBar({
    format:
      chalk.blue("Progress: {bar}") +
      " | {percentage}% || Arquivos: {value} / {total}",
      barCompleteChar: "\u25AE",
      barIncompleteChar: "\u25AF",
  });

  progressBar.start(urls.length, 0);

  const promises: Promise<void>[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (url.includes("rule34")) {
      const regex = /pid=(\d+)/;
      const match = url.match(regex);
      const pid = match ? parseInt(match[1]!) : 0;
      const iterations = Math.floor(pid / 42);
      for (let i = 0; i <= iterations; i++) {
        const newPid = 42 * i;
        const pidUrl = `${url}&pid=${newPid}\n`;
        promises.push(
          new Promise<void>((resolve, reject) => {
            fs.appendFile("output.txt", pidUrl, (err) => {
              if (err) {
                console.error(err);
                reject(err);
              }
              resolve();
            });
          })
        );
      }
    } else if (url.includes("simpcity")) {
      const regex = /\/page-\d+$/;
      const newUrl = url.replace(regex, "");
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
              fs.appendFile("output.txt", pageUrl, (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                }
                resolve();
              });
            })
          );
        }
      }
    }
    progressBar.update(i + 1);
  }

  Promise.all(promises)
    .then(() => {
      progressBar.stop();
      setTimeout(() => {
        fs.open("output.txt", "r", (err, fd) => {
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
        fs.open("output.txt", "r", (err, fd) => {
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
