/** Generate native StarUML models and matching monochrome UML SVG previews. */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const out = dirname(fileURLToPath(import.meta.url));
const ref = id => ({ $ref: id });
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const project = { _type: 'Project', _id: 'rms-project', name: 'Restaurant Management System', ownedElements: [] };
let serial = 0;
const id = prefix => `${prefix}-${++serial}`;

function model(type, name, parent) {
  const item = { _type: type, _id: id(type), _parent: ref(parent._id), name, ownedElements: [] };
  parent.ownedElements.push(item);
  return item;
}

function diagram(type, name, parent) {
  const item = model(type, name, parent);
  delete item.ownedElements;
  item.ownedViews = [];
  return item;
}

function nodeView(type, item, owner, box) {
  const view = { _type: type, _id: id(type), _parent: ref(owner._id), model: ref(item._id),
    ...box, font: 'Arial;13;0', fillColor: '#ffffff', lineColor: '#000000', fontColor: '#000000',
    wordWrap: true, suppressAttributes: true, suppressOperations: true, subViews: [] };
  const compartment = { _type: 'UMLNameCompartmentView', _id: id('name'), _parent: ref(view._id), model: ref(item._id),
    left: box.left, top: box.top, width: box.width, height: 38, font: 'Arial;13;0', subViews: [] };
  for (const [key, text, visible] of [['stereotypeLabel', type === 'UMLComponentView' ? '«component»' : '', type === 'UMLComponentView'],
    ['nameLabel', item.name, true], ['namespaceLabel', '', false], ['propertyLabel', '', false]]) {
    const label = { _type: 'LabelView', _id: id(key), _parent: ref(compartment._id), font: key === 'nameLabel' ? 'Arial;13;1' : 'Arial;13;0',
      left: box.left + 5, top: box.top + 8, width: box.width - 10, height: 26, text, visible, wordWrap: true };
    compartment.subViews.push(label);
    compartment[key] = ref(label._id);
  }
  view.subViews.push(compartment);
  view.nameCompartment = ref(compartment._id);
  if (!['UMLUseCaseSubjectView', 'UMLPackageView'].includes(type)) {
    for (const [key, kind] of [['attributeCompartment', 'UMLAttributeCompartmentView'], ['operationCompartment', 'UMLOperationCompartmentView'],
      ['receptionCompartment', 'UMLReceptionCompartmentView'], ['templateParameterCompartment', 'UMLTemplateParameterCompartmentView'],
      ...(type === 'UMLUseCaseView' ? [['extensionPointCompartment', 'UMLExtensionPointCompartmentView']] : [])]) {
      const child = { _type: kind, _id: id(key), _parent: ref(view._id), model: ref(item._id), visible: false,
        font: 'Arial;13;0', left: box.left, top: box.top, width: 10, height: 10 };
      view.subViews.push(child);
      view[key] = ref(child._id);
    }
  }
  if (type === 'UMLComponentView') view.stereotypeDisplay = 'decoration-label';
  owner.ownedViews.push(view);
  return view;
}

