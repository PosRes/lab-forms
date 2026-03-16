// 3d-bg.js
// Custom WebGL Animation for Microbiology Laboratory Theme using Three.js

// Ensure the canvas exists
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  // Scene Setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030b14'); // Deep lab blue background
  scene.fog = new THREE.FogExp2('#030b14', 0.0025); // Adds depth

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting to give cells a "microscope" illumination feel
  const ambientLight = new THREE.AmbientLight('#204566', 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight('#0ea5e9', 3, 200);
  pointLight.position.set(20, 20, 20);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight('#10b981', 2, 200);
  pointLight2.position.set(-20, -20, 10);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight('#8b5cf6', 2.5, 200);
  pointLight3.position.set(0, 0, 40);
  scene.add(pointLight3);

  // Microbiology Elements: Floating Cells / Bubbles
  const cellGeometry = new THREE.SphereGeometry(1, 32, 32);
  const cellMaterial = new THREE.MeshPhysicalMaterial({
    color: '#0ea5e9',
    transmission: 0.9,     // Glass-like
    opacity: 1,
    metalness: 0,
    roughness: 0.1,
    ior: 1.5,
    thickness: 0.5,
    specularIntensity: 1,
    specularColor: new THREE.Color('#ffffff'),
    emissive: '#04223d',
    emissiveIntensity: 0.5
  });

  const cells = [];
  const cellCount = 65;

  const group = new THREE.Group();
  scene.add(group);

  for (let i = 0; i < cellCount; i++) {
    const mesh = new THREE.Mesh(cellGeometry, cellMaterial);
    
    // Spread them across a wide volume
    mesh.position.x = (Math.random() - 0.5) * 100;
    mesh.position.y = (Math.random() - 0.5) * 100;
    mesh.position.z = (Math.random() - 0.5) * 60;
    
    const scale = Math.random() * 2 + 0.5; // vary size
    mesh.scale.set(scale, scale, scale);

    // Give each cell a randomized floating velocity
    mesh.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      ),
      pulseSpeed: Math.random() * 0.02,
      baseScale: scale
    };

    group.add(mesh);
    cells.push(mesh);
  }

  // Floating Micro-particles (Dust / DNA fragments)
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 1000;
  const posArray = new Float32Array(particleCount * 3);
  const vArray = []; // To hold velocities for particles

  for(let i = 0; i < particleCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 150;
    posArray[i+1] = (Math.random() - 0.5) * 150;
    posArray[i+2] = (Math.random() - 0.5) * 100;
    
    vArray.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02
    });
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    color: '#38bdf8',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Mouse Interaction Setup
  let mouseX = 0;
  let targetX = 0;
  let mouseY = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();

    // Mouse drift camera effect
    targetX = mouseX * 0.005;
    targetY = mouseY * 0.005;
    group.rotation.y += 0.05 * (targetX - group.rotation.y);
    group.rotation.x += 0.05 * (targetY - group.rotation.x);

    // Slowly rotate the entire system
    group.rotation.z += 0.0005;
    particlesMesh.rotation.y = -elapsedTime * 0.05;

    // Animate large cells
    cells.forEach(cell => {
      // Float
      cell.position.add(cell.userData.velocity);

      // Bounce off invisible boundaries to keep them centered
      if (cell.position.x > 50 || cell.position.x < -50) cell.userData.velocity.x *= -1;
      if (cell.position.y > 50 || cell.position.y < -50) cell.userData.velocity.y *= -1;
      if (cell.position.z > 30 || cell.position.z < -40) cell.userData.velocity.z *= -1;

      // Pulsate scale slightly
      const pulse = Math.sin(elapsedTime * cell.userData.pulseSpeed * 100) * 0.1;
      const s = cell.userData.baseScale + pulse;
      cell.scale.set(s, s, s);
    });

    // Animate particles
    const positions = particlesGeometry.attributes.position.array;
    for(let i=0; i<particleCount; i++) {
        const i3 = i * 3;
        const v = vArray[i];
        
        positions[i3] += v.x;
        positions[i3+1] += v.y;
        
        // Loop particles to other side
        if (positions[i3+1] > 75) positions[i3+1] = -75;
        if (positions[i3+1] < -75) positions[i3+1] = 75;
        if (positions[i3] > 75) positions[i3] = -75;
        if (positions[i3] < -75) positions[i3] = 75;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
