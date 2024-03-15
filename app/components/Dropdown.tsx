interface ButtonProps {
  text?: string;
}

const Dropdown: React.FC<ButtonProps> = ({ text = "Dropdown" }) => {
  return (
    <div>
      {text}
    </div>
  )
}

export default Dropdown;