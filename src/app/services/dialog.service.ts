import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { uid } from '../utilities/utilities';

export interface DialogData {
  id: string,
  body: string,
  color?: "danger" | "success"
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogs = new BehaviorSubject<DialogData[]>([]);

  constructor() { }

  pushDialog(data: { body: string, color?: "danger" | "success" }) {
    const dialogs = this.dialogs.value;

    const id = uid();

    dialogs.push({
      id: id,
      body: data.body,
      color: data.color
    })

    this.dialogs.next(dialogs)

    setTimeout(() => {
      this.dialogs.next(this.dialogs.value.filter(d => d.id != id))
    }, 2000)
  }
}
