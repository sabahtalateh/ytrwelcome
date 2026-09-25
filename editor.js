// The placement rig for welcome.html: a floating panel, resize frames and the sliders
// that produced every number baked into the page's css. Not loaded by the page.
// Open the console and call edit() to bring it up.

const STYLE = `
.layer { outline: 1px dashed #1a73e8; }

    .layer i {
      position: absolute;
      width: 9px;
      height: 9px;
      margin: -5px;
      background: #fff;
      border: 1px solid #1a73e8;
    }

    .layer i[data-grip="nw"],
    .layer i[data-grip="se"] {
      cursor: nwse-resize;
    }

    .layer i[data-grip="ne"],
    .layer i[data-grip="sw"] {
      cursor: nesw-resize;
    }

    .layer i[data-grip="n"],
    .layer i[data-grip="s"] {
      cursor: ns-resize;
    }

    .layer i[data-grip="e"],
    .layer i[data-grip="w"] {
      cursor: ew-resize;
    }

    .layer b {
      position: absolute;
      left: 100%;
      top: 0;
      width: 11px;
      height: 11px;
      margin: -18px 0 0 7px;
      background: #fff;
      border: 1px solid #1a73e8;
      border-radius: 50%;
      /* no css keyword means turning, so the arrow is drawn here; 12 12 puts the hotspot at its centre */
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cg fill='none' stroke='%23fff' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 12a6 6 0 1 1-6-6'/%3E%3Cpath d='M12 3l4 3l-4 3z'/%3E%3C/g%3E%3Cpath d='M18 12a6 6 0 1 1-6-6' fill='none' stroke='%23202124' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 3l4 3l-4 3z' fill='%23202124'/%3E%3C/svg%3E") 12 12, grab;
    }

    /* the frames are an authoring aid; this is how the page actually looks */
    .bare .layer {
      outline: none;
    }

    .bare .layer i,
    .bare .layer b {
      display: none;
    }

    .press {
      font: 11px/1.4 ui-monospace, Menlo, monospace;
      color: #3c4043;
      padding: 5px 8px;
      background: #fff;
      border: 1px solid #dadce0;
      border-radius: 4px;
      cursor: pointer;
    }

    .menu,
    .callout,
    .layer {
      cursor: grab;
    }

    .menu:active,
    .callout:active,
    .layer:active {
      cursor: grabbing;
    }

    /* the pointer is captured while turning, so the cursor has to be forced page wide */
    .spinning,
    .spinning *,
    .spinning .layer i {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cg fill='none' stroke='%23fff' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 12a6 6 0 1 1-6-6'/%3E%3Cpath d='M12 3l4 3l-4 3z'/%3E%3C/g%3E%3Cpath d='M18 12a6 6 0 1 1-6-6' fill='none' stroke='%23202124' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 3l4 3l-4 3z' fill='%23202124'/%3E%3C/svg%3E") 12 12, grabbing;
    }

    /* the pointer stands still through a wheel gesture, so it only gets in the way */
    .wheeling,
    .wheeling *,
    .wheeling .layer i {
      cursor: none;
    }

    /* temporary: the whole authoring rig, parked off to the side of the page */
    .panel {
      position: fixed;
      left: 12px;
      top: 12px;
      z-index: 10;
      width: 320px;
      max-height: calc(100vh - 24px);
      overflow-y: auto;
      display: grid;
      gap: 6px;
      padding: 12px;
      text-align: left;
      background: #fff;
      border: 1px solid #dadce0;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(32, 33, 36, 0.16);
    }

    .size {
      display: grid;
      grid-template-columns: 100px 1fr 40px;
      align-items: center;
      gap: 8px;
      font: 11px/1.4 ui-monospace, Menlo, monospace;
      color: #3c4043;
    }

    .size input {
      width: 100%;
      min-width: 0;
    }

    .size output {
      text-align: right;
    }

    .buttons {
      display: flex;
      gap: 8px;
      margin: 2px 0 4px;
    }

    /* only the layer clicked on the mock-up shows its own controls */
    .sect {
      display: none;
      gap: 6px;
    }

    .sect.on {
      display: grid;
    }

    .pick {
      margin: 0;
      font: 11px/1.4 ui-monospace, Menlo, monospace;
      color: #80868b;
    }

    /* temporary: shows where each overlay sits, so the values can be copied into the css above */
    .readout {
      margin: 0;
      font: 10px/1.45 ui-monospace, Menlo, monospace;
      color: #3c4043;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
`;

