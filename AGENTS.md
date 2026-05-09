<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## 🚨 CRITICAL ABSOLUTE RULES - NEVER VIOLATE THESE

1. Never use `any` type in Typescript(Unless absolutely necessary). Use proper types/interfaces. Check existing types first and then create new ones if needed.
2. Avoid adding comments in the code unless absolutely necessary.(The code should be self-explanatory)
3. Only log for important errors. Don't add logging statements unless explicitly requested.
4. Create config or magics number in `constants.ts` wherever applicable. (Make sure don't create unnecessary constants)
5. When writing multiple `className` in single div use `classNames` utils from `@/utils/classNames`
6. Don't create validation schemas inside forms.
   Create in separate file and import it wherever needed.
   Eg. `authSchema.ts`
7. Always use `FormProvider` from `react-hook-form` to wrap forms before using any `RHF` components.
8. Never use `useMemo` or `useCallback` unless there is a performance issue. (If you are AI agent, avoid using them completely)
9. Never check `obj.nested && 'property' in obj.nested`. Use optional chaining `obj.nested?.property` instead.
10. Never document the changes with markdown file or something, unless explicitly requested.
11. Always use `yarn` as package manager.
12. Always run `lint` and `typecheck` to check for linting errors before submitting code.
13. Always use `zod` with `react-hook-form` for form validation.
    And in hono, never check validation in service layer unless there is no way to do it in the controller layer.
    Use `zv`(middleware) + `zod` schemas in controller layer for validation. TIP: `zv` is just a thin wrapper around `zValidation` from `hono/zod-validator`.
    Make sure to use `zod` schemas from `validation/` folder this should shareable between frontend and backend.
14. Always use `@geckoui/geckoui` components wherever applicable instead of creating custom components. Don't guess how to use components from `geckoui`. Always make sure to check the documentation of necessary components before using them if you are not sure.
15. Always use `spoosh skill` for making API calls. Never use `fetch` or `axios` directly.
16. Component files should be max ~200 lines. If it exceeds, break into smaller components.
17. Insteads of nested if..else, use early returns to reduce nesting and improve readability.
18. Never use `useEffect` to set form initial values. Use `values` of `useForm` instead.
19. Always use `lucide-react` for icons. Never use other icon libraries.
20. Always use `nuqs` for query string parsing/stringifying.
21. Make sure to always double check protected api routes to use `authMiddleware` and `adminMiddleware` (if admin access is required) before proceeding with implementation.
22. Add empty lines between functions and logical blocks of code to improve readability.
    eg.

    ```
    // Do not do this
    function example() {
        const value = computeValue();
        if() {
            // code
        }
        if() {
            // code
        }
    }

    // Do this instead
    function example() {
        const value = computeValue();

        if() {
            // code
        }

        if() {
            // code
        }
    }
    ```

## 🚨 CRITICAL

**ABSOLUTE AI AGENT RULES**:

1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files, text/mds and tests to the root folder**
3. ALWAYS organize files in appropriate subdirectories
4. **USE CLAUDE CODE'S TASK TOOL** for spawning agents concurrently, not just MCP
5. Never run prisma migrate or prisma db push or prisma related commands. You must ask the user to run those commands.

**MANDATORY PATTERNS:**

- **TodoWrite**: ALWAYS batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool (Claude Code)**: ALWAYS spawn ALL agents in ONE message with full instructions
- **File operations**: ALWAYS batch ALL reads/writes/edits in ONE message
- **Bash commands**: ALWAYS batch ALL terminal operations in ONE message
- **Memory operations**: ALWAYS batch ALL memory store/retrieve in ONE message

## Type Definitions

Don't blindly use prisma generated types in client components. Cuz when they return from API, some properties will be serialized/deserialized and types may not match exactly.
So create separate types/interfaces in `types/` folder for API responses if necessary. Make sure to extends prisma generated types wherever applicable.

```
import { type Product } from '@/lib/generated/prisma/browser';
import { Jsonify } from "@/types/Jsonify";

export type ClientProduct = Jsonify<Product>
```

> Use `Client*` prefix for such types.

## Video.js

When working on Video.js React player code, use the project `videojs` skill first.

## Overview

# Component Documentations

Gecko UI is a production-ready React component library built with TypeScript and Tailwind CSS.

## Docs

- [Full Docs](https://gecko.productionbug.com/llms-full.txt): Full documentation of all components.

## Examples

- [GitHub Examples](https://github.com/geckoui/geckoui/tree/main/apps/docs/src/components/examples): Component example files.

## Components

### Form Inputs

- [Input](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/input.mdx): Text input with prefix/suffix support
- [Textarea](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/textarea.mdx): Multi-line text input with auto-resize
- [Select](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/select/index.mdx): Dropdown with single/multiple selection
- [Checkbox](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/checkbox.mdx): Checkbox with indeterminate state
- [CounterInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/counter-input.mdx): Numeric input with increment/decrement buttons
- [Radio](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/radio.mdx): Radio button for single selection
- [Switch](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/switch.mdx): Toggle switch for boolean values
- [OTPInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/otp-input.mdx): One-time password input
- [DateInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/date-input.mdx): Date picker with calendar
- [DateRangeInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/date-range-input.mdx): Date range picker

### Buttons

- [Button](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/button.mdx): Flexible button with variants and sizes
- [LoadingButton](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/loading-button.mdx): Button with loading state

### Feedback

- [Alert](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/alert.mdx): Alert messages (success, error, warning, info)
- [Toast](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/toast.mdx): Toast notifications
- [Spinner](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/spinner.mdx): Loading spinner

### Overlays

- [Dialog](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/dialog.mdx): Modal dialog
- [ConfirmDialog](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/confirm-dialog.mdx): Confirmation modal
- [Drawer](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/drawer.mdx): Side drawer/panel
- [Dropdown](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/dropdown.mdx): Dropdown menu
- [Menu](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/menu.mdx): Headless menu component
- [Tooltip](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/tooltip.mdx): Accessible tooltip

### Form Helpers

- [Label](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/label.mdx): Form label with tooltip
- [InputError](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/input-error.mdx): Error message display

### Calendar

- [Calendar](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/calendar.mdx): Full calendar component

### Content

- [Markdown](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/markdown.mdx): Markdown renderer
- [MermaidDiagram](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/mermaid-diagram.mdx): Diagram renderer
- [Pagination](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/pagination.mdx): Page navigation

## React Hook Form

- [RHFInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-input.mdx)
- [RHFTextarea](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-textarea.mdx)
- [RHFCheckbox](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-checkbox.mdx)
- [RHFCounterInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-counter-input.mdx)
- [RHFRadio](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-radio.mdx)
- [RHFSwitch](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-switch.mdx)
- [RHFSelect](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-select.mdx)
- [RHFDateInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-date-input.mdx)
- [RHFDateRangeInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-date-range-input.mdx)
- [RHFNumberInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-number-input.mdx)
- [RHFCurrencyInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-currency-input.mdx)
- [RHFOTPInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-otp-input.mdx)
- [RHFFileInput](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-file-input.mdx)
- [RHFFilePicker](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-file-picker.mdx)
- [RHFInputGroup](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-input-group.mdx)
- [RHFError](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-error.mdx)
- [RHFController](https://raw.githubusercontent.com/geckoui/geckoui/develop/apps/docs/content/docs/rhf-controller.mdx)

## Creating project specific components

When creating components, that doesn't exist in Gecko UI, follow these guidelines:

- If the component is related to specific page. eg. Products page. add `Products` prefix to the component name. eg. `ProductsHeroSection`, `ProductsFeatures` etc.
  And place the component inside the page folder itself. eg.
  ```
  |-- products
    |-- components
        |-- HomeHeroSection.tsx
        |-- HomeFeatures.tsx
        |-- index.tsx // -> exports all components
    |-- page.tsx
  ```
- If components is shareable and base components make sure to write it pure without side effects.
  And place such components inside `components/` folder at root level.
- If components is shareable but the components need side effects like fetching data, triggering something eg.(updating themes, user settings etc),
  place such components inside `components/@shared/` folder at root level.
