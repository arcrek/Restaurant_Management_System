# Restaurant Ordering and Management — Product Concept

Status: concept draft for discussion. This concept describes the product; it does not select a technology stack or define an implementation plan.

[Tiếng Việt](product-concept.vi.md)

## Proposed diagrams

- [Standard UML use-case diagram](diagrams/standard-use-case.svg): actors and their goals, using associations and mandatory `«include»` relationships. It describes responsibilities rather than task order.
- [Standard UML component overview](diagrams/standard-component.svg): all 17 logical components with key dependencies and generous spacing. Dashed arrows point from the component that depends on another to its supplier; they do not represent execution order.
- Focused component diagrams retain all 41 dependencies: [Ordering and service](diagrams/standard-component-ordering.svg), [Menu, recipes and stock](diagrams/standard-component-stock.svg), and [Bills, records and analysis](diagrams/standard-component-reporting.svg). Short dependency IDs refer to separate keys below each diagram and full dependency documentation in the project.
- [Editable StarUML project](diagrams/restaurant-management.mdj): contains the use-case diagram, component overview, and three focused component diagrams. The native structure follows the [official StarUML example model](https://github.com/staruml/staruml-samples/blob/main/UMLExample.mdj). IDs, ownership, references, and relationship endpoints were checked; component views have no overlapping nodes or routes through unrelated components. Opening the regenerated project in StarUML has not been tested in this environment.

The diagrams propose product responsibilities and logical boundaries; they do not select a technology stack or deployment architecture.

## Product vision

Give customers, waiters, chefs, and managers one connected restaurant workflow: orders reach the kitchen, dishes use ingredients, stock determines what can be sold, and managers see how the restaurant is performing.

The core promise is that the menu reflects what the kitchen can actually prepare, while staff can trace each order and each stock movement.

## Outcome and boundaries

- **Outcome:** connect ordering, kitchen preparation, tables, menu, inventory, recipes, and management reporting in one system.
- **Constraints:** waiter and customer orders follow the same availability rules; ingredient quantities use consistent units; stock changes are traceable; screens show clear order and connection states; permissions follow staff responsibilities.
- **Non-goals for this concept:** implementation phases, stack selection, delivery estimates, and deployment design. Payment-provider integration, accounting, payroll, loyalty, and reservations are separate product decisions.
- **Acceptance:** every requested module has a clear user, purpose, and connection to the others. The concept explains how concurrent orders, cancellations, kitchen activity, and inventory updates affect dish availability.

Start with one restaurant location. Keep ordering, kitchen, tables, menu, inventory, recipes, and reporting as clear product modules so the system can later expand to multiple restaurant locations within the same business. Future expansion must distinguish location-specific tables, stock, staff assignments, and operational reports. Multi-location operation is future scope; language, currency, timezone, and localization requirements are outside this draft.

The product requires an online connection. Orders and stock-changing actions are accepted only when the system confirms them; disconnected screens must clearly show that actions are unavailable. If a connection drops after submission, staff or customers must check the existing submission's result after reconnecting before retrying.

## Users and experiences

| User | Primary experience | Main responsibilities |
|---|---|---|
| Customer | Mobile menu opened through a table QR code | Browse available dishes, choose options, submit orders, see order progress |
| Waiter | Touch-friendly POS and assigned-zone table view | Open a table visit, enter orders, manage changes, receive QR-order notifications, serve ready dishes, hand the bill to the cashier |
| Cashier | Bill and settlement workspace | Review calculated bills, handle payment outside the system, confirm settlement |
| Chef | Kitchen display | Review tickets, start preparation, mark dishes ready, report shortages and waste |
| Manager | Table overview and management workspace | Manage menu and recipes, oversee stock and suppliers, authorize corrections, analyze operations |
| Inventory staff, if separate | Inventory workspace | Receive ingredients, record stock issues and waste, perform stock counts |

Customers only see their authorized table visit. Staff permissions restrict sensitive actions such as price edits, order voids, stock adjustments, and settlement changes.

## Functional scope

### 1. Waiter ordering and POS

- Browse dishes by category, search quickly, and see current sellable quantities.
- Create orders for a table visit; add quantities, supported dish options, and preparation notes.
- Send new items to the kitchen and track preparation and serving status.
- Keep later additions distinguishable from items already being prepared.
- Handle item changes and cancellations with clear kitchen acknowledgement and authorization where required.
- Calculate the table bill from accepted order prices and quantities, excluding cancelled items according to the authorized billing decision.
- Hand the bill to the cashier. The cashier handles payment outside the system and confirms settlement so the bill and table visit can close. The system does not process payments.
- Prioritize tables and notifications in the waiter's assigned zone.

### 1.1. Customer QR ordering

- Scan a table QR code to open the menu and join the current authorized table visit.
- Browse dish descriptions, prices, supported options, and availability.
- Submit an order and receive a definite accepted or rejected result.
- Validate table-visit access, menu selections, current prices, quantities, and ingredient availability before acceptance. Accepted QR orders go directly to the kitchen and notify the assigned waiter; waiter approval is not required.
- See progress for the customer's orders. Repeated taps or retries must not create duplicate orders.
- A copied table QR must not grant access to a later customer's visit. Staff-controlled visit access is separate from order validation and must not introduce waiter approval for each order.

### 2. Kitchen display system

- Display incoming tickets with table, items, quantities, options, notes, and elapsed time.
- Support item-level states: queued, preparing, ready, and cancelled. Waiters mark ready items served.
- Highlight additions and cancellation requests without silently removing active work.
- Let chefs report an unavailable ingredient, wasted portion, or preparation exception.
- Show whether the display is connected and refresh current ticket state after reconnection.

### 3. Table management

- Maintain tables, capacities, and service zones; every table belongs to a zone.
- Show free, occupied, awaiting settlement, and cleaning states, alongside open orders and service progress.
- Associate all orders and the bill with a table visit rather than permanently with the physical table.
- Move an active visit to another table while preserving order history and notifying the kitchen.
- Close a settled visit and invalidate its customer access before the table is reused.

### 3.1. Waiter zone assignments

- Managers assign waiters to service zones for the current shift or service period.
- Each zone groups a limited set of tables. Managers configure a maximum table count per waiter; assignments that exceed that limit are blocked until the manager changes the allocation or limit.
- Each active zone has one responsible waiter by default, making notification ownership clear. A waiter may cover multiple zones if their total assigned tables remain within the limit.
- Route accepted QR-order notifications and ready-to-serve notifications to the currently responsible waiter.
- Let managers reassign zones for breaks, shift changes, or workload balancing. The replacement waiter receives the current open-table and pending-notification context.
- Moving a visit across zones transfers service responsibility and subsequent notifications to the destination zone's waiter while preserving history.
- Show managers unassigned active zones. If an order arrives without an assigned waiter, keep its kitchen ticket and notify the manager for assignment.

Zone assignments define service responsibility. They do not grant waiters manager or cashier permissions.

### 4. Menu management

- Manage categories, dishes, descriptions, images, prices, supported variants, and visibility.
- Link every stock-controlled dish or variant to its recipe.
- Derive sellable portions from usable ingredient stock and existing order reservations.
- Recalculate availability after orders, receipts, consumption, waste, stock counts, and recipe changes.
- Allow managers or chefs to pause a dish even when ingredients are available, with a recorded reason.
- Preserve the original price, selected variant, and recipe version on accepted orders.

### 5. Inventory and suppliers

- Maintain ingredients, base units, purchase-unit conversions, storage locations, and minimum-stock thresholds.
- Maintain suppliers and record ingredient receipts with quantity, unit cost, date, and supplier reference.
- Track received ingredient lots and expiry where applicable; expired or quarantined stock is unavailable for sale. Prepared-batch tracking is a separate optional module.
- Record stock imports/receipts, exports/issues, kitchen consumption, waste, supplier returns, and count adjustments with reasons.
- Show on-hand, reserved, usable, and available stock separately.
- Alert staff to shortages, low stock, and approaching expiry.
- Keep a stock-movement history. Corrections create traceable reversing or adjusting entries.

“Export” here means stock leaving inventory, not exporting a report file. Moving ingredients to kitchen storage is a transfer and must not also count as recipe consumption.

### 6. Recipe management

- Define ingredient quantities and units per portion, preparation instructions, and expected yield.
- Support recipes for actual sellable variants; ingredient-changing options must have defined stock effects.
- Express usable quantities after expected preparation loss to avoid overstating portions.
- Estimate ingredient cost per portion from recorded inventory costs.
- Version recipe changes so existing orders retain their accepted ingredient requirements.
- Keep allergens associated with ingredients and expose the relevant information on dishes; free-text notes do not automatically alter a recipe.
- Use direct recipes by default; allow recipes to consume prepared stock when the optional prepared-batch module is enabled.

### 7. Manager dashboard

- Show sales by period, dish, category, and order channel, distinguishing settled sales from open bills.
- Show order volumes, average bill, cancellations, and voids.
- Show kitchen preparation times and table occupancy and visit duration.
- Show stock levels, consumption, waste, supplier purchases, and low-stock ingredients.
- Compare sales with estimated ingredient cost to show estimated food margin, clearly labelled as distinct from net profit.
- Let managers drill into the orders or stock movements behind a metric and filter by date.

## Connected operating flow

| Event | Result across the system |
|---|---|
| Ingredients received | Usable stock increases; linked dishes may become available |
| Waiter or QR order accepted | Required ingredients are reserved; sellable portions decrease; kitchen ticket appears; accepted QR orders notify the assigned waiter |
| Chef starts preparation | Reserved ingredients become consumed stock; physical on-hand decreases |
| Item becomes ready | The currently assigned zone waiter receives a ready-to-serve signal; customer progress updates |
| Item cancelled before preparation | Reservation is released; availability is recalculated |
| Item cancelled after preparation starts | Consumed ingredients remain consumed; waste is recorded where applicable |
| Ingredients expire or are counted lower | Availability decreases; affected active reservations require staff resolution |
| Cashier confirms external payment and closes the visit | Sales reporting updates; the table moves to cleaning; visit access ends |

Recommended ordering policy: reserve stock when an order is accepted and consume it when preparation starts. This makes committed stock visible while allowing cancellations before preparation to release it cleanly. Consuming at acceptance is simpler but blurs physical stock and unprepared commitments; consuming only at serving leaves preparation stock unavailable too late unless reservations are still maintained.

## Automatic dish quantity rules

For each ingredient:

`available = usable on-hand − quantities reserved for accepted orders`

For a recipe:

`sellable portions = minimum of floor(available ingredient quantity / ingredient quantity per portion)`

Calculate using compatible base units and the recipe's yield assumptions. Any manually paused dish has zero sellable portions.

With prepared-batch tracking enabled, the same rules apply to prepared stock referenced by a recipe. Raw ingredients that could make another batch do not count as prepared stock available now.

Example: a dish needs 150 g chicken and 100 g rice. With 900 g available chicken and 1,000 g available rice, it has six sellable portions. Accepting two portions reserves 300 g chicken and 200 g rice, leaving four sellable portions.

Shared ingredients make availability interdependent. Two dishes may each display six portions while competing for the same chicken; their displayed quantities are not separate stock allocations. The system must recheck and reserve the entire submitted order together before accepting it. If two people order the last portion at once, only one order can be accepted.

When preparation starts, converting reserved stock to consumed stock must happen once. It reduces both on-hand and reservations by the same quantity, so that event alone does not reduce available stock a second time.

Physical shortages can invalidate previously accepted commitments. The system must identify affected tickets and prompt staff to replenish, substitute with customer approval, or cancel; changing the menu alone does not resolve those orders.

## Product success scenarios

- A waiter order and a QR order appear in the same kitchen queue and obey the same stock rules.
- Concurrent requests for the last available portion cannot oversell it.
- Receiving an ingredient restores the availability of every affected dish.
- Cancelling an unprepared item releases ingredients; cancelling a prepared item does not restore ingredients automatically.
- Moving a table visit preserves its tickets and bill, and closing it removes customer access.
- A manager can trace a displayed sales or waste total to its source records.
- Reconnecting or retrying a submitted action does not duplicate orders or stock consumption.
- Accepted QR orders reach the kitchen immediately after validation and notify the table's assigned waiter.
- Waiter assignments respect the configured table limit; reassignment and cross-zone table moves preserve service continuity.
- During a connection outage, screens cannot accept orders or stock changes without an online confirmation.
- Cashiers can confirm externally handled settlement without payment-provider integration.
- With prepared-batch tracking disabled, direct recipes work without batch-production steps. With it enabled, production consumes raw ingredients once and dishes consume the resulting prepared stock.

## Optional module: prepared batches and sub-recipes

Managers can enable or disable prepared-batch tracking for the restaurant. It is disabled by default. When disabled, its production screens and prepared-stock recipe options are hidden, and dishes use direct recipes. When enabled, the restaurant can use direct recipes, prepared-stock recipes, or a combination.

A direct recipe consumes raw ingredients for each ordered dish. A sub-recipe describes an intermediate preparation used by other recipes, such as tomato sauce, dough, broth, or marinated chicken. A prepared batch is an actual quantity of that preparation made in advance and held in stock.

Example: the kitchen uses 2 kg tomatoes and other ingredients to produce 1.5 litres of sauce. Recording that batch consumes the raw ingredients and adds 1.5 litres of prepared sauce with its actual yield, production date, cost, and expiry. A pasta dish then reserves and consumes 100 ml of sauce per portion. That batch supports 15 portions, provided its other ingredients are available.

The raw tomatoes must not be deducted again when pasta is ordered. If the kitchen has ingredients to make more sauce but no prepared sauce remaining, immediate dish availability is limited by the prepared sauce until a new batch is recorded. Spoiling a sauce batch reduces sauce stock rather than restoring its raw ingredients.

This capability matters when advance preparation determines what the kitchen can serve now, or when actual batch yield and expiry need tracking. If dishes are prepared directly from raw ingredients, direct recipes may be sufficient. A reusable sub-recipe without prepared-stock tracking can help organize instructions, but cannot represent how much sauce is ready to serve.

Disabling the module must preserve historical production and stock records. Before disabling, resolve active prepared-stock reservations, account for remaining prepared stock, and replace prepared-stock dependencies in active recipes with valid direct recipes. The system must not silently reinterpret prepared stock as raw ingredients or change accepted orders.
