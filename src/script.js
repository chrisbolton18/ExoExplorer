import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OutlinePass} from 'three/addons/postprocessing/OutlinePass.js';

import bgTexture1 from '/images/1.jpg';
import bgTexture2 from '/images/2.jpg';
import bgTexture3 from '/images/3.jpg';
import bgTexture4 from '/images/4.jpg';
import sunTexture from '/images/sun.jpg';
import exo1 from '/images/exo1.jpg';
import exo2 from '/images/exo2.jpg';
import exo3 from '/images/exo3.jpg';
import exo4 from '/images/exo4.jpg';
import exo0 from '/images/exo5.jpg';
import mercuryTexture from '/images/mercurymap.jpg';
import mercuryBump from '/images/mercurybump.jpg';
import venusTexture from '/images/venusmap.jpg';
import venusBump from '/images/venusmap.jpg';
import venusAtmosphere from '/images/venus_atmosphere.jpg';
import earthTexture from '/images/earth_daymap.jpg';
import earthNightTexture from '/images/earth_nightmap.jpg';
import earthAtmosphere from '/images/earth_atmosphere.jpg';
import earthMoonTexture from '/images/moonmap.jpg';
import earthMoonBump from '/images/moonbump.jpg';
import marsTexture from '/images/marsmap.jpg';
import marsBump from '/images/marsbump.jpg';
import jupiterTexture from '/images/jupiter.jpg';
import ioTexture from '/images/jupiterIo.jpg';
import europaTexture from '/images/jupiterEuropa.jpg';
import ganymedeTexture from '/images/jupiterGanymede.jpg';
import callistoTexture from '/images/jupiterCallisto.jpg';
import saturnTexture from '/images/saturnmap.jpg';
import satRingTexture from '/images/saturn_ring.png';
import uranusTexture from '/images/uranus.jpg';
import uraRingTexture from '/images/uranus_ring.png';
import neptuneTexture from '/images/neptune.jpg';
import plutoTexture from '/images/plutomap.jpg';

const container = document.getElementById('solar-system');
container.style.width = '100%';
container.style.height = '100%';
container.style.position = 'relative';

const baseTableHeight = document.getElementById('planet-table').offsetTop;

