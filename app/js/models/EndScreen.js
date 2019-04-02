import { BoxGeometry } from 'three';
import * as THREE from 'three';
import { Group } from '../../../node_modules/three/src/objects/Group';
//import this.score from '../main.js';

export default class Screen extends Group {
  constructor () { // number of spokes on the wheel
    super();    // invoke the super class constructor

    //Text code got from: 
    //https://stackoverflow.com/questions/12380072/threejs-render-text-in-canvas-as-texture-and-then-apply-to-a-plane
    var bitmap = document.createElement('canvas');
    var g = bitmap.getContext('2d');
    bitmap.width = 64;
    bitmap.height = 64;
    g.font = 'Bold 30px Arial';
    var text = "Score: "+ this.score;
    g.fillStyle = 'white';
    g.fillText(text, 0, 20);
    g.strokeStyle = 'black';
    g.strokeText(text, 0, 20);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(bitmap); 
    texture.needsUpdate = true;

    var geometry = new THREE.BoxGeometry( 200, 200, 0 );
    //var material = new THREE.MeshBasicMaterial( {map: texture} );
    var material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
    var screen = new THREE.Mesh( geometry, material );
    this.add( screen );   
    }

}