import Input from "../../form/input";
import { Link } from "react-router-dom";
import styles from "../../form/Form.module.css";

function Register() {
  function handleChange(e) {}

  return (
    <section className={styles.form_container}>
      <h1>Register</h1>
      <form>
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite seu nome!"
          handleOnChange={handleChange}
        />
        <Input
          text="Telefone"
          type="text"
          name="Phone"
          placeholder="Digite seu telefone!"
          handleOnChange={handleChange}
        />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite seu email!"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha!"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirme sua senha"
          type="password"
          name="confirmpassowrd"
          placeholder="Confirme sua senha !"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Já tem conta? <Link to="/login">clique aqui.</Link>
      </p>
    </section>
  );
}

export default Register;
