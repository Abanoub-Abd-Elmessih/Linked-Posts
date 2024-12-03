import { TextField } from "@mui/material";

interface InputsProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Inputs({ label, type, name, value, onChange,}: InputsProps) {
  return (
    <div>
      <TextField
        type={type}
        id={name}
        name={name}
        label={label}
        variant="filled"
        value={value}
        onChange={onChange}
        fullWidth
      />
    </div>
  );
}
