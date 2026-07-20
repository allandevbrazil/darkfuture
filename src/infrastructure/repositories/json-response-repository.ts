import type {
  ResponseRepository,
  ReadingMatrix,
} from "../../application/ports/response-repository";

export class JsonResponseRepository implements ResponseRepository {
  async getMatrix(): Promise<ReadingMatrix> {
    const response = await fetch(
      `${import.meta.env.BASE_URL}mocks/responses.json`,
    );
    if (!response.ok) {
      throw new Error("Nao foi possivel carregar os textos da leitura.");
    }

    return (await response.json()) as ReadingMatrix;
  }
}
