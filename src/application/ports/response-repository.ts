export type ResponseTemplates = {
  intros: string[];
  conclusions: string[];
  advices: string[];
};

export interface ResponseRepository {
  getTemplates(): Promise<ResponseTemplates>;
}
