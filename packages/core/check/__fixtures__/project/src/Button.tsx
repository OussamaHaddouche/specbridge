interface ButtonProps {
  label: string;
  variant: "primary" | "secondary";
  disabled?: boolean;
}

export function Button({
  label: _label,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return null;
}
