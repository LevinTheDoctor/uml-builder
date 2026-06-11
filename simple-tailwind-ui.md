---
description: Build React UI with SimpleTailwindUI — @levin-the-doctor/simple-tailwind-ui component library
---

You are helping the user build React UIs using the **SimpleTailwindUI** component library (`@levin-the-doctor/simple-tailwind-ui`) — a handcrafted React + Tailwind CSS component library with dark-mode support and full TypeScript types.

## Setup

```bash
npm install @levin-the-doctor/simple-tailwind-ui
npm install react react-dom lucide-react tailwindcss react-markdown
```

In your CSS entry file:
```css
@import "tailwindcss";
```

## Importing components

All components are imported from the package root:
```tsx
import { Button, Card, Input, Modal } from "@levin-the-doctor/simple-tailwind-ui"
```

---

## Components

### Button
`variant`: solid | outline | ghost | link  
`color`: primary | secondary | success | warning | danger | neutral  
`size`: xs | sm | md | lg  
`loading`, `disabled`, `leftIcon`, `rightIcon`

```tsx
<Button color="primary">Save</Button>
<Button variant="outline" color="neutral" size="sm">Cancel</Button>
<Button variant="solid" color="danger" loading>Deleting…</Button>
<Button variant="ghost" color="primary" leftIcon={<Plus />}>Add item</Button>
```

---

### Card
`variant`: default | elevated | outlined | ghost  
`size`: sm | md | lg  
`title`

```tsx
<Card title="Overview" variant="elevated" size="md">
  <p>Card content here.</p>
</Card>
```

---

### Input
`label`, `placeholder`, `value`, `onChange`, `icon`, `loading`, `disabled`, `error`

```tsx
<Input label="Email" placeholder="you@example.com" icon={<Mail />} />
<Input label="Search" value={q} onChange={e => setQ(e.target.value)} loading />
```

---

### Dropdown
`label`, `options` (`{value, label}[]`), `value`, `onChange`, `icon`, `placeholder`, `disabled`

```tsx
<Dropdown
  label="Status"
  options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
  value={status}
  onChange={setStatus}
/>
```

---

### ComboBox
`label`, `options`, `value` (single) | `values` (multi), `onChange`, `multi`, `maxVisible`, `placeholder`

```tsx
<ComboBox label="Tags" options={opts} values={selected} onChange={setSelected} multi />
<ComboBox label="Country" options={countries} value={country} onChange={setCountry} />
```

---

### DatePicker

| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `title` | `string` | — | Label / Feldbezeichnung (required) |
| `size` | `"sm" \| "md" \| "lg" \| "full"` | `"md"` | Größe des Triggers |
| `variant` | `"default" \| "subtle" \| "strong"` | `"default"` | Visueller Stil |
| `icon` | `LucideIcon` | `Calendar` | Eigenes Icon links im Trigger |
| `loading` | `boolean` | `false` | Zeigt Lade-Spinner, blockiert Interaktion |
| `disabled` | `boolean` | `false` | Deaktiviert den Picker |
| `fullWidth` | `boolean` | `false` | Volle Breite des Containers |
| `value` | `Date \| null` | — | Kontrollierter Wert |
| `onChange` | `(v: Date \| string \| number) => void` | — | Callback bei Datumsauswahl |
| `displayFormat` | `"de" \| "us" \| "iso" \| "long"` | `"de"` | Vordefiniertes Anzeigeformat im Trigger |
| `customDisplayFormat` | `string` | — | Freies Anzeigeformat, überschreibt `displayFormat`. Tokens: `DD` `MM` `YYYY` `D` `M` |
| `outputFormat` | `"date" \| "iso" \| "de" \| "us" \| "timestamp"` | `"date"` | Vordefiniertes Format für `onChange` |
| `customOutputFormat` | `string` | — | Freies Ausgabeformat, überschreibt `outputFormat`. Gleiche Tokens wie `customDisplayFormat` |
| `minDate` | `Date` | — | Frühestes wählbares Datum |
| `maxDate` | `Date` | — | Spätestes wählbares Datum |
| `placeholder` | `string` | `"Datum waehlen..."` | Platzhaltertext wenn kein Datum gewählt |
| `className` | `string` | `""` | Zusätzliche CSS-Klassen |

