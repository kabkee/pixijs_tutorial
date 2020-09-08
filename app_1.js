let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

// PIXI.utils.sayHello(type);

//Create a Pixi Application
let app = new PIXI.Application({
    width: 256, // default: 800
    height: 256, // default: 600
    antialias: true, // default: false
    transparent: false, // default: false
    resolution: 1, // default: 1
});
app.renderer.backgroundColor = 0x061639;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

PIXI.Loader.shared
    .add([{ name: "vr_floor", url: "images/vr_floor.jpg" }])
    .load(setup);

let vr_floor;

function setup() {
    vr_floor = new PIXI.Sprite(PIXI.Loader.shared.resources.vr_floor.texture);
    app.stage.addChild(vr_floor);
    vr_floor.scale.set(0.2, 0.2);

    let circle = new PIXI.Graphics();
    circle.beginFill(0x9966ff);
    circle.drawCircle(0, 0, 32);
    circle.endFill();
    circle.x = 64;
    circle.y = 130;
    app.stage.addChild(circle);

    app.ticker.add((delta) => gameLoop(delta));
}
function gameLoop(delta) {
    //Move the cat 1 pixel
    vr_floor.x += 1;
}

// setTimeout(()=>{
//     app.renderer.resize(512, 512);

// }, 1000)

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
