function Select({ children, ...props }) {
  return (
    <select {...props} className="form-input">
      <option label={props.placeholder} value={null}>
        {props.placeholder}
      </option>
      {children}
    </select>
  );
}
/* 绑定静态属性   */
Select.Option = function (props) {
  return <option {...props} className="" label={props.children}></option>;
};
Select.displayName = "select";
export default Select;
