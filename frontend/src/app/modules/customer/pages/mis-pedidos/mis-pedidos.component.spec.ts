import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { MisPedidosComponent } from "./mis-pedidos.component"
import { PedidoService } from "../../../../services/pedido.service"
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

  it("should load orders if user is logged in", () => {
    expect(mockUsuarioService.usuario).toHaveBeenCalled()
    expect(mockPedidoService.obtenerPedidosPorUsuario).toHaveBeenCalledWith(1)
    expect(component.isLoading()).toBeFalse()
    expect(component.pedidos()).toEqual([])
  })

  it("should set error if user is not logged in", () => {
    mockUsuarioService.usuario.and.returnValue(null)
    fixture = TestBed.createComponent(MisPedidosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    expect(component.error()).toBe("Debes iniciar sesión para ver tus pedidos.")
    expect(component.isLoading()).toBeFalse()
  })

  it("should handle error when loading orders from service", () => {
    mockPedidoService.obtenerPedidosPorUsuario.and.returnValue(throwError(() => new Error("API Error")))
    
    fixture = TestBed.createComponent(MisPedidosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    expect(component.error()).toBe("No se pudieron cargar tus pedidos. Intenta de nuevo más tarde.")
    expect(component.isLoading()).toBeFalse()
  })

  it("should return correct severity for status", () => {
    expect(component.getSeverity("completado")).toBe("success")
    expect(component.getSeverity("pendiente")).toBe("warning")
    expect(component.getSeverity("cancelado")).toBe("danger")
    expect(component.getSeverity("unknown")).toBe("info")
  })
})
