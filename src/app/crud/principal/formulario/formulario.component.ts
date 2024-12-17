import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent  {
  campaign: any;

  constructor(
    public dialogRef: MatDialogRef<FormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.campaign = data ? { ...data } : { name: '', createdAt: '', active: '' };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.campaign.name && this.campaign.createdAt !== '' && this.campaign.active !== '') {
      // Convertir el valor de 'active' a booleano
      this.campaign.active = (this.campaign.active === 'true');
      this.dialogRef.close(this.campaign);
    }
  }
  
  
}
