import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VentasService } from '../../services/ventas.service';
import { Venta } from '../../models/venta';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    private ventasService: VentasService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      Idventa: [null],
      ClienteNombre: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      Total: [null, [Validators.required, Validators.maxLength(7)]],
      Fecha: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });
  }
  Titulo = 'Ventas';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Venta[] = null;
  RegistrosTotal: number;
  Pagina = 1; // inicia pagina 1
  submitted: boolean = false;
  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  Buscar() {
    this.ventasService.get().subscribe((res: any) => {
      this.Items = res.Items;
      this.RegistrosTotal = res.RegistrosTotal;
    });
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ IdVenta: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }
  Consultar(dto) {}
  Modificar(dto) {}
  Eliminar(dto) {}
  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    const itemCopy = { ...this.FormRegistro.value };

    var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaFundacion = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      this.ventasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.ventasService
        .put(itemCopy.IdVenta, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
        });
    }
  }
  Volver() {
    this.AccionABMC = 'L';
  }
}
