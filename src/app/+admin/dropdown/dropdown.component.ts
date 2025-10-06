import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'ss-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: false
})
export class DropdownComponent {

  @Input() shown = false;
  @Output() closed = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.shown) {
      this.closed.emit();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutsideEvent(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closed.emit();
    }
  }
}
