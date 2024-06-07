import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";
import chalk from "chalk";
import { SingleBar } from "cli-progress";

export function processFiles(dirs: string[]): void {
  let totalFiles = 0;
  dirs.forEach((dir) => {
    totalFiles += countAllFiles(dir);
  });

  const progressBar = new SingleBar({
    format:
      chalk.blue("Progress: {bar}") +
      " | {percentage}% || Arquivos: {value} / {total}",
    barCompleteChar: "\u25AE",
    barIncompleteChar: "\u25AF",
  });

  progressBar.start(totalFiles, 0);

  dirs.forEach((dir) => {
    const mp4Dir = path.join(dir, "mp4");
    const imageDir = path.join(dir, "image");
    const zipDir = path.join(dir, "zip");

    fs.mkdirSync(mp4Dir, { recursive: true });
    fs.mkdirSync(imageDir, { recursive: true });
    fs.mkdirSync(zipDir, { recursive: true });

    processDirectory(dir, mp4Dir, imageDir, zipDir, progressBar);
    deleteOtherDirectories(dir, [mp4Dir, imageDir, zipDir]);
  });

  progressBar.stop();
}

function processDirectory(
  dir: string,
  mp4Dir: string,
  imageDir: string,
  zipDir: string,
  progressBar: SingleBar
): void {
  try {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      if (fs.existsSync(filePath)) {
        if (fs.lstatSync(filePath).isDirectory()) {
          processDirectory(filePath, mp4Dir, imageDir, zipDir, progressBar);
        } else {
          const mimeType = mime.lookup(filePath);

          if (mimeType && mimeType.includes("video")) {
            const newFilePath = path.join(
              mp4Dir,
              `video_${path.basename(filePath)}`
            );
            fs.renameSync(filePath, newFilePath);
          } else if (mimeType && mimeType.includes("image")) {
            const newFilePath = path.join(
              imageDir,
              `image_${path.basename(filePath)}`
            );
            fs.renameSync(filePath, newFilePath);
          } else if (mimeType && mimeType.includes("application")) {
            const newFilePath = path.join(
              zipDir,
              `compressed_${path.basename(filePath)}`
            );
            fs.renameSync(filePath, newFilePath);
          }
          progressBar.increment();
        }
      } else {
        console.error(`File not found: ${filePath}`);
      }
    });
  } catch (err) {
    console.error(`Error processing directory: ${dir}`, err);
  }
}

function countAllFiles(dir: string): number {
  let totalFiles = 0;
  const stack = [dir];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        stack.push(filePath);
      } else {
        totalFiles++;
      }
    }
  }

  return totalFiles;
}

function deleteOtherDirectories(baseDir: string, excludeDirs: string[]): void {
  const excludeSet = new Set(excludeDirs);

  function deleteDirRecursive(dir: string): void {
    if (excludeSet.has(dir)) {
      return;
    }

    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        deleteDirRecursive(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });

    fs.rmdirSync(dir);
  }

  const subDirs = fs.readdirSync(baseDir).map((subDir) => path.join(baseDir, subDir));
  subDirs.forEach((subDir) => {
    if (!excludeSet.has(subDir)) {
      deleteDirRecursive(subDir);
    }
  });
}
