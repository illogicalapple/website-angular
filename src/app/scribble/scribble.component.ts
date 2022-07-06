import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scribble',
  templateUrl: './scribble.component.html',
  styleUrls: ['./scribble.component.css']
})
export class ScribbleComponent implements OnInit {
  
  drawing = {
    title: "untitled",
    destroy: 20,
    frames: [[]]
  }
  scribbled = false
  canvas = null
  onCanvasLoad = (e: any) => {
    this.canvas = e.target
    this.onWindowResize()
  }
  interval = null
  warp = (e: any, s: number, a: number) => [e[0] + Math.sin(Date.now() * s + e[1]) * a, e[1] + Math.sin(Date.now() * s + e[0]) * a]
  location = function(event: any) { // get location of the touch/mouse event
		if(event instanceof TouchEvent) {
			return [ (event.touches[0] || event.changedTouches[0]).clientX, (event.touches[0] || event.changedTouches[0]).clientY - 85 ]; // single touch im not bothering to do multiple :p
		} else {
			return [ event.clientX, event.clientY - 85 ];
		}
	}
  target = null
  mouse = false
  oldPosition = false
  render = () => {
		this.canvas.width += 0;
		let rendering = this.drawing.frames[0];
		let destroyed = this.scribbled;
		let context = this.canvas.getContext("2d");
		context.strokeStyle = "black";
		context.lineCap = "round";
		context.lineWidth = 5;
		context.beginPath();
		let down = false;
		let _warp = destroyed ? this.warp : (e: Array) => e;
		let position = false;
		rendering.forEach((e: any) => {
			if(e == "DOWN") { down = true; return; }
			if(e == "UP") { down = false; return; }
			if(down) {
				context.beginPath();
				context.moveTo(...(position || e));
				position = _warp(e, 0.01, 20);
				context.lineTo(..._warp(e, 0.01, 20));
				context.stroke();
			} else {
				context.moveTo(..._warp(e, 0.01, 20));
				position = _warp(e, 0.01, 20);
			}
		});
		return context;
	}
  addLine = (context: any, position: any) => {
		if(position == "DOWN") { this.mouse = true; return; }
		if(position == "UP") { this.mouse = false; return; }
		if(this.mouse) {
			context.beginPath();
			context.moveTo(...(this.oldPosition || position));
			this.oldPosition = position;
			context.lineTo(...position);
			context.stroke();
		} else {
			context.moveTo(...position);
			this.oldPosition = position;
		}
	}

  constructor() { }

  ngOnInit(): void {
  }

}
