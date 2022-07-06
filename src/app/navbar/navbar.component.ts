import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  menuOpen = false
  toggleMenu = (stuf: boolean) => {
    this.menuOpen = stuf
  }
  pages = [
    {
      url: "/scribble",
      title: "scribble",
      desc: "ruins your drawings"
    },
    {
      url: "//car-crash.herokuapp.com",
      title: "car crash",
      desc: "multiplayer car game"
    },
    {
      url: "/thesaurus-rex",
      title: "thesaurus rex",
      desc: "dinosaur that knows english"
    }
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
