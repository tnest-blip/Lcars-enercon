import {
  Component, ChangeDetectionStrategy, inject, signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

export type JobStatus = 'running' | 'completed' | 'forwarded';
export type JobPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Job {
  id: number;
  selected: boolean;
  name: string;
  status: JobStatus;
  priority: JobPriority;
  computingTime: string | null;
  simulationStart: string | null;
  simulationEnd: string | null;
  progress: number;
}

const BASE_PATHS: Record<number, string> = {
  1:  'b:\\SyAn\\WP\\Y\\WP_Yangsan\\Ver_Red_T1\\E-160_EP5_E3_R1\\E-160_EP5_E3-HST-120-FB-C-01\\A16_u07_Zeitreihen_Standort\\1.3.c=x\\',
  2:  'b:\\SyAn\\WP\\Y\\WP_Yangsan\\Ver_Red_T1\\E-160_EP5_E3_R1\\E-160_EP5_E3-HST-120-FB-C-01\\A16_u07_Zeitreihen_Standort\\1.3.c=x\\',
  3:  'B:\\SyAn\\WP\\P\\WP_Psilo_Koutsouri\\Ver_1\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A3_u05_Auswertung\\Ultimate_CLI_files\\',
  4:  'b:\\SyAn\\WP\\Y\\WP_Yangsan\\Ver_Red_T2\\E-160_EP5_E3_R2\\E-160_EP5_E3-HST-120-FB-C-01\\A16_u07_Zeitreihen_Standort\\1.3.c=x\\',
  5:  'B:\\SyAn\\WP\\K\\WP_Koutsouri\\Ver_2\\E-138_EP3_E4\\A5_u08_Auswertung\\',
  6:  'B:\\SyAn\\WP\\N\\WP_Nordic\\Ver_A\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A12_u04_Analysis\\',
  7:  'b:\\SyAn\\WP\\G\\WP_Gulf\\Ver_Final\\E-126_EP3\\E-126_EP3-HST-95-FB-C-01\\A09_u03_Zeitreihen\\',
  8:  'B:\\SyAn\\WP\\S\\WP_Santander\\Ver_B2\\E-160_EP5_E3\\E-160_EP5_E3-HST-120-FB-C-01\\A14_u06_Auswertung\\',
  9:  'b:\\SyAn\\WP\\T\\WP_Taiwan\\Ver_3\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-02\\A07_u02_Zeitreihen\\',
  10: 'B:\\SyAn\\WP\\M\\WP_Morocco\\Ver_1\\E-175_EP5_E3\\E-175_EP5_E3-HT-110-FC-C-01\\A02_u01_Setup\\',
  11: 'b:\\SyAn\\WP\\P\\WP_Poland\\Ver_A1\\E-160_EP4_E3\\E-160_EP4_E3-HST-110-FB-B-02\\A11_u05_Auswertung\\',
  12: 'B:\\SyAn\\WP\\J\\WP_Japan\\Ver_Final\\E-138_EP5_E3\\E-138_EP5_E3-ST-81-FB-C-01\\A08_u03_Zeitreihen\\',
};

const WIND_CODES = [
  'w00103_c=x', 'w00109_c=x', 'w00111_c=x', 'w00119_c=x', 'w00205_c=x',
  'w00215_c=x', 'w00307_c=x', 'w00315_c=x', 'w00409_c=x', 'w00415_c=x',
  'w00505_c=x', 'w00511_c=x', 'w00601_c=x', 'w00609_c=x', 'w00703_c=x',
  'w00711_c=x', 'w00801_c=x', 'w00811_c=x', 'w00903_c=x', 'w00909_c=x',
  'w01001_c=x', 'w01103_c=x', 'w01207_c=x', 'w01309_c=x', 'w01405_c=x',
];

function fakeDate(minsAgo: number): string {
  const d = new Date(Date.now() - minsAgo * 60000);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

function now(): string { return fakeDate(0); }

const PRIORITIES: JobPriority[] = ['critical', 'high', 'medium', 'low'];

// Pre-seeded state: first 8 completed, next 10 running at different progress, rest forwarded
function makeJobs(batchId: number): Job[] {
  const base = BASE_PATHS[batchId] ?? BASE_PATHS[1];
  const prefix = base + '1.3_';
  return WIND_CODES.map((code, i) => {
    const priority = PRIORITIES[i % 3];
    if (i < 8) {
      const start = fakeDate(90 - i * 8);
      const end   = fakeDate(30 - i * 2);
      return {
        id: i + 1, selected: false, name: prefix + code,
        status: 'completed' as JobStatus, priority, progress: 100,
        computingTime: `${(1.2 + i * 0.3).toFixed(1)}h`,
        simulationStart: start, simulationEnd: end,
      };
    }
    if (i < 18) {
      const pct = Math.max(15, 85 - (i - 8) * 7);
      return {
        id: i + 1, selected: false, name: prefix + code,
        status: 'running' as JobStatus, priority, progress: pct,
        computingTime: null,
        simulationStart: fakeDate(20 - (i - 8) * 2), simulationEnd: null,
      };
    }
    return {
      id: i + 1, selected: false, name: prefix + code,
      status: 'forwarded' as JobStatus, priority, progress: 0,
      computingTime: null, simulationStart: null, simulationEnd: null,
    };
  });
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule, ButtonModule, InputTextModule, SelectModule,
    CheckboxModule, TooltipModule, IconFieldModule, InputIconModule,
    FormsModule, RouterLink, TitleCasePipe,
  ],
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss',
})
export class JobsComponent {
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly batchId = Number(this.route.snapshot.paramMap.get('id') ?? 1);
  readonly batchFolder = BASE_PATHS[this.batchId] ?? BASE_PATHS[1];
  readonly batchLabel = this.batchFolder.split('\\').filter(Boolean).slice(-2).join('\\');

