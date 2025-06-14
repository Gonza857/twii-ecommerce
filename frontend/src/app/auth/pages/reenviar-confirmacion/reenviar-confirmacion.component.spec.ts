import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReenviarConfirmacionComponent } from './reenviar-confirmacion.component';

describe('ConfirmarCuentaComponent', () => {
  let component: ReenviarConfirmacionComponent;
  let fixture: ComponentFixture<ReenviarConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReenviarConfirmacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReenviarConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
