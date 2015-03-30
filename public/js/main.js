var container = $('#design-lab');

var camera, scene, renderer;
var cameraCube, sceneCube;

var mesh, lightMesh, geometry;
var spheres = [];

var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var WIDTH = container.innerWidth(), HEIGHT = container.innerHeight(), VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 1, FAR = 10000;



init();
animate();

function addGeometry(geometry, x, y, textureCube) {
    var material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        envMap: textureCube, 
        refractionRatio: 0.65 } );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 4;
    
    mesh.position.x = x;
    mesh.position.y = y;
    
    scene.add( mesh );
    spheres.push( mesh );

}

function init() {
    camera = new THREE.PerspectiveCamera( 60, ASPECT, NEAR, FAR);
    camera.position.z = 3200;
    cameraCube = new THREE.PerspectiveCamera( 60, ASPECT, 1, 100000 );

    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();
    
    var path = "textures/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );
    
    addGeometry(new THREE.CylinderGeometry(20, 20, 200, 200, 100, false), 0, 0, textureCube);
    addGeometry(new THREE.CylinderGeometry(20, 50, 100, 0, 0, false), 0, -600, textureCube);
    addGeometry(new THREE.CylinderGeometry(10, 10, 70, 0, 0, false), 200, 200, textureCube);
    // Skybox

    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial( {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide

    } ),

    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
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
}


