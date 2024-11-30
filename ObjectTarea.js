class Tarea {
  constructor(id, titulo, descripcion, estado = false, urgencia = 'normal', fecha = Date.now()) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.estado = estado;         // boolean: true = completada, false = pendiente
    this.urgencia = urgencia;     // 'urgente', 'normal', 'no-urgente'
    this.fecha = fecha;
    this.eliminada = false;
  }

  toggleEstado() {
    this.estado = !this.estado;
  }

  eliminar() {
    this.eliminada = true;
  }

  actualizar(nuevoTitulo, nuevaDescripcion, nuevaUrgencia) {
    this.titulo = nuevoTitulo;
    this.descripcion = nuevaDescripcion;
    this.urgencia = nuevaUrgencia;
  }
}