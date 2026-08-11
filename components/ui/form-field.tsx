import type { InputHTMLAttributes, ReactElement, ReactNode } from "react";
import { cloneElement } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  control: ReactElement<InputHTMLAttributes<HTMLInputElement>>;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  controlSuffix?: ReactNode;
};

export function FormField({ id, label, control, description, error, required = false, controlSuffix }: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [control.props["aria-describedby"], descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  const invalid = error ? true : control.props["aria-invalid"];
  const fieldControl = cloneElement(control, {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid || undefined,
    required: required || control.props.required || undefined,
  });

  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-small font-semibold text-text-primary" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div className={controlSuffix ? "relative" : undefined}>
        {fieldControl}
        {controlSuffix ? <div className="absolute inset-y-0 right-1 flex items-center">{controlSuffix}</div> : null}
      </div>
      {description ? <p className="text-body-small text-text-muted" id={descriptionId}>{description}</p> : null}
      {error ? <p className="text-body-small text-error-text" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}
