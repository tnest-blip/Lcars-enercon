import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface BatchItem {
  id: number;
  priority: Priority;
  subPriority: number;
  folder: string;
  taskId: string;
  taskType: string;
  submissionTime: string;
  projectNumber: string;
  jobs: {
    total: number;
    forwarded: number;
    running: number;
    failed: number;
    cancelled: number;
    completed: number;
  };
  programVersion: string;
  user: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low:      { label: 'Low',      color: '#3b82f6' },
  medium:   { label: 'Medium',   color: '#22c55e' },
  high:     { label: 'High',     color: '#eab308' },
  critical: { label: 'Critical', color: '#ed2939' },
};

@Component({
  selector: 'app-batch-lists',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule, ButtonModule, InputTextModule, TextareaModule,
    SelectModule, CheckboxModule, DialogModule, SliderModule,
    TagModule, TooltipModule, IconFieldModule, InputIconModule, FormsModule,
  ],
  templateUrl: './batch-lists.html',
  styleUrl: './batch-lists.scss',
})
export class BatchListsComponent {
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  searchKeyword = '';
  selectedTaskType: string | null = null;
  selectedStatus: string | null = 'not_completed';
  itemsPerPage = 25;

  // Dialog state
  showAddDialog = false;
  newBatch = {
    directory: '',
    projectNumber: '',
    priority: 'low' as Priority,
    subPriority: 1,
    simulationTime: 8,
    simulateBatchfilesDirectly: false,
    loadSimulationProcessId: '',
    useLinuxSimulation: false,
    skipCalculatedSimulations: false,
    keepBatchFiles: false,
  };

  readonly priorityConfig = PRIORITY_CONFIG;

