// 3d-bg.js — Colorful Laboratory Cell Animation
// Bright, vibrant, fun WebGL background for Microbiology Lab theme

const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f0f4f8'); // Light lab background
  scene.fog = new THREE.FogExp2('#f0f4f8', 0.003);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Bright, even lab lighting
  const ambient = new THREE.AmbientLight('#ffffff', 0.6);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight('#ffffff', 0.8);
  dirLight.position.set(30, 40, 30);
  scene.add(dirLight);

  const pt1 = new THREE.PointLight('#06b6d4', 1.5, 200); // Teal
  pt1.position.set(20, 20, 20);
  scene.add(pt1);

  const pt2 = new THREE.PointLight('#a855f7', 1, 200); // Purple
  pt2.position.set(-20, -15, 15);
  scene.add(pt2);

  const pt3 = new THREE.PointLight('#f43f5e', 0.8, 200); // Rose
  pt3.position.set(10, -20, 25);
  scene.add(pt3);

  // Colorful lab cell palette
  const palette = [
    { color: '#06b6d4', emissive: '#0891b2' }, // Teal — bacterial culture
    { color: '#10b981', emissive: '#059669' }, // Emerald — agar
    { color: '#a855f7', emissive: '#7c3aed' }, // Purple — Gram stain
    { color: '#f43f5e', emissive: '#e11d48' }, // Rose — blood agar
    { color: '#f59e0b', emissive: '#d97706' }, // Amber — nutrient broth
    { color: '#3b82f6', emissive: '#2563eb' }, // Blue — Methylene blue
    { color: '#ec4899', emissive: '#db2777' }, // Pink — MacConkey
    { color: '#14b8a6', emissive: '#0d9488' }, // Teal green — EMB
  ];

  const cellGeometry = new THREE.SphereGeometry(1, 32, 32);
  const cells = [];
  const cellCount = 50;
  const group = new THREE.Group();
  scene.add(group);

  for (let i = 0; i < cellCount; i++) {
    const p = palette[i % palette.length];
    const mat = new THREE.MeshPhysicalMaterial({
      color: p.color,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      metalness: 0,
      roughness: 0.15,
      ior: 1.4,
      thickness: 0.3,
      specularIntensity: 0.8,
      emissive: p.emissive,
      emissiveIntensity: 0.15
    });

    const mesh = new THREE.Mesh(cellGeometry, mat);
    mesh.position.x = (Math.random() - 0.5) * 120;
    mesh.position.y = (Math.random() - 0.5) * 100;
    mesh.position.z = (Math.random() - 0.5) * 80;

    const scale = Math.random() * 2.5 + 0.8;
    mesh.scale.set(scale, scale, scale);

    mesh.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.02
      ),
      pulseSpeed: Math.random() * 0.015 + 0.005,
      baseScale: scale
    };

    group.add(mesh);
    cells.push(mesh);
  }

  // Tiny colorful dust particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 600;
  const posArray = new Float32Array(particleCount * 3);
  const colArray = new Float32Array(particleCount * 3);
  const vArray = [];

  const dustColors = [
    [0.02, 0.71, 0.83], // teal
    [0.06, 0.73, 0.51], // green
    [0.66, 0.33, 0.97], // purple
    [0.96, 0.25, 0.37], // rose
    [0.96, 0.62, 0.04], // amber
    [0.23, 0.51, 0.96], // blue
  ];

  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i]     = (Math.random() - 0.5) * 180;
    posArray[i + 1] = (Math.random() - 0.5) * 180;
    posArray[i + 2] = (Math.random() - 0.5) * 120;

    const dc = dustColors[Math.floor(Math.random() * dustColors.length)];
    colArray[i]     = dc[0];
    colArray[i + 1] = dc[1];
    colArray[i + 2] = dc[2];

    vArray.push({
      x: (Math.random() - 0.5) * 0.015,
      y: (Math.random() - 0.5) * 0.015
    });
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.NormalBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  const halfW = window.innerWidth / 2;
  const halfH = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - halfW);
    mouseY = (e.clientY - halfH);
  });

  // Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Gentle mouse-follow camera drift
    group.rotation.y += 0.03 * (mouseX * 0.003 - group.rotation.y);
    group.rotation.x += 0.03 * (mouseY * 0.003 - group.rotation.x);
    group.rotation.z += 0.0003;

    particlesMesh.rotation.y = -t * 0.03;

    cells.forEach(cell => {
      cell.position.add(cell.userData.velocity);
      if (cell.position.x > 60 || cell.position.x < -60) cell.userData.velocity.x *= -1;
      if (cell.position.y > 50 || cell.position.y < -50) cell.userData.velocity.y *= -1;
      if (cell.position.z > 40 || cell.position.z < -40) cell.userData.velocity.z *= -1;

      const pulse = Math.sin(t * cell.userData.pulseSpeed * 80) * 0.08;
      const s = cell.userData.baseScale + pulse;
      cell.scale.set(s, s, s);
    });

    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const v = vArray[i];
      positions[i3] += v.x;
      positions[i3 + 1] += v.y;
      if (positions[i3 + 1] > 90) positions[i3 + 1] = -90;
      if (positions[i3 + 1] < -90) positions[i3 + 1] = 90;
      if (positions[i3] > 90) positions[i3] = -90;
      if (positions[i3] < -90) positions[i3] = 90;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
