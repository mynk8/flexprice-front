# FlexPrice Component Library — Approach & Methodology

## Overview

FlexPrice UI is a React + TypeScript component library built on **shadcn/Radix UI** primitives, **Tailwind CSS** design tokens, and **Storybook** for documentation and visual testing. The goal is fully reusable, accessible, and consistently styled components following atomic design principles.

---

## Design Tokens

All color, spacing, and typography decisions use **CSS custom properties** from `src/index.css`. Hardcoded hex values are prohibited.

| Token | Value | Usage |
|---|---|---|
| `--background` | `#f8fafc` | Page/app background |
| `--foreground` | HSL `0 0% 3.9%` | Primary text |
| `--card` | HSL `0 0% 100%` | Card surfaces |
| `--primary` | HSL `0 0% 9%` | Primary actions |
| `--muted` | HSL `0 0% 96.1%` | Subdued backgrounds |
| `--border` | HSL `0 0% 89.8%` | Borders and dividers |
| `--destructive` | HSL `84.2% 60.2%` | Destructive actions |

Tailwind utilities map to these tokens: `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.

---

## Atomic Design Classification

```
atoms/       — Primitives. Shadcn Radix wrappers (Button, Badge, Modal, Toggle, Input, Select, etc.)
molecules/   — Purpose-built UI units composed of atoms (SearchBar, Table, MetricCard, ApiDocsContent, etc.)
organisms/   — Page sections. Large, feature-complete chunks (EmptyPage, SidebarNav, QueryableDataArea, etc.)
```

### Atoms

Single-responsibility primitives. No business logic, no local state, no compound child-rendering.

- Built on shadcn/ui Radix primitives where available (`ui/dialog`, `ui/switch`, `ui/select`, etc.)
- Use `forwardRef` for ref forwarding
- Props spread to root element only — no magic prop drilling
- Variants via `class-variance-authority` (CVA)

**Pattern:**
```tsx
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => (
  <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));
Badge.displayName = 'Badge';
export { Badge, badgeVariants };
```

### Molecules

Purpose-specific UI units combining one or more atoms for a defined task. May have local state for UI concerns only.

### Organisms

Page sections — large, feature-complete chunks that compose molecules and atoms together. Business logic lives in pages/hooks/api, not here. Organisms should be dumb renderers of their configuration.

---

## shadcn/Radix Composition Patterns

### Controlled + Uncontrolled APIs

Radix primitives use `value` + `onChange` for controlled state. All wrapper components follow this pattern.

```tsx
// Controlled Modal
<Modal isOpen={open} onOpenChange={setOpen}>
//                         ↑ value + onChange pattern
```

### Compound Components

Radix exports sub-components (`DialogHeader`, `DialogTitle`, `DialogFooter`, etc.) that must be composed by the consumer. Modal re-exports these:

```tsx
<Modal isOpen={open} onOpenChange={setOpen}>
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </DialogHeader>
  <DialogFooter>...</DialogFooter>
</Modal>
```

### Slot / asChild

Use `asChild` with Radix's `Slot` component to attach behavior to arbitrary child elements without wrapping:

```tsx
<SidebarMenuButton asChild isActive={active}>
  <Link to={item.url}>...</Link>
</SidebarMenuButton>
```

---

## Empty States

### EmptyPage (organism)

Used by application pages. Accepts `emptyStateCard` with optional `icon` field:

```tsx
<EmptyPage
  heading='Bulk Imports'
  emptyStateCard={{
    icon: <FileInputIcon className="size-12" />,
    heading: 'Ready to Import Data?',
    description: 'Upload your first import file...',
    buttonLabel: 'Create Import Task',
    buttonAction: () => setdrawerOpen(true),
  }}
/>
```

**Token mapping in EmptyPage:**
- Background: `bg-card border border-border rounded-[6px]`
- Heading: `font-medium text-[20px] text-foreground`
- Description: `bg-muted/50 text-[16px] text-muted-foreground`
- Icon wrapper: `text-muted-foreground/40`

### QueryableDataArea.EmptyState (organism)

Used inside the `QueryableDataArea` component when no data is available. Configuration passed via `emptyStateConfig`:

```tsx
<QueryableDataArea
  emptyStateConfig={{
    icon: <EmptyIcon className="size-12" />,
    heading: 'No Customers',
    description: 'Create your first customer to get started.',
    buttonLabel: 'Create Customer',
    buttonAction: handleCreate,
    tags: ['Customers'],
  }}
/>
```

### Icon Rendering

Icons are **optional** in both empty state components. When provided, they render inside a muted wrapper div:

```tsx
{config.icon && <div className='mb-6 text-muted-foreground/40'>{config.icon}</div>}
```

---

## Storybook Setup

### Backgrounds

Storybook backgrounds are configured in `.storybook/preview.tsx` to match app design tokens:

```ts
backgrounds: {
  default: 'surface',
  values: [
    { name: 'surface', value: '#f8fafc' },  // matches --background
    { name: 'card', value: '#ffffff' },      // matches --card
    { name: 'ink', value: '#09090b' },
  ],
}
```

### Theme

Custom Storybook theme in `.storybook/manager.ts` uses design token values:
- `appBg: '#f8fafc'`
- `appContentBg: '#ffffff'`
- `appBorderColor: '#e4e4e7'`
- `barTextColor: '#3f3f46'`

### Stories

Each component has a `*.stories.tsx` co-located with the source. Stories include:
- `autodocs` tag for automatic docs generation
- ArgType controls for all props
- Proper display name (no "Default" export needed — auto-generated)
- Story-level decorators for layout isolation

---

## What's NOT Allowed

- **No magic state management** inside components (no Zustand, no TanStack Query calls in atoms/molecules)
- **No hardcoded hex colors** in component styles (use design tokens)
- **No business logic** in organisms (they render config, pages contain logic)
- **No inline styles** (`style={{ ... }}`) — use Tailwind utilities only
- **No prop drilling** through multiple layers — compose at the page level

---

## Deployment to Vercel

To host this Storybook on Vercel, follow these steps:

### 1. Build Storybook Locally
Ensure the build works as expected:
```bash
npm run build-storybook
```
This generates a static site in the `storybook-static/` directory.

### 2. Deploy via Vercel Dashboard (Recommended)
1. Push your changes to GitHub.
2. Log in to [Vercel](https://vercel.com).
3. Click **New Project** and import your repository.
4. In the **Build & Development Settings**:
   - **Framework Preset**: Select `Other`.
   - **Build Command**: `npm run build-storybook`
   - **Output Directory**: `storybook-static`
5. Click **Deploy**.

### 3. Deploy via Vercel CLI
If you have the [Vercel CLI](https://vercel.com/docs/cli) installed:
```bash
vercel --name flexprice-ui --public --prod --build-command "npm run build-storybook" --output storybook-static
```

---

## File Structure

```
src/components/
├── atoms/          # Badge, Button, Card, Chip, Input, Modal, Toggle, etc.
│   ├── Badge/
│   │   ├── Badge.tsx
│   │   └── Badge.stories.tsx
│   └── ...
├── molecules/      # SearchBar, Table, MetricCard, ApiDocsContent, etc.
│   └── ...
├── organisms/      # EmptyPage, SidebarNav, QueryableDataArea, etc.
│   └── ...
└── ui/             # shadcn/Radix base primitives (dialog, switch, select, etc.)
    └── ...
```