const renderTable = () => {
    const tbody = document.querySelector('#planetsTable tbody');
    tbody.innerHTML = '';

    renderedExoplanetsData.forEach(exoplanet => {

    const row = document.createElement('tr');

        // add to table
        const properties = [exoplanet.pl_name, exoplanet.pl_rade, exoplanet.st_rad, exoplanet.sy_dist, exoplanet.pl_orbsmax, exoplanet.snr, exoplanet.ESmax];
        properties.forEach(property => {
            const cell = document.createElement('td');
            if (property === exoplanet.snr) {
                cell.textContent = property.toFixed(2);
            } else {
                cell.textContent = property;
            }
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
};

var planetRadAscending = true;
const sortByPlanetRadius = () => {
    renderedExoplanetsData.sort((a,b) => (planetRadAscending ? 1 : -1) * (a.pl_rade - b.pl_rade));
    planetRadAscending = !planetRadAscending;
    renderTable();
};
document.querySelector('#pradHeader').addEventListener('click', sortByPlanetRadius);


var stellarRadAscending = true;
const sortByStellarRadius = () => {
    renderedExoplanetsData.sort((a,b) => (stellarRadAscending ? 1 : -1) * (a.st_rad - b.st_rad));
    stellarRadAscending = !stellarRadAscending;
    renderTable();
};
document.querySelector('#sradHeader').addEventListener('click', sortByStellarRadius);

var distAscending = true;
const sortByDistance = () => {
    renderedExoplanetsData.sort((a,b) => (distAscending ? 1 : -1) * (a.sy_dist - b.sy_dist));
    distAscending = !distAscending;
    renderTable();
};
document.querySelector('#distHeader').addEventListener('click', sortByDistance);

var psDistAscending = true;
const sortByPSDistance = () => {
    renderedExoplanetsData.sort((a,b) => (psDistAscending ? 1 : -1) * (a.pl_orbsmax - b.pl_orbsmax));
    psDistAscending = !psDistAscending;
    renderTable();
};
document.querySelector('#psdistHeader').addEventListener('click', sortByPSDistance);

var snrAscending = true;
const sortBySNR = () => {
    renderedExoplanetsData.sort((a,b) => (snrAscending ? 1 : -1) * (a.snr - b.snr));
    snrAscending = !snrAscending;
    renderTable();
};
document.querySelector('#snrHeader').addEventListener('click', sortBySNR);

var esMaxAscending = true;
const sortByESMax = () => {
    renderedExoplanetsData.sort((a,b) => (esMaxAscending ? 1 : -1) * (a.ESmax - b.ESmax));
    esMaxAscending = !esMaxAscending;
    renderTable();
};
document.querySelector('#esMaxHeader').addEventListener('click', sortByESMax);





async function loadPlanetsFromJSON(diameter=5) {
    try {
        // Use Fetch API to load the planets.json file
        const response = await fetch(`https://nbolton.pythonanywhere.com/planets/telediam/${diameter}`); // Update with the correct path to your JSON file
        return await response.json();

    } catch (error) {
        console.error('Error loading planets JSON:', error);
    }
}

const scene = new THREE.Scene();

const stl = getComputedStyle(container);
const [w, h] = [parseInt(stl.width), parseInt(stl.height)];

var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 20000);
camera.position.set(-175, 115, 5);


const renderer = new THREE.WebGL1Renderer();
renderer.setSize(w, h, false);
container.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = false;
controls.enableDamping = true;
controls.dampingFactor = 0.2;
controls.zoomSpeed = 25;
controls.rotateSpeed = 1.5;
controls.panSpeed = 1.5;
controls.maxDistance = 1000000;            // Maximum distance the camera can zoom out


const cubeTextureLoader = new THREE.CubeTextureLoader();
const loadTexture = new THREE.TextureLoader();

// ******  POSTPROCESSING setup ******
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// ******  OUTLINE PASS  ******
const outlinePass = new OutlinePass(new THREE.Vector2(w, h), scene, camera);
outlinePass.edgeStrength = 3;
outlinePass.edgeGlow = 1;
outlinePass.visibleEdgeColor.set(0xffffff);
outlinePass.hiddenEdgeColor.set(0x190a05);
composer.addPass(outlinePass);

// ******  BLOOM PASS  ******
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1, 0.4, 0.85);
bloomPass.threshold = 1;
bloomPass.radius = 0.9;
composer.addPass(bloomPass);

// ****** AMBIENT LIGHT ******

var lightAmbient = new THREE.AmbientLight(0x222222, 6);
scene.add(lightAmbient);


// ******  CONTROLS  ******
const gui = new dat.GUI({autoPlace: false});
const customContainer = document.getElementById('gui-container');
customContainer.appendChild(gui.domElement);

// ****** SETTINGS FOR INTERACTIVE CONTROLS  ******
const settings = {
    accelerationOrbit: 1,
    acceleration: 1,
    sunIntensity: 1.9,
    telescopeDiameter: 5
};

gui.add(settings, 'sunIntensity', 1, 10).onChange(value => {
    sunMat.emissiveIntensity = value;
});
gui.add(settings, 'telescopeDiameter', 5, 15, 1).onFinishChange(value => {
    createExoplanetsFromJSON(value);
    document.getElementById('tele-diam').textContent = `Telescope diameter: ${value} m`;
})

// mouse movement
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    event.preventDefault();

    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouse.x = (x / w) * 2 - 1;
    mouse.y = -(y / h) * 2 + 1;

}

// ******  SELECT PLANET  ******
let selectedPlanet = null;
let selectedExoplanet = null
let isMovingTowardsPlanet = false;
let isMovingTowardsExoPlanet = false;

let targetCameraPosition = new THREE.Vector3();
let offset;
let clickedExoPlanet;
function onDocumentMouseDown(event) {
    event.preventDefault();

    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    mouse.x = (x / w) * 2 - 1;
    mouse.y = -(y / h) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects2 = raycaster.intersectObjects(exoplanetsArray, true); // Use true for recursive checking
    var intersects = raycaster.intersectObjects(raycastTargets);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        selectedPlanet = identifyPlanet(clickedObject);


        if (selectedPlanet) {
            closeInfoNoZoomOut();

            settings.accelerationOrbit = 0; // Stop orbital movement

            // Update camera to look at the selected planet
            const planetPosition = new THREE.Vector3();
            // selectedPlanet.planet.getWorldPosition(planetPosition);
            selectedPlanet.planet.getWorldPosition(planetPosition);
            controls.target.copy(planetPosition);
            camera.lookAt(planetPosition); // Orient the camera towards the planet
            targetCameraPosition.copy(planetPosition).add(camera.position.clone().sub(planetPosition).normalize().multiplyScalar(offset));
            isMovingTowardsPlanet = true;
        }
    }
    if (intersects2.length > 0) {

        clickedExoPlanet = intersects2[0].object;
        clickedExoPlanet.material.emissiveIntensity = 0.03;

        selectedExoplanet = identifyExoplanet(clickedExoPlanet); // Get the exoplanet data

        if (selectedExoplanet) {
            closeInfoNoZoomOut();
            settings.accelerationOrbit = 0; // Stop orbital movement

            const planetPosition = new THREE.Vector3();
            selectedExoplanet.planet.getWorldPosition(planetPosition);

            controls.target.copy(planetPosition);
            camera.lookAt(planetPosition); // Orient the camera towards the planet
            offset = 50;
            targetCameraPosition.copy(planetPosition).add(camera.position.clone().sub(planetPosition).normalize().multiplyScalar(offset));
            isMovingTowardsExoPlanet = true;


        }
    }
}

