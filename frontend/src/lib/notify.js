import { toast } from "sonner";

export const notify = {
  success: (message, opts = {}) => toast.success(message, opts),
  error: (message, opts = {}) => toast.error(message, opts),
  info: (message, opts = {}) => toast.message(message, opts),
  warning: (message, opts = {}) =>
    toast.warning
      ? toast.warning(message, opts)
      : toast.message(message, { ...opts, description: "Warning" }),
};

export default notify;