  taskTypeOptions = [
    { label: 'All Task Types',  value: null },
    { label: 'Load simulation', value: 'Load simulation' },
    { label: 'Ultimate loads',  value: 'Ultimate loads' },
    { label: 'Fatigue analysis',value: 'Fatigue analysis' },
  ];

  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Not completed', value: 'not_completed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
  ];

  pageSizeOptions = [
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  priorityOptions = [
    { label: 'Low',      value: 'low' },
    { label: 'Medium',   value: 'medium' },
    { label: 'High',     value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  subPriorityOptions = [1,2,3,4,5,6,7,8,9].map(n => ({ label: String(n), value: n }));

  readonly batches = signal<BatchItem[]>([
    {
      id: 1, priority: 'critical', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\Y\\WP_Yangsan\\Ver_Red_T1\\E-160_EP5_E3_R1\\E-160_EP5_E3-HST-120-FB-C-01\\A16_u07_Zeitreihen_Standort\\1.3.c=x_\\',
      taskId: '342b3cce-deb2-45cd-8ed2-304c5b91429c',
      taskType: 'Load simulation', submissionTime: '2026-03-16 05:17',
      projectNumber: '9200022626',
      jobs: { total: 60, forwarded: 60, running: 8, failed: 0, cancelled: 0, completed: 52 },
      programVersion: '', user: 'Rushabh Shah', status: 'running',
    },
    {
      id: 2, priority: 'critical', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\Y\\WP_Yangsan\\Ver_Red_T1\\E-160_EP5_E3_R1\\E-160_EP5_E3-HST-120-FB-C-01\\A16_u07_Zeitreihen_Standort\\1.3.c=x\\',
      taskId: '39c3162c-4182-4973-b994-b945cef07412',
      taskType: 'Load simulation', submissionTime: '2026-03-23 14:15',
      projectNumber: '9200022626',
      jobs: { total: 60, forwarded: 60, running: 0, failed: 0, cancelled: 0, completed: 0 },
      programVersion: '', user: 'Rushabh Shah', status: 'running',
    },
    {
      id: 3, priority: 'critical', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\P\\WP_Psilo_Koutsouri\\Ver_1\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A3_u05_Auswertung\\Ultimate_CLI_files\\ultimate_loads_analyses_Turmasuwertung_A3_u.json',
      taskId: 'bed6f16e-3f47-4af3-b31a-75e333639cc7',
      taskType: 'Ultimate loads', submissionTime: '2026-04-09 21:44',
      projectNumber: '9200016885',
      jobs: { total: 1, forwarded: 1, running: 0, failed: 0, cancelled: 0, completed: 0 },
      programVersion: '', user: 'Leonardo Oliveira Antunes', status: 'running',
    },
    {
      id: 4, priority: 'high', subPriority: 2,
      folder: 'b:\\SyAn\\WP\\Y\\WP_Yangsan\\Ver_Red_T2\\E-160_EP5_E3_R2\\E-160_EP5_E3-HST-120-FB-C-01\\A16_u07_Zeitreihen_Standort\\1.3.c=x\\',
      taskId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      taskType: 'Load simulation', submissionTime: '2026-04-12 08:30',
      projectNumber: '9200022626',
      jobs: { total: 45, forwarded: 45, running: 0, failed: 2, cancelled: 0, completed: 43 },
      programVersion: '2.1.4', user: 'Maria Schmidt', status: 'completed',
    },
    {
      id: 5, priority: 'high', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\K\\WP_Koutsouri\\Ver_2\\E-138_EP3_E4\\A5_u08_Auswertung\\fatigue_analysis_v2.json',
      taskId: 'f0e1d2c3-b4a5-6789-cdef-012345678901',
      taskType: 'Fatigue analysis', submissionTime: '2026-04-15 11:22',
      projectNumber: '9200016886',
      jobs: { total: 120, forwarded: 120, running: 5, failed: 0, cancelled: 0, completed: 115 },
      programVersion: '2.0.8', user: 'Hans Mueller', status: 'running',
    },
    {
      id: 6, priority: 'medium', subPriority: 3,
      folder: 'B:\\SyAn\\WP\\N\\WP_Nordic\\Ver_A\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A12_u04_Analysis\\load_cases_nordic_v3.json',
      taskId: 'c9d8e7f6-a5b4-3210-fedc-ba9876543210',
      taskType: 'Load simulation', submissionTime: '2026-04-18 09:05',
      projectNumber: '9200031142',
      jobs: { total: 200, forwarded: 200, running: 12, failed: 0, cancelled: 0, completed: 188 },
      programVersion: '2.2.0', user: 'Anna Lindqvist', status: 'running',
    },
    {
      id: 7, priority: 'medium', subPriority: 2,
      folder: 'b:\\SyAn\\WP\\G\\WP_Gulf\\Ver_Final\\E-126_EP3\\E-126_EP3-HST-95-FB-C-01\\A09_u03_Zeitreihen\\turbine_loads_gulf.json',
      taskId: '11223344-5566-7788-99aa-bbccddeeff00',
      taskType: 'Ultimate loads', submissionTime: '2026-04-20 16:47',
      projectNumber: '9200044210',
      jobs: { total: 88, forwarded: 88, running: 0, failed: 4, cancelled: 1, completed: 83 },
      programVersion: '2.1.4', user: 'Ahmed Al-Rashid', status: 'failed',
    },
    {
      id: 8, priority: 'medium', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\S\\WP_Santander\\Ver_B2\\E-160_EP5_E3\\E-160_EP5_E3-HST-120-FB-C-01\\A14_u06_Auswertung\\fatigue_santander.json',
      taskId: 'aabbccdd-eeff-0011-2233-445566778899',
      taskType: 'Fatigue analysis', submissionTime: '2026-04-22 07:30',
      projectNumber: '9200028873',
      jobs: { total: 55, forwarded: 55, running: 0, failed: 0, cancelled: 0, completed: 55 },
      programVersion: '2.0.8', user: 'Carlos Mendez', status: 'completed',
    },
    {
      id: 9, priority: 'low', subPriority: 4,
      folder: 'b:\\SyAn\\WP\\T\\WP_Taiwan\\Ver_3\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-02\\A07_u02_Zeitreihen\\offshore_tw_loads.json',
      taskId: 'deadbeef-cafe-babe-f00d-123456789abc',
      taskType: 'Load simulation', submissionTime: '2026-05-01 13:15',
      projectNumber: '9200055019',
      jobs: { total: 300, forwarded: 300, running: 0, failed: 0, cancelled: 3, completed: 297 },
      programVersion: '2.2.1', user: 'Wei Zhang', status: 'completed',
    },
    {
      id: 10, priority: 'low', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\M\\WP_Morocco\\Ver_1\\E-175_EP5_E3\\E-175_EP5_E3-HT-110-FC-C-01\\A02_u01_Setup\\initial_simulation_morocco.json',
      taskId: '09876543-2101-fedc-ba98-765432109876',
      taskType: 'Ultimate loads', submissionTime: '2026-05-03 10:00',
      projectNumber: '9200061234',
      jobs: { total: 24, forwarded: 24, running: 0, failed: 0, cancelled: 0, completed: 0 },
      programVersion: '', user: 'Fatima Benali', status: 'queued',
    },
    {
      id: 11, priority: 'low', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\P\\WP_Poland\\Ver_A1\\E-160_EP4_E3\\E-160_EP4_E3-HST-110-FB-B-02\\A11_u05_Auswertung\\fatigue_poland_offshore.json',
      taskId: 'f1e2d3c4-b5a6-9870-cdef-fedcba987654',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-05 08:45',
      projectNumber: '9200072341',
      jobs: { total: 76, forwarded: 76, running: 0, failed: 1, cancelled: 0, completed: 75 },
      programVersion: '2.1.4', user: 'Piotr Kowalski', status: 'completed',
    },
    {
      id: 12, priority: 'high', subPriority: 3,
      folder: 'B:\\SyAn\\WP\\J\\WP_Japan\\Ver_Final\\E-138_EP5_E3\\E-138_EP5_E3-ST-81-FB-C-01\\A08_u03_Zeitreihen\\japan_loads_final.json',
      taskId: '99887766-5544-3322-1100-ffeeddccbbaa',
      taskType: 'Load simulation', submissionTime: '2026-05-07 02:20',
      projectNumber: '9200083552',
      jobs: { total: 480, forwarded: 480, running: 22, failed: 0, cancelled: 0, completed: 458 },
      programVersion: '2.2.0', user: 'Yuki Tanaka', status: 'running',
    },
    {
      id: 13, priority: 'critical', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\A\\WP_Australia\\Ver_1\\E-175_EP5_E3\\E-175_EP5_E3-HT-120-FC-D-01\\A18_u09_Auswertung\\load_sim_australia_v1.json',
      taskId: 'a3f8c2e1-7b4d-4e9f-b2c5-d6e8f1a3b5c7',
      taskType: 'Load simulation', submissionTime: '2026-05-08 07:12',
      projectNumber: '9200091100',
      jobs: { total: 144, forwarded: 144, running: 14, failed: 0, cancelled: 0, completed: 130 },
      programVersion: '2.2.1', user: 'James Carter', status: 'running',
    },
    {
      id: 14, priority: 'high', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\C\\WP_Chile\\Ver_2\\E-160_EP5_E3\\E-160_EP5_E3-HST-110-FB-C-01\\A10_u04_Zeitreihen\\chile_offshore_loads.json',
      taskId: 'b7d2a4f6-3e8c-4a1b-9d5e-c2f4a6b8d0e2',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-09 10:45',
      projectNumber: '9200092310',
      jobs: { total: 96, forwarded: 96, running: 0, failed: 0, cancelled: 0, completed: 96 },
      programVersion: '2.1.4', user: 'Sofia Herrera', status: 'completed',
    },
    {
      id: 15, priority: 'medium', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\I\\WP_India\\Ver_A\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-01\\A06_u02_Analysis\\ultimate_india_v2.json',
      taskId: 'c1e3a5b7-9d4f-4c2e-a8b6-d0f2c4e6a8b0',
      taskType: 'Ultimate loads', submissionTime: '2026-05-10 14:30',
      projectNumber: '9200093421',
      jobs: { total: 72, forwarded: 72, running: 0, failed: 3, cancelled: 0, completed: 69 },
      programVersion: '2.2.0', user: 'Priya Sharma', status: 'failed',
    },
    {
      id: 16, priority: 'low', subPriority: 3,
      folder: 'b:\\SyAn\\WP\\B\\WP_Brazil\\Ver_Final\\E-126_EP3\\E-126_EP3-HST-95-FB-C-01\\A07_u03_Zeitreihen\\brazil_loads_final.json',
      taskId: 'd4f6b8e0-a2c4-4d6e-b8a0-e2f4b6d8a0c2',
      taskType: 'Load simulation', submissionTime: '2026-05-11 08:00',
      projectNumber: '9200094532',
      jobs: { total: 180, forwarded: 180, running: 0, failed: 0, cancelled: 2, completed: 178 },
      programVersion: '2.2.1', user: 'Lucas Oliveira', status: 'completed',
    },
    {
      id: 17, priority: 'critical', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\U\\WP_USA_Texas\\Ver_3\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FC-D-01\\A15_u07_Auswertung\\texas_fatigue_v3.json',
      taskId: 'e5a7c9b1-d3e5-4f7a-9b3d-f5a7c9e1b3d5',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-12 03:20',
      projectNumber: '9200095643',
      jobs: { total: 256, forwarded: 256, running: 31, failed: 0, cancelled: 0, completed: 225 },
      programVersion: '2.2.0', user: 'Michael Johnson', status: 'running',
    },
    {
      id: 18, priority: 'high', subPriority: 4,
      folder: 'b:\\SyAn\\WP\\F\\WP_France\\Ver_B\\E-160_EP4_E3\\E-160_EP4_E3-HST-110-FB-B-02\\A09_u04_Zeitreihen\\france_offshore_v2.json',
      taskId: 'f6b8d0a2-e4f6-4a8c-b0d2-a4c6e8f0b2d4',
      taskType: 'Load simulation', submissionTime: '2026-05-13 11:55',
      projectNumber: '9200096754',
      jobs: { total: 110, forwarded: 110, running: 0, failed: 0, cancelled: 0, completed: 0 },
      programVersion: '', user: 'Pierre Dupont', status: 'queued',
    },
    {
      id: 19, priority: 'medium', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\S\\WP_Sweden\\Ver_1\\E-175_EP5_E3\\E-175_EP5_E3-HT-110-FC-C-01\\A04_u01_Setup\\sweden_loads_v1.json',
      taskId: 'a1c3e5f7-b9d1-4e3a-c7e9-b1d3f5a7c9e1',
      taskType: 'Ultimate loads', submissionTime: '2026-05-14 16:10',
      projectNumber: '9200097865',
      jobs: { total: 48, forwarded: 48, running: 0, failed: 0, cancelled: 0, completed: 48 },
      programVersion: '2.1.4', user: 'Erik Johansson', status: 'completed',
    },
    {
      id: 20, priority: 'low', subPriority: 2,
      folder: 'b:\\SyAn\\WP\\K\\WP_Kazakhstan\\Ver_A\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A05_u02_Analysis\\kaz_fatigue_v1.json',
      taskId: 'b2d4f6a8-c0e2-4f4b-d6f8-c2e4a6b8d0f2',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-15 09:30',
      projectNumber: '9200098976',
      jobs: { total: 64, forwarded: 64, running: 7, failed: 0, cancelled: 0, completed: 57 },
      programVersion: '2.2.1', user: 'Asel Nurmagambetova', status: 'running',
    },
    {
      id: 21, priority: 'high', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\N\\WP_Netherlands\\Ver_2\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A13_u06_Auswertung\\netherlands_loads.json',
      taskId: 'c3e5a7b9-d1f3-4e5c-e7a9-d3f5b7c9e1a3',
      taskType: 'Load simulation', submissionTime: '2026-05-16 13:45',
      projectNumber: '9200100087',
      jobs: { total: 320, forwarded: 320, running: 0, failed: 1, cancelled: 0, completed: 319 },
      programVersion: '2.2.0', user: 'Lars van den Berg', status: 'completed',
    },
    {
      id: 22, priority: 'medium', subPriority: 3,
      folder: 'b:\\SyAn\\WP\\E\\WP_Egypt\\Ver_1\\E-160_EP5_E3\\E-160_EP5_E3-HST-120-FB-C-01\\A08_u03_Zeitreihen\\egypt_sim_v1.json',
      taskId: 'd4f6b8c0-e2a4-4f6d-f8b0-e4a6c8d0f2b4',
      taskType: 'Ultimate loads', submissionTime: '2026-05-17 06:20',
      projectNumber: '9200101198',
      jobs: { total: 88, forwarded: 88, running: 0, failed: 5, cancelled: 2, completed: 81 },
      programVersion: '2.1.4', user: 'Omar Hassan', status: 'failed',
    },
    {
      id: 23, priority: 'low', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\C\\WP_Canada\\Ver_B\\E-138_EP5_E3\\E-138_EP5_E3-ST-81-FB-C-01\\A03_u01_Setup\\canada_fatigue_v2.json',
      taskId: 'e5a7c9d1-f3b5-4a7e-a9c1-f5b7d9e1a3c5',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-18 18:05',
      projectNumber: '9200102309',
      jobs: { total: 150, forwarded: 150, running: 0, failed: 0, cancelled: 0, completed: 150 },
      programVersion: '2.2.1', user: 'Emma Wilson', status: 'completed',
    },
    {
      id: 24, priority: 'critical', subPriority: 3,
      folder: 'b:\\SyAn\\WP\\R\\WP_Romania\\Ver_1\\E-175_EP5_E3\\E-175_EP5_E3-HT-120-FC-D-01\\A17_u08_Auswertung\\romania_loads_v1.json',
      taskId: 'f6b8d0e2-a4c6-4b8f-b0d2-a6c8e0f2b4d6',
      taskType: 'Load simulation', submissionTime: '2026-05-19 04:50',
      projectNumber: '9200103410',
      jobs: { total: 400, forwarded: 400, running: 45, failed: 0, cancelled: 0, completed: 355 },
      programVersion: '2.2.0', user: 'Andrei Popescu', status: 'running',
    },
    {
      id: 25, priority: 'high', subPriority: 3,
      folder: 'B:\\SyAn\\WP\\T\\WP_Turkey\\Ver_A\\E-160_EP4_E3\\E-160_EP4_E3-HST-110-FB-B-01\\A11_u05_Auswertung\\turkey_ultimate_v1.json',
      taskId: 'a7b9c1d3-e5f7-4a9b-c3e5-a7b9d1e3f5a7',
      taskType: 'Ultimate loads', submissionTime: '2026-05-20 12:15',
      projectNumber: '9200104521',
      jobs: { total: 36, forwarded: 36, running: 0, failed: 0, cancelled: 0, completed: 0 },
      programVersion: '', user: 'Mehmet Yilmaz', status: 'queued',
    },
    {
      id: 26, priority: 'medium', subPriority: 4,
      folder: 'b:\\SyAn\\WP\\G\\WP_Greece\\Ver_2\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A06_u02_Zeitreihen\\greece_fatigue_v2.json',
      taskId: 'b8c0d2e4-f6a8-4b0c-d4f6-b8c0e2f4a6b8',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-21 08:40',
      projectNumber: '9200105632',
      jobs: { total: 92, forwarded: 92, running: 0, failed: 0, cancelled: 0, completed: 92 },
      programVersion: '2.1.4', user: 'Nikos Papadopoulos', status: 'completed',
    },
    {
      id: 27, priority: 'low', subPriority: 4,
      folder: 'B:\\SyAn\\WP\\A\\WP_Argentina\\Ver_Final\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A14_u07_Analysis\\argentina_v2.json',
      taskId: 'c9d1e3f5-a7b9-4c1d-e5f7-c9d1f3a5b7c9',
      taskType: 'Load simulation', submissionTime: '2026-05-22 15:25',
      projectNumber: '9200106743',
      jobs: { total: 210, forwarded: 210, running: 0, failed: 2, cancelled: 1, completed: 207 },
      programVersion: '2.2.1', user: 'Valentina Cruz', status: 'completed',
    },
    {
      id: 28, priority: 'critical', subPriority: 2,
      folder: 'b:\\SyAn\\WP\\N\\WP_Norway\\Ver_3\\E-175_EP5_E3\\E-175_EP5_E3-HT-120-FC-C-01\\A19_u09_Auswertung\\norway_offshore_v3.json',
      taskId: 'd0e2f4a6-b8c0-4d2e-f6a8-d0e2a4f6b8d0',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-23 02:10',
      projectNumber: '9200107854',
      jobs: { total: 512, forwarded: 512, running: 58, failed: 0, cancelled: 0, completed: 454 },
      programVersion: '2.2.0', user: 'Ingrid Haugen', status: 'running',
    },
    {
      id: 29, priority: 'high', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\S\\WP_Spain\\Ver_B\\E-160_EP5_E3\\E-160_EP5_E3-HST-120-FB-C-01\\A10_u04_Zeitreihen\\spain_loads_vB.json',
      taskId: 'e1f3a5b7-c9d1-4e3f-a7b9-e1f3b5d7a9c1',
      taskType: 'Ultimate loads', submissionTime: '2026-05-24 11:00',
      projectNumber: '9200108965',
      jobs: { total: 68, forwarded: 68, running: 0, failed: 0, cancelled: 0, completed: 68 },
      programVersion: '2.1.4', user: 'Isabella Garcia', status: 'completed',
    },
    {
      id: 30, priority: 'medium', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\P\\WP_Portugal\\Ver_1\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-02\\A05_u02_Analysis\\portugal_sim_v1.json',
      taskId: 'f2a4b6c8-d0e2-4f4a-b8c0-f2a4d6e8b0c2',
      taskType: 'Load simulation', submissionTime: '2026-05-25 09:35',
      projectNumber: '9200110076',
      jobs: { total: 128, forwarded: 128, running: 9, failed: 0, cancelled: 0, completed: 119 },
      programVersion: '2.2.1', user: 'João Ferreira', status: 'running',
    },
    {
      id: 31, priority: 'low', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\D\\WP_Denmark\\Ver_A\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A07_u03_Auswertung\\denmark_fatigue_vA.json',
      taskId: 'a3b5c7d9-e1f3-4a5b-c7d9-a3b5e7f9c1d3',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-26 14:20',
      projectNumber: '9200111187',
      jobs: { total: 80, forwarded: 80, running: 0, failed: 6, cancelled: 0, completed: 74 },
      programVersion: '2.0.8', user: 'Søren Christensen', status: 'failed',
    },
    {
      id: 32, priority: 'critical', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\U\\WP_Ukraine\\Ver_2\\E-160_EP5_E3\\E-160_EP5_E3-HST-120-FB-C-01\\A16_u08_Zeitreihen\\ukraine_loads_v2.json',
      taskId: 'b4c6d8e0-f2a4-4b6c-d8e0-b4c6f8a0d2e4',
      taskType: 'Load simulation', submissionTime: '2026-05-27 05:55',
      projectNumber: '9200112298',
      jobs: { total: 200, forwarded: 200, running: 22, failed: 0, cancelled: 0, completed: 178 },
      programVersion: '2.2.0', user: 'Olena Kovalenko', status: 'running',
    },
    {
      id: 33, priority: 'high', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\H\\WP_Hungary\\Ver_1\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A04_u01_Setup\\hungary_ultimate_v1.json',
      taskId: 'c5d7e9f1-a3b5-4c7d-e9f1-c5d7a9f1b3e5',
      taskType: 'Ultimate loads', submissionTime: '2026-05-28 10:10',
      projectNumber: '9200113309',
      jobs: { total: 44, forwarded: 44, running: 0, failed: 0, cancelled: 0, completed: 44 },
      programVersion: '2.1.4', user: 'Gábor Kovács', status: 'completed',
    },
    {
      id: 34, priority: 'medium', subPriority: 2,
      folder: 'b:\\SyAn\\WP\\F\\WP_Finland\\Ver_B\\E-175_EP5_E3\\E-175_EP5_E3-HT-110-FC-C-01\\A12_u05_Auswertung\\finland_fatigue_vB.json',
      taskId: 'd6e8f0a2-b4c6-4d8e-f0a2-d6e8b0c2f4a6',
      taskType: 'Fatigue analysis', submissionTime: '2026-05-29 16:45',
      projectNumber: '9200114410',
      jobs: { total: 160, forwarded: 160, running: 18, failed: 0, cancelled: 0, completed: 142 },
      programVersion: '2.2.1', user: 'Mikael Virtanen', status: 'running',
    },
    {
      id: 35, priority: 'low', subPriority: 3,
      folder: 'B:\\SyAn\\WP\\C\\WP_Croatia\\Ver_1\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-01\\A03_u01_Analysis\\croatia_loads_v1.json',
      taskId: 'e7f9a1b3-c5d7-4e9f-a1b3-e7f9c1d3a5b7',
      taskType: 'Load simulation', submissionTime: '2026-05-30 07:30',
      projectNumber: '9200115521',
      jobs: { total: 56, forwarded: 56, running: 0, failed: 0, cancelled: 0, completed: 56 },
      programVersion: '2.2.0', user: 'Marko Horvat', status: 'completed',
    },
    {
      id: 36, priority: 'high', subPriority: 4,
      folder: 'b:\\SyAn\\WP\\B\\WP_Belgium\\Ver_A\\E-160_EP4_E3\\E-160_EP4_E3-HST-110-FB-B-01\\A10_u04_Zeitreihen\\belgium_sim_vA.json',
      taskId: 'f8a0b2c4-d6e8-4f0a-b2c4-f8a0d2e4b6c8',
      taskType: 'Ultimate loads', submissionTime: '2026-05-31 12:50',
      projectNumber: '9200116632',
      jobs: { total: 240, forwarded: 240, running: 0, failed: 0, cancelled: 4, completed: 236 },
      programVersion: '2.1.4', user: 'Thomas Dubois', status: 'completed',
    },
    {
      id: 37, priority: 'critical', subPriority: 3,
      folder: 'B:\\SyAn\\WP\\S\\WP_Scotland\\Ver_2\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A16_u08_Auswertung\\scotland_offshore_v2.json',
      taskId: 'a9b1c3d5-e7f9-4a1b-c3d5-a9b1e3f5c7d9',
      taskType: 'Fatigue analysis', submissionTime: '2026-06-01 04:15',
      projectNumber: '9200117743',
      jobs: { total: 384, forwarded: 384, running: 44, failed: 0, cancelled: 0, completed: 340 },
      programVersion: '2.2.0', user: 'Alistair MacLeod', status: 'running',
    },
    {
      id: 38, priority: 'medium', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\A\\WP_Austria\\Ver_Final\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A08_u03_Zeitreihen\\austria_loads_final.json',
      taskId: 'b0c2d4e6-f8a0-4b2c-d4e6-b0c2f4a6d8e0',
      taskType: 'Load simulation', submissionTime: '2026-06-02 10:40',
      projectNumber: '9200118854',
      jobs: { total: 100, forwarded: 100, running: 0, failed: 2, cancelled: 0, completed: 98 },
      programVersion: '2.2.1', user: 'Klaus Bauer', status: 'completed',
    },
    {
      id: 39, priority: 'low', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\I\\WP_Ireland\\Ver_1\\E-175_EP5_E3\\E-175_EP5_E3-HT-120-FC-D-01\\A09_u04_Auswertung\\ireland_fatigue_v1.json',
      taskId: 'c1d3e5f7-a9b1-4c3d-e5f7-c1d3a5e7f9b1',
      taskType: 'Fatigue analysis', submissionTime: '2026-06-03 08:25',
      projectNumber: '9200119965',
      jobs: { total: 72, forwarded: 72, running: 0, failed: 0, cancelled: 0, completed: 0 },
      programVersion: '', user: 'Ciarán Murphy', status: 'queued',
    },
    {
      id: 40, priority: 'high', subPriority: 1,
      folder: 'b:\\SyAn\\WP\\N\\WP_NewZealand\\Ver_A\\E-160_EP5_E3\\E-160_EP5_E3-HST-120-FB-C-01\\A11_u05_Zeitreihen\\nz_loads_vA.json',
      taskId: 'd2e4f6a8-b0c2-4d4e-f6a8-d2e4b6c8f0a2',
      taskType: 'Ultimate loads', submissionTime: '2026-06-04 13:00',
      projectNumber: '9200121076',
      jobs: { total: 136, forwarded: 136, running: 15, failed: 0, cancelled: 0, completed: 121 },
      programVersion: '2.2.0', user: 'Sarah Thompson', status: 'running',
    },
    {
      id: 41, priority: 'medium', subPriority: 4,
      folder: 'B:\\SyAn\\WP\\M\\WP_Mexico\\Ver_2\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-02\\A07_u03_Analysis\\mexico_fatigue_v2.json',
      taskId: 'e3f5a7b9-c1d3-4e5f-a7b9-e3f5c7d9a1b3',
      taskType: 'Fatigue analysis', submissionTime: '2026-06-05 06:35',
      projectNumber: '9200122187',
      jobs: { total: 192, forwarded: 192, running: 0, failed: 0, cancelled: 0, completed: 192 },
      programVersion: '2.1.4', user: 'Diego Ramirez', status: 'completed',
    },
    {
      id: 42, priority: 'critical', subPriority: 2,
      folder: 'b:\\SyAn\\WP\\V\\WP_Vietnam\\Ver_1\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A14_u07_Auswertung\\vietnam_loads_v1.json',
      taskId: 'f4a6b8c0-d2e4-4f6a-b8c0-f4a6d8e0b2c4',
      taskType: 'Load simulation', submissionTime: '2026-06-06 09:20',
      projectNumber: '9200123298',
      jobs: { total: 288, forwarded: 288, running: 32, failed: 0, cancelled: 0, completed: 256 },
      programVersion: '2.2.1', user: 'Nguyen Van An', status: 'running',
    },
    {
      id: 43, priority: 'low', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\C\\WP_Czech\\Ver_B\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A06_u02_Zeitreihen\\czech_ultimate_vB.json',
      taskId: 'a5b7c9d1-e3f5-4a7b-c9d1-a5b7e9f1c3d5',
      taskType: 'Ultimate loads', submissionTime: '2026-06-07 14:55',
      projectNumber: '9200124409',
      jobs: { total: 56, forwarded: 56, running: 0, failed: 1, cancelled: 0, completed: 55 },
      programVersion: '2.2.0', user: 'Pavel Novak', status: 'completed',
    },
    {
      id: 44, priority: 'high', subPriority: 3,
      folder: 'b:\\SyAn\\WP\\S\\WP_Slovakia\\Ver_1\\E-160_EP4_E3\\E-160_EP4_E3-HST-110-FB-B-02\\A08_u03_Auswertung\\slovakia_fatigue_v1.json',
      taskId: 'b6c8d0e2-f4a6-4b8c-d0e2-b6c8f0a2d4e6',
      taskType: 'Fatigue analysis', submissionTime: '2026-06-08 07:10',
      projectNumber: '9200125510',
      jobs: { total: 168, forwarded: 168, running: 19, failed: 0, cancelled: 0, completed: 149 },
      programVersion: '2.2.1', user: 'Martin Kovac', status: 'running',
    },
    {
      id: 45, priority: 'medium', subPriority: 3,
      folder: 'B:\\SyAn\\WP\\L\\WP_Lithuania\\Ver_A\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-01\\A05_u02_Analysis\\lithuania_loads_vA.json',
      taskId: 'c7d9e1f3-a5b7-4c9d-e1f3-c7d9a1f3b5e7',
      taskType: 'Load simulation', submissionTime: '2026-06-09 11:45',
      projectNumber: '9200126621',
      jobs: { total: 104, forwarded: 104, running: 0, failed: 0, cancelled: 0, completed: 104 },
      programVersion: '2.2.0', user: 'Tomas Kazlauskas', status: 'completed',
    },
    {
      id: 46, priority: 'low', subPriority: 4,
      folder: 'b:\\SyAn\\WP\\L\\WP_Latvia\\Ver_2\\E-175_EP5_E3\\E-175_EP5_E3-HT-110-FC-C-01\\A10_u04_Zeitreihen\\latvia_fatigue_v2.json',
      taskId: 'd8e0f2a4-b6c8-4d0e-f2a4-d8e0b2c4f6a8',
      taskType: 'Fatigue analysis', submissionTime: '2026-06-10 04:30',
      projectNumber: '9200127732',
      jobs: { total: 80, forwarded: 80, running: 0, failed: 3, cancelled: 1, completed: 76 },
      programVersion: '2.1.4', user: 'Jānis Bērziņš', status: 'failed',
    },
    {
      id: 47, priority: 'critical', subPriority: 1,
      folder: 'B:\\SyAn\\WP\\E\\WP_Estonia\\Ver_1\\E-160_EP5_E3\\E-160_EP5_E3-HST-120-FB-C-01\\A13_u06_Auswertung\\estonia_loads_v1.json',
      taskId: 'e9f1a3b5-c7d9-4e1f-a3b5-e9f1c3d5a7b9',
      taskType: 'Load simulation', submissionTime: '2026-06-11 08:15',
      projectNumber: '9200128843',
      jobs: { total: 336, forwarded: 336, running: 38, failed: 0, cancelled: 0, completed: 298 },
      programVersion: '2.2.1', user: 'Kaia Mägi', status: 'running',
    },
    {
      id: 48, priority: 'high', subPriority: 2,
      folder: 'b:\\SyAn\\WP\\S\\WP_Serbia\\Ver_A\\E-138_EP3_E3\\E-138_EP3_E3-ST-81-FB-C-01\\A04_u01_Setup\\serbia_ultimate_vA.json',
      taskId: 'f0a2b4c6-d8e0-4f2a-b4c6-f0a2d4e6b8c0',
      taskType: 'Ultimate loads', submissionTime: '2026-06-12 15:00',
      projectNumber: '9200129954',
      jobs: { total: 48, forwarded: 48, running: 0, failed: 0, cancelled: 0, completed: 48 },
      programVersion: '2.2.0', user: 'Nikola Đorđević', status: 'completed',
    },
    {
      id: 49, priority: 'medium', subPriority: 2,
      folder: 'B:\\SyAn\\WP\\B\\WP_Bulgaria\\Ver_2\\E-175_EP4_E3\\E-175_EP4_E3-HT-100-FB-D-01\\A11_u05_Auswertung\\bulgaria_fatigue_v2.json',
      taskId: 'a1b3c5d7-e9f1-4a3b-c5d7-a1b3e5f7c9d1',
      taskType: 'Fatigue analysis', submissionTime: '2026-06-13 10:30',
      projectNumber: '9200131065',
      jobs: { total: 224, forwarded: 224, running: 25, failed: 0, cancelled: 0, completed: 199 },
      programVersion: '2.2.1', user: 'Georgi Petrov', status: 'running',
    },
    {
      id: 50, priority: 'low', subPriority: 3,
      folder: 'b:\\SyAn\\WP\\S\\WP_Slovenia\\Ver_Final\\E-138_EP4_E3\\E-138_EP4_E3-ST-81-FB-D-02\\A06_u02_Zeitreihen\\slovenia_loads_final.json',
      taskId: 'b2c4d6e8-f0a2-4b4c-d6e8-b2c4f6a8d0e2',
      taskType: 'Load simulation', submissionTime: '2026-06-14 07:45',
      projectNumber: '9200132176',
      jobs: { total: 120, forwarded: 120, running: 0, failed: 0, cancelled: 0, completed: 120 },
      programVersion: '2.2.0', user: 'Andrej Novak', status: 'completed',
    },
  ]);

  get filteredBatches(): BatchItem[] {
    const kw = this.searchKeyword.toLowerCase();
    const tt = this.selectedTaskType;
    const st = this.selectedStatus;
    return this.batches().filter(b => {
      if (kw && !b.folder.toLowerCase().includes(kw)
             && !b.taskId.toLowerCase().includes(kw)
             && !b.user.toLowerCase().includes(kw)
             && !b.projectNumber.toLowerCase().includes(kw)) return false;
      if (tt && b.taskType !== tt) return false;
      if (st === 'not_completed' && b.status === 'completed') return false;
      if (st === 'completed' && b.status !== 'completed') return false;
      if (st === 'failed' && b.status !== 'failed') return false;
      return true;
    });
  }

  get summaryBatchlists() {
    const list = this.batches();
    return {
      total: list.length,
      running: list.filter(b => b.status === 'running').length,
      completed: list.filter(b => b.status === 'completed').length,
    };
  }

  get summaryJobs() {
    return this.batches().reduce((acc, b) => ({
      total: acc.total + b.jobs.total,
      forwarded: acc.forwarded + b.jobs.forwarded,
      running: acc.running + b.jobs.running,
      failed: acc.failed + b.jobs.failed,
      cancelled: acc.cancelled + b.jobs.cancelled,
      completed: acc.completed + b.jobs.completed,
    }), { total: 0, forwarded: 0, running: 0, failed: 0, cancelled: 0, completed: 0 });
  }

  openAddDialog() {
    this.showAddDialog = true;
  }

  closeAddDialog() {
    this.showAddDialog = false;
  }

  scheduleBatchlist() {
    const dir = this.newBatch.directory.trim();
    if (!dir) return;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const submissionTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    const list = this.batches();
    const newItem: BatchItem = {
      id: (list[list.length - 1]?.id ?? 0) + 1,
      priority: this.newBatch.priority,
      subPriority: this.newBatch.subPriority,
      folder: dir,
      taskId: uuid,
      taskType: 'Load simulation',
      submissionTime,
      projectNumber: this.newBatch.projectNumber.trim() || '–',
      jobs: { total: 0, forwarded: 0, running: 0, failed: 0, cancelled: 0, completed: 0 },
      programVersion: '',
      user: 'Current User',
      status: 'queued',
    };

    this.batches.update(list => [...list, newItem]);
    this.showAddDialog = false;
    this.newBatch = {
      directory: '',
      projectNumber: '',
      priority: 'low',
      subPriority: 1,
      simulationTime: 8,
      simulateBatchfilesDirectly: false,
      loadSimulationProcessId: '',
      useLinuxSimulation: false,
      skipCalculatedSimulations: false,
      keepBatchFiles: false,
    };
  }

  openJobs(batchId: number) {
    this.router.navigate(['/jobs', batchId]);
  }

  getPriorityColor(priority: Priority): string {
    return PRIORITY_CONFIG[priority].color;
  }

  getPriorityLabel(priority: Priority): string {
    return PRIORITY_CONFIG[priority].label;
  }
}