function identifyPlanet(clickedObject) {
    // Logic to identify which planet was clicked based on the clicked object, different offset for camera distance
    if (clickedObject.material === mercury.planet.material) {
        offset = 10;
        return mercury;
    } else if (clickedObject.material === venus.Atmosphere.material) {
        offset = 25;    // the higher the offset, the more distance there is when selecting planet
        return venus;
    } else if (clickedObject.material === earth.Atmosphere.material) {
        offset = 25;
        return earth;
    } else if (clickedObject.material === mars.planet.material) {
        offset = 15;
        return mars;
    } else if (clickedObject.material === jupiter.planet.material) {
        offset = 50;
        return jupiter;
    } else if (clickedObject.material === saturn.planet.material) {
        offset = 50;
        return saturn;
    } else if (clickedObject.material === uranus.planet.material) {
        offset = 25;
        return uranus;
    } else if (clickedObject.material === neptune.planet.material) {
        offset = 20;
        return neptune;
    } else if (clickedObject.material === pluto.planet.material) {
        offset = 10;
        return pluto;
    }
    return null;
}

var x, y, z;
let name = "";
var correctExoPlanet;
function identifyExoplanet(clickedObject) {

    x = clickedObject.position.x;
    y = clickedObject.position.y;
    z = clickedObject.position.z;

    for(let i = 0; i < allExoPlanets.length; i++){
        if(allExoPlanets[i].planet.position.x == x && allExoPlanets[i].planet.position.y == y && allExoPlanets[i].planet.position.z == z){

            return allExoPlanets[i];
        };

    }
    return name;

}


var info = [];
var exoPlanetInfo=[];
var exoPlanets = [];

async function showExoPlanetInfo(planetname) {
    var info = document.getElementById('planetInfo');
    var name = document.getElementById('planetName');
    var details = document.getElementById('planetDetails');


    exoPlanets = await loadExoPlanetJson();

    for (let i = 0; i < exoPlanets.length; i++) {
        if (exoPlanets[i].pl_name == planetname.name) {
            correctExoPlanet = exoPlanets[i];
        }

    }

    name.innerText = planetname.name;
    details.innerText = `Host Name: ${correctExoPlanet.hostname}\nDiscovery Year: ${correctExoPlanet.disc_year}\nDiscovery Facility: ${correctExoPlanet.disc_facility}\nRadius: ${(correctExoPlanet.pl_rade * 6371).toFixed(2)} KM (approx)\nPlanet Mass: ${(correctExoPlanet.pl_bmasse).toFixed(2)} (Earth Masses)\nDistance: ${(correctExoPlanet.sy_dist).toFixed(2)} Parsecs\n Number of Stars: ${correctExoPlanet.sy_snum}`;
    //info.innerText = planetname;

    info.style.display = 'block';

}
//info = loadPlanetsFromJSON();

async function loadExoPlanetJson(){
    exoPlanetInfo = await loadPlanetsFromJSON();

    return exoPlanetInfo;
}

// ******  SHOW PLANET INFO AFTER SELECTION  ******
function showPlanetInfo(planet) {
    var info = document.getElementById('planetInfo');
    var name = document.getElementById('planetName');
    var details = document.getElementById('planetDetails');

    name.innerText = planet;
    details.innerText = `Radius: ${planetData[planet].radius}\nTilt: ${planetData[planet].tilt}\nRotation: ${planetData[planet].rotation}\nOrbit: ${planetData[planet].orbit}\nDistance: ${planetData[planet].distance}\nMoons: ${planetData[planet].moons}\nInfo: ${planetData[planet].info}`;

    info.style.display = 'block';
}

let isZoomingOut = false;
let zoomOutTargetPosition = new THREE.Vector3(-175, 115, 5);

// close 'x' button function
function closeInfo() {
    if(clickedExoPlanet){
        clickedExoPlanet.material.emissiveIntensity = 5;

    }
    var info = document.getElementById('planetInfo');
    info.style.display = 'none';
    settings.accelerationOrbit = 1;
    isZoomingOut = true;
    controls.target.set(0, 0, 0);
}

