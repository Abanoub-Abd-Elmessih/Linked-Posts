import { TextField } from "@mui/material";

interface InputsProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?:boolean
}

export default function Inputs({ label, type, name, value, onChange,autoFocus}: InputsProps) {
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
        autoFocus={autoFocus}
      />
    </div>
  );
}
