// 3d-bg-equipment.js — Equipment Log: 3D Lab Equipment
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

  scene.add(new THREE.AmbientLight('#ffffff', 0.65));
  const dir = new THREE.DirectionalLight('#ffffff', 0.85);
  dir.position.set(30, 40, 30);
  scene.add(dir);
  const pt1 = new THREE.PointLight('#10b981', 1.2, 200);
  pt1.position.set(25, 20, 20);
  scene.add(pt1);
  const pt2 = new THREE.PointLight('#0ea5e9', 1, 200);
  pt2.position.set(-20, -15, 15);
  scene.add(pt2);

  const group = new THREE.Group();
  scene.add(group);
  const items = [];

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#e2e8f0', transmission: 0.8, transparent: true, opacity: 0.85,
    metalness: 0, roughness: 0.05, ior: 1.5, thickness: 0.3
  });
  const metalMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8', metalness: 0.7, roughness: 0.3
  });

  // Erlenmeyer flask (cone + cylinder neck)
  function createErlenmeyer(scale) {
    const flask = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2, 16, 1, true), glassMat);
    body.rotation.x = Math.PI;
    body.position.y = 0;
    flask.add(body);
    // Base disc
    const base = new THREE.Mesh(new THREE.CircleGeometry(1.2, 16), glassMat);
    base.rotation.x = -Math.PI/2;
    base.position.y = 1;
    flask.add(base);
    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 1.2, 16), glassMat);
    neck.position.y = -1.6;
    flask.add(neck);
    // Liquid
    const liqMat = new THREE.MeshPhysicalMaterial({
      color: '#fbbf24', transmission: 0.3, transparent: true, opacity: 0.7,
      emissive: '#f59e0b', emissiveIntensity: 0.1
    });
    const liq = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 16, 1, true), liqMat);
    liq.rotation.x = Math.PI;
    liq.position.y = 0.4;
    flask.add(liq);

    flask.scale.set(scale, scale, scale);
    return flask;
  }

  // Duran bottle (tall cylinder + screw cap)
  function createDuranBottle(scale) {
    const bottle = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 16), glassMat);
    bottle.add(body);
    // Blue screw cap
    const capMat = new THREE.MeshStandardMaterial({ color: '#0ea5e9', metalness: 0.2, roughness: 0.5 });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 16), capMat);
    cap.position.y = 1.75;
    bottle.add(cap);
    // Thread lines (ring)
    const thread = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.04, 8, 16), capMat);
    thread.rotation.x = Math.PI/2;
    thread.position.y = 1.55;
    bottle.add(thread);
    // Liquid
    const liqMat = new THREE.MeshPhysicalMaterial({
      color: '#a78bfa', transmission: 0.35, transparent: true, opacity: 0.65,
      emissive: '#8b5cf6', emissiveIntensity: 0.1
    });
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.5, 16), liqMat);
    liq.position.y = -0.5;
    bottle.add(liq);

    bottle.scale.set(scale, scale, scale);
    return bottle;
  }

  // Petri dish
  function createPetriDish(scale) {
    const dish = new THREE.Group();
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.2, 32), glassMat);
    dish.add(bottom);
    const agarMat = new THREE.MeshStandardMaterial({
      color: '#f87171', transparent: true, opacity: 0.85,
      emissive: '#ef4444', emissiveIntensity: 0.08
    });
    const agar = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.12, 32), agarMat);
    agar.position.y = 0.05;
    dish.add(agar);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.15, 32), glassMat);
    lid.position.y = 0.3;
    dish.add(lid);
    dish.scale.set(scale, scale, scale);
    return dish;
  }

  // Autoclave (cylindrical chamber + door)
  function createAutoclave(scale) {
    const ac = new THREE.Group();
    const acMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.8, roughness: 0.2 });
    const chamber = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.2, 24), acMat);
    chamber.rotation.z = Math.PI/2;
    ac.add(chamber);
    // Door
    const doorMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.6, roughness: 0.3 });
    const door = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), doorMat);
    door.position.x = 1.1;
    door.rotation.y = Math.PI/2;
    ac.add(door);
    // Handle
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 16), metalMat);
    handle.position.x = 1.2;
    handle.rotation.y = Math.PI/2;
    ac.add(handle);
    // Gauge
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16), new THREE.MeshStandardMaterial({ color: '#10b981' }));
    gauge.position.set(0, 1.25, 0.8);
    ac.add(gauge);
    ac.scale.set(scale, scale, scale);
    return ac;
  }

  // BSC (box shape with window)
  function createBSC(scale) {
    const bsc = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.4, roughness: 0.4 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 1.8), boxMat);
    bsc.add(box);
    // Front window (glass panel)
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1),
      new THREE.MeshPhysicalMaterial({ color: '#bfdbfe', transmission: 0.8, transparent: true, opacity: 0.4 })
    );
    glass.position.set(0, -0.2, 0.91);
    bsc.add(glass);
    // UV light strip
    const uv = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: '#8b5cf6', emissive: '#8b5cf6', emissiveIntensity: 0.5 }));
    uv.position.set(0, 0.9, 0.5);
    bsc.add(uv);
    bsc.scale.set(scale, scale, scale);
    return bsc;
  }

  // Colony counter (flat platform + lens)
  function createColonyCounter(scale) {
    const cc = new THREE.Group();
    const platMat = new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.3, roughness: 0.6 });
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32), platMat);
    cc.add(platform);
    // Grid pattern (ring)
    const grid = new THREE.Mesh(new THREE.RingGeometry(0.3, 1.3, 32, 4), new THREE.MeshStandardMaterial({ color: '#94a3b8', side: THREE.DoubleSide }));
    grid.rotation.x = -Math.PI/2;
    grid.position.y = 0.16;
    cc.add(grid);
    // Magnifying arm
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 8), metalMat);
    arm.position.set(1.2, 0.9, 0);
    arm.rotation.z = 0.2;
    cc.add(arm);
    // Lens
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshPhysicalMaterial({ color: '#e0f2fe', transmission: 0.9, transparent: true, opacity: 0.6, ior: 1.5 }));
    lens.position.set(0.8, 1.6, 0);
    cc.add(lens);
    cc.scale.set(scale, scale, scale);
    return cc;
  }

  // Microscope
  function createMicroscope(scale) {
    const mic = new THREE.Group();
    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.6), metalMat);
    mic.add(base);
    // Arm (curved pillar)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.5, 0.3), metalMat);
    arm.position.set(-0.3, 1.4, -0.5);
    mic.add(arm);
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.5), metalMat);
    head.position.set(0, 2.6, -0.3);
    mic.add(head);
    // Eyepiece
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 12), metalMat);
    eye.position.set(0, 3.1, -0.3);
    eye.rotation.z = 0.3;
    mic.add(eye);
    // Objectives (3 nosepiece cylinders)
    for (let i = -1; i <= 1; i++) {
      const obj = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: ['#f59e0b','#10b981','#ef4444'][i+1], metalness: 0.5, roughness: 0.4 }));
      obj.position.set(i*0.18, 2.1, 0.1);
      mic.add(obj);
    }
    // Stage
    const stage = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 24), new THREE.MeshStandardMaterial({ color: '#1e293b' }));
    stage.position.set(0, 1.3, 0.2);
    mic.add(stage);

    mic.scale.set(scale, scale, scale);
    return mic;
  }

  // Spawn equipment
  const creators = [createErlenmeyer, createDuranBottle, createPetriDish, createAutoclave, createBSC, createColonyCounter, createMicroscope];
  const count = 28;
  for (let i = 0; i < count; i++) {
    const create = creators[i % creators.length];
    const scale = Math.random() * 1.0 + 0.6;
    const item = create(scale);

    item.position.x = (Math.random() - 0.5) * 120;
    item.position.y = (Math.random() - 0.5) * 100;
    item.position.z = (Math.random() - 0.5) * 60;
    item.rotation.set(Math.random() * 0.5, Math.random() * Math.PI * 2, Math.random() * 0.3);

    item.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.015
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.001
      )
    };

    group.add(item);
    items.push(item);
  }

  // Particles
  const pgeo = new THREE.BufferGeometry();
  const pcount = 350;
  const ppos = new Float32Array(pcount * 3);
  const pcol = new Float32Array(pcount * 3);
  const pvels = [];
  const dustC = [[0.06,0.71,0.51],[0.05,0.65,0.91],[0.58,0.59,0.60],[0.96,0.62,0.04],[0.55,0.36,0.96]];
  for (let i = 0; i < pcount * 3; i += 3) {
    ppos[i]=(Math.random()-0.5)*160; ppos[i+1]=(Math.random()-0.5)*160; ppos[i+2]=(Math.random()-0.5)*100;
    const dc = dustC[Math.floor(Math.random()*dustC.length)];
    pcol[i]=dc[0]; pcol[i+1]=dc[1]; pcol[i+2]=dc[2];
    pvels.push({x:(Math.random()-0.5)*0.01,y:(Math.random()-0.5)*0.01});
  }
  pgeo.setAttribute('position', new THREE.BufferAttribute(ppos,3));
  pgeo.setAttribute('color', new THREE.BufferAttribute(pcol,3));
  const pmesh = new THREE.Points(pgeo, new THREE.PointsMaterial({
    size:0.35, vertexColors:true, transparent:true, opacity:0.4
  }));
  scene.add(pmesh);

  let mouseX=0, mouseY=0;
  document.addEventListener('mousemove', e => {
    mouseX=(e.clientX-window.innerWidth/2);
    mouseY=(e.clientY-window.innerHeight/2);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.02*(mouseX*0.002-group.rotation.y);
    group.rotation.x += 0.02*(mouseY*0.002-group.rotation.x);

    items.forEach(item => {
      item.position.add(item.userData.velocity);
      item.rotation.x += item.userData.rotSpeed.x;
      item.rotation.y += item.userData.rotSpeed.y;
      if (item.position.x>60||item.position.x<-60) item.userData.velocity.x*=-1;
      if (item.position.y>50||item.position.y<-50) item.userData.velocity.y*=-1;
      if (item.position.z>30||item.position.z<-30) item.userData.velocity.z*=-1;
    });

    const pos=pgeo.attributes.position.array;
    for(let i=0;i<pcount;i++){
      const i3=i*3;
      pos[i3]+=pvels[i].x; pos[i3+1]+=pvels[i].y;
      if(pos[i3+1]>80)pos[i3+1]=-80;
      if(pos[i3+1]<-80)pos[i3+1]=80;
      if(pos[i3]>80)pos[i3]=-80;
      if(pos[i3]<-80)pos[i3]=80;
    }
    pgeo.attributes.position.needsUpdate=true;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
