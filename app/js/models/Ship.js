import { TorusGeometry, CylinderGeometry, ConeGeometry, PlaneGeometry, MeshBasicMaterial, MeshNormalMaterial, Mesh, Group} from 'three';

export default class Ship extends Group {
  constructor () { // number of spokes on the wheel
    super();

    const CONE_RADIUS = 10;
    const HEIGHT = 30;
    /* Torus with 6 radial segments, 30 tubular segments */
    var coneGeom = new ConeGeometry(CONE_RADIUS, HEIGHT, 4);
    var coneMatr = new MeshNormalMaterial();
    var cone = new Mesh (coneGeom, coneMatr);
    cone.rotateX(-(3*Math.PI)/7);
    this.add (cone);

    var wingGeom = new PlaneGeometry( 15, 15, 32 );
    var wingMaterial = new MeshNormalMaterial();
    var wing = new Mesh( wingGeom, wingMaterial );
    wing.position.set(0,1,4);
    wing.rotateX(-Math.PI/2);
    wing.rotateZ(Math.PI/4);
    this.add(wing);

    var tailGeom = new PlaneGeometry( 9, 9, 32 );
    var tailMaterial = new MeshBasicMaterial({color: 0xff0000});
    var tail = new Mesh(tailGeom, tailMaterial );
    tail.position.set(0,0,14);
    tail.rotateX(-Math.PI/2);
    tail.rotateZ(Math.PI/4);
    this.add(tail);

    var tail2Geom = new PlaneGeometry( 10, 10, 32 );
    var tail2Material = new MeshBasicMaterial({color: 0xff0000});
    var tail2 = new Mesh(tail2Geom, tail2Material );
    tail2.position.set(0,-3,14);
    tail2.rotateX(-Math.PI/2);
    tail2.rotateZ(Math.PI/4);
    this.add(tail2);

    var tail3Geom = new PlaneGeometry( 9, 9, 32 );
    var tail3Material = new MeshBasicMaterial({color: 0xff0000});
    var tail3 = new Mesh(tail3Geom, tail3Material );
    tail3.position.set(0,-7,12);
    tail3.rotateX(-Math.PI/2);
    tail3.rotateZ(Math.PI/4);
    this.add(tail3);
    
    //default to return this;
  }
}