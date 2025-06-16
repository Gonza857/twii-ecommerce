import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoPageComponent } from './carrito-page.component';

describe('CarritoPageComponent', () => {
  let component: CarritoPageComponent;
  let fixture: ComponentFixture<CarritoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
