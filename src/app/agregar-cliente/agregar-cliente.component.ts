import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {

  formularioCliente:FormGroup;
  porcentajeSubida:number=0;
  cargando: boolean = false;
  urlImagen: string = "";
  esEditable: boolean = false;
  id:string;

  constructor(private fb: FormBuilder,
              private storage:AngularFireStorage, 
              private db: AngularFirestore,
              private activeRoute: ActivatedRoute,
              private msj:MensajesService)
                        { }

  ngOnInit() {
      
    this.formularioCliente = this.fb.group({
      nombre:['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([Validators.required,Validators.email])],
      DUI: [''],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      imgUrl: ['', Validators.required]
    })

      console.log(this.activeRoute.snapshot.params.clienteID);
      this.id = this.activeRoute.snapshot.params.clienteID;
      
      if(this.id != undefined)
      {
        this.esEditable = true;
        this.db.doc<any>('clientes/' + this.id).valueChanges().subscribe((cliente)=>{
        console.log(cliente);
        this.formularioCliente.setValue({
        nombre: cliente.nombre,
        apellido: '',
        correo: cliente.correo,
        fechaNacimiento: '',
        DUI: cliente.DUI,
        telefono: cliente.telefono,
        imgUrl: ''
        })

            this.urlImagen= cliente.imgUrl;

            });     
      }

   

  }

 agregar()
 {
    this.formularioCliente.value.imgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    console.log(this.formularioCliente.value);
    this.db.collection('clientes').add(this.formularioCliente.value).then((termino)=>{
    console.warn("registro creado"); 
    
    this.msj.mensajeCorrecto("Agregado","usuario agregado correctamente")
    
  })
 }

 editar()
 {
  this.formularioCliente.value.imgUrl = this.urlImagen;
  this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
  
  this.db.doc('clientes/'+ this.id).update(this.formularioCliente.value).then((resultado)=>
  {
    Swal.fire({
      title: "Editado",
      text: "El usuario se ha editado correctamente",
      icon: "success"
    })

  }).catch((error)=>{
    this.msj.mensajeError("Ocurrio algun error","Lamentablemente ocurrio un error, intentalo de nuevo")
  })
 }

 subirImagen(event)
 {

  if(event.target.files.length > 0)
  {
    let nombre = new Date().getTime().toString();
    let archivo= event.target.files[0];
  
    let extension = archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'));
    
    let ruta= 'clientes/' + nombre + extension;
    const referencia = this.storage.ref(ruta);
    const tarea = referencia.put(archivo);
    tarea.then((objeto)=>{
    console.warn("Se ha subido una imagen");
        referencia.getDownloadURL().subscribe((url)=>{
        this.urlImagen= url;
        }) 
    })
      tarea.percentageChanges().subscribe((porcentaje)=>{
      this.porcentajeSubida =parseInt(porcentaje.toString());
      
      if(this.porcentajeSubida == 100){
        this.cargando = true;
      }
    })
  
  }

  
 }

}
