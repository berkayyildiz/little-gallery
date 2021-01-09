import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';


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

  firstFourImage(collection: string) {
    const arr: Image[] = [null, null, null, null]
    let images = [];
    if (collection) {
      images = this.images.filter(image => image.collections.includes(collection)).sort((a, b) => { return collection.indexOf(b.id) - collection.indexOf(a.id) }).slice(0, 4);

    } else {
      images = this.images.reverse().slice(0, 4);

    }
    images.forEach((image, index) => {
      arr[index] = image;
    })
    return arr;
  }

  addImageToCollection(image: Image, collection: Collection) {
    const tmpImg = this.images.find(img => img.id == image.id);
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
  }

  editSelectedCollectionTitle() {
    window.localStorage.setItem("collections", JSON.stringify(this.collections.value));
  }

  addNewImages(files: File[]) {
    files.forEach(async file => {
      console.log(file);

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

  selectedCollection = new BehaviorSubject<Collection>(null);


  images: Image[] = []



  constructor(
    private readonly sanitizer: DomSanitizer
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
}

export function uid() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};


function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
