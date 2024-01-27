import { Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";
import { AITransaction } from "./transaction";
import { initializeApp } from "firebase-admin/app";
import * as admin from "firebase-admin";
import * as path from "path";

const mm = "FirestoreService";
@Injectable()
export class FirestoreService {
  private firestore: Firestore;

  constructor() {
    this.init();
  }

  init() {
    // Initialize Firebase with default credentials
    // console.log(`${mm} ... initialize Firebase ..........`);
    // initializeApp({
    //     projectId: 'sgela-ai-33'
    // });
    // console.log(`${mm} ... Firebase initialized OK 🍎 🍎 🍎 🍎 🍎 🍎`);
    this.firestore = new Firestore();
  }

  async createData(collection: string, data: any): Promise<string> {
    const documentRef = this.firestore.collection(collection).doc();
    await documentRef.set(data);
    return documentRef.id;
  }
  async addTransaction(transaction: AITransaction): Promise<string> {
    const documentRef = this.firestore.collection("ai_transactions").doc();
    const res = await documentRef.set(transaction.toJson());
    console.log(`${mm} .... addTransaction: Gemini AI: 🍎 🍎 ${res}`);
    return documentRef.id;
  }
  async addPaymentSucceeded(payload: any): Promise<string> {
    const documentRef = this.firestore
      .collection("RapidPaymentSucceeded")
      .doc();
    const res = await documentRef.set(payload);
    console.log(`${mm} .... addPaymentSucceeded: res: 🍎 🍎 ${res}`);
    return documentRef.id;
  }
  async addPaymentCompleted(payload: any): Promise<string> {
    const documentRef = this.firestore
      .collection("RapidPaymentCompleted")
      .doc();
    const res = await documentRef.set(payload);
    console.log(`${mm} .... addPaymentCompleted: res: 🍎 🍎 ${res}`);
    return documentRef.id;
  }
  async addPaymentFailed(payload: any): Promise<string> {
    const documentRef = this.firestore
      .collection("RapidPaymentFailed")
      .doc();
    const res = await documentRef.set(payload);
    console.log(`${mm} .... addPaymentFailed: res: 🍎 🍎 ${res}`);
    return documentRef.id;
  }
}
