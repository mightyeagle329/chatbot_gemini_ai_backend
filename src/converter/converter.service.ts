import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as shell from "shelljs";
import * as sharp from "sharp";
import { exec } from "child_process";
import { spawn } from "child_process";
import { execSync } from "child_process";
import { promisify } from "util";

const mm = "🔵 🔵 🔵 🔵 ConverterService: 🍎 ";
const fsPromises = fs.promises;
var conversionId = 1234;
@Injectable()
export class ConverterService {
  async convertPdfToPng(
    pdfFilePath: string,
    outputFilePath: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const command = `convert -density 300 "${pdfFilePath}" -quality 100 "${outputFilePath}"`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error converting PDF to PNG: ${error.message}`);
          reject(error);
        } else if (stderr) {
          console.error(`Error converting PDF to PNG: ${stderr}`);
          reject(new Error(stderr));
        } else {
          console.log(`PDF converted to PNG: ${outputFilePath}`);
          resolve(outputFilePath);
        }
      });
    });
  }

  async convertToHtmlFromMarkdown(
    markdownString: string,
    title: string
  ): Promise<any> {
    conversionId = new Date().getTime();

    // Set the paths for the temporary and output directories
    const tempDirPath = `${process.cwd()}/tempConversionDir`;

    // Create the temporary directory if it doesn't exist
    shell.mkdir("-p", tempDirPath);

    // Write the markdown string to a temporary file
    const tempFilePath = `${tempDirPath}/input_${conversionId}.md`;
    const tempOutFilePath = `${tempDirPath}/output_${conversionId}.html`;

    await fsPromises.writeFile(tempFilePath, markdownString);
    const mTitle = `"${title}"`;

    // Define the pandoc command to convert the markdown file to an HTML file
    const pandocCommand = `pandoc -f markdown -t html -s ${tempFilePath} -o ${tempOutFilePath} --metadata title=${mTitle}`;

    console.log(
      `${mm} pandocCommand has been setup OK, HTML will be put into file: ${tempOutFilePath}`
    );

    // Execute the pandoc command
    await new Promise<void>((resolve, reject) => {
      exec(pandocCommand, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    console.log(`${mm} returning HTML file path: $${tempOutFilePath}`);

    // Return the path of the generated HTML file
    return tempOutFilePath;
  }
  async convertToPdfFromMarkdown(
    markdownString: string,
    title: string
  ): Promise<any> {
    const conversionId = new Date().getTime();
    const tempDirPath = `${process.cwd()}/tempConversionDir`;
    let execPromise = promisify(exec);

    shell.mkdir("-p", tempDirPath);

    const tempFilePath = `${tempDirPath}/input_${conversionId}.tex`;
    const tempOutFilePath = `${tempDirPath}/output_${conversionId}.pdf`;

    fs.writeFileSync(tempFilePath, markdownString);
    const mTitle = `"${title}"`;

    const pandocCommand = `pandoc -f markdown -t pdf -s  ${tempFilePath} -o ${tempOutFilePath} --metadata title=${mTitle}`;
    console.log(
      `${mm} pandocCommand has been set up OK, PDF will be put into file: ${tempOutFilePath}`
    );

    try {
      await execPromise(pandocCommand);
      console.log(`${mm} Pandoc command executed successfully`);
      return tempOutFilePath;
    } catch (error) {
      console.error(`${mm} Error executing Pandoc: ${error}`);
      throw error;
    }
  }

  async convertToHtmlFromLaTeX(
    laTexString: string,
    title: string
  ): Promise<any> {
    const conversionId = new Date().getTime();
    const tempDirPath = `${process.cwd()}/tempConversionDir`;

    shell.mkdir("-p", tempDirPath);

    const tempFilePath = `${tempDirPath}/input_${conversionId}.tex`;
    const tempOutFilePath = `${tempDirPath}/output_${conversionId}.html`;
    let execPromise = promisify(exec);

    await fsPromises.writeFile(tempFilePath, laTexString);

    const mTitle = `"${title}"`
    const pandocCommand = `pandoc -f latex -t html -s --mathjax ${tempFilePath} -o ${tempOutFilePath} --metadata title=${mTitle}`;
    console.log(`${mm} pandocCommand: ${pandocCommand}`);
    console.log(
      `${mm} pandocCommand has been set up OK, latex from HTML will be put into file: ${tempOutFilePath}`
    );

    try {
      await execPromise(pandocCommand);
      console.log(`${mm} Pandoc command executed successfully`);
      return tempOutFilePath;
    } catch (error) {
      console.error(`${mm} Error executing Pandoc: ${error}`);
      throw error;
    }
  }

  async convertToPdfFromLaTeX(
    laTexString: string,
    title: string
  ): Promise<string> {
    const conversionId = new Date().getTime();
    const tempDirPath = `${process.cwd()}/tempConversionDir`;
    let execPromise = promisify(exec);

    shell.mkdir("-p", tempDirPath);

    const tempFilePath = `${tempDirPath}/input_${conversionId}.tex`;
    const tempOutFilePath = `${tempDirPath}/output_${conversionId}.pdf`;

    fs.writeFileSync(tempFilePath, laTexString);
    const mTitle = `"${title}"`;

    const pandocCommand = `pandoc -f latex -t pdf -s --mathjax ${tempFilePath} -o ${tempOutFilePath} --metadata title=${mTitle}`;
    console.log(
      `${mm} pandocCommand has been set up OK, PDF will be put into file: ${tempOutFilePath}`
    );

    try {
      await execPromise(pandocCommand);
      console.log(`${mm} Pandoc command executed successfully`);
      return tempOutFilePath;
    } catch (error) {
      console.error(`${mm} Error executing Pandoc: ${error}`);
      throw error;
    }
  }

  async deleteFilesInDirectory(directoryPath: string): Promise<void> {
    try {
      const files = await fs.promises.readdir(directoryPath);

      for (const file of files) {
        const filePath = `${directoryPath}/${file}`;
        await fs.promises.unlink(filePath);
      }

      console.log(`All files in ${directoryPath} have been deleted.`);
    } catch (error) {
      console.error(`Error deleting files in ${directoryPath}: ${error}`);
    }
  }
}
