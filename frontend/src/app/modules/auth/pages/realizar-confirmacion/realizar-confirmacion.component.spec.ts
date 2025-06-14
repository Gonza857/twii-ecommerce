import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarConfirmacionComponent } from './realizar-confirmacion.component';

describe('RealizarConfirmacionComponent', () => {
  let component: RealizarConfirmacionComponent;
  let fixture: ComponentFixture<RealizarConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizarConfirmacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizarConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
