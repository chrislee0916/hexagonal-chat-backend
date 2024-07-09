export class FindListMessageQuery {
  constructor(
    public readonly id: number,
    public readonly limit: number,
    public readonly skip: number,
    public readonly sort: string,
  ) {}
}