function edge(type, from, to, owner, points, label = '', options = {}) {
  const relation = options.relation || model(type, label, from.item);
  if (!options.relation && type === 'UMLAssociation') {
    for (const [key, target] of [['end1', from.item], ['end2', to.item]]) {
      relation[key] = { _type: 'UMLAssociationEnd', _id: id(key), _parent: ref(relation._id), reference: ref(target._id), navigable: 'unspecified' };
    }
  } else if (!options.relation) {
    relation.source = ref(from.item._id);
    relation.target = ref(to.item._id);
  }
  const view = { _type: `${type}View`, _id: id('edge'), _parent: ref(owner._id), model: ref(relation._id),
    tail: ref(from.view._id), head: ref(to.view._id), points: points.map(p => `${Math.round(p.x)}:${Math.round(p.y)}`).join(';'),
    font: 'Arial;13;0', lineColor: '#000000', fontColor: '#000000', lineStyle: 1, subViews: [] };
  for (const [key, text] of [['nameLabel', label], ['stereotypeLabel', type === 'UMLInclude' ? '«include»' : ''], ['propertyLabel', '']]) {
    const child = { _type: 'EdgeLabelView', _id: id(key), _parent: ref(view._id), model: ref(relation._id),
      hostEdge: ref(view._id), edgePosition: 1, alpha: Math.PI / 2, distance: 15, font: 'Arial;13;0', text, visible: !!text && options.showLabel !== false, height: 13 };
    view.subViews.push(child);
    view[key] = ref(child._id);
  }
  if (type === 'UMLAssociation') {
    for (const end of ['tail', 'head']) for (const suffix of ['RoleNameLabel', 'PropertyLabel', 'MultiplicityLabel']) {
      const child = { _type: 'EdgeLabelView', _id: id('end-label'), _parent: ref(view._id), model: ref(relation[end === 'tail' ? 'end1' : 'end2']._id),
        hostEdge: ref(view._id), visible: false, font: 'Arial;13;0', height: 13 };
      view.subViews.push(child);
      view[`${end}${suffix}`] = ref(child._id);
    }
  }
  owner.ownedViews.push(view);
  return relation;
}

function note(owner, text, x, y, width, height) {
  owner.ownedViews.push({ _type: 'UMLNoteView', _id: id('note'), _parent: ref(owner._id), font: 'Arial;13;0',
    left: x, top: y, width, height, text, fillColor: '#ffffff', lineColor: '#000000' });
  return `<path d="M${x} ${y}h${width - 15}l15 15v${height - 15}h-${width}z M${x + width - 15} ${y}v15h15" fill="white" stroke="black"/>${textLines(text.split('\n'), x + 12, y + 22, 'start', 13)}`;
}

function textLines(lines, x, y, anchor = 'middle', size = 14) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? 18 : 0}">${xml(line)}</tspan>`).join('')}</text>`;
}

