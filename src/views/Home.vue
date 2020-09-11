<template>
    <b-container fluid class="home">
        <b-row class="mb-3">
            <b-col ref="pixi" class="p-0 m-0" cols="10"></b-col>
            <b-col cols="2" class="p-3">
                <!-- <b-button @click="startDrawingLine = true">Line_1</b-button> -->
				<b-button
					v-for="(btn, idx) in buttons"
					:key="idx"
					:pressed.sync="btn.state"
					variant="outline-secondary"
					style='display: block;'
					class='m-3'
					@click='onClickButtons(btn.state)'
				>
					{{ btn.caption }}
				</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import * as PIXI from "pixi.js";
import vrFloorImage from "@/assets/images/vr_floor.jpg";

export default {
    name: "Home",
    components: {},
    data() {
        return {
            PixiApp: null,
            pixiLines: [],
            lineGraphics: null,
            lineContainers: null,
            lineFillPercent: 0,
            spriteVrFloor: null,
			startDrawingLine: true,
            lineCoordinates: [
                {
                    name: "line 1",
					currentCoordIdx: 0,
					color: '0x33ff00',
					coordinates: [
                        { x: 115.09375, y: 490, finished: false },
                        { x: 179.09375, y: 363, finished: false },
                        { x: 129.09375, y: 247, finished: false },
                        { x: 257.09375, y: 196, finished: false },
                        { x: 339.09375, y: 323, finished: false },
                        { x: 584.09375, y: 218, finished: false },
                        { x: 670.09375, y: 306, finished: false },
                    ],
				},
				{
                    name: "line 2",
                    currentCoordIdx: 0,
					color: '0xff3300',
                    coordinates: [
						{ x: 114.09375, y: 482, finished: false },
						{ x: 172.09375, y: 383, finished: false },
						{ x: 559.09375, y: 231, finished: false },
						{ x: 460.09375, y: 125, finished: false },
						{ x: 556.09375, y: 89, finished: false },
						{ x: 673.09375, y: 208, finished: false },
						{ x: 609.09375, y: 236, finished: false },
						{ x: 675.09375, y: 316, finished: false },
                    ],
                },
            ],
            buttons: [
                { caption: "Line 1", idx: 0, state: false },
                { caption: "Line 2", idx: 1, state: false },
                { caption: "Line 3", idx: 2, state: false },
                { caption: "Line 4", idx: 3, state: false },
            ],
        };
    },
    created() {
        window.addEventListener("resize", this.onResize);
    },
    destoryed() {
        window.removeEventListener("resize", this.onResize);
    },
    mounted() {
        this.PixiApp = new PIXI.Application({
            backgroundColor: 0x103322,
            transparent: true,
        });
        this.PixiApp.view.id = "pixiView";
        this.PixiApp.view.addEventListener("click", this.onClickCanvas);
        this.$refs.pixi.appendChild(this.PixiApp.view);

        // === FIRST PART ===
		// just simple rotation
		if(!PIXI.Loader.shared.resources.vr_floor){
			PIXI.Loader.shared
				.add([{ name: "vr_floor", url: vrFloorImage }])
		}
		PIXI.Loader.shared.load(this.pixiSetup);
	},
	watch: {},
	computed:{
		drawingLineIdxs(){
			return this.buttons.filter((item)=>{
				return item.state;
			})
		},
		undrawingLineIdxs(){
			return this.buttons.filter((item)=>{
				return !item.state;
			})
		},
	},
    methods: {
        onResize() {
            console.info("resiezed");
            this.fitView(this.spriteVrFloor);
        },
        pixiSetup() {
            this.lineContainers = new PIXI.Container();
            this.lineGraphics = new PIXI.Graphics();
            this.spriteVrFloor = new PIXI.Sprite(
                PIXI.Loader.shared.resources.vr_floor.texture
            );
            this.PixiApp.stage.addChild(this.spriteVrFloor);
            this.spriteVrFloor.org_width = this.spriteVrFloor.width;
            this.spriteVrFloor.org_height = this.spriteVrFloor.height;
            this.fitView(this.spriteVrFloor);

            this.addCicle();
            this.PixiApp.ticker.add((delta) => this.pixiLoop(delta));
        },
        addCicle() {
            let circle = new PIXI.Graphics();
            circle.beginFill(0x9966ff);
            circle.drawCircle(0, 0, 32);
            circle.endFill();
            circle.x = 64;
            circle.y = 130;
            circle.interactive = true;
            circle.buttonMode = true;

            circle.on("pointerdown", (e) => {
                this.startDrawingLine = true;
            });

            this.PixiApp.stage.addChild(circle);
        },
        fitView(sprite) {
            let scaleX, scaleY, scale;
            scaleX = this.PixiApp.view.width / sprite.org_width;
            scaleY = this.PixiApp.view.height / sprite.org_height;
			scale = Math.min(scaleX, scaleY);
			console.info('fitScale: ', scale);
            sprite.scale.set(scale, scale);
        },
        pixiLoop(delta) {
            if (this.startDrawingLine) {
                this.drawingLines();
            }
		},
		removeUntoggledLines(){
			for(let undrawIdx=0; undrawIdx< this.undrawingLineIdxs.length; undrawIdx++){
				// 그린 선 모두 지우기.
				if(this.pixiLines[this.undrawingLineIdxs[undrawIdx].idx]){
					for(let lineIdx=0; lineIdx<this.pixiLines[this.undrawingLineIdxs[undrawIdx].idx].length; lineIdx++){
						this.pixiLines[this.undrawingLineIdxs[undrawIdx].idx][lineIdx].clear();
					}
				}
				// 그린 선 모두 초기화.
				console.info(this.lineCoordinates[this.undrawingLineIdxs[undrawIdx].idx], this.undrawingLineIdxs[undrawIdx].idx)
				for(let coordIdx=0; this.lineCoordinates[this.undrawingLineIdxs[undrawIdx].idx] && coordIdx<this.lineCoordinates[this.undrawingLineIdxs[undrawIdx].idx].coordinates.length; coordIdx++){
					this.lineCoordinates[this.undrawingLineIdxs[undrawIdx].idx].coordinates[coordIdx].finished = false;
					this.lineFillPercent = 0;
				}
			}
		},
		drawingLines(){
			for(let i=0; i< this.drawingLineIdxs.length; i++){
				// for (let pixiLinesIdx in this.pixiLines) {
				// 	for(let i=0; i<this.pixiLines[pixiLinesIdx].length; i++){
				// 		this.pixiLines[pixiLinesIdx][i].clear();
				// 	}
				// }
				this.drawingLine(this.drawingLineIdxs[i].idx);
			}
		},
        drawingLine(lineIdx) {
			if(!this.lineCoordinates[lineIdx]){
				return;
			}
            let lineGraphics = new PIXI.Graphics();
            lineGraphics.lineStyle(5, this.lineCoordinates[lineIdx].color);

            let startX, startY;
            let noMoreDrawing;
            for (
                let idx = 0;
                idx < this.lineCoordinates[lineIdx].coordinates.length;
                idx++
            ) {
                noMoreDrawing = false;

                let { x, y } = this.lineCoordinates[lineIdx].coordinates[idx];

                if (
                    idx != 0 &&
                    this.lineCoordinates[lineIdx].coordinates[idx].finished
                ) {
                    lineGraphics.lineTo(x, y);
                    continue;
                } else if (idx == 0) {
                    lineGraphics.moveTo(x, y);
                    this.lineCoordinates[lineIdx].coordinates[
                        idx
                    ].finished = true;
					this.PixiApp.stage.addChild(lineGraphics);
					if(!this.pixiLines[lineIdx]){
						this.pixiLines[lineIdx] = [];
					}
                    this.pixiLines[lineIdx].push(lineGraphics);
                } else {
                    if (this.lineFillPercent == 0) {
						this.PixiApp.stage.addChild(lineGraphics);
						if(!this.pixiLines[lineIdx]){
							this.pixiLines[lineIdx] = [];
						}
                        this.pixiLines[lineIdx].push(lineGraphics);
                    }
                    if (this.lineFillPercent < 1.0) {
                        this.lineFillPercent += 0.05;
                        noMoreDrawing = true;
                    }
                    let { x: prevX, y: prevY } = this.lineCoordinates[
                        lineIdx
                    ].coordinates[idx - 1];
                    lineGraphics.lineTo(
                        prevX + (x - prevX) * this.lineFillPercent,
                        prevY + (y - prevY) * this.lineFillPercent
                    );
                    // console.info('idx, this.lineFillPercent', idx, this.lineFillPercent)

                    if (this.lineFillPercent >= 1) {
                        this.lineFillPercent = 0;
                        this.lineCoordinates[lineIdx].coordinates[
                            idx
                        ].finished = true;
                        this.lineCoordinates[lineIdx].currentCoordIdx += 1;
                    }
                }
                if (noMoreDrawing) {
                    return;
                }
            }
		},
		onClickButtons(pressed){
			if(!pressed){
				this.removeUntoggledLines();
			}
		},
        onClickCanvas(event) {
            // clientX/Y gives the coordinates relative to the viewport in CSS pixels.
            // console.log(event.clientX, event.clientY); // x coordinate

            // pageX/Y gives the coordinates relative to the <html> element in CSS pixels.
            // console.log(event.pageX, event.pageY);

            // screenX/Y gives the coordinates relative to the screen in device pixels.
            // console.log(event.screenX);
			// console.log(event.screenY);
			
			
			const rect = this.PixiApp.view.getBoundingClientRect()
			const x = event.clientX - rect.left
			const y = event.clientY - rect.top
			console.log(`x: ${x}, y: ${y}`)

        },
    },
};
</script>

<style>
#pixiView {
    width: 100%;
    height: 100%;
	max-width: fit-content;
}
</style>
