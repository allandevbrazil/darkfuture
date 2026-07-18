import type {
  ResponseRepository,
  ResponseTemplates,
} from "../../application/ports/response-repository";

export class JsonResponseRepository implements ResponseRepository {
  async getTemplates(): Promise<ResponseTemplates> {
    const response = await fetch("/mocks/responses.json");
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar os textos da leitura.");
    }

    return (await response.json()) as ResponseTemplates;
  }
}
