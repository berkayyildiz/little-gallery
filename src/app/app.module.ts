import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SelectAreaDirective } from './directives/select-area.directive';
import { DraggableDirective } from './directives/draggable.directive';
import { DroppableDirective } from './directives/droppable.directive';
import { DroppableCollectionsPipe } from './pipes/droppable-collections.pipe';
import { ContenteditableModule } from '@ng-stack/contenteditable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropZoneDirective } from './directives/drop-zone.directive';

@NgModule({
  declarations: [
    AppComponent,
    SelectAreaDirective,
    DraggableDirective,
    DroppableDirective,
    DroppableCollectionsPipe,
    DropZoneDirective
  ],
  imports: [
    BrowserModule,
    ContenteditableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