window.closeInfo = closeInfo;

// close info when clicking another planet
function closeInfoNoZoomOut() {
    var info = document.getElementById('planetInfo');
    info.style.display = 'none';
    settings.accelerationOrbit = 1;
}

// ******  SUN  ******
let sunMat;

const sunSize = 697 / 40; // 40 times smaller scale than earth
const sunGeom = new THREE.SphereGeometry(sunSize, 32, 20);
sunMat = new THREE.MeshStandardMaterial({
    emissive: 0xFFF88F,
    emissiveMap: loadTexture.load(sunTexture),
    emissiveIntensity: settings.sunIntensity
});
const sun = new THREE.Mesh(sunGeom, sunMat);
scene.add(sun);

//point light in the sun
const pointLight = new THREE.PointLight(0xFDFFD3, 1200, 400, 1.4);
scene.add(pointLight);


// ******  PLANET CREATION FUNCTION  ******
function createPlanet(planetName, size, position, tilt, texture, bump, ring, atmosphere, moons) {

    let material;
    if (texture instanceof THREE.Material) {
        material = texture;
    } else if (bump) {
        material = new THREE.MeshPhongMaterial({
            map: loadTexture.load(texture),
            bumpMap: loadTexture.load(bump),
            bumpScale: 0.7
        });
    } else {
        material = new THREE.MeshPhongMaterial({
            map: loadTexture.load(texture)
        });
    }

    const name = planetName;
    const geometry = new THREE.SphereGeometry(size, 32, 20);
    const planet = new THREE.Mesh(geometry, material);
    const planet3d = new THREE.Object3D;
    const planetSystem = new THREE.Group();
    planetSystem.add(planet);
    let Atmosphere;
    let Ring;
    planet.position.x = position;
    planet.rotation.z = tilt * Math.PI / 180;

    // add orbit path
    const orbitPath = new THREE.EllipseCurve(
        0, 0,            // ax, aY
        position, position, // xRadius, yRadius
        0, 2 * Math.PI,   // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );

    const pathPoints = orbitPath.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.03});
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    planetSystem.add(orbit);

    //add ring
    if (ring) {
        const RingGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 30);
        const RingMat = new THREE.MeshStandardMaterial({
            map: loadTexture.load(ring.texture),
            side: THREE.DoubleSide
        });
        Ring = new THREE.Mesh(RingGeo, RingMat);
        planetSystem.add(Ring);
        Ring.position.x = position;
        Ring.rotation.x = -0.5 * Math.PI;
        Ring.rotation.y = -tilt * Math.PI / 180;
    }

    //add atmosphere
    if (atmosphere) {
        const atmosphereGeom = new THREE.SphereGeometry(size + 0.1, 32, 20);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            map: loadTexture.load(atmosphere),
            transparent: true,
            opacity: 0.4,
            depthTest: true,
            depthWrite: false
        })
        Atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMaterial)

        Atmosphere.rotation.z = 0.41;
        planet.add(Atmosphere);
    }

    //add moons
    if (moons) {
        moons.forEach(moon => {
            let moonMaterial;

            if (moon.bump) {
                moonMaterial = new THREE.MeshStandardMaterial({
                    map: loadTexture.load(moon.texture),
                    bumpMap: loadTexture.load(moon.bump),
                    bumpScale: 0.5
                });
            } else {
                moonMaterial = new THREE.MeshStandardMaterial({
                    map: loadTexture.load(moon.texture)
                });
            }
            const moonGeometry = new THREE.SphereGeometry(moon.size, 32, 20);
            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
            const moonOrbitDistance = size * 1.5;
            moonMesh.position.set(moonOrbitDistance, 0, 0);
            planetSystem.add(moonMesh);
            moon.mesh = moonMesh;
        });
    }
    //add planet system to planet3d object and to the scene
    planet3d.add(planetSystem);
    scene.add(planet3d);
    return {name, planet, planet3d, Atmosphere, moons, planetSystem, Ring};
}

const exoplanetsArray = []; // Array to store exoplanet meshes
const textureMap = {};
const planetNameMap = {};



