import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import SelectionArea from '@simonwep/selection-js';
import { Collection, CollectionService, Image } from './services/collection.service';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('insertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1000ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  selectionArea: SelectionArea;

  isSelectionActive = false;

  isAddToCollectionDropdownOpen = false;

  isCollectionAddDropdownOpen = false;

  isDeletingCollection = false;

  galleryDropdownContent: "delete" | "edit-title" | "menu" = null;



  constructor(
    public readonly collectionService: CollectionService,
    public readonly dialogService: DialogService
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
    this.selectionArea.getSelection().forEach(item => {
      this.collectionService.deleteImage(item.getAttribute("data-image-id"))
    })
  }

  createCollection(title: string) {
    this.collectionService.addNewCollection(title);
    this.isCollectionAddDropdownOpen = false;
  }

  addSelectedItemsToCollection(collection: Collection) {
    this.selectionArea.getSelection().forEach(item => {
      this.collectionService.addImageToCollection(item.getAttribute("data-image-id"), collection)
    })
    this.isAddToCollectionDropdownOpen = false;
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