function svg(title, width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${xml(title)}</title><defs><marker id="open-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M1 1L10 6L1 11" fill="none" stroke="black" stroke-width="1.2"/></marker></defs><rect width="100%" height="100%" fill="white"/><g font-family="Arial, sans-serif" fill="black">${content}</g></svg>\n`;
}

// Use cases describe actor goals, not the chronological ordering of tasks.
const useModel = model('UMLModel', 'User Responsibilities', project);
const useDiagram = diagram('UMLUseCaseDiagram', 'User Use Cases', useModel);
const subject = model('UMLUseCaseSubject', 'Restaurant Management System', useModel);
nodeView('UMLUseCaseSubjectView', subject, useDiagram, { left: 235, top: 85, width: 1080, height: 1395 });
const useNodes = new Map();
let userSvg = textLines(['Restaurant Management System — UML Use Case Diagram'], 775, 35, 'middle', 22);
userSvg += '<rect x="235" y="85" width="1080" height="1395" fill="none" stroke="black" stroke-width="1.5"/>';
userSvg += textLines(['Restaurant Management System'], 775, 115, 'middle', 17);

const actorData = [
  ['customer', 'Customer', 100, 225, 'left'], ['waiter', 'Waiter', 100, 675, 'left'],
  ['manager', 'Manager', 100, 1175, 'left'], ['chef', 'Chef', 1450, 640, 'right'],
  ['cashier', 'Cashier', 1450, 920, 'right'], ['stock-staff', 'Inventory Staff', 1450, 1260, 'right']
];
for (const [key, label, x, y, side] of actorData) {
  const item = model('UMLActor', label, useModel);
  const view = nodeView('UMLActorView', item, useDiagram, { left: x - 55, top: y - 45, width: 110, height: 100 });
  useNodes.set(key, { item, view, x, y, side });
}
const cases = [
  ['browse', 'Browse Available Menu', 440, 185, 'customer'],
  ['submit', 'Submit Order (QR / POS)', 440, 295, 'customer,waiter'],
  ['track', 'Track Order Progress', 440, 405, 'customer'],
  ['validate', 'Validate Order', 790, 295, ''],
  ['reserve', 'Reserve Required Stock', 1110, 295, ''],
  ['visit', 'Manage Table Visit', 440, 550, 'waiter'],
  ['alerts', 'Receive QR / Ready Alerts', 440, 660, 'waiter'],
  ['serve', 'Mark Items Served', 440, 770, 'waiter'],
  ['bill', 'View / Hand Over Bill', 440, 880, 'waiter'],
  ['tickets', 'View Kitchen Tickets', 1110, 480, 'chef'],
  ['prepare', 'Start Preparation', 1110, 590, 'chef'],
  ['ready', 'Mark Items Ready', 1110, 700, 'chef'],
  ['batch', 'Record Prepared Batch', 1110, 810, 'chef'],
  ['review-bill', 'Review Calculated Bill', 1110, 935, 'cashier'],
  ['settlement', 'Confirm External Settlement', 1110, 1045, 'cashier'],
  ['zones', 'Assign Zones / Table Limits', 440, 1060, 'manager'],
  ['catalog', 'Manage Menu and Recipes', 440, 1170, 'manager'],
  ['analysis', 'Analyze Restaurant Operations', 440, 1280, 'manager'],
  ['config', 'Configure Batch Module', 440, 1390, 'manager'],
  ['suppliers', 'Manage Suppliers', 1110, 1170, 'stock-staff,manager'],
  ['receipts', 'Record Receipts and Issues', 1110, 1280, 'stock-staff'],
  ['counts', 'Record Counts and Waste', 1110, 1390, 'stock-staff,chef']
];
for (const [key, label, x, y] of cases) {
  const item = model('UMLUseCase', label, useModel);
  if (key === 'batch') item.documentation = 'Optional. Available only when prepared-batch tracking is enabled; disabled by default.';
  const view = nodeView('UMLUseCaseView', item, useDiagram, { left: x - 135, top: y - 35, width: 270, height: 70 });
  useNodes.set(key, { item, view, x, y });
}
// Associations connect actors to goals; the two dashed arrows are mandatory includes.
for (const [key, , x, y, actors] of cases) for (const actorKey of actors.split(',').filter(Boolean)) {
  const actor = useNodes.get(actorKey);
  const target = useNodes.get(key);
  const direction = actor.side === 'left' ? 1 : -1;
  const start = { x: actor.x + direction * 25, y: actor.y };
  const finish = { x: x - direction * 135, y };
  const lane = actor.side === 'left' ? 205 : 1340;
  const points = [start, { x: lane, y: start.y }, { x: lane, y }, finish];
  // Cross-side associations run below the system frame to avoid unrelated use cases.
  if ((actor.side === 'left' && x > 900) || (actor.side === 'right' && x < 600)) {
    points.splice(1, 2, { x: lane, y: start.y }, { x: lane, y: 1510 }, { x: 1340, y: 1510 }, { x: 1340, y });
    finish.x = x + 135;
  }
  edge('UMLAssociation', actor, target, useDiagram, points);
  userSvg += `<polyline points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="black" stroke-width="1.1"/>`;
}
for (const [fromKey, toKey] of [['submit', 'validate'], ['validate', 'reserve']]) {
  const from = useNodes.get(fromKey), to = useNodes.get(toKey);
  const points = [{ x: from.x + 135, y: from.y }, { x: to.x - 135, y: to.y }];
  edge('UMLInclude', from, to, useDiagram, points);
  userSvg += `<polyline points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="black" stroke-dasharray="7 4" marker-end="url(#open-arrow)"/>`;
  userSvg += textLines(['«include»'], (points[0].x + points[1].x) / 2, from.y - 12, 'middle', 12);
}
for (const [key, label, x, y] of cases) {
  userSvg += `<ellipse cx="${x}" cy="${y}" rx="135" ry="35" fill="white" stroke="black" stroke-width="1.3"/>`;
  const words = label.split(' '), lines = [''];
  for (const word of words) {
    if ((lines.at(-1) + ' ' + word).trim().length > 27) lines.push(word);
    else lines[lines.length - 1] = (lines.at(-1) + ' ' + word).trim();
  }
  userSvg += textLines(lines, x, y + 5 - (lines.length - 1) * 9, 'middle', 14);
}
for (const [, label, x, y] of actorData) {
  userSvg += `<circle cx="${x}" cy="${y - 29}" r="13" fill="white" stroke="black" stroke-width="1.5"/><path d="M${x} ${y - 16}v36m-25 -22h50m-25 22l-24 30m24 -30l24 30" fill="none" stroke="black" stroke-width="1.5"/>`;
  userSvg += textLines([label], x, y + 74, 'middle', 15);
}
userSvg += note(useDiagram, 'Online only. QR acceptance sends tickets directly to kitchen.\nNotify the assigned zone waiter; no waiter approval.\nCashier handles payment outside this system.', 605, 160, 650, 85);
userSvg += note(useDiagram, 'Prepared batch: optional; disabled by default.\nShown as a conditional capability, not an «extend»\nrelationship to ordering.', 640, 840, 325, 90);
userSvg += textLines(['Associations = actor participation. «include» = required behavior. This diagram does not show task sequence.'], 775, 1550, 'middle', 14);
writeFileSync(join(out, 'standard-use-case.svg'), svg('Restaurant UML Use Case Diagram', 1550, 1580, userSvg));

// Reuse the validated logical topology and layout, then render standard UML notation.
const compilerPath = process.argv[2];
assert(compilerPath, 'Provide the ak-diagram compiler module path as the first argument.');
const { validateIR, layoutScene } = await import(compilerPath);
const systemIR = JSON.parse(readFileSync(join(out, 'system-map.json'), 'utf8'));
validateIR(systemIR);
const componentModel = model('UMLModel', 'Logical System Components', project);
const appPackage = model('UMLPackage', 'Proposed Shared Application', componentModel);
const appMembers = new Set(systemIR.boundaries[0].components);
const components = new Map();
for (const source of systemIR.components) {
  const item = model('UMLComponent', source.label, appMembers.has(source.id) ? appPackage : componentModel);
  item.documentation = source.description;
  components.set(source.id, item);
}
const dependencies = systemIR.connections.map((connection, index) => {
  const relation = model('UMLDependency', `D${String(index + 1).padStart(2, '0')}`, components.get(connection.from));
  relation.source = ref(components.get(connection.from)._id);
  relation.target = ref(components.get(connection.to)._id);
  relation.documentation = `${components.get(connection.from).name} → ${components.get(connection.to).name}: ${connection.label}`;
  return relation;
});

// A sparse overview gives orientation; focused views retain every detailed dependency.
const viewSpecs = [
  { name: 'System Components — Overview', file: 'standard-component', indexes: [0,1,2,3,4,5,6,7,8,9,10,13,17,21,26,40], overview: true },
  { name: 'Components — Ordering and Service', file: 'standard-component-ordering', indexes: [0,1,2,3,4,5,6,7,14,15,16,17,18,19,20,21,22,23,24,25] },
  { name: 'Components — Menu, Recipes and Stock', file: 'standard-component-stock', indexes: [9,11,12,13,26,27,28,29,36,37,38,39] },
  { name: 'Components — Bills, Records and Analysis', file: 'standard-component-reporting', indexes: [3,4,8,10,30,31,32,33,34,35,40] }
];
const covered = new Set(viewSpecs.filter(v => !v.overview).flatMap(v => v.indexes));
assert.equal(covered.size, systemIR.connections.length, 'Focused views must retain all original dependencies.');
for (const spec of viewSpecs) {
  const selected = spec.indexes.map(index => systemIR.connections[index]);
  const members = new Set(selected.flatMap(c => [c.from, c.to]));
  const ir = { ...systemIR, meta: { ...systemIR.meta, views: [] },
    components: systemIR.components.filter(c => members.has(c.id)),
    boundaries: [{ ...systemIR.boundaries[0], components: [...members].filter(key => appMembers.has(key)) }],
    connections: selected };
  const scene = layoutScene(validateIR(ir), ir);
  const owner = diagram('UMLComponentDiagram', spec.name, componentModel);
  owner.documentation = spec.overview
    ? 'Orientation view showing key dependencies. All 41 dependencies remain in the three focused component views.'
    : 'Detailed dependencies. D-number labels refer to the dependency key below; select a dependency for its full documentation.';
  const sx = 1.9, sy = 2.8, offsetY = 100;
  const scalePoint = p => ({ x: p.x * sx, y: p.y * sy + offsetY });
  const boxes = new Map(scene.nodes.map(n => [n.id, { left: (n.x + n.w / 2) * sx - 150,
    top: (n.y + n.h / 2) * sy + offsetY - 42, width: 300, height: 84 }]));
  const frame = scene.frames[0];
  const appBox = { left: frame.x * sx, top: frame.y * sy + offsetY,
    width: frame.w * sx, height: frame.h * sy };
  const packageView = nodeView('UMLPackageView', appPackage, owner, appBox);
  packageView.containedViews = [];
  const views = new Map();
  for (const n of scene.nodes) {
    const item = components.get(n.id);
    const view = nodeView('UMLComponentView', item, owner, boxes.get(n.id));
    if (appMembers.has(n.id)) {
      view.containerView = ref(packageView._id);
      packageView.containedViews.push(ref(view._id));
    }
    views.set(n.id, { item, view });
  }
  const width = Math.ceil(scene.viewBox.w * sx);
  const chartBottom = Math.ceil(scene.viewBox.h * sy) + offsetY;
  const legendRows = spec.overview ? 3 : Math.ceil(selected.length / 2) + 3;
  const height = chartBottom + legendRows * 26 + 100;
  let content = textLines([spec.name], width / 2, 35, 'middle', 24);
  content += textLines(['Logical UML dependencies · online only · prepared batches optional'], width / 2, 65, 'middle', 16);
  content += `<rect x="${appBox.left}" y="${appBox.top}" width="${appBox.width}" height="${appBox.height}" fill="none" stroke="black" stroke-width="1.4"/>`;
  content += textLines(['Proposed shared application'], appBox.left + 16, appBox.top + 27, 'start', 16);

  // Keep orthogonal routes in spacious gutters; adapt endpoints to fixed-size UML boxes.
  function dock(p, node, box) {
    const epsilon = 0.1;
    if (Math.abs(p.x - node.x) < epsilon) return { x: box.left, y: box.top + box.height * (p.y - node.y) / node.h };
    if (Math.abs(p.x - node.x - node.w) < epsilon) return { x: box.left + box.width, y: box.top + box.height * (p.y - node.y) / node.h };
    if (Math.abs(p.y - node.y) < epsilon) return { x: box.left + box.width * (p.x - node.x) / node.w, y: box.top };
    return { x: box.left + box.width * (p.x - node.x) / node.w, y: box.top + box.height };
  }
  const nativeNodes = new Map(scene.nodes.map(n => [n.id, n]));
  for (const [edgeIndex, e] of scene.edges.entries()) {
    const points = e.points.map(scalePoint);
    points[0] = dock(e.points[0], nativeNodes.get(e.source), boxes.get(e.source));
    points[points.length - 1] = dock(e.points.at(-1), nativeNodes.get(e.target), boxes.get(e.target));
    // Move the adjacent bend's docking coordinate with the endpoint to keep routes orthogonal.
    if (points.length > 2) {
      if (e.points[0].y === e.points[1].y) points[1].y = points[0].y;
      else points[1].x = points[0].x;
      const last = points.length - 1;
      if (e.points[last].y === e.points[last - 1].y) points[last - 1].y = points[last].y;
      else points[last - 1].x = points[last].x;
    }
    const relation = dependencies[spec.indexes[edgeIndex]];
    edge('UMLDependency', views.get(e.source), views.get(e.target), owner, points, relation.name,
      { relation, showLabel: !spec.overview });
    content += `<polyline points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="black" stroke-width="1.2" stroke-dasharray="7 5" marker-end="url(#open-arrow)"/>`;
    if (!spec.overview && e.labelBox) {
      const center = scalePoint({ x: e.labelBox.x, y: e.labelBox.y });
      content += `<rect x="${center.x - 20}" y="${center.y - 15}" width="40" height="22" fill="white"/>`;
      content += textLines([relation.name], center.x, center.y + 1, 'middle', 13);
    }
    for (let i = 1; i < points.length; i++) {
      assert(Math.abs(points[i].x - points[i-1].x) < 0.1 || Math.abs(points[i].y - points[i-1].y) < 0.1,
        `${spec.name}: non-orthogonal route ${relation.name}`);
    }
  }
  for (const n of scene.nodes) {
    const item = components.get(n.id), b = boxes.get(n.id);
    const { left: x, top: y, width: w, height: h } = b;
    content += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white" stroke="black" stroke-width="1.5"/><path d="M${x+w-30} ${y+12}h18v20h-18z M${x+w-34} ${y+15}h8v5h-8z M${x+w-34} ${y+24}h8v5h-8z" fill="white" stroke="black"/>`;
    content += textLines(['«component»'], x + w / 2, y + 24, 'middle', 13);
    content += textLines([item.name], x + w / 2, y + 52, 'middle', 16);
  }
  const legend = ['Dashed arrow: client depends on supplier. Logical dependencies do not show execution sequence.',
    ...(spec.overview ? ['Overview shows key dependencies. Open the Ordering, Stock, and Reporting views for all relationships.',
      'Prepared batches are configurable and disabled by default. Payment is handled externally by the cashier.']
      : spec.indexes.map(index => {
        const c = systemIR.connections[index];
        return `${dependencies[index].name}  ${components.get(c.from).name} → ${components.get(c.to).name}: ${c.label}`;
      }))];
  // Notes stay outside the component field instead of competing with route labels.
  const keyTop = chartBottom + 25;
  if (spec.overview) content += note(owner, legend.join('\n'), 30, keyTop, width - 60, 100);
  else {
    content += note(owner, legend[0], 30, keyTop, width - 60, 42);
    const half = Math.ceil((legend.length - 1) / 2), columnWidth = (width - 90) / 2;
    for (let column = 0; column < 2; column++) {
      const lines = legend.slice(1 + column * half, 1 + (column + 1) * half);
      content += note(owner, lines.join('\n'), 30 + column * (columnWidth + 30), keyTop + 60,
        columnWidth, lines.length * 20 + 25);
    }
  }
  writeFileSync(join(out, `${spec.file}.svg`), svg(spec.name, width, height, content));
}