```tsx
// Standard
<DatePicker title="Startdatum" value={date} onChange={setDate} />

// Vordefinierte Formate
<DatePicker title="Datum" displayFormat="long" outputFormat="iso" value={date} onChange={setDate} />

// Eigene Formate
<DatePicker
  title="Datum"
  customDisplayFormat="DD.MM.YYYY"
  customOutputFormat="YYYY/MM/DD"
  value={date}
  onChange={setDate}
/>
```

---

### TitelBorder
Groups form elements inside a labelled fieldset border.  
`title`

```tsx
<TitelBorder title="Personal Information">
  <Input label="First name" />
  <Input label="Last name" />
</TitelBorder>
```

---

### NavigationBar
`items` (`{id, label, icon?}[]`), `activeId`, `onSelect`, `orientation`: horizontal | vertical  
`indicator`: gradient-line | pill | dot | none  
`logo` (ReactNode), `fullWidth`

```tsx
const items = [
  { id: "home",     label: "Home",      icon: Home },
  { id: "settings", label: "Settings",  icon: Settings },
];

<NavigationBar items={items} activeId={active} onSelect={setActive} indicator="pill" />
```

---

### Accordion
`title`, `icon` (LucideIcon), `loading`, `disabled`, `defaultOpen`  
`size`: sm | md | lg | full

```tsx
<Accordion title="Details" defaultOpen>
  <p>Expanded content here.</p>
</Accordion>
<Accordion title="Advanced" icon={Settings} size="full">
  <p>More options.</p>
</Accordion>
```

---

### Tabelle (Data Table)
`columns` (`{key, header, sortable?, width?, render?}[]`), `data`, `loading`  
`scrollable`, `maxHeight`, `multiSelect`, `onSelectionChange`, `pageSize`

```tsx
const columns = [
  { key: "name",  header: "Name",  sortable: true },
  { key: "email", header: "Email" },
  { key: "role",  header: "Role",  render: (v) => <Badge label={v as string} color="primary" /> },
];

<Tabelle columns={columns} data={rows} scrollable maxHeight="400px" pageSize={10} />
```

---

### Modal
`open`, `onClose`, `title`, `size`: sm | md | lg | xl  
`showCloseButton` (default: true)

```tsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>

<Modal open={open} onClose={() => setOpen(false)} title="Confirm action" size="sm">
  <p>Are you sure you want to delete this item?</p>
  <div className="flex gap-2 mt-4">
    <Button color="danger" onClick={() => setOpen(false)}>Delete</Button>
    <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>Cancel</Button>
  </div>
</Modal>
```

---

### Toast
Wrap your app with `<ToastProvider>`, then use the `useToast()` hook anywhere inside.

```tsx
// In your root component:
<ToastProvider>
  <App />
</ToastProvider>

// Anywhere inside:
const { show } = useToast();

show("Saved successfully!", { type: "success" });
show("Something went wrong.", { type: "error" });
show("Heads up.", { type: "warning", duration: 5000 });
show("FYI.", { type: "info", duration: 0 }); // duration: 0 = stays until closed
```

---

### Tabs
`items` (`{id, label, icon?, disabled?}[]`), `orientation`: horizontal | vertical  
`variant`: default | subtle | strong, `size`

```tsx
const tabs = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "settings",  label: "Settings",  icon: Settings },
];

<Tabs items={tabs} size="full">
  <TabPanel id="overview"><p>Overview content</p></TabPanel>
  <TabPanel id="settings"><p>Settings content</p></TabPanel>
</Tabs>
```

---

### Badge
`label`, `color`: primary | secondary | success | warning | danger | neutral  
`variant`: solid | subtle | outline, `size`, `icon`, `dot`

```tsx
<Badge label="New"     color="primary"  dot />
<Badge label="Error"   color="danger"   variant="outline" />
<Badge label="Success" color="success"  variant="subtle" icon={<CheckCircle />} />
```

---

### Changelog
Displays an info button that opens a modal with a rendered Markdown changelog.  
`program`, `version`, `date`, `path` (URL to your `CHANGELOG.md` in `/public`)

Requires `react-markdown` as a peer dependency.

```tsx
// Place CHANGELOG.md in your /public folder, then:
<Changelog program="MyApp" version="v2.0.0" date="01.06.2026" path="/CHANGELOG.md" />
```

---

## Tips

- All components support **dark mode** out of the box via the `dark` class on `<html>`.
- Icons come from `lucide-react` — pass any Lucide icon component directly as a prop.
- Use `TitelBorder` to group related `Input` / `Dropdown` fields visually.
- Combine `ToastProvider` at the app root so `useToast()` is available everywhere.
