import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";
import chalk from "chalk";
import { SingleBar } from "cli-progress";
import { runMain } from "..";

export function processFiles(dirs: string[]): void {
  dirs.forEach((dir) => {
    const defaultdir = dir;
    const mp4Dir = `${defaultdir}/mp4`;
    const imageDir = `${defaultdir}/image`;
    const zipDir = `${defaultdir}/zip`;

    fs.mkdirSync(mp4Dir, { recursive: true });
    fs.mkdirSync(imageDir, { recursive: true });

    let fileIndex = 5820;
    processDirectory(dir, mp4Dir, imageDir, zipDir, fileIndex);
  });
}

function processDirectory(
  dir: string,
  mp4Dir: string,
  imageDir: string,
  zipDir: string,
  fileIndex: number
): number {
  
  const progressBar = new SingleBar({
    format:
      chalk.blue("Progress: {bar}") +
      " | {percentage}% || Arquivos: {value} / {total}",
    barCompleteChar: "\u25AE",
    barIncompleteChar: "\u25AF",
  });

  const files = fs.readdirSync(dir);
  progressBar.start(files.length, 0);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      fileIndex = processDirectory(
        filePath,
        mp4Dir,
        imageDir,
        zipDir,
        fileIndex
      );
    } else {
      const mimeType = mime.lookup(filePath);

      if (mimeType && mimeType.includes("video")) {
        const videoTypes = ["video/mp4", "video/quicktime"];
        if (videoTypes.includes(mimeType)) {
          const newFilePath = path.join(mp4Dir, `video_${fileIndex}.mp4`);
          fs.renameSync(filePath, newFilePath);
          console.log(`Arquivo de vídeo movido para ${newFilePath}`);
        } else {
          console.log(`Arquivo de vídeo não suportado: ${filePath}`);
        }
      } else if (mimeType && mimeType.includes("image")) {
        const imageTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (imageTypes.includes(mimeType)) {
          const newFilePath = path.join(
            imageDir,
            `imagem_${fileIndex}${path.extname(file)}`
          );
          fs.renameSync(filePath, newFilePath);
          console.log(`Arquivo de imagem movido para ${newFilePath}`);
        } else {
          console.log(`Arquivo de imagem não suportado: ${filePath}`);
        }
      } else if (mimeType && mimeType.includes("application")) {
        const compressedTypes = [
          "application/zip",
          "application/x-rar-compressed",
        ];
        if (compressedTypes.includes(mimeType)) {
          const newFilePath = path.join(
            zipDir,
            `compressed_${fileIndex}${path.extname(file)}`
          );
          fs.renameSync(filePath, newFilePath);
          console.log(`Arquivo comprimido movido para ${newFilePath}`);
        } else {
          console.log(`Arquivo comprimido não suportado: ${filePath}`);
        }
      } else {
        console.log(`Tipo de arquivo não suportado: ${filePath}`);
      }
      fileIndex++;
      progressBar.increment();
    }
  });

  progressBar.stop();
  return fileIndex;
}
