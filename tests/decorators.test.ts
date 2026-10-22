import { expect, test } from "vitest";
import { ModeToggle } from "../dist/ModeToggle.js";

test("compiled legacy decorators preserve reactive properties and class field setters", async () => {
   const toggle = new ModeToggle();
   document.body.append(toggle);
   try {
      await toggle.updateComplete;
      expect(customElements.get("mode-toggle")).toBe(ModeToggle);
      expect(Object.hasOwn(toggle, "selectedIndex")).toBe(false);
      expect(toggle.querySelectorAll("button")).toHaveLength(2);

      toggle.modes = ["First", "Second", "Third"];
      await toggle.updateComplete;
      expect(toggle.querySelectorAll("button")).toHaveLength(3);

      let selected: unknown;
      toggle.addEventListener("mode-change", (event) => {
         selected = (event as CustomEvent<{ index: number; mode: string }>).detail;
      });
      toggle.querySelectorAll("button")[2].click();
      await toggle.updateComplete;
      expect(toggle.selectedIndex).toBe(2);
      expect(selected).toEqual({ index: 2, mode: "Third" });
      expect(toggle.querySelectorAll("button")[2].classList.contains("bg-card")).toBe(true);
   } finally {
      toggle.remove();
   }
});
