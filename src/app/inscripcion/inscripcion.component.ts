import { Component, OnInit } from '@angular/core';
import { Inscripcion} from '../models/inscripcion';
import { Cliente } from '../models/cliente';
import { AngularFirestore } from '@angular/fire/firestore';
import { Precio } from '../models/precio';
import { GroupedObservable } from 'rxjs';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {

  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente= new Cliente();
  precioSeleccionado: Precio = new Precio();
  precios: Precio[] = new Array <Precio>();
  
  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.db.collection('precios').get().subscribe((resultado)=>
    {
      resultado.docs.forEach((item)=>
      {
        let precio= item.data() as Precio;
        precio.id= item.id;
        precio.ref=item.ref;
        this.precios.push(precio)
      })
    })
  }

  asignarCliente(cliente:Cliente)
  {
    this.inscripcion.cliente = cliente.ref; 
    this.clienteSeleccionado =  cliente;
  }

  eliminarCliente()
  {
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.cliente = undefined;
  }

  guardar()
  {
    
    
    if(this.inscripcion.validar().esValido)
    {
    this.db.collection('inscipciones').add(this.inscripcion).then((resultado)=>
    {
      console.log("guardando");
    })
      
    }

 
    else
    {
      console.log(this.inscripcion.validar().mensaje);
    }

  }

  seleccionarPrecio(event)
  {

    if(event != null)
    {
      this.precioSeleccionado= this.precios.find(x=>x.id == event);
      this.inscripcion.precios= this.precioSeleccionado.ref;
    
      this.inscripcion.fecha =  new Date();
  
      this.inscripcion.total= this.precioSeleccionado.costo;
  
      if(this.precioSeleccionado.tipoDuracion ==1)
      {
        let dias:number =  this.precioSeleccionado.duracion*1;
        let fechaFinal = new Date(this.inscripcion.fecha.getFullYear(),this.inscripcion.fecha.getMonth(),this.inscripcion.fecha.getDate()+ dias);
        this.inscripcion.fechaFinal=fechaFinal;
      }
      if(this.precioSeleccionado.tipoDuracion ==2)
      {
        let dias:number =  this.precioSeleccionado.duracion*7;
        let fechaFinal = new Date(this.inscripcion.fecha.getFullYear(),this.inscripcion.fecha.getMonth(),this.inscripcion.fecha.getDate()+ dias);
        this.inscripcion.fechaFinal=fechaFinal;
      }
      if(this.precioSeleccionado.tipoDuracion ==3)
      {
        let dias:number =  this.precioSeleccionado.duracion*15;
        let fechaFinal = new Date(this.inscripcion.fecha.getFullYear(),this.inscripcion.fecha.getMonth(),this.inscripcion.fecha.getDate()+ dias);
        this.inscripcion.fechaFinal=fechaFinal;
      }
  
    }

else{
  this.precioSeleccionado= new Precio();
  this.inscripcion.precios = null;
  this.inscripcion.total=0;

}

  }

}
