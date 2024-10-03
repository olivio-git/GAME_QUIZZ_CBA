export class Ejemplo {
    constructor(nombre, saludar){
        this.nombre=nombre
        this.saludar=saludar
    }
    classSaludar(){
        this.saludar(this.nombre)
    }
}

