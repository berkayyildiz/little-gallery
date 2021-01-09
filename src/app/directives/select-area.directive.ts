import { Directive, ElementRef, HostListener } from '@angular/core';

interface Coordinate {

}

@Directive({
  selector: '[appSelectArea]'
})
export class SelectAreaDirective {

  startEvent: MouseEvent;
  nativeEl: HTMLElement;

  areaEl: HTMLElement;

  selecting: boolean;

  @HostListener("mousedown", ["$event"])
  mouseDown(event: MouseEvent) {
    this.startEvent = event;
    this.areaEl.style.display = "block";
    this.areaEl.style.left = `${event.clientX - (window.innerWidth - this.nativeEl.clientWidth) / 2}px`;
    this.areaEl.style.top = `${event.clientY - (window.innerHeight - this.nativeEl.clientHeight) / 2}px`;
    this.selecting = true;
  }

  @HostListener("mousemove", ["$event"])
  mouseMove(event: MouseEvent) {
    if (this.selecting) {
      const width = Math.abs(event.clientX - this.startEvent.clientX);
      const height = Math.abs(event.clientY - this.startEvent.clientY);

      this.areaEl.style.width = `${width}px`
      this.areaEl.style.height = `${height}px`
    }
  }

  @HostListener("mouseup", ["$event"])
  mouseup(event: MouseEvent) {
    this.startEvent = event;
    this.areaEl.style.display = "none";
    this.selecting = false;

  }

  constructor(
    private elRef: ElementRef
  ) {
    this.nativeEl = this.elRef.nativeElement;

    this.areaEl = document.createElement("div");
    this.areaEl.classList.add("selection-area");
    this.areaEl.style.display = "none";
    this.areaEl.style.position = "fixed"
    this.nativeEl.appendChild(this.areaEl);
  }

}
