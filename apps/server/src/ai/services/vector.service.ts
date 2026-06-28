export class VectorService {
  static async indexDocument(collection: string, doc: any) { return true; }
  static async search(collection: string, queryVector: number[], limit = 5) { return []; }
  static async deleteDocument(collection: string, id: string) { return true; }
}
