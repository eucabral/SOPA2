import styles from "../form/input.module.css";

function Input({
  type,
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  multiple,
}) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        OnChange={handleOnChange}
        value={value}
        {...(multiple ? { multiple } : "")}
      />
    </div>
  );
}

export default Input;
