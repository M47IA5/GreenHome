import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
register(); 
@Component({
  selector: 'app-plantas',
  templateUrl: './plantas.page.html',
  styleUrls: ['./plantas.page.scss'],
})
export class PlantasPage implements OnInit {

  constructor() { }

  ngOnInit() {

  }
}
