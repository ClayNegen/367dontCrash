import * as THREE from 'three';
import orbit from 'three-orbit-controls';
const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import Wall from './models/Wall';
import EndScreen from './models/EndScreen';
import Ship from './models/Ship';


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
    this.camera.position.z = -200;
    this.camera.position.y = 40;
    //this.camera.position.x = -100;

    this.tracker = new TrackballControls(this.camera);
    this.tracker.rotateSpeed = 2.0;
    // Allow zoom and pan
    this.tracker.noZoom = true;
    this.tracker.noPan = true;

    // Add background
    this.texture = new THREE.TextureLoader().load( 'space.jpg' );
    var backGeo = new THREE.BoxGeometry( 800, 400, 5);
    var backMat = new THREE.MeshBasicMaterial( {map: this.texture } );
    var background = new THREE.Mesh( backGeo, backMat );
    var moveBack = new THREE.Vector3(0, 75, 150);
    background.position.copy( moveBack );
    this.scene.add(background);
    
    // Add our Plane
    this.texture2 = new THREE.TextureLoader().load( 'floor.jpg' );

    var geometry = new THREE.BoxGeometry( 650, 5, 400);
    var material = new THREE.MeshPhongMaterial( {color: 0xd3d3d3} );
    //var material = new THREE.MeshBasicMaterial( {map: this.texture2} );
    var plane = new THREE.Mesh( geometry, material );  
    this.scene.add( plane );

    // Add our Player
    this.player = new Ship();
    var placePlayer = new THREE.Vector3(0, 15, -150);
    this.player.position.copy( placePlayer );
    this.player.rotateOnAxis(new THREE.Vector3(0, 1, 0), (3.14));
    this.player.scale.x = 0.5;
    this.player.scale.y = 0.5;
    this.player.scale.z = 0.5;
    this.scene.add(this.player);

    // Add our wall(s)
    this.wallArray = [];
    this.count = 0;
    for (var i = 0; i < 7; i++){
      this.makeWalls();
    }
  
    // Add our light
	  const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
	  lightOne.position.set (10, 40, 100);
    this.scene.add (lightOne);
    
    // Add our Event Listeners
    this.rederBool = true;
    var startBtn = document.getElementById("start");
    startBtn.addEventListener('click', () => this.startRender());
    var stopBtn = document.getElementById("stop");
    stopBtn.addEventListener('click', () => this.stopRender());
    var resetBtn = document.getElementById("reset");
    resetBtn.addEventListener('click', () => this.reset());
    window.addEventListener('keydown', (e) => this.keyPress(e));
    
    /*
    this.keyState = {};
    window.addEventListener('keydown', 
    function(e){
      this.keyState[e.keyCode] = true;
    },
    true);
    window.addEventListener('keyup',function(e){
      console.log(e.keyCode);
      this.keyState[e.keyCode] = false;
    },true);
  */

    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    
    // Global Variables and start render
    this.screen;
    this.score = 0;
    this.hit = 0;
    this.up = false;
    this.startRender();
  }
  
  render() {
    this.count += 1;

    // Move and Remove Walls
    // Detect collisions
    for (var i = 0; i < this.wallArray.length; i++){
      this.moveWalls(this.wallArray[i]);
      this.detectCollision(this.wallArray[i]);
      if(this.wallArray[i].matrix.elements[14] == -200){
        this.removeWalls(this.wallArray[i]);
      }
    }
    /*
    if (this.keyState[37]){
      this.moveRight();
    }
    if (this.keyState[39]){
      this.moveLeft();
    }
    */

    // Make new Walls every 25 renders
    if(this.count < 2400){
      if(this.count%25 == 0){
        for (var i = 0; i < 4; i++){
          this.makeWalls();
        }
      }
    }
    else if (this.count == 2500){
      this.final();
    }
    else if(this.count > 2500){
      this.moveFinal(this.gate);
    }

    if(this.count == 2750){
      //END THE GAME
    }
    
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();
    // Update Score
    if(this.count%10 == 0){
      this.score+=1;
      document.getElementById("finalScore").innerHTML = this.score;
    }
    // setup the render function to "autoloop"
    if (this.renderBool == true){
      requestAnimationFrame(() => this.render());
    }
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
    this.newWall = new Wall(20,20,5,this.count);
    this.ypos = Math.floor((Math.random() * 100) - 200); 
    this.xpos = ((Math.random() * 400) - 200); 
    this.move = new THREE.Vector3(this.xpos, 10, -this.ypos);
    this.newWall.position.copy( this.move );
    this.newWall.matrixAutoUpdate = false;
    this.newWall.updateMatrix();
    this.wallArray.push(this.newWall);
    this.scene.add( this.newWall );
  }

  removeWalls(endWall){
    this.scene.remove(endWall);  
  }

  moveWalls(wall){
    // Wall Movement Matrix
    this.transX = new THREE.Matrix4().makeTranslation(0, 0, -2 - (this.count/1000));
    wall.matrix.multiply(this.transX);
  }
  
  keyPress(e){
    switch (e.keyCode) {
      case 32:
          //spacebar = pause
          if (this.rederBool == true){ 
            this.stopRender();
          }
          else if(this.renderBool == false){
            this.startRender();
          }
          break;
      case 37:
          this.moveRight();
          break;
      case 38:
          break;
      case 39:
          this.moveLeft();
          break;
      case 40:
          break;
      case 82:
          //R
          this.reset();
          break;
    }
  }
  
  detectCollision(enemy){
    if (-148 > enemy.matrix.elements[14] && enemy.matrix.elements[14] > -152){
      if(-15 < enemy.matrix.elements[12] && enemy.matrix.elements[12] < 15){
        //this.endGame();
        this.hit+=1;
        document.getElementById("hits").innerHTML = this.hit;
        //this.stopRender();
      }
    }
  }

  final(){
    this.gate = new EndScreen();
    var move = new THREE.Vector3(0, 10, 200);
    this.gate.position.copy( move );
    this.gate.matrixAutoUpdate = false;
    this.gate.updateMatrix();
    this.scene.add(this.gate);
    console.log('its here');
  }
  
  moveFinal(gate){
    var gateMove = new THREE.Matrix4().makeTranslation(0, 0, -1.5);
    gate.matrix.multiply( gateMove );
  }

  stopRender(){
    this.renderBool = false;
    console.log(this.renderBool);
    console.log(this.wallArray.length);
  }
  
  startRender(){
    this.renderBool = true;
    requestAnimationFrame(() => this.render());
    console.log(this.renderBool);
  }

  reset(){
    for (var i = 0; i < this.wallArray.length; i++){
      this.scene.remove(this.wallArray[i]);
    }
    this.count = 0;
    this.score = 0;
    this.hit = 0;
    document.getElementById("hits").innerHTML = this.hit;
    document.getElementById("finalScore").innerHTML = this.score;
    this.wallArray = [];
    this.stopRender();
    this.startRender();
    this.stopRender();
  }

  moveLeft(){
    var left = new THREE.Matrix4().makeTranslation(5, 0, 0);
    //this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), -(0.15));
    for (var i = 0; i < this.wallArray.length; i++){
      this.wallArray[i].matrix.multiply( left );
    }
  }

  moveRight(){
    var right = new THREE.Matrix4().makeTranslation(-5, 0, 0);
    //this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), (0.01));
    for (var i = 0; i < this.wallArray.length; i++){
      this.wallArray[i].matrix.multiply( right );
    }
  }

  keyUpHandler(){
    this.up = true;
    console.log(this.up);
  }
}