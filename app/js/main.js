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

    // Add background
    /*
    var loader = new THREE.TextureLoader();
    loader.load('../app/js/space.jpg', function( space ){
      var backGeo = new THREE.BoxGeometry( 600, 200, 5);
      var backMat = new THREE.MeshBasicMaterial( {map: space} );
      var background = new THREE.Mesh( backGeo, backMat );
      var moveBack = new THREE.Vector3(0, 75, 150);
      background.position.copy( moveBack );
      this.scene.add(background);
    }); */
    
    var backGeo = new THREE.BoxGeometry( 600, 200, 5);
    var backMat = new THREE.MeshBasicMaterial( {color: 0x0000FF } );
    var background = new THREE.Mesh( backGeo, backMat );
    var moveBack = new THREE.Vector3(0, 75, 150);
    background.position.copy( moveBack );
    this.scene.add(background);
    
    // Add our Plane
    var geometry = new THREE.BoxGeometry( 400, 5, 400);
    var material = new THREE.MeshBasicMaterial( {color: 0xd3d3d3} );
    var cube = new THREE.Mesh( geometry, material );  
    this.scene.add( cube );

    //Add our wall(s)
    this.wallArray = [];
    this.allWalls = [];
    this.count = 0;
    this.makeWalls();
    this.transX = new THREE.Matrix4().makeTranslation(0, 0, -1);
  
    // Add our light
	  const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
	  lightOne.position.set (10, 40, 100);
	  this.scene.add (lightOne);
	
    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.count += 1;
    for (var i = 0; i < 15; i++){
      this.wallArray[i].matrix.multiply(this.transX);
    }
    if (this.count%350 == 0){
        this.removeWalls();
        this.makeWalls();
    }
    if(this.count%50 == 0){
      //this.makeWalls();
    }
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

  makeWalls(){
    for (var i = 0; i < 15; i++){
      this.newWall = new Wall(20,20,5,this.count);
      this.ypos = Math.floor((Math.random() * 100) - 200); 
      this.xpos = ((Math.random() * 400) - 200); 
      this.move = new THREE.Vector3(this.xpos, 10, -this.ypos);
      this.newWall.position.copy( this.move );
      this.newWall.matrixAutoUpdate = false;
      this.newWall.updateMatrix();
      this.wallArray[i] = this.newWall;
      //this.scene.add( this.newWall );
    }
    this.allWalls.push(this.wallArray);
    console.log(this.allWalls);
    for (var x = 0; x < this.wallArray.length; x++){
      for (var y = 0; y < this.allWalls.length; y++){
          this.scene.add( this.allWalls[y][x]);
      }
    }
  }

  removeWalls(){
    for (var x = 0; x < this.wallArray.length; x++){
      for (var y = 0; y < this.allWalls.length; y++){
          this.scene.remove( this.allWalls[y][x]);
      }
    }
  }

}