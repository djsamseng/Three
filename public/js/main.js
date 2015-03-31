var container = $('#design-lab');
var WIDTH = container.innerWidth(), HEIGHT = container.innerHeight(), VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 10000;
var ROTATION_AMOUNT = 0.01;
var parentObj, renderer, scene, camera;
var cameraCube, sceneCube;

main();

function main() {
    var meshes = []; 
    init(meshes);
    animate();
}

function addGeometry(geometry, x, y, textureCube, pivot, meshes) {
    var material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        envMap: textureCube, 
        refractionRatio: 0.65 } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 4;
    
    mesh.position.x = x;
    mesh.position.y = y;
    
    pivot.add(mesh);
    //scene.add( mesh );
    meshes.push( mesh );

}

function init(meshes) {
    camera = new THREE.PerspectiveCamera( 60, ASPECT, NEAR, FAR);
    camera.position.z = 3200;
    cameraCube = new THREE.PerspectiveCamera( 60, ASPECT, 1, 100000 );

    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();
    
    var path = "public/textures/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    
    parentObj = new THREE.Object3D();
    scene.add(parentObj);
    var pivot1 = new THREE.Object3D();
    var pivot2 = new THREE.Object3D();
    var pivot3 = new THREE.Object3D();
    parentObj.add(pivot1);
    parentObj.add(pivot2);
    parentObj.add(pivot3);

    addGeometry(new THREE.CylinderGeometry(20, 20, 200, 200, 100, false), 0, 600, textureCube, pivot1, meshes);
    addGeometry(new THREE.CylinderGeometry(20, 50, 100, 0, 0, false), 0, 0, textureCube, pivot2, meshes);
    addGeometry(new THREE.CylinderGeometry(10, 10, 70, 0, 0, false), 200, 800, textureCube, pivot3, meshes);
    // Skybox

    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial( {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide

    } );

    var mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
    sceneCube.add( mesh );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( ASPECT );
    renderer.setSize( WIDTH, HEIGHT );
    renderer.autoClear = false;
    container.append( renderer.domElement );
}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {
    renderer.render( sceneCube, cameraCube );
    renderer.render( scene, camera );

    rotate(true, true);
    rotate(false, true);

}

function rotate(vertical, up) {
    if (vertical) {
        parentObj.rotation.y += ROTATION_AMOUNT * (up ? 1 : -1);
    } else {
        parentObj.rotation.x += ROTATION_AMOUNT * (up ? 1 : -1);
    }
}
