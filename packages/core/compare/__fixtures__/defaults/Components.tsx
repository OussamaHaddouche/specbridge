interface Props {
  variant: "primary" | "secondary";
  disabled?: boolean;
  size?: number;
  label: string;
}

export function WithDefaults({
  variant = "primary",
  disabled = false,
  size = 2,
  label,
}: Props) {
  return null;
}

export function NoDefaults(_props: Props) {
  return null;
}

export const ArrowDefaults = ({
  variant = "secondary",
  disabled = true,
}: Props) => null;
