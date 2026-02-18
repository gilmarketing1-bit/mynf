export default function LoginPage(): JSX.Element {
  return (
    <main>
      <h1>Login</h1>
      <p>Tela inicial de autenticação (integração com /api/auth/login na próxima etapa).</p>
      <form>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" placeholder="voce@empresa.com" />
        <br />
        <label htmlFor="password">Senha</label>
        <input id="password" type="password" placeholder="********" />
      </form>
    </main>
  );
}