const PANEL = `
    <label class="size">
      <span>Ширина</span>
      <input type="range" id="shotWidth" min="320" max="900" value="720">
      <output id="shotWidthValue"></output>
    </label>

    <p class="pick" id="pick">Кликни по слою на макете</p>

    <div class="sect" data-for=".browser">
      <label class="size">
        <span>Обрезка</span>
        <input type="range" id="browserCut" min="20" max="100" step="0.5" value="94.5">
        <output id="browserCutValue"></output>
      </label>
    </div>
    <div class="sect" data-for=".browser2">
      <label class="size">
        <span>Обрезка</span>
        <input type="range" id="browser2Cut" min="20" max="100" step="0.5" value="30.5">
        <output id="browser2CutValue"></output>
      </label>
    </div>

    <div class="sect" data-for=".menu">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="menuScale" min="10" max="300" value="100">
        <output id="menuScaleValue"></output>
      </label>
      <pre class="readout" id="menuReadout"></pre>
    </div>
    <div class="sect" data-for=".hand">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="handScale" min="10" max="300" value="100">
        <output id="handScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="handShade" min="0" max="12" step="0.1" value="4.7">
        <output id="handShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="handTurn" min="-180" max="180" step="1" value="0">
      </label>
      <pre class="readout" id="handReadout"></pre>
    </div>
    <div class="sect" data-for=".bluesparks">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="bluesparksScale" min="10" max="300" value="100">
        <output id="bluesparksScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="bluesparksShade" min="0" max="12" step="0.1" value="4.7">
        <output id="bluesparksShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="bluesparksTurn" min="-180" max="180" step="1" value="0">
      </label>
      <pre class="readout" id="bluesparksReadout"></pre>
    </div>
    <div class="sect" data-for=".redsparks">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="redsparksScale" min="10" max="300" value="100">
        <output id="redsparksScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="redsparksShade" min="0" max="12" step="0.1" value="1.3">
        <output id="redsparksShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="redsparksTurn" min="-180" max="180" step="1" value="0">
      </label>
      <pre class="readout" id="redsparksReadout"></pre>
    </div>
    <div class="sect" data-for=".puzzle">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="puzzleScale" min="10" max="300" value="100">
        <output id="puzzleScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="puzzleShade" min="0" max="12" step="0.1" value="4.7">
        <output id="puzzleShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="puzzleTurn" min="-180" max="180" step="1" value="0">
      </label>
      <pre class="readout" id="puzzleReadout"></pre>
    </div>
    <div class="sect" data-for=".pin">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="pinScale" min="10" max="300" value="100">
        <output id="pinScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="pinShade" min="0" max="12" step="0.1" value="3.5">
        <output id="pinShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="pinTurn" min="-180" max="180" step="1" value="0">
      </label>
      <pre class="readout" id="pinReadout"></pre>
    </div>
    <div class="sect" data-for=".hand2">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="hand2Scale" min="10" max="300" value="100">
        <output id="hand2ScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="hand2Shade" min="0" max="12" step="0.1" value="4.7">
        <output id="hand2ShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="hand2Turn" min="-180" max="180" step="1" value="0">
      </label>
      <pre class="readout" id="hand2Readout"></pre>
    </div>
    <div class="sect" data-for=".step1">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="step1Scale" min="10" max="300" value="100">
        <output id="step1ScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="step1Shade" min="0" max="40" step="0.5" value="11">
        <output id="step1ShadeValue"></output>
      </label>
      <pre class="readout" id="step1Readout"></pre>
    </div>
    <div class="sect" data-for=".step3">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="step3Scale" min="10" max="300" value="100">
        <output id="step3ScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="step3Shade" min="0" max="40" step="0.5" value="11">
        <output id="step3ShadeValue"></output>
      </label>
      <pre class="readout" id="step3Readout"></pre>
    </div>
    <div class="sect" data-for=".step2">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="step2Scale" min="10" max="300" value="100">
        <output id="step2ScaleValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="step2Shade" min="0" max="40" step="0.5" value="11">
        <output id="step2ShadeValue"></output>
      </label>
      <pre class="readout" id="step2Readout"></pre>
    </div>
    <div class="sect" data-for=".arrow1">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="arrow1Scale" min="10" max="300" value="100">
        <output id="arrow1ScaleValue"></output>
      </label>
      <label class="size">
        <span>Обводка</span>
        <input type="range" id="arrow1Ring" min="0" max="6" step="0.1" value="3.4">
        <output id="arrow1RingValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="arrow1Shade" min="0" max="12" step="0.1" value="4.7">
        <output id="arrow1ShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="arrow1Turn" min="-180" max="180" step="1" value="-8">
      </label>
      <pre class="readout" id="arrow1Readout"></pre>
    </div>
    <div class="sect" data-for=".arrow2">
      <label class="size">
        <span>Масштаб</span>
        <input type="range" id="arrow2Scale" min="10" max="300" value="100">
        <output id="arrow2ScaleValue"></output>
      </label>
      <label class="size">
        <span>Обводка</span>
        <input type="range" id="arrow2Ring" min="0" max="6" step="0.1" value="4.2">
        <output id="arrow2RingValue"></output>
      </label>
      <label class="size">
        <span>Тень</span>
        <input type="range" id="arrow2Shade" min="0" max="12" step="0.1" value="4.7">
        <output id="arrow2ShadeValue"></output>
      </label>
      <label class="size">
        <span>Угол</span>
        <input type="range" id="arrow2Turn" min="-180" max="180" step="1" value="-3">
      </label>
      <pre class="readout" id="arrow2Readout"></pre>
    </div>

    <div class="buttons">
      <button type="button" class="press" id="bare">Показать рамки</button>
      <button type="button" class="press" id="copy">Копировать дефолты</button>
    </div>`;

let running = false;

export function start() {
  if (running) return;
  running = true;

  document.head.append(Object.assign(document.createElement('style'), { textContent: STYLE }));

  const panel = document.createElement('aside');
  panel.className = 'panel';
  panel.innerHTML = PANEL;
  document.body.prepend(panel);
  document.body.classList.add('bare');

      // temporary placement helpers; the values they produce live in the css above
      // a layer is measured against the scene it sits in, not always the first one
      const scene = node => node.closest('.shot');
      const pick = document.getElementById('pick');

      // a ratio slider hands over the change since its last reading, so a stretch made
      // with the grips survives a later move of it
      function ratio(name, suffix, grow) {
        const input = document.getElementById(`${name}${suffix}`);
        if (!input) return;

        const value = document.getElementById(`${name}${suffix}Value`);
        let last = Number(input.value);

        input.addEventListener('input', () => {
          const now = Number(input.value);
          grow(now / last);
          last = now;
          value.value = `${now}%`;
        });

        value.value = `${last}%`;
      }

      // a wheel gesture leaves the pointer where it is, so hide it until the wheel goes quiet;
      // events inside one gesture are tens of ms apart, well under this
      let wheelIdle = null;

      function hideCursor() {
        document.body.classList.add('wheeling');
        clearTimeout(wheelIdle);
        wheelIdle = setTimeout(() => document.body.classList.remove('wheeling'), 400);
      }

      addEventListener('pointermove', () => {
        document.body.classList.remove('wheeling');
      });

      // the panel shows one layer at a time: the one last clicked on the mock-up
      function select(selector) {
        for (const node of document.querySelectorAll('.sect')) {
          node.classList.toggle('on', node.dataset.for === selector);
        }
        pick.hidden = true;
      }

      // drag moves the element, wheel resizes it through the given property; the readout prints the css
      function placeable(selector, start, property) {
        const name = selector.slice(1);
        const element = document.querySelector(selector);
        const readout = document.getElementById(`${name}Readout`);
        const place = { ...start };
        let drag = null;

        function apply() {
          element.style.top = `${place.top}%`;
          element.style.right = `${place.right}%`;
          element.style.setProperty(property, `${place.size}cqw`);

          readout.textContent =
            `${selector}  top: ${place.top.toFixed(1)}%;  right: ${place.right.toFixed(1)}%;  ${property}: ${place.size.toFixed(2)}cqw`;
        }

        // scaling holds the centre: a box that grows by d pushes each edge out by d / 2
        function resize(change) {
          const box = scene(element).getBoundingClientRect();
          const before = element.getBoundingClientRect();
          change();
          apply();
          const after = element.getBoundingClientRect();
          place.right -= (after.width - before.width) / 2 / box.width * 100;
          place.top -= (after.height - before.height) / 2 / box.height * 100;
          apply();
        }

        ratio(name, 'Scale', factor => resize(() => {
          place.size *= factor;
        }));

        element.addEventListener('pointerdown', event => {
          event.preventDefault();
          select(selector);
          drag = { x: event.clientX, y: event.clientY };
          element.setPointerCapture(event.pointerId);
        });

        element.addEventListener('pointermove', event => {
          if (!drag) return;

          const box = scene(element).getBoundingClientRect();
          // the box has no size until the images load
          if (!box.width || !box.height) return;

          // right grows leftwards, so a rightward drag lowers it
          place.right -= (event.clientX - drag.x) / box.width * 100;
          place.top += (event.clientY - drag.y) / box.height * 100;
          drag = { x: event.clientX, y: event.clientY };
          apply();
        });

        element.addEventListener('pointerup', () => {
          drag = null;
        });

        // cmd + wheel resizes; the step is a share of the current size, so small and large
        // elements both move sensibly
        element.addEventListener('wheel', event => {
          if (!event.metaKey || event.altKey) return;
          event.preventDefault();
          select(selector);
          hideCursor();
          resize(() => {
            place.size = Math.max(0.2, Math.min(140, place.size * (1 - event.deltaY * 0.002)));
          });
        }, { passive: false });

        apply();
      }

      // cut-outs stretch as well as move, so they sit in a box with resize grips
      function framed(selector, start) {
        const name = selector.slice(1);
        const frame = document.querySelector(selector);
        const readout = document.getElementById(`${name}Readout`);
        const turn = document.getElementById(`${name}Turn`);
        const place = { ...start };

        for (const grip of ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']) {
          const knob = document.createElement('i');
          knob.dataset.grip = grip;
          knob.style.left = `${grip.includes('w') ? 0 : grip.includes('e') ? 100 : 50}%`;
          knob.style.top = `${grip.includes('n') ? 0 : grip.includes('s') ? 100 : 50}%`;
          frame.append(knob);
        }

        const spin = document.createElement('b');
        frame.append(spin);

        function apply() {
          frame.style.top = `${place.top}%`;
          frame.style.right = `${place.right}%`;
          frame.style.width = `${place.width}cqw`;
          frame.style.height = `${place.height}cqw`;
          frame.style.transform = `rotate(${turn.value}deg)`;

          readout.textContent =
            `${selector}  top: ${place.top.toFixed(1)}%;  right: ${place.right.toFixed(1)}%;  ` +
            `width: ${place.width.toFixed(2)}cqw;  height: ${place.height.toFixed(2)}cqw;  ` +
            `transform: rotate(${turn.value}deg)`;
        }

        // scaling holds the centre: a box that grows by d pushes each edge out by d / 2.
        // the frame may be turned, so its own size is used and not the box it covers on screen
        function resize(change) {
          const box = scene(frame).getBoundingClientRect();
          const wide = place.width;
          const tall = place.height;
          change();
          // height is a share of the shot's width, top a share of its height
          place.right -= (place.width - wide) / 2;
          place.top -= (place.height - tall) / 2 * (box.width / box.height);
          apply();
        }

        ratio(name, 'Scale', factor => resize(() => {
          place.width *= factor;
          place.height *= factor;
        }));

        let drag = null;

        frame.addEventListener('pointerdown', event => {
          event.preventDefault();
          select(selector);
          const box = frame.getBoundingClientRect();
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          drag = {
            x: event.clientX,
            y: event.clientY,
            grip: event.target.dataset.grip,
            spin: event.target === spin,
            cx,
            cy,
            deg0: Math.atan2(event.clientY - cy, event.clientX - cx) * 180 / Math.PI,
            turn0: Number(turn.value),
          };
          event.target.setPointerCapture(event.pointerId);
          document.body.classList.toggle('spinning', drag.spin);
        });

        frame.addEventListener('pointermove', event => {
          if (!drag) return;

          const box = scene(frame).getBoundingClientRect();
          // the box has no size until the images load
          if (!box.width || !box.height) return;

          if (drag.spin) {
            // measured from where the grab started, so the knob's own corner does not matter
            const deg = Math.atan2(event.clientY - drag.cy, event.clientX - drag.cx) * 180 / Math.PI;
            const next = drag.turn0 + deg - drag.deg0;
            turn.value = Math.round(((next + 180) % 360 + 360) % 360 - 180);
            apply();
            return;
          }

          const dx = event.clientX - drag.x;
          const dy = event.clientY - drag.y;
          drag.x = event.clientX;
          drag.y = event.clientY;

          if (!drag.grip) {
            // right grows leftwards, so a rightward drag lowers it
            place.right -= dx / box.width * 100;
            place.top += dy / box.height * 100;
            apply();
            return;
          }

          // the drag in the frame's own axes, so the grips stay true once it is rotated
          const angle = turn.value * Math.PI / 180;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const lx = dx * cos + dy * sin;
          const ly = -dx * sin + dy * cos;

          const sx = drag.grip.includes('e') ? 1 : drag.grip.includes('w') ? -1 : 0;
          const sy = drag.grip.includes('s') ? 1 : drag.grip.includes('n') ? -1 : 0;
          const dw = sx * lx;
          const dh = sy * ly;

          // an edge dragged by d moves the centre d / 2 along that axis, the far edge stays put
          const shiftX = (sx ? lx / 2 : 0) * cos - (sy ? ly / 2 : 0) * sin;
          const shiftY = (sx ? lx / 2 : 0) * sin + (sy ? ly / 2 : 0) * cos;

          place.width = Math.max(1, place.width + dw / box.width * 100);
          place.height = Math.max(1, place.height + dh / box.width * 100);
          place.right -= (shiftX + dw / 2) / box.width * 100;
          place.top += (shiftY - dh / 2) / box.height * 100;
          apply();
        });

        frame.addEventListener('pointerup', () => {
          drag = null;
          document.body.classList.remove('spinning');
        });

        // cmd + wheel resizes, alt + wheel turns, both together set the outline; one wheel
        // notch is about 100 of deltaY, so that is 20% of the size, 10 degrees or 0.2px
        const ring = document.getElementById(`${name}Ring`);

        frame.addEventListener('wheel', event => {
          if (!event.metaKey && !event.altKey) return;
          event.preventDefault();
          select(selector);
          hideCursor();

          // only the cut-outs carry one, the chips and hands have nothing to widen
          if (event.metaKey && event.altKey) {
            if (!ring) return;
            ring.value = Math.max(0, Math.min(6, Number(ring.value) - event.deltaY * 0.002)).toFixed(1);
            ring.dispatchEvent(new Event('input', { bubbles: true }));
            return;
          }

          if (event.metaKey) {
            const step = 1 - event.deltaY * 0.002;
            resize(() => {
              place.width = Math.max(0.2, place.width * step);
              place.height = Math.max(0.2, place.height * step);
            });
            return;
          }

          const next = Number(turn.value) - event.deltaY * 0.1;
          turn.value = Math.round(((next + 180) % 360 + 360) % 360 - 180);
          apply();
        }, { passive: false });

        turn.addEventListener('input', apply);
        apply();
      }

      // both window shots are 1565 by 1005, give or take a pixel, so one ratio covers them:
      // a share of the height turns into a share of the width, which is what margins use
      const aspect = 1566 / 1005;

      // each scene is cut on its own; clicking its window opens that slider
      for (const name of ['browser', 'browser2']) {
        const node = document.querySelector(`.${name}`);
        const input = document.getElementById(`${name}Cut`);
        const value = document.getElementById(`${name}CutValue`);

        const paint = () => {
          const share = Number(input.value);
          node.style.marginBottom = `${-(100 - share) / aspect}%`;
          value.value = `${share.toFixed(1)}%`;
        };

        node.addEventListener('pointerdown', () => select(`.${name}`));
        input.addEventListener('input', paint);
        paint();
      }

      const widthInput = document.getElementById('shotWidth');
      const widthValue = document.getElementById('shotWidthValue');

      function applyWidth() {
        for (const node of document.querySelectorAll('.shot')) node.style.maxWidth = `${widthInput.value}px`;
        widthValue.value = `${widthInput.value}px`;
      }

      const bare = document.getElementById('bare');
      const copy = document.getElementById('copy');

      // everything the css needs, in the order the controls sit in
      function defaults() {
        return [
          ...['browser', 'browser2'].map(name => `Обрезка .${name} ${document.getElementById(`${name}Cut`).value}%`),
          `Ширина браузера ${widthInput.value}px`,
          ...outlined.map(name => `Обводка .${name} ${document.getElementById(`${name}Ring`).value}px`),
          ...[...filtered, 'step1', 'step2', 'step3'].map(name => `Тень .${name} ${document.getElementById(`${name}Shade`).value}px`),
          ...[...document.querySelectorAll('.readout')].map(node => node.textContent),
        ].join('\n');
      }

      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(defaults());
          copy.textContent = 'Скопировано';
        } catch (error) {
          copy.textContent = String(error.name);
        }
        setTimeout(() => { copy.textContent = 'Копировать дефолты'; }, 1500);
      });

      bare.addEventListener('click', () => {
        const hidden = document.body.classList.toggle('bare');
        bare.textContent = hidden ? 'Показать рамки' : 'Скрыть рамки';
      });

      // every layer with a filter of its own; the cut-outs also carry a white ring
      const arrows = ['arrow1', 'arrow2'];
      const filtered = [...arrows, 'puzzle', 'pin', 'redsparks', 'bluesparks', 'hand', 'hand2'];
      const outlined = arrows;

      // a filter primitive driven by one slider, in css pixels of the rendered layer
      function dial(name, suffix, node, attribute, factor = 1) {
        const input = document.getElementById(`${name}${suffix}`);
        const value = document.getElementById(`${name}${suffix}Value`);

        const paint = () => {
          node.setAttribute(attribute, input.value * factor);
          value.value = `${input.value}px`;
        };

        input.addEventListener('input', paint);
        paint();
      }

      for (const name of arrows) {
        dial(name, 'Ring', document.querySelector(`#fx-${name} feMorphology`), 'radius');
      }

      for (const name of filtered) {
        dial(name, 'Shade', document.querySelector(`#fx-${name} feDropShadow`), 'stdDeviation');
      }

      // the pills are css boxes, not filtered images, so their blur is a custom property
      for (const name of ['step1', 'step2', 'step3']) {
        const element = document.querySelector(`.${name}`);
        const input = document.getElementById(`${name}Shade`);
        const value = document.getElementById(`${name}ShadeValue`);

        const paint = () => {
          element.style.setProperty('--shade', `${input.value}px`);
          value.value = `${input.value}px`;
        };

        input.addEventListener('input', paint);
        paint();
      }

      widthInput.addEventListener('input', applyWidth);

      applyWidth();
      placeable('.menu', { top: 31.9, right: -4.5, size: 61.21 }, 'width');
      placeable('.step1', { top: -3.9, right: 24.2, size: 2.42 }, 'font-size');
      placeable('.step2', { top: 44.5, right: 16.6, size: 2.2 }, 'font-size');
      placeable('.step3', { top: 5.1, right: 28.5, size: 2.4 }, 'font-size');
      framed('.arrow1', { top: 2.0, right: 17.7, width: 14.48, height: 8.17 });
      framed('.arrow2', { top: 49, right: 9.9, width: 10.82, height: 6.2 });
      framed('.hand', { top: 20.8, right: 4.2, width: 6.67, height: 7.33 });
      framed('.hand2', { top: 68.3, right: -0.2, width: 6.67, height: 7.33 });
      framed('.puzzle', { top: 12.2, right: 8.0, width: 8.0, height: 8.08 });
      framed('.pin', { top: 60.1, right: 3.4, width: 7.12, height: 7.16 });
      framed('.redsparks', { top: 3.5, right: 4.7, width: 16.4, height: 11.18 });
      framed('.bluesparks', { top: 51.9, right: 0.2, width: 14, height: 8.36 });
}
