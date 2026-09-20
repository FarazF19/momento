import { cn as cnMerge, type ClassValue } from "cn";

export function cn(...inputs: ClassValue[]) {
  return cnMerge(...inputs);
}
