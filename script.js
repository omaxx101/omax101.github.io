/* Elevator portfolio script
   - Moves the .track vertically so the chosen floor aligns to viewport.
   - Floors are in DOM order: Ground (index 0), 1..5 (index 1..5)
   - Side buttons select target floor.
*/

(() => {
  // DOM refs
  const track = document.getElementById('track');
  const buttons = Array.from(document.querySelectorAll('.floor-btn'));
  const indicator = document.getElementById('indicator');

  // Read floors from DOM and build mapping
  const floors = Array.from(document.querySelectorAll('.floor'));
  // floorLabels: ['G','1','2','3','4','5']
  const floorLabels = floors.map(f => f.dataset.floor);

  // Helper: set CSS transform to move track to show index-th floor
  // Each floor's height is viewport (100vh). We'll use window.innerHeight to compute px offset.
  function goToFloor(index) {
    // clamp
    index = Math.max(0, Math.min(index, floors.length - 1));
    // translate upward by index * viewportHeight
    const vh = window.innerHeight;
    const translateY = -(index * vh);
    // Apply transform
    track.style.transform = `translateY(${translateY}px)`;
    // Update indicator and active button
    const label = floorLabels[index] || '';
    indicator.textContent = label;
    updateActiveButton(label);
  }

  function updateActiveButton(label){
    buttons.forEach(btn => {
      if (btn.dataset.target === label) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  // map button clicks to floors
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      // find index of target in floorLabels
      const idx = floorLabels.indexOf(target);
      if (idx === -1) return;
      goToFloor(idx);
    });
  });

  // Recompute translation on resize to keep target floor aligned
  let currentTarget = 0;
  function recompute(){
    // indicator text tells current
    const label = indicator.textContent || 'G';
    const idx = floorLabels.indexOf(label);
    const activeIdx = idx === -1 ? 0 : idx;
    currentTarget = activeIdx;
    // Reapply transform to new viewport height
    goToFloor(activeIdx);
  }
  window.addEventListener('resize', () => {
    // small timeout helps mobile keyboard/layout changes
    setTimeout(recompute, 120);
  });

  // Initialize at Ground
  goToFloor(0);

  // Optional: keyboard nav (G, 1-5, arrow up/down)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      // go up a floor (higher index)
      const label = indicator.textContent;
      const idx = Math.max(0, floorLabels.indexOf(label));
      goToFloor(Math.min(floors.length - 1, idx + 1));
    } else if (e.key === 'ArrowDown') {
      const label = indicator.textContent;
      const idx = Math.max(0, floorLabels.indexOf(label));
      goToFloor(Math.max(0, idx - 1));
    } else if (/^[G1-5]$/.test(e.key)) {
      // typed G or 1-5
      const target = e.key;
      const idx = floorLabels.indexOf(target);
      if (idx >= 0) goToFloor(idx);
    }
  });

})();
