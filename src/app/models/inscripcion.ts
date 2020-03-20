import { DocumentReference } from '@angular/fire/firestore';

export class Inscripcion{
    fecha: Date;
    fechaFinal: Date;
    cliente: DocumentReference;
    precios: DocumentReference;
    total: number;

    constructor()
    { 
        this.fecha = null; 
        this.fechaFinal = null;
        this.cliente = this.cliente;
        this.precios = this.precios;
        this.total= this.total;
    }

    validar(): any{
        let respuesta = 
        {
            esValido: false,
            mensaje: ''
        }

        if(this.cliente == undefined || this.cliente == null)
        {
            respuesta.esValido=false;
            respuesta.mensaje = "no se ha seleccionado cliente"
            return respuesta
        }

        if(this.fecha == undefined || this.fecha == null)
        {
            respuesta.esValido=false;
            respuesta.mensaje = "no tiene fecha de inicio"
            return respuesta
        }

        if(this.precios == undefined || this.precios == null)
        {
            respuesta.esValido=false;
            respuesta.mensaje = "no ha seleccionado un precio"
            return respuesta
        }

        if(this.total == undefined || this.total == null)
        {
            respuesta.esValido=false;
            respuesta.mensaje = "no se ha podido calcular el total"
            return respuesta
        }



    }

}