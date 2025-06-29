export interface CarritoItemDTO {
  productoid: number
  cantidad: number
  producto: {
    precio: number | string 
  }
}
