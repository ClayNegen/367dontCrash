import { BoxGeometry } from 'three';
import * as THREE from 'three';
import { Group } from '../../../node_modules/three/src/objects/Group';

export default class Screen extends Group {
  constructor () { // number of spokes on the wheel
    super();    // invoke the super class constructor

    var texture = new THREE.TextureLoader().load( 'BandW.jpg' );
    var flagGeo = new THREE.BoxGeometry( 200, 30, 0 );
    var flagMat = new THREE.MeshBasicMaterial( {map: texture} );
    var flag = new THREE.Mesh( flagGeo, flagMat ); 
    var move = new THREE.Vector3(0, 60, 0); //horizontal, verticle, depth
    flag.position.copy( move );  
    this.add( flag );

    var lpoleGeo = new THREE.CylinderGeometry(3, 3, 85);
    var lpoleMat = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    var lpole = new THREE.Mesh( lpoleGeo, lpoleMat );
    var movePole = new THREE.Vector3(-100, 30, 0); //horizontal, verticle, depth
    lpole.position.copy( movePole );
    this.add(lpole)

    var rpoleGeo = new THREE.CylinderGeometry(3, 3, 85);
    var rpoleMat = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    var rpole = new THREE.Mesh( rpoleGeo, rpoleMat );
    var moveRPole = new THREE.Vector3(100, 30, 0); //horizontal, verticle, depth
    rpole.position.copy( moveRPole );
    this.add(rpole)
    }

}