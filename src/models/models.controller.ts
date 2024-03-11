import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { FirestoreService } from "./models.service";
// import { FirestoreService } from "..models/FirestoreService";

@Controller("firestore")
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get(":collection/:documentId")
  async getData(
    @Param("collection") tx: any,
    @Param("documentId") documentId: string
  ): Promise<any> {
    return this.firestoreService.addAITransaction(tx);
  }

  @Post(":collection")
  async createData(
    @Param("collection") collection: string,
    @Body() data: any
  ): Promise<string> {
    return this.firestoreService.createData(collection, data);
  }
}
