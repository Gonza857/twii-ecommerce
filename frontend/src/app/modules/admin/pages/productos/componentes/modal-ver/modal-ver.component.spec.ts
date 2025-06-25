import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerComponent } from './modal-ver.component';

describe('ModalVerComponent', () => {
  let component: ModalVerComponent;
  let fixture: ComponentFixture<ModalVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