  jobs = signal<Job[]>(makeJobs(this.batchId));
  currentPage = 0;

  private _searchKeyword = '';
  get searchKeyword() { return this._searchKeyword; }
  set searchKeyword(v: string) { this._searchKeyword = v; this.currentPage = 0; }

  private _selectedFilter: string | null = null;
  get selectedFilter() { return this._selectedFilter; }
  set selectedFilter(v: string | null) { this._selectedFilter = v; this.currentPage = 0; }

  private _itemsPerPage = 25;
  get itemsPerPage() { return this._itemsPerPage; }
  set itemsPerPage(v: number) { this._itemsPerPage = v; this.currentPage = 0; }

  errorPanelOpen = signal(false);

  filterOptions = [
    { label: 'All Jobs',   value: null },
    { label: 'Running',    value: 'running' },
    { label: 'Completed',  value: 'completed' },
    { label: 'Forwarded',  value: 'forwarded' },
  ];

  pageSizeOptions = [
    { label: '25',  value: 25 },
    { label: '50',  value: 50 },
    { label: '100', value: 100 },
  ];

  get filteredJobs(): Job[] {
    const kw = this.searchKeyword.toLowerCase();
    const f  = this.selectedFilter;
    return this.jobs().filter(j => {
      if (kw && !j.name.toLowerCase().includes(kw)) return false;
      if (f  && j.status !== f) return false;
      return true;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredJobs.length / this.itemsPerPage));
  }

  get safePage(): number {
    return Math.min(this.currentPage, this.totalPages - 1);
  }

  get pagedJobs(): Job[] {
    const start = this.safePage * this.itemsPerPage;
    return this.filteredJobs.slice(start, start + this.itemsPerPage);
  }

  get pageFrom(): number { return this.safePage * this.itemsPerPage + 1; }
  get pageTo(): number   { return Math.min((this.safePage + 1) * this.itemsPerPage, this.filteredJobs.length); }

  prevPage() { if (this.safePage > 0) this.currentPage = this.safePage - 1; }
  nextPage() { if (this.safePage < this.totalPages - 1) this.currentPage = this.safePage + 1; }

  get allSelected(): boolean {
    const list = this.jobs();
    return list.length > 0 && list.every(j => j.selected);
  }

  toggleAll(checked: boolean) {
    this.jobs.update(jobs => jobs.map(j => ({ ...j, selected: checked })));
  }

  toggleJob(id: number, checked: boolean) {
    this.jobs.update(jobs => jobs.map(j => j.id === id ? { ...j, selected: checked } : j));
  }

  goBack() { this.router.navigate(['/']); }

  toggleErrorPanel() { this.errorPanelOpen.update(v => !v); }
}
