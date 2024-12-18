import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Este componente representa un formulario en un cuadro de diálogo.
 * Se utiliza para capturar, editar o visualizar datos relacionados con una campaña.
 */
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
  /**
   * Objeto que representa los datos de la campaña.
   * Se inicializa con valores predeterminados si no se proporcionan datos desde el cuadro de diálogo.
   */
  campaign: any;

  /**
   * Constructor del componente.
   * @param dialogRef Referencia al cuadro de diálogo, utilizado para cerrarlo y devolver datos.
   * @param data Datos inyectados en el cuadro de diálogo. Si no hay datos, se inicializa una campaña vacía.
   */
  constructor(
    public dialogRef: MatDialogRef<FormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Inicializa la campaña con los datos recibidos o con valores predeterminados.
    this.campaign = data ? { ...data } : { name: '', createdAt: '', active: '' };
  }

  /**
   * Maneja el evento de cerrar el cuadro de diálogo sin guardar cambios.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Guarda los datos de la campaña y cierra el cuadro de diálogo.
   * Valida que todos los campos estén completos antes de proceder.
   */
  save(): void {
    if (this.campaign.name && this.campaign.createdAt !== '' && this.campaign.active !== '') {
      // Convierte el campo 'active' en un valor booleano.
      this.campaign.active = this.campaign.active === 'true';
      // Cierra el cuadro de diálogo y envía los datos de la campaña.
      this.dialogRef.close(this.campaign);
    }
  }
}
