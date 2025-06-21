import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoDrawerComponent } from './carrito-drawer.component';

describe('CarritoDrawerComponent', () => {
  let component: CarritoDrawerComponent;
  let fixture: ComponentFixture<CarritoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