function createExoplanet(planetName, size, position, tilt, texture, bump, ring, atmosphere, moons, emissiveColor = 0xffffff) {
    const material = new THREE.MeshPhongMaterial({
        map: loadTexture.load(texture),
        emissive: emissiveColor,  // Set emissive color
        emissiveIntensity: 5,  // Adjust intensity as needed
    });


    const name = planetName;
    const geometry = new THREE.SphereGeometry(size, 32, 20);
    const planet = new THREE.Mesh(geometry, material);
    const planet3d = new THREE.Object3D();
    const planetSystem = new THREE.Group();
    planetSystem.add(planet);
    let Atmosphere;
    let Ring;
    planet.position.set(position.x, position.y, position.z);
    planet.rotation.z = tilt * Math.PI / 180;
    exoplanetsArray.push(planet3d);

    //var exoplanetTexture = `${funTexture}`;
    textureMap[texture] = planet3d;
    planetNameMap[texture] = planetName;


    // Add atmosphere
    if (atmosphere) {
        const atmosphereGeom = new THREE.SphereGeometry(size + 0.1, 32, 20);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            map: loadTexture.load(atmosphere),
            transparent: true,
            opacity: 0.4,
            depthTest: true,
            depthWrite: false
        });
        Atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMaterial);
        Atmosphere.rotation.z = 0.41;


        planet.add(Atmosphere);
    }

    // Add moons
    if (moons) {
        moons.forEach(moon => {
            let moonMaterial;

            if (moon.bump) {
                moonMaterial = new THREE.MeshStandardMaterial({
                    map: loadTexture.load(moon.texture),
                    bumpMap: loadTexture.load(moon.bump),
                    bumpScale: 0.5
                });
            } else {
                moonMaterial = new THREE.MeshStandardMaterial({
                    map: loadTexture.load(moon.texture)
                });
            }
            const moonGeometry = new THREE.SphereGeometry(moon.size, 32, 20);
            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
            const moonOrbitDistance = size * 1.5;
            moonMesh.position.set(moonOrbitDistance, 0, 0);
            planetSystem.add(moonMesh);
            moon.mesh = moonMesh;
        });
    }

    // Add planet system to planet3d object and to the scene
    planet3d.add(planetSystem);
    scene.add(planet3d);

    return {name, planet, planet3d, Atmosphere, moons, planetSystem, emissiveColor};
}



// ******  LOADING OBJECTS METHOD  ******
function loadObject(path, position, scale, callback) {
    const loader = new GLTFLoader();

    loader.load(path, function (gltf) {
        const obj = gltf.scene;
        obj.position.set(position, 0, 0);
        obj.scale.set(scale, scale, scale);
        scene.add(obj);
        if (callback) {
            callback(obj);
        }
    }, undefined, function (error) {
        console.error('An error happened', error);
    });
}


