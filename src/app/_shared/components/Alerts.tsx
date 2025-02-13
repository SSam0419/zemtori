import { CircleAlert, CircleCheck, LucideIcon, TriangleAlert } from "lucide-react";

import { cn } from "@/app/_shared/lib/utils";

type AlertVariant = "warning" | "danger" | "success";

interface AlertProps {
  message: string;
  variant: AlertVariant;
  className?: string;
  onClose?: () => void;
  role?: "alert" | "status";
}

const alertConfig: Record<
  AlertVariant,
  {
    icon: LucideIcon;
    colors: {
      border: string;
      text: string;
      bg: string;
    };
  }
> = {
  warning: {
    icon: TriangleAlert,
    colors: {
      border: "border-amber-500/50",
      text: "text-amber-600",
      bg: "bg-amber-50",
    },
  },
  danger: {
    icon: CircleAlert,
    colors: {
      border: "border-red-500/50",
      text: "text-red-600",
      bg: "bg-red-50",
    },
  },
  success: {
    icon: CircleCheck,
    colors: {
      border: "border-emerald-500/50",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  },
};

export default function Alert({
  message,
  variant,
  className,
  onClose,
  role = "alert",
}: AlertProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role={role}
      className={cn(
        "animate-fadeIn rounded-lg border px-4 py-3 transition-all",
        config.colors.border,
        config.colors.text,
        config.colors.bg,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center text-sm">
          <Icon
            className="-mt-0.5 me-3 inline-flex opacity-60"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>{message}</span>
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Close alert"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
}
