import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { uid } from '../utilities/utilities';
import { DialogService } from './dialog.service';


export interface Collection {
  id: string,
  title: string,
  images: string[]
}

export interface Image {
  id: string,
  url: string,
  collections: string[]
}

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  galleryImages = new BehaviorSubject<Image[]>([]);

  collections = new BehaviorSubject<Collection[]>([])

  selectedCollection = new BehaviorSubject<Collection>(null);


  images: Image[] = []
  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly dialogService: DialogService
  ) {

    let localImages: Image[] = JSON.parse(window.localStorage.getItem("images")) || [];
    localImages.forEach(image => {
      image.url = <string>this.sanitizer.bypassSecurityTrustUrl((image.url as any).changingThisBreaksApplicationSecurity)
    })
    this.images = localImages || [];
    this.collections.next(JSON.parse(window.localStorage.getItem("collections")) || [])


    this.selectedCollection.subscribe(collection => {
      if (collection) {
        this.galleryImages.next(this.images.filter(image => image.collections.includes(collection.id)))
      } else {
        this.galleryImages.next(this.images);
      }

    })

    this.galleryImages.subscribe(() => {
      window.localStorage.setItem("images", JSON.stringify(this.images));
    })

    this.collections.subscribe(collections => {
      window.localStorage.setItem("collections", JSON.stringify(collections));
    })
  }

  firstFourImage(collection: string) {
    const arr: Image[] = [null, null, null, null]
    let images = [];
    if (collection) {
      images = this.images.filter(image => image.collections.includes(collection)).sort((a, b) => { return collection.indexOf(b.id) - collection.indexOf(a.id) }).slice(0, 4);

    } else {
      images = this.images.slice(0, 4);

    }
    images.forEach((image, index) => {
      arr[index] = image;
    })
    return arr;
  }

  addImageToCollection(imageId: string, collection: Collection) {
    const tmpImg = this.images.find(img => img.id == imageId);
    tmpImg.collections.push(collection.id);
    window.localStorage.setItem("images", JSON.stringify(this.images));

  }

  openCollection(collection: Collection) {
    this.selectedCollection.next(collection);
  }

  addNewCollection(title?: string) {
    const collections = this.collections.value;
    collections.push({
      id: uid(),
      title: title || "Untitled Collection",
      images: []
    })
    this.collections.next(collections);

    this.dialogService.pushDialog({
      body: `Collection ${title} successfully created`,
      color: "success"
    })
  }



  addNewImages(files: File[]) {
    files.forEach(async file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {

        const image: Image = {
          id: uid(),
          url: <string>this.sanitizer.bypassSecurityTrustUrl(<string>reader.result),
          collections: this.selectedCollection.value ? [this.selectedCollection.value.id] : []
        }
        this.images.push(image)
        this.galleryImages.next(this.images);
      }
    })

  }

  deleteImage(id: string) {
    this.images = this.images.filter(i => i.id != id);
    this.openCollection(this.selectedCollection.value);
  }

  editSelectedCollectionTitle(title: string) {
    const collections = this.collections.value;
    const collection = collections.find(c => c.id == this.selectedCollection.value.id);
    const oldTitle = collection.title;
    collection.title = title;
    this.collections.next(collections);

    window.localStorage.setItem("collections", JSON.stringify(this.collections.value));

    this.dialogService.pushDialog({
      body: `Title of ${oldTitle} successfully changed with ${title}`,
      color: "success"
    })
  }

  deleteCollection(collection?: Collection) {
    collection = this.selectedCollection.value;
    this.selectedCollection.next(null);
    this.collections.next(this.collections.value.filter(c => c.id != collection.id));
    window.localStorage.setItem("collections", JSON.stringify(this.collections.value));
    this.dialogService.pushDialog({
      body: `Collection ${collection.title} successfully deleted`,
      color: "danger"
    })
  }



}

