import { Controller, Get, Query, Res } from "@nestjs/common";
import { ConverterService } from "./converter.service";
import { Response } from "express";
import { createReadStream } from "fs";
import * as mfs from "fs";

const mm = "🍎 🍎 🍎 ConverterController: 🍎 ";

@Controller("converter")
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  private async sendFileResponse(
    filePath: string,
    res: Response,
    contentType: string
  ): Promise<void> {
    const fileStream = createReadStream(filePath);
    const fileStats = await mfs.promises.stat(filePath);
    const fileSize = fileStats.size;
    console.log(
      `${mm} returning file name: ${filePath}, size: ${fileSize} bytes`
    );
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", fileSize.toString());
    fileStream.pipe(res);
  }


  @Get("/convertToHtmlFromMarkdown")
  async convertToHtmlFromMarkdown(
    @Query("markdownString") markdownString: string,
    @Query("title") title: string,

    @Res() res: Response
  ): Promise<void> {
    const filePath = await this.converterService.convertToHtmlFromMarkdown(
      markdownString,
      title
    );
    await this.sendFileResponse(filePath, res, "text/html");
  }

  @Get("/convertToPdfFromMarkdown")
  async convertToPdfFromMarkdown(
    @Query("markdownString") markdownString: string,
    @Query("title") title: string,

    @Res() res: Response
  ): Promise<void> {
    const filePath = await this.converterService.convertToPdfFromMarkdown(
      markdownString,
      title
    );
    await this.sendFileResponse(filePath, res, "application/pdf");
  }

  @Get("/convertToHtmlFromLaTeX")
  async convertToHtmlFromLaTeX(
    @Query("laTexString") laTexString: string,
    @Query("title") title: string,

    @Res() res: Response
  ): Promise<void> {
    const filePath = await this.converterService.convertToHtmlFromLaTeX(
      laTexString,
      title
    );
    await this.sendFileResponse(filePath, res, "text/html");
  }

  @Get("/convertToPdfFromLaTeX")
  async convertToPdfFromLaTeX(
    @Query("laTexString") laTexString: string,
    @Query("title") title: string,
    @Res() res: Response
  ): Promise<void> {
    const filePath = await this.converterService.convertToPdfFromLaTeX(
      laTexString,
      title
    );
    await this.sendFileResponse(filePath, res, "application/pdf");
  }

  @Get("/ping")
  ping(): string {
    console.log(`${mm} pinged!! .......`);
    return `${mm} Ping response at ${new Date()}`;
  }
}
