import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {FormularioComponent} from './formulario/formulario.component';

// Interfaz de Campaña
export interface Campaign {
  id: number;
  name: string;
  createdAt: string;
  active: boolean;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  campaigns: Campaign[] = [];
  filters = { name: '', createdAt: '', active: null };


  displayedColumns: string[] = ['name', 'createdAt', 'active', 'actions'];
  dataSource = new MatTableDataSource<Campaign>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateTable();
  }

  updateTable() {
    this.dataSource.data = [...this.campaigns];
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilters(): void {
    const filteredData = this.campaigns.filter((campaign) => {
      const matchesName = !this.filters.name || campaign.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchesDate = !this.filters.createdAt || campaign.createdAt === this.filters.createdAt;
  
      // Convertir el filtro de active a booleano antes de comparar
      const filterActive = this.filters.active === null || this.filters.active === '' 
        ? null 
        : this.filters.active === 'true';
  
      const matchesActive = filterActive === null || campaign.active === filterActive;
  
      return matchesName && matchesDate && matchesActive;
    });
  
    this.dataSource.data = filteredData;
  }
  
  
  

  resetFilters(): void {
    this.filters = { name: '', createdAt: '', active: null };
    this.updateTable();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormularioComponent, {
      width: '500px',
      height: 'auto', // Ajusta el ancho según necesites
      disableClose: true, // Evita que se cierre al hacer clic fuera
      position: { top: '50%', left: '50%' },
      panelClass: 'centered-dialog',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result: Campaign) => {
      if (result) {
        result.id = this.campaigns.length + 1;
        this.campaigns.push(result);
        this.updateTable();
      }
    });
  }

  editCampaign(campaign: Campaign): void {
    const dialogRef = this.dialog.open(FormularioComponent, {
      width: '500px',
      height: 'auto', // Ajusta el ancho según necesites
      disableClose: true, // Evita que se cierre al hacer clic fuera
      position: { top: '50%', left: '50%' },
      panelClass: 'centered-dialog',
      data: { ...campaign },
    });

    dialogRef.afterClosed().subscribe((updatedCampaign: Campaign) => {
      if (updatedCampaign) {
        const index = this.campaigns.findIndex((c) => c.id === updatedCampaign.id);
        if (index !== -1) {
          this.campaigns[index] = updatedCampaign; 
        this.updateTable();
        }
      }
    });
  }

  deleteCampaign(campaign: Campaign): void {
    this.campaigns = this.campaigns.filter((c) => c.id !== campaign.id);
    this.updateTable();
  }

}
