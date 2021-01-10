import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Collection } from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection-title-form',
  templateUrl: './collection-title-form.component.html',
  styleUrls: ['./collection-title-form.component.scss']
})
export class CollectionTitleFormComponent implements OnInit {

  constructor() { }

  collectionNameTitle = new FormControl();

  @Input("title") title: string;
  @Output("onValidSubmit") onValidSubmit = new EventEmitter<string>();

  ngOnInit(): void {
    this.collectionNameTitle.setValue(this.title);
  }

  onSubmit() {
    if (this.collectionNameTitle.valid) {
      this.onValidSubmit.emit(this.collectionNameTitle.value);
      this.collectionNameTitle.reset();
    } else {
      this.collectionNameTitle.markAsDirty();
      this.collectionNameTitle.markAsTouched();
    }
  }

}
