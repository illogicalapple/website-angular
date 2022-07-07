import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  setHeightInterval = () => {
    const interval = setInterval(this.onResize, 500, {
      target: window
    });
    window.addEventListener("resize", this.onResize);
    this.onResize({
      target: window
    });
  }
  onResize = (event: any) => {
    event.target.document.body.style.setProperty("--height", event.target.innerHeight + "px");
  }
  title = "illogicalapple"
}
