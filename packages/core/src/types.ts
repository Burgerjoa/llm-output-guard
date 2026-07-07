export type ValidationWarningType =
  | "UNCLOSED_FENCE"
  | "MALFORMED_FENCE"
  | "MISSING_LANGUAGE"
  | "SUSPICIOUS_NESTED_FENCE";

export type ValidationWarning = {
  type: ValidationWarningType;
  line: number;
  column: number;
  message: string;
  severity: "info" | "warning" | "error";
};

export type ValidationResult = {
  ok: boolean;
  warnings: ValidationWarning[];
  stats: {
    totalLines: number;
    codeFenceCount: number;
    codeBlockCount: number;
    unclosedFenceCount: number;
  };
};

export type FixResult = {
  fixedText: string;
  changed: boolean;
  appliedFixes: {
    type: string;
    line: number;
    message: string;
  }[];
};
