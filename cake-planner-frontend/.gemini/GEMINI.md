You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

always use english for all code and comments

## Project

- Use Angular v21+ features
- Use TypeScript v5+ features
- Use english for all code and comments
- use JSDoc for all code and comments
- use JSDoc for file headers, including project description, author, and license and version

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use Angular v21+ features
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## RxJS & Signals

- Use `toSignal` to convert Observables to Signals for template rendering
- Avoid nested subscriptions; use flattening operators (`switchMap`, `concatMap`) or Signals

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Performance

- Use `@defer` blocks to lazy load heavy components or content below the fold
- Use `runOutsideAngular` for high-frequency events (like scroll or mousemove) if they don't affect the view

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Testing

- Use `ComponentFixture` for unit tests
- Test accessibility in unit tests
