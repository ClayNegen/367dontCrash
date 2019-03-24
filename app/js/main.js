import * as THREE from 'three';
import orbit from 'three-orbit-controls';
const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import Wall from './models/Wall';

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    // Enable antialias for smoother lines
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.scene = new THREE.Scene();
    // Use perspective camera:
    //   Field of view: 75 degrees
    //   Screen aspect ration 4:3
    //   Near plane at z=0.5, far plane at z=500
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 500);
    // Place the camera at (0,0,100)
    this.camera.position.z = -120;
    this.camera.position.y = 40;
    //this.camera.position.x = -100;

    this.tracker = new TrackballControls(this.camera);
    this.tracker.rotateSpeed = 2.0;
    // Allow zoom and pan
    this.tracker.noZoom = false;
    this.tracker.noPan = false;

    // Dodecahedron radius = 30
    //const dodecgeom = new THREE.DodecahedronGeometry(30);
    //const dodecmatr = new THREE.MeshPhongMaterial ({color: 0x00FFae});
    //const dodecmesh = new THREE.Mesh(dodecgeom, dodecmatr);
    //this.scene.add(dodecmesh);

    // Add our Plane
    var geometry = new THREE.BoxGeometry( 400, 5, 200);
    var material = new THREE.MeshBasicMaterial( {color: 0xFFaaFF} );
    var cube = new THREE.Mesh( geometry, material );  
    this.scene.add( cube );

    //Add our wall(s)
    for (var i = 0; i < 15; i++){
      var newWall = new Wall(20,20,5);
      var ypos = Math.floor((Math.random() * 100) - 100); 
      var xpos = ((Math.random() * 400) - 200); 
      var move = new THREE.Vector3(xpos, 10, -ypos);
      newWall.position.copy( move );
      newWall.matrixAutoUpdate = false;
      newWall.updateMatrix();
      this.scene.add( newWall );
    }
	
	  const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
	  lightOne.position.set (10, 40, 100);
	  this.scene.add (lightOne);
	
    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();
    // setup the render function to "autoloop"
    requestAnimationFrame(() => this.render());
  }

  resizeHandler() {
    const canvas = document.getElementById("mycanvas");
    let w = window.innerWidth - 16;
    let h = 0.75 * w;  /* maintain 4:3 ratio */
    if (canvas.offsetTop + h > window.innerHeight) {
      h = window.innerHeight - canvas.offsetTop - 16;
      w = 4/3 * h;
    }
    canvas.width = w;
    canvas.height = h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.tracker.handleResize();
  }
}