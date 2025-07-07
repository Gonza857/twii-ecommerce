import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionesComponent } from './clasificaciones.component';

describe('ClasificacionesComponent', () => {
  let component: ClasificacionesComponent;
  let fixture: ComponentFixture<ClasificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
