import { html } from "lit";
import { i18n } from "./i18n.js";
import { type BaseComponentProps, fc } from "./mini.js";

export interface DialogProps {
   isOpen: boolean;
   onClose?: () => void;
   children: any;
   width?: string;
   height?: string;
   className?: string;
   backdropClassName?: string;
}

export interface DialogHeaderProps {
   title: string;
   description?: string;
   className?: string;
}

export interface DialogContentProps extends BaseComponentProps {}

export interface DialogFooterProps extends BaseComponentProps {}

// Main Dialog container
export const Dialog = fc<DialogProps>(
   ({
      isOpen,
      onClose,
      children,
      width = "min(600px, 90vw)",
      height = "auto",
      className = "",
      backdropClassName = "bg-black/50",
   }) => {
      if (!isOpen) return html``;

      const handleBackdropClick = (e: Event) => {
         if (e.target === e.currentTarget) {
            onClose?.();
         }
      };

      // Add escape key handler
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose?.();
         }
      };

      // Add/remove event listener when dialog opens/closes
      if (isOpen) {
         document.addEventListener("keydown", handleKeyDown);
         // Clean up on unmount
         setTimeout(() => {
            if (!isOpen) {
               document.removeEventListener("keydown", handleKeyDown);
            }
         }, 0);
      }

      // Below the sm breakpoint (a browser side panel, a phone) the dialog is a sheet that
      // fills the viewport edge to edge; wider viewports get the centered card at width x height.
      return html`
         <!-- Backdrop -->
         <div class="fixed inset-0 ${backdropClassName} z-40" @click=${handleBackdropClick}>
            <!-- Modal -->
            <div
               class="fixed z-50 inset-0 bg-background flex flex-col overflow-y-auto sm:overflow-visible sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[var(--dialog-width)] sm:h-[var(--dialog-height)] sm:rounded-lg sm:border sm:border-border sm:shadow-xl ${className}"
               style="--dialog-width: ${width}; --dialog-height: ${height};"
               @click=${(e: Event) => e.stopPropagation()}
            >
               ${children}

               <!-- Close button - absolutely positioned -->
               <button
                  type="button"
                  @click=${() => onClose?.()}
                  class="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none cursor-pointer"
                  aria-label="${i18n("Close")}"
               >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
         </div>
      `;
   },
);

// Dialog header component
export const DialogHeader = fc<DialogHeaderProps>(({ title, description, className = "" }) => {
   return html`
      <div class="pr-8 ${className}">
         <h2 class="text-base font-semibold text-foreground${description ? " mb-1" : ""}">${title}</h2>
         ${description ? html`<p class="text-sm text-muted-foreground">${description}</p>` : ""}
      </div>
   `;
});

// Dialog content wrapper
export const DialogContent = fc<DialogContentProps>(({ children, className = "" }) => {
   return html` <div class="p-4 sm:p-6 flex flex-col gap-4 ${className}">${children}</div> `;
});

// Dialog footer for action buttons
export const DialogFooter = fc<DialogFooterProps>(({ children, className = "" }) => {
   return html` <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}">${children}</div> `;
});
