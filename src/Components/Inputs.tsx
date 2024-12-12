import { TextField } from "@mui/material";

interface InputsProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?:boolean
  variant?: 'filled' | 'outlined' | 'standard';
  multiline?:boolean
  rows?:number
  required?:boolean
  accept?:string
}

export default function Inputs({ label, type, name, value, onChange,autoFocus , variant = 'filled',multiline=false,rows, required, accept}: InputsProps) {
  return (
    <div>
      <TextField
        type={type}
        id={name}
        name={name}
        label={label}
        variant={variant}
        value={value}
        onChange={onChange}
        fullWidth
        autoFocus={autoFocus}
        multiline={multiline}
        rows={rows}
        required={required}
        inputProps={type === "file" ? { accept } : undefined}
      />
    </div>
  );
}
