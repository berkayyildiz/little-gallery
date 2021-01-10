import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import SelectionArea from '@simonwep/selection-js';
import { CollectionService } from './services/collection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  selectionArea: SelectionArea;

  isSelectionActive = false;

  isOptionsOpen = false;

  isAddToCollectionDropdownOpen = false;

  isCollectionAddDropdownOpen = false;

  isDeletingCollection = false;

  collectionNameTitle = new FormControl();

  constructor(
    public readonly collectionService: CollectionService
  ) {

  }

  ngOnInit() {
    this.initSelection();
  }

  startSelection() {
    this.selectionArea.enable();
    this.isSelectionActive = true;
  }

  clearSelection() {
    this.selectionArea.getSelection().forEach(el => el.classList.remove("selected"));
    this.selectionArea.clearSelection();
  }


  deleteSelectedElements() {
    console.log(this.selectionArea.getSelection());

  }

  createCollection() {


    if (this.collectionNameTitle.valid) {
      this.collectionService.addNewCollection(this.collectionNameTitle.value);
      this.collectionNameTitle.setValue("");
      this.isAddToCollectionDropdownOpen = false;

    } else {
      this.collectionNameTitle.markAsDirty();
      this.collectionNameTitle.markAsTouched();
    }

  }


  initSelection() {
    this.selectionArea = new SelectionArea({

      // All elements in this container can be selected
      selectables: ['.gallery > .items > .item'],

      // The container is also the boundary in this case
      boundaries: ['.gallery > .items']
    }).on('start', ({ store, event }) => {

      // Remove class if the user isn't pressing the control key or ⌘ key
      if (!event.ctrlKey && !event.metaKey) {

        // Unselect all elements
        for (const el of store.stored) {
          el.classList.remove('selected');
        }

        // Clear previous selection
        this.selectionArea.clearSelection();
      }

    }).on('move', ({ store: { changed: { added, removed } } }) => {

      // Add a custom class to the elements that where selected.
      for (const el of added) {
        el.classList.add('selected');
      }

      // Remove the class from elements that where removed
      // since the last selection
      for (const el of removed) {
        el.classList.remove('selected');
      }

    }).on('stop', () => {
      this.selectionArea.keepSelection();
    })

    this.selectionArea.disable();
  }
}
