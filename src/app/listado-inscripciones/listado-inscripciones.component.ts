import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Inscripcion } from '../models/inscripcion';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../models/cliente';

@Component({
  selector: 'app-listado-inscripciones',
  templateUrl: './listado-inscripciones.component.html',
  styleUrls: ['./listado-inscripciones.component.scss']
})
export class ListadoInscripcionesComponent implements OnInit {

  inscripciones: Inscripcion[] = [];

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.db.collection('inscripciones').get().subscribe((resultado)=>
    {
      resultado.forEach((inscripcion)=>{console.log(inscripcion.data());

        let inscripcionObtenida = inscripcion.data();
        inscripcionObtenida.id =  inscripcion.id;
        console.log(inscripcionObtenida);
        this.db.doc(inscripcion.data().cliente.path).get().subscribe((cliente)=>
        {
          console.log(cliente.data());
          inscripcionObtenida.clienteObtenido =  cliente.data();          

          console.log(inscripcionObtenida);
          
        })

      })
    })
  }

}
