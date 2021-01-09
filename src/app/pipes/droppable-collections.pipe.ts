import { Pipe, PipeTransform } from '@angular/core';
import { Collection, Image } from "../services/collection.service";

@Pipe({
  name: 'droppableCollections',
  pure: false
})
export class DroppableCollectionsPipe implements PipeTransform {

  transform(collections: Collection[], image: Image): string[] {
    return collections.map(c => c.id).filter(id => !image.collections.includes(id));

  }

}
