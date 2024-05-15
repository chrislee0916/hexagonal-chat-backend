export class SignInQuery {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) { }
}