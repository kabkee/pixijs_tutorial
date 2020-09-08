const app = new PIXI.Application({ 
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x103322,
    transparent: true,
});
app.view.id='pixiView';
document.body.appendChild(app.view);

// === FIRST PART ===
// just simple rotation
PIXI.Loader.shared
    .add([{ name: "vr_floor", url: "images/vr_floor.jpg" }])
    .load(setup);

let vr_floor;

function setup() {
    vr_floor = new PIXI.Sprite(PIXI.Loader.shared.resources.vr_floor.texture);
    app.stage.addChild(vr_floor);

    fitView(vr_floor);
    
    // app.renderer.resize(defaultX,defaultY);

    let circle = new PIXI.Graphics();
    circle.beginFill(0x9966ff);
    circle.drawCircle(0, 0, 32);
    circle.endFill();
    circle.x = 64;
    circle.y = 130;
    circle.interactive = true;
    // Shows hand cursor
    circle.buttonMode = true;

    circle.on('pointerdown', function(e){
        console.info(e, this, this.x, this.y);
        
    });
    app.stage.addChild(circle);

    app.ticker.add((delta) => gameLoop(delta));
}
function fitView(sprite){
    let scaleX, scaleY, scale;
    scaleX = app.view.width / sprite.width;
    scaleY = app.view.height / sprite.height;
    scale = Math.min(scaleX, scaleY);
    
    console.info(scaleX, scaleY, scale, sprite.width, sprite.height)
    sprite.scale.set(scale, scale)

    app.view.width = sprite.width;
    app.view.height = sprite.height;

}
function gameLoop(delta) {
}