// Earth day/night effect shader material
const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
        dayTexture: {type: "t", value: loadTexture.load(earthTexture)},
        nightTexture: {type: "t", value: loadTexture.load(earthNightTexture)},
        sunPosition: {type: "v3", value: sun.position}
    },
    vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    uniform vec3 sunPosition;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
      vSunDirection = normalize(sunPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vSunDirection;

    void main() {
      float intensity = max(dot(vNormal, vSunDirection), 0.0);
      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv)* 0.2;
      gl_FragColor = mix(nightColor, dayColor, intensity);
    }
  `
});


// ******  MOONS  ******
// Earth
const earthMoon = [{
    size: 1.6,
    texture: earthMoonTexture,
    bump: earthMoonBump,
    orbitSpeed: 0.001 * settings.accelerationOrbit,
    orbitRadius: 10
}]

// Mars' moons with path to 3D models (phobos & deimos)
const marsMoons = [
    {
        modelPath: '/images/mars/phobos.glb',
        scale: 0.1,
        orbitRadius: 5,
        orbitSpeed: 0.002 * settings.accelerationOrbit,
        position: 100,
        mesh: null
    },
    {
        modelPath: '/images/mars/deimos.glb',
        scale: 0.1,
        orbitRadius: 9,
        orbitSpeed: 0.0005 * settings.accelerationOrbit,
        position: 120,
        mesh: null
    }
];


// Jupiter
const jupiterMoons = [
    {
        size: 1.6,
        texture: ioTexture,
        orbitRadius: 20,
        orbitSpeed: 0.0005 * settings.accelerationOrbit
    },
    {
        size: 1.4,
        texture: europaTexture,
        orbitRadius: 24,
        orbitSpeed: 0.00025 * settings.accelerationOrbit
    },
    {
        size: 2,
        texture: ganymedeTexture,
        orbitRadius: 28,
        orbitSpeed: 0.000125 * settings.accelerationOrbit
    },
    {
        size: 1.7,
        texture: callistoTexture,
        orbitRadius: 32,
        orbitSpeed: 0.00006 * settings.accelerationOrbit
    }
];

// ******  PLANET CREATIONS  ******
const mercury = new createPlanet('Mercury', 2.4, 40, 0, mercuryTexture, mercuryBump);
const venus = new createPlanet('Venus', 6.1, 65, 3, venusTexture, venusBump, null, venusAtmosphere);
const earth = new createPlanet('Earth', 6.4, 90, 23, earthMaterial, null, null, earthAtmosphere, earthMoon);
const mars = new createPlanet('Mars', 3.4, 115, 25, marsTexture, marsBump)


// Load Mars moons
marsMoons.forEach(moon => {
    loadObject(moon.modelPath, moon.position, moon.scale, function (loadedModel) {
        moon.mesh = loadedModel;
        mars.planetSystem.add(moon.mesh);
        moon.mesh.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    });
});

const jupiter = new createPlanet('Jupiter', 69 / 4, 200, 3, jupiterTexture, null, null, null, jupiterMoons);
const saturn = new createPlanet('Saturn', 58 / 4, 270, 26, saturnTexture, null, {
    innerRadius: 18,
    outerRadius: 29,
    texture: satRingTexture
});
const uranus = new createPlanet('Uranus', 25 / 4, 320, 82, uranusTexture, null, {
    innerRadius: 6,
    outerRadius: 8,
    texture: uraRingTexture
});
const neptune = new createPlanet('Neptune', 24 / 4, 340, 28, neptuneTexture);

const pluto = new createPlanet('Pluto', 1, 350, 57, plutoTexture)

function calculateExoplanetPosition(ra_degrees, dec_degrees, distance) {
    if (isNaN(ra_degrees) || isNaN(dec_degrees) || isNaN(distance) || distance <= 0) {
        console.error("Invalid position values:", ra_degrees, dec_degrees, distance);
        return new THREE.Vector3(0, 0, 0);
    }

    // Adjust the scaling factor based on your scene's scale
    const SCALE_FACTOR = 800; // This value may need tweaking

    const ra_rad = ra_degrees * Math.PI / 180;
    const dec_rad = dec_degrees * Math.PI / 180;
    const scaledDistance = distance * SCALE_FACTOR;

    const x = scaledDistance * Math.cos(dec_rad) * Math.cos(ra_rad);
    const y = scaledDistance * Math.cos(dec_rad) * Math.sin(ra_rad);
    const z = scaledDistance * Math.sin(dec_rad);



    return new THREE.Vector3(x, y, z);
}

// to keep track of what exoplanets are rendered
var renderedExoplanets = [];
var materialExoplanetMap = {};
const allExoPlanets = [];
var renderedExoplanetsData = [];
async function createExoplanetsFromJSON(diameter=5) {
    const exoplanets = await loadPlanetsFromJSON(diameter);
    renderedExoplanetsData = structuredClone(exoplanets);
    renderedExoplanets.forEach(exoplanet =>{
        scene.remove(exoplanet);
    });
    renderedExoplanets = [];

    const tbody = document.querySelector('#planetsTable tbody');
    exoplanets.forEach(planetData => {
        const {pl_name, ra, dec, sy_dist, pl_rade} = planetData;

        const ra_num = parseFloat(ra);
        const dec_num = parseFloat(dec);
        const distance_num = parseFloat(sy_dist);


        if (isNaN(ra_num) || isNaN(dec_num) || isNaN(distance_num) || distance_num <= 0) {
            console.error(`Invalid data for exoplanet ${pl_name}, skipping.`);
            return;
        }

        // Calculate the position using RA, Dec, and scaled distance
        const position = calculateExoplanetPosition(ra_num, dec_num, distance_num);

        var texChoice = (Math.random() *(4)).toFixed(0);

        var funTexture;
        if (texChoice == 0){
            funTexture = exo1;
        }
        if (texChoice == 1){
            funTexture = exo2;
        }
        if (texChoice == 2){
            funTexture = exo3;
        }
        if (texChoice == 3){
            funTexture = exo4;
        }
        if (texChoice == 4){
            funTexture = exo0;
        }

        // Create the planet
        const planet = createExoplanet(pl_name, pl_rade*4, position, 0, funTexture);

        // Add the planet to the scene
        scene.add(planet.planet3d);

        // Add planet to rendered exoplanets
        renderedExoplanets.push(planet.planet3d);
        allExoPlanets.push(planet);

    });

    renderTable();
    document.getElementById('exo-count').textContent = `Exoplanets: ${renderedExoplanets.length}`;
}



// Call the function to create exoplanets
await createExoplanetsFromJSON();


// ******  PLANETS DATA  ******
const planetData = {
    'Mercury': {
        radius: '2,439.7 km',
        tilt: '0.034°',
        rotation: '58.6 Earth days',
        orbit: '88 Earth days',
        distance: '57.9 million km',
        moons: '0',
        info: 'The smallest planet in our solar system and nearest to the Sun.'
    },
    'Venus': {
        radius: '6,051.8 km',
        tilt: '177.4°',
        rotation: '243 Earth days',
        orbit: '225 Earth days',
        distance: '108.2 million km',
        moons: '0',
        info: 'Second planet from the Sun, known for its extreme temperatures and thick atmosphere.'
    },
    'Earth': {
        radius: '6,371 km',
        tilt: '23.5°',
        rotation: '24 hours',
        orbit: '365 days',
        distance: '150 million km',
        moons: '1 (Moon)',
        info: 'Third planet from the Sun and the only known planet to harbor life.'
    },
    'Mars': {
        radius: '3,389.5 km',
        tilt: '25.19°',
        rotation: '1.03 Earth days',
        orbit: '687 Earth days',
        distance: '227.9 million km',
        moons: '2 (Phobos and Deimos)',
        info: 'Known as the Red Planet, famous for its reddish appearance and potential for human colonization.'
    },
    'Jupiter': {
        radius: '69,911 km',
        tilt: '3.13°',
        rotation: '9.9 hours',
        orbit: '12 Earth years',
        distance: '778.5 million km',
        moons: '95 known moons (Ganymede, Callisto, Europa, Io are the 4 largest)',
        info: 'The largest planet in our solar system, known for its Great Red Spot.'
    },
    'Saturn': {
        radius: '58,232 km',
        tilt: '26.73°',
        rotation: '10.7 hours',
        orbit: '29.5 Earth years',
        distance: '1.4 billion km',
        moons: '146 known moons',
        info: 'Distinguished by its extensive ring system, the second-largest planet in our solar system.'
    },
    'Uranus': {
        radius: '25,362 km',
        tilt: '97.77°',
        rotation: '17.2 hours',
        orbit: '84 Earth years',
        distance: '2.9 billion km',
        moons: '27 known moons',
        info: 'Known for its unique sideways rotation and pale blue color.'
    },
    'Neptune': {
        radius: '24,622 km',
        tilt: '28.32°',
        rotation: '16.1 hours',
        orbit: '165 Earth years',
        distance: '4.5 billion km',
        moons: '14 known moons',
        info: 'The most distant planet from the Sun in our solar system, known for its deep blue color.'
    },
    'Pluto': {
        radius: '1,188.3 km',
        tilt: '122.53°',
        rotation: '6.4 Earth days',
        orbit: '248 Earth years',
        distance: '5.9 billion km',
        moons: '5 (Charon, Styx, Nix, Kerberos, Hydra)',
        info: 'Originally classified as the ninth planet, Pluto is now considered a dwarf planet.'
    }
};


// Array of planets and atmospheres for raycasting
const raycastTargets = [
    mercury.planet, venus.planet, venus.Atmosphere, earth.planet, earth.Atmosphere,
    mars.planet, jupiter.planet, saturn.planet, uranus.planet, neptune.planet, pluto.planet,
];


// ******  SHADOWS  ******
renderer.shadowMap.enabled = true;
pointLight.castShadow = true;

//properties for the point light
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 10;
pointLight.shadow.camera.far = 20;

//casting and receiving shadows
earth.planet.castShadow = true;
earth.planet.receiveShadow = true;
earth.Atmosphere.castShadow = true;
earth.Atmosphere.receiveShadow = true;
earth.moons.forEach(moon => {
    moon.mesh.castShadow = true;
    moon.mesh.receiveShadow = true;
});
mercury.planet.castShadow = true;
mercury.planet.receiveShadow = true;
venus.planet.castShadow = true;
venus.planet.receiveShadow = true;
venus.Atmosphere.receiveShadow = true;
mars.planet.castShadow = true;
mars.planet.receiveShadow = true;
jupiter.planet.castShadow = true;
jupiter.planet.receiveShadow = true;
jupiter.moons.forEach(moon => {
    moon.mesh.castShadow = true;
    moon.mesh.receiveShadow = true;
});
saturn.planet.castShadow = true;
saturn.planet.receiveShadow = true;
saturn.Ring.receiveShadow = true;
uranus.planet.receiveShadow = true;
neptune.planet.receiveShadow = true;
pluto.planet.receiveShadow = true;



function animate() {

    //rotating planets around the sun and itself
    sun.rotateY(0.001 * settings.acceleration);
    mercury.planet.rotateY(0.001 * settings.acceleration);
    mercury.planet3d.rotateY(0.004 * settings.accelerationOrbit);
    venus.planet.rotateY(0.0005 * settings.acceleration)
    venus.Atmosphere.rotateY(0.0005 * settings.acceleration);
    venus.planet3d.rotateY(0.0006 * settings.accelerationOrbit);
    earth.planet.rotateY(0.005 * settings.acceleration);
    earth.Atmosphere.rotateY(0.001 * settings.acceleration);
    earth.planet3d.rotateY(0.001 * settings.accelerationOrbit);
    mars.planet.rotateY(0.01 * settings.acceleration);
    mars.planet3d.rotateY(0.0007 * settings.accelerationOrbit);
    jupiter.planet.rotateY(0.005 * settings.acceleration);
    jupiter.planet3d.rotateY(0.0003 * settings.accelerationOrbit);
    saturn.planet.rotateY(0.01 * settings.acceleration);
    saturn.planet3d.rotateY(0.0002 * settings.accelerationOrbit);
    uranus.planet.rotateY(0.005 * settings.acceleration);
    uranus.planet3d.rotateY(0.0001 * settings.accelerationOrbit);
    neptune.planet.rotateY(0.005 * settings.acceleration);
    neptune.planet3d.rotateY(0.00008 * settings.accelerationOrbit);
    pluto.planet.rotateY(0.001 * settings.acceleration)
    pluto.planet3d.rotateY(0.00006 * settings.accelerationOrbit)

// Animate Earth's moon
    if (earth.moons) {
        earth.moons.forEach(moon => {
            const time = performance.now();
            const tiltAngle = 5 * Math.PI / 180;

            const moonX = earth.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
            const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.sin(tiltAngle);
            const moonZ = earth.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.cos(tiltAngle);

            moon.mesh.position.set(moonX, moonY, moonZ);
            moon.mesh.rotateY(0.01);
        });
    }
// Animate Mars' moons
    if (marsMoons) {
        marsMoons.forEach(moon => {
            if (moon.mesh) {
                const time = performance.now();

                const moonX = mars.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
                const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
                const moonZ = mars.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

                moon.mesh.position.set(moonX, moonY, moonZ);
                moon.mesh.rotateY(0.001);
            }
        });
    }

// Animate Jupiter's moons
    if (jupiter.moons) {
        jupiter.moons.forEach(moon => {
            const time = performance.now();
            const moonX = jupiter.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
            const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
            const moonZ = jupiter.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);

            moon.mesh.position.set(moonX, moonY, moonZ);
            moon.mesh.rotateY(0.01);
        });
    }


// ****** OUTLINES ON PLANETS ******
    raycaster.setFromCamera(mouse, camera);

// Check for intersections
    var intersects = raycaster.intersectObjects(raycastTargets);

// Reset all outlines
    outlinePass.selectedObjects = [];

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        // If the intersected object is an atmosphere, find the corresponding planet
        if (intersectedObject === earth.Atmosphere) {
            outlinePass.selectedObjects = [earth.planet];
        } else if (intersectedObject === venus.Atmosphere) {
            outlinePass.selectedObjects = [venus.planet];
        } else {
            // For other planets, outline the intersected object itself
            outlinePass.selectedObjects = [intersectedObject];
        }
    }

    if (isMovingTowardsExoPlanet){
        // Smoothly move the camera towards the target position
        camera.position.lerp(targetCameraPosition, 0.03);

        // Check if the camera is close to the target position
        if (camera.position.distanceTo(targetCameraPosition) < 150) {
            isMovingTowardsExoPlanet = false;
            showExoPlanetInfo(selectedExoplanet)

        }
    } else if (isZoomingOut) {
        camera.position.lerp(zoomOutTargetPosition, 0.05);

        if (camera.position.distanceTo(zoomOutTargetPosition) < 1) {
            isZoomingOut = false;
        }
    }





// ******  ZOOM IN/OUT  ******
    if (isMovingTowardsPlanet) {
        // Smoothly move the camera towards the target position
        camera.position.lerp(targetCameraPosition, 0.03);

        // Check if the camera is close to the target position
        if (camera.position.distanceTo(targetCameraPosition) < 1) {
            isMovingTowardsPlanet = false;
            showPlanetInfo(selectedPlanet.name)

        }
    } else if (isZoomingOut) {
        camera.position.lerp(zoomOutTargetPosition, 0.05);

        if (camera.position.distanceTo(zoomOutTargetPosition) < 1) {
            isZoomingOut = false;
        }
    }

    controls.update();
    requestAnimationFrame(animate);
    composer.render();
}


animate();

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onDocumentMouseDown, false);
window.addEventListener('resize', function () {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
});
