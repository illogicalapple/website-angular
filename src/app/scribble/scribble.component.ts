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
    frames: [[<any>]]
  }
  scribbled = false
  canvas: any = document.createElement("canvas")
  onCanvasLoad = (e: any) => {
    this.canvas = e.target;
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize);
    window.onbeforeunload = () => "do you really want to leave? your edits will be lost";
  }
  interval: any = null
  warp = (e: any, s: number, a: number) => [e[0] + Math.sin(Date.now() * s + e[1]) * a, e[1] + Math.sin(Date.now() * s + e[0]) * a]
  location = (event: any) => {
    if (event instanceof TouchEvent) {
      return [(event.touches[0] || event.changedTouches[0]).clientX, (event.touches[0] || event.changedTouches[0]).clientY - 85]; // single touch im not bothering to do multiple :p
    } else {
      return [event.clientX, event.clientY - 85];
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
		let _warp = destroyed ? this.warp : (e: Array<any>) => e;
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
  toggleScribble = (bob: boolean) => {
		this.scribbled = bob ?? !this.scribbled;
		if(this.interval && !this.scribbled) {
			clearInterval(this.interval);
			this.interval = null;
			this.render();
		}
		if(!this.interval && this.scribbled) {
			this.interval = setInterval(this.render, 33);
		}
	}
  handleMouseDown = (event: any) => {
    if(!this.target) this.target = this.render();
    const position = this.location(event);
    this.drawing.frames[0].push(position);
    this.addLine(this.target, position);
    this.drawing.frames[0].push("DOWN");
    this.addLine(this.target, "DOWN");
  }
  handleMouseUp = (event: any) => {
    if(!this.target) this.target = this.render();
    const position = this.location(event);
    this.drawing.frames[0].push(position);
    this.addLine(this.target, position);
    this.drawing.frames[0].push("UP");
    this.addLine(this.target, "UP");
  }
  handleMouseMove = (event: any) => {
    if(!this.target) this.target = this.render();
    const position = this.location(event);
    if(this.mouse) {
      this.drawing.frames[0].push(position);
      this.addLine(this.target, position);
    }
  }
  onWindowResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - (85 * 2);
    this.render();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
