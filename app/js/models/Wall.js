import { BoxGeometry } from 'three';
import * as THREE from 'three';
import { Group } from '../../../node_modules/three/src/objects/Group';

export default class Wheel extends Group {
  constructor (width, height, depth, time) { // number of spokes on the wheel
    super();    // invoke the super class constructor

    var colorChange = Math.floor((Math.random() * 500) + time);
    var geometry = new THREE.BoxGeometry( width, height, depth );
    var material = new THREE.MeshBasicMaterial( {color: 0xFF0000+colorChange} ); //add randomizer for color
    var cube = new THREE.Mesh( geometry, material );
    this.add( cube );   
    }

}