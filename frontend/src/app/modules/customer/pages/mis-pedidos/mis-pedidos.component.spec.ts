import { Pedido } from './../../../../../../../backend/src/models/entities/pedido';
import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { MisPedidosComponent } from "./mis-pedidos.component"
import { PedidoService } from "../../../../services/pedido/pedido.service"
import { UsuarioService } from "../../../../services/usuario/usuario.service"
import { of, throwError } from "rxjs"
import { NO_ERRORS_SCHEMA } from "@angular/core"

describe("MisPedidosComponent", () => {
  let component: MisPedidosComponent
  let fixture: ComponentFixture<MisPedidosComponent>
  let mockPedidoService: any
  let mockUsuarioService: any

  beforeEach(async () => {
    mockPedidoService = {
      obtenerPedidosPorUsuario: jasmine.createSpy("obtenerPedidosPorUsuario").and.returnValue(of([])),
    }
    mockUsuarioService = {
      usuario: jasmine.createSpy("usuario").and.returnValue({ id: 1 }),
    }

    await TestBed.configureTestingModule({
      imports: [MisPedidosComponent],
      providers: [
        { provide: PedidoService, useValue: mockPedidoService },
        { provide: UsuarioService, useValue: mockUsuarioService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(MisPedidosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should return correct severity for status", () => {
    expect(component.getSeverity("completado")).toBe("success")
    expect(component.getSeverity("pendiente")).toBe("warning")
    expect(component.getSeverity("cancelado")).toBe("danger")
    expect(component.getSeverity("unknown")).toBe("info")
  })
})
