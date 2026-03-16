// 3d-bg-strain.js — Reference Strain Log: 3D Bacteria & Microorganisms
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

  scene.add(new THREE.AmbientLight('#ffffff', 0.6));
  const dir = new THREE.DirectionalLight('#ffffff', 0.9);
  dir.position.set(30, 40, 30);
  scene.add(dir);
  const pt1 = new THREE.PointLight('#a855f7', 1.2, 200);
  pt1.position.set(20, 20, 20);
  scene.add(pt1);
  const pt2 = new THREE.PointLight('#10b981', 1, 200);
  pt2.position.set(-20, -15, 15);
  scene.add(pt2);
  const pt3 = new THREE.PointLight('#f43f5e', 0.8, 200);
  pt3.position.set(0, -20, 25);
  scene.add(pt3);

  const group = new THREE.Group();
  scene.add(group);
  const items = [];

  const bacteriaColors = [
    '#a855f7', // Purple — Gram positive
    '#10b981', // Green — E. coli fluorescent
    '#f43f5e', // Rose — Salmonella
    '#0ea5e9', // Blue — Pseudomonas
    '#f59e0b', // Amber — S. aureus
    '#ec4899', // Pink — Streptococcus
    '#14b8a6', // Teal — Listeria
    '#6366f1', // Indigo — Clostridium
  ];

  // Rod bacteria (Bacillus) — capsule shape
  function createRod(color, scale) {
    const rod = new THREE.Group();
    const mat = new THREE.MeshPhysicalMaterial({
      color, transmission: 0.5, transparent: true, opacity: 0.85,
      metalness: 0, roughness: 0.2, emissive: color, emissiveIntensity: 0.15
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), mat);
    rod.add(body);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), mat);
    top.position.y = 1;
    rod.add(top);
    const bot = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), mat);
    bot.position.y = -1;
    rod.add(bot);

    // Flagellum (thin tapered tail)
    const flagGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.4, 0),
        new THREE.Vector3(0.3, -2, 0.2),
        new THREE.Vector3(-0.2, -2.6, -0.1),
        new THREE.Vector3(0.1, -3.2, 0.15)
      ]), 20, 0.06, 6, false
    );
    const flagMat = new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.5 });
    rod.add(new THREE.Mesh(flagGeo, flagMat));

    rod.scale.set(scale, scale, scale);
    return rod;
  }

  // Coccus (sphere) — Staphylococcus cluster
  function createCoccusCluster(color, scale) {
    const cluster = new THREE.Group();
    const mat = new THREE.MeshPhysicalMaterial({
      color, transmission: 0.5, transparent: true, opacity: 0.9,
      metalness: 0, roughness: 0.15, emissive: color, emissiveIntensity: 0.12
    });
    // 4-6 spheres clustered
    const positions = [
      [0, 0, 0], [0.7, 0.3, 0], [-0.5, 0.6, 0.2],
      [0.2, -0.6, 0.3], [-0.3, -0.2, -0.5]
    ];
    positions.forEach(p => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mat);
      s.position.set(p[0], p[1], p[2]);
      cluster.add(s);
    });
    cluster.scale.set(scale, scale, scale);
    return cluster;
  }

  // Spiral bacteria (Spirillum) — torus knot
  function createSpiral(color, scale) {
    const mat = new THREE.MeshPhysicalMaterial({
      color, transmission: 0.45, transparent: true, opacity: 0.85,
      metalness: 0, roughness: 0.2, emissive: color, emissiveIntensity: 0.15
    });
    const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.15, 80, 8, 3, 2), mat);
    mesh.scale.set(scale, scale, scale);
    return mesh;
  }

  // Vibrio (comma shape) — curved cylinder
  function createVibrio(color, scale) {
    const vibrio = new THREE.Group();
    const mat = new THREE.MeshPhysicalMaterial({
      color, transmission: 0.5, transparent: true, opacity: 0.85,
      metalness: 0, roughness: 0.2, emissive: color, emissiveIntensity: 0.15
    });
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0.4, 0, 0.2),
      new THREE.Vector3(0, 1, 0)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.3, 12, false);
    vibrio.add(new THREE.Mesh(tubeGeo, mat));
    // End caps
    const cap1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), mat);
    cap1.position.set(0, -1, 0);
    vibrio.add(cap1);
    const cap2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), mat);
    cap2.position.set(0, 1, 0);
    vibrio.add(cap2);
    vibrio.scale.set(scale, scale, scale);
    return vibrio;
  }

  // Spawn bacteria
  const count = 35;
  const creators = [createRod, createCoccusCluster, createSpiral, createVibrio];
  for (let i = 0; i < count; i++) {
    const color = bacteriaColors[i % bacteriaColors.length];
    const scale = Math.random() * 1.5 + 0.7;
    const create = creators[i % creators.length];
    const item = create(color, scale);

    item.position.x = (Math.random() - 0.5) * 120;
    item.position.y = (Math.random() - 0.5) * 100;
    item.position.z = (Math.random() - 0.5) * 60;
    item.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI);

    item.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.02
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.003
      ),
      wigglePhase: Math.random() * Math.PI * 2,
      wiggleSpeed: Math.random() * 2 + 1
    };

    group.add(item);
    items.push(item);
  }

  // Particles
  const pgeo = new THREE.BufferGeometry();
  const pcount = 500;
  const ppos = new Float32Array(pcount * 3);
  const pcol = new Float32Array(pcount * 3);
  const pvels = [];
  const dustC = [[0.66,0.33,0.97],[0.06,0.73,0.51],[0.96,0.25,0.37],[0.93,0.29,0.60],[0.39,0.40,0.95]];
  for (let i = 0; i < pcount * 3; i += 3) {
    ppos[i] = (Math.random()-0.5)*160; ppos[i+1] = (Math.random()-0.5)*160; ppos[i+2] = (Math.random()-0.5)*100;
    const dc = dustC[Math.floor(Math.random()*dustC.length)];
    pcol[i]=dc[0]; pcol[i+1]=dc[1]; pcol[i+2]=dc[2];
    pvels.push({ x:(Math.random()-0.5)*0.015, y:(Math.random()-0.5)*0.015 });
  }
  pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
  pgeo.setAttribute('color', new THREE.BufferAttribute(pcol, 3));
  const pmesh = new THREE.Points(pgeo, new THREE.PointsMaterial({
    size: 0.3, vertexColors: true, transparent: true, opacity: 0.4
  }));
  scene.add(pmesh);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX - window.innerWidth/2);
    mouseY = (e.clientY - window.innerHeight/2);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    group.rotation.y += 0.02 * (mouseX * 0.002 - group.rotation.y);
    group.rotation.x += 0.02 * (mouseY * 0.002 - group.rotation.x);

    items.forEach(item => {
      item.position.add(item.userData.velocity);
      // Slight wiggle (natural swimming motion)
      item.position.x += Math.sin(t * item.userData.wiggleSpeed + item.userData.wigglePhase) * 0.015;
      item.rotation.x += item.userData.rotSpeed.x;
      item.rotation.y += item.userData.rotSpeed.y;
      item.rotation.z += item.userData.rotSpeed.z;
      if (item.position.x > 60 || item.position.x < -60) item.userData.velocity.x *= -1;
      if (item.position.y > 50 || item.position.y < -50) item.userData.velocity.y *= -1;
      if (item.position.z > 30 || item.position.z < -30) item.userData.velocity.z *= -1;
    });

    const pos = pgeo.attributes.position.array;
    for (let i = 0; i < pcount; i++) {
      const i3 = i*3;
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
