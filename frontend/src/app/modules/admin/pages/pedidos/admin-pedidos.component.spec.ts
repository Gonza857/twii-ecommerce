import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { AdminPedidosComponent } from "./admin-pedidos.component"
import { MessageService } from "primeng/api"
import { of, throwError } from "rxjs"
import { NO_ERRORS_SCHEMA } from "@angular/core"
import { PedidoService } from "../../../../services/pedido/pedido.service"


describe("AdminPedidosComponent", () => {
  let component: AdminPedidosComponent
  let fixture: ComponentFixture<AdminPedidosComponent>
  let mockPedidoService: any
  let mockMessageService: any

  beforeEach(async () => {
    mockPedidoService = {
      obtenerTodosLosPedidos: jasmine.createSpy("obtenerTodosLosPedidos").and.returnValue(of([])),
      actualizarEstadoPedido: jasmine.createSpy("actualizarEstadoPedido").and.returnValue(of({})),
    }
    mockMessageService = {
      add: jasmine.createSpy("add"),
    }

    await TestBed.configureTestingModule({
      declarations: [AdminPedidosComponent],
      providers: [
        { provide: PedidoService, useValue: mockPedidoService },
        { provide: MessageService, useValue: mockMessageService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(AdminPedidosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should load all orders on init", () => {
    expect(mockPedidoService.obtenerTodosLosPedidos).toHaveBeenCalled()
    expect(component.isLoading()).toBeFalse()
    expect(component.pedidos()).toEqual([])
  })

  it("should handle error when loading orders", () => {
    mockPedidoService.obtenerTodosLosPedidos.and.returnValue(throwError(() => new Error("Test error")))
    component.cargarPedidos() //
    fixture.detectChanges()

    expect(component.error()).toBe("No se pudieron cargar los pedidos. Intenta de nuevo más tarde.")
    expect(component.isLoading()).toBeFalse()
  })

  it("should return correct severity for status", () => {
    expect(component.getSeverity("completado")).toBe("success")
    expect(component.getSeverity("pendiente")).toBe("warning")
    expect(component.getSeverity("cancelado")).toBe("danger")
    expect(component.getSeverity("unknown")).toBe("info")
  })

  it("should update order status and show success toast", () => {
    spyOn(window, "confirm").and.returnValue(true)
    const testPedido = { id: 1, estado: "pendiente" } as any
    component.onEstadoChange(testPedido, "completado")

    expect(mockPedidoService.actualizarEstadoPedido).toHaveBeenCalledWith(1, "completado")
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: "success",
      summary: "Éxito",
      detail: 'Estado del pedido #1 actualizado a "completado"',
    })
    expect(mockPedidoService.obtenerTodosLosPedidos).toHaveBeenCalledTimes(2)
  })

  it("should not update order status if confirm is false", () => {
    spyOn(window, "confirm").and.returnValue(false)
    const testPedido = { id: 1, estado: "pendiente" } as any
    component.onEstadoChange(testPedido, "completado")

    expect(mockPedidoService.actualizarEstadoPedido).not.toHaveBeenCalled()
    expect(mockMessageService.add).not.toHaveBeenCalled()
  })

  it("should show error toast if status update fails", () => {
    spyOn(window, "confirm").and.returnValue(true)
    mockPedidoService.actualizarEstadoPedido.and.returnValue(throwError(() => new Error("Update error")))
    const testPedido = { id: 1, estado: "pendiente" } as any
    component.onEstadoChange(testPedido, "completado")

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: "error",
      summary: "Error",
      detail: "No se pudo actualizar el estado del pedido.",
    })
    expect(mockPedidoService.obtenerTodosLosPedidos).toHaveBeenCalledTimes(2)
  })
})
