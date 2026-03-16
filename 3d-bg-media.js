// 3d-bg-media.js — Media Opening Log: 3D Media Bottles & Lab Glassware
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f0f4f8');
  scene.fog = new THREE.FogExp2('#f0f4f8', 0.003);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  scene.add(new THREE.AmbientLight('#ffffff', 0.7));
  const dir = new THREE.DirectionalLight('#ffffff', 0.8);
  dir.position.set(30, 40, 30);
  scene.add(dir);
  const pt1 = new THREE.PointLight('#0ea5e9', 1.2, 200);
  pt1.position.set(20, 20, 20);
  scene.add(pt1);
  const pt2 = new THREE.PointLight('#f59e0b', 0.8, 200);
  pt2.position.set(-20, -15, 15);
  scene.add(pt2);

  const group = new THREE.Group();
  scene.add(group);
  const items = [];

  // Color palette for media/reagent liquids
  const mediaColors = [
    { body: '#f59e0b', liquid: '#fbbf24' },  // Amber — Nutrient Broth
    { body: '#ef4444', liquid: '#f87171' },  // Red — Blood Agar Base
    { body: '#8b5cf6', liquid: '#a78bfa' },  // Purple — MacConkey
    { body: '#10b981', liquid: '#34d399' },  // Green — Sabouraud
    { body: '#0ea5e9', liquid: '#38bdf8' },  // Blue — EMB
    { body: '#ec4899', liquid: '#f472b6' },  // Pink — Chromogenic
  ];

  // Create a media bottle (cylinder body + narrow neck + cap)
  function createBottle(color, scale) {
    const bottle = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 2.5, 16);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: '#e2e8f0', transmission: 0.85, transparent: true, opacity: 0.9,
      metalness: 0, roughness: 0.05, ior: 1.5, thickness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    bottle.add(body);

    // Liquid inside
    const liqGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.6, 16);
    const liqMat = new THREE.MeshPhysicalMaterial({
      color: color.liquid, transmission: 0.4, transparent: true, opacity: 0.8,
      metalness: 0, roughness: 0.2, emissive: color.body, emissiveIntensity: 0.15
    });
    const liquid = new THREE.Mesh(liqGeo, liqMat);
    liquid.position.y = -0.3;
    bottle.add(liquid);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.4, 0.8, 0.8, 16);
    const neck = new THREE.Mesh(neckGeo, bodyMat);
    neck.position.y = 1.65;
    bottle.add(neck);

    // Cap
    const capGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: color.body, metalness: 0.3, roughness: 0.4 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 2.2;
    bottle.add(cap);

    // Label band
    const labelGeo = new THREE.CylinderGeometry(1.03, 1.03, 0.6, 16, 1, true);
    const labelMat = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.7 });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = 0.2;
    bottle.add(label);

    bottle.scale.set(scale, scale, scale);
    return bottle;
  }

  // Create Petri dish
  function createPetriDish(color, scale) {
    const dish = new THREE.Group();

    // Bottom
    const bottomGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.25, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#e2e8f0', transmission: 0.8, transparent: true, opacity: 0.85,
      metalness: 0, roughness: 0.05, ior: 1.5
    });
    const bottom = new THREE.Mesh(bottomGeo, glassMat);
    dish.add(bottom);

    // Agar inside
    const agarGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.15, 32);
    const agarMat = new THREE.MeshStandardMaterial({
      color: color.liquid, transparent: true, opacity: 0.9,
      emissive: color.body, emissiveIntensity: 0.1
    });
    const agar = new THREE.Mesh(agarGeo, agarMat);
    agar.position.y = 0.05;
    dish.add(agar);

    // Lid (slightly bigger, offset up)
    const lidGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.18, 32);
    const lid = new THREE.Mesh(lidGeo, glassMat);
    lid.position.y = 0.35;
    dish.add(lid);

    dish.scale.set(scale, scale, scale);
    return dish;
  }

  // Spawn bottles and dishes
  const count = 30;
  for (let i = 0; i < count; i++) {
    const mc = mediaColors[i % mediaColors.length];
    const scale = Math.random() * 1.2 + 0.6;
    const item = (i % 3 === 0) ? createPetriDish(mc, scale) : createBottle(mc, scale);

    item.position.x = (Math.random() - 0.5) * 120;
    item.position.y = (Math.random() - 0.5) * 100;
    item.position.z = (Math.random() - 0.5) * 60;
    item.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.3);

    item.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.025,
        (Math.random() - 0.5) * 0.025,
        (Math.random() - 0.5) * 0.015
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002
      )
    };

    group.add(item);
    items.push(item);
  }

  // Particles (tiny sparkle dust)
  const pgeo = new THREE.BufferGeometry();
  const pcount = 400;
  const ppos = new Float32Array(pcount * 3);
  const pcol = new Float32Array(pcount * 3);
  const pvels = [];
  const dustC = [[0.96,0.62,0.04],[0.06,0.65,0.51],[0.55,0.36,0.96],[0.94,0.27,0.37],[0.05,0.65,0.91]];
  for (let i = 0; i < pcount * 3; i += 3) {
    ppos[i] = (Math.random() - 0.5) * 160;
    ppos[i+1] = (Math.random() - 0.5) * 160;
    ppos[i+2] = (Math.random() - 0.5) * 100;
    const dc = dustC[Math.floor(Math.random() * dustC.length)];
    pcol[i] = dc[0]; pcol[i+1] = dc[1]; pcol[i+2] = dc[2];
    pvels.push({ x: (Math.random()-0.5)*0.012, y: (Math.random()-0.5)*0.012 });
  }
  pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
  pgeo.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
  const pmesh = new THREE.Points(pgeo, new THREE.PointsMaterial({
    size: 0.35, vertexColors: true, transparent: true, opacity: 0.45
  }));
  scene.add(pmesh);

  // Mouse
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX - window.innerWidth/2);
    mouseY = (e.clientY - window.innerHeight/2);
  });

  // Animate
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    group.rotation.y += 0.02 * (mouseX * 0.002 - group.rotation.y);
    group.rotation.x += 0.02 * (mouseY * 0.002 - group.rotation.x);

    items.forEach(item => {
      item.position.add(item.userData.velocity);
      item.rotation.x += item.userData.rotSpeed.x;
      item.rotation.y += item.userData.rotSpeed.y;
      if (item.position.x > 60 || item.position.x < -60) item.userData.velocity.x *= -1;
      if (item.position.y > 50 || item.position.y < -50) item.userData.velocity.y *= -1;
      if (item.position.z > 30 || item.position.z < -30) item.userData.velocity.z *= -1;
    });

    const pos = pgeo.attributes.position.array;
    for (let i = 0; i < pcount; i++) {
      const i3 = i * 3;
      pos[i3] += pvels[i].x; pos[i3+1] += pvels[i].y;
      if (pos[i3+1] > 80) pos[i3+1] = -80;
      if (pos[i3+1] < -80) pos[i3+1] = 80;
      if (pos[i3] > 80) pos[i3] = -80;
      if (pos[i3] < -80) pos[i3] = 80;
    }
    pgeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
