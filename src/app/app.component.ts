import { Component } from '@angular/core';
import { CollectionService } from './services/collection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  constructor(
    public readonly collectionService: CollectionService
  ) {

  }

  onInit() {
  }
}