// Validate the native project's identities, references and UML relationship semantics.
const objects = new Map(), refs = [];
function inspect(value, parent = null) {
  if (!value || typeof value !== 'object') return;
  if (value._id) {
    assert(!objects.has(value._id), `Duplicate ID: ${value._id}`);
    objects.set(value._id, value);
    if (parent) assert.equal(value._parent?.$ref, parent._id, `Wrong parent: ${value._id}`);
    parent = value;
  }
  if (value.$ref) refs.push(value.$ref);
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(entry => inspect(entry, parent));
    else if (child && typeof child === 'object') inspect(child, parent);
  }
}
inspect(project);
for (const target of refs) assert(objects.has(target), `Dangling reference: ${target}`);
for (const item of objects.values()) {
  if (item._type === 'UMLInclude') {
    assert.equal(objects.get(item.source.$ref)._type, 'UMLUseCase');
    assert.equal(objects.get(item.target.$ref)._type, 'UMLUseCase');
  }
  if (item._type === 'UMLDependency') {
    assert.equal(objects.get(item.source.$ref)._type, 'UMLComponent');
    assert.equal(objects.get(item.target.$ref)._type, 'UMLComponent');
  }
}
writeFileSync(join(out, 'restaurant-management.mdj'), JSON.stringify(project, null, 2) + '\n');
console.log(`Generated 5 UML SVG previews and a native StarUML project; all 41 dependencies retained; ${objects.size} unique objects and ${refs.length} references validated.`);
