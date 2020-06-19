import {
  Component,
  ComponentFactory,
  ComponentRef,
  HostListener,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'ngx-shop-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent implements OnInit {
  @ViewChild('modalContent', { read: ViewContainerRef, static: false })
  public modal!: ViewContainerRef;

  // tslint:disable-next-line:no-any
  public childComponent!: ComponentFactory<any>;
  public isOpen = false;
  // tslint:disable-next-line:no-any
  public modalContext!: ComponentRef<any>;
  // tslint:disable-next-line:no-any
  public component!: Type<any>;

  public constructor(
    private readonly _modalService: ModalService,
    private readonly _cfr: ComponentFactoryResolver
  ) {}

  public ngOnInit(): void {
    this._modalService.modalSequence$.subscribe(
      // tslint:disable-next-line:no-any
      ({ component, context }: any): void => {
        if (!component) {
          this.close();
          return;
        }
        this.isOpen = true;
        this.childComponent = this._cfr.resolveComponentFactory(component);
        this.modalContext = this.modal.createComponent(this.childComponent, 0);
        Object.keys(context).forEach(
          (key: string): void => (this.modalContext.instance[key] = context[key])
        );
      }
    );
  }

  @HostListener('window:keyup', ['$event.keyCode'])
  public close(code = 27): void {
    if (code !== 27) {
      return;
    }
    if (this.modalContext) {
      this.modalContext.destroy();
    }
    this.isOpen = false;
  }
}
