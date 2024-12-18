import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { FormularioComponent } from './formulario/formulario.component';

/**
 * Interfaz que representa una Campaña.
 */
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
  /**
   * Lista de campañas que se mostrarán en la tabla.
   */
  campaigns: Campaign[] = [];

  /**
   * Objeto para almacenar los valores de los filtros.
   */
  filters = { name: '', createdAt: '', active: null };

  /**
   * Columnas que se mostrarán en la tabla.
   */
  displayedColumns: string[] = ['name', 'createdAt', 'active', 'actions'];

  /**
   * Fuente de datos para la tabla.
   */
  dataSource = new MatTableDataSource<Campaign>();

  /**
   * Paginador para la tabla.
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) {}

  /**
   * Hook de ciclo de vida que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.updateTable();
  }

  /**
   * Actualiza los datos de la tabla y configura el paginador.
   */
  updateTable(): void {
    this.dataSource.data = [...this.campaigns];
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Aplica los filtros a los datos de la tabla.
   */
  applyFilters(): void {
    const filteredData = this.campaigns.filter((campaign) => {
      const matchesName = !this.filters.name || campaign.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchesDate = !this.filters.createdAt || campaign.createdAt === this.filters.createdAt;

      const filterActive = this.filters.active === null || this.filters.active === '' 
        ? null 
        : this.filters.active === 'true';
      const matchesActive = filterActive === null || campaign.active === filterActive;

      return matchesName && matchesDate && matchesActive;
    });

    this.dataSource.data = filteredData;
  }

  /**
   * Restablece todos los filtros a sus valores predeterminados y actualiza la tabla.
   */
  resetFilters(): void {
    this.filters = { name: '', createdAt: '', active: null };
    this.updateTable();
  }

  /**
   * Abre un cuadro de diálogo para agregar una nueva campaña.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(FormularioComponent, {
      width: '500px',
      height: 'auto',
      disableClose: true,
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

  /**
   * Abre un cuadro de diálogo para editar una campaña existente.
   * @param campaign La campaña a editar.
   */
  editCampaign(campaign: Campaign): void {
    const dialogRef = this.dialog.open(FormularioComponent, {
      width: '500px',
      height: 'auto',
      disableClose: true,
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

  /**
   * Elimina una campaña de la lista.
   * @param campaign La campaña a eliminar.
   */
  deleteCampaign(campaign: Campaign): void {
    this.campaigns = this.campaigns.filter((c) => c.id !== campaign.id);
    this.updateTable();
  }
}
