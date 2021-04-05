import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { finalize } from 'rxjs/operators';
import { Device, DeviceOnlineStatus } from '@app/model/device';
import { DeviceStore } from '@app/providers/device';
import { AdminService } from '@app/services/admin';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable, Subscription } from 'rxjs';

const ELEMENT_DATA: Device[] = [
  {
    mac: 'macadd',
    uuid: 'uuid',
    deviceName: 'test',
    deviceType: 'string',
    deviceSubType: 'string',
    firmwareVersion: ' string',
    domain: 'string',
    reservedDomain: 'string',
    userId: 'string',
    status: DeviceOnlineStatus.UNKNOWN
  },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['deviceId', 'network', 'status'];
  dataSource = new MatTableDataSource<Device>(ELEMENT_DATA);
  private _autoUpdateSubscription: Subscription = null;

  //private autoDeviceUpdate = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private deviceStore: DeviceStore) {}
  ngOnInit(): void {
    // Update the device list once
    this.deviceStore.devices.subscribe((devices) => (this.dataSource.data = devices));
  }

  onAutodeviceUpdate(e: MatSlideToggleChange) {
    if (e.checked === true) {
      if (this._autoUpdateSubscription !== null) this._autoUpdateSubscription.unsubscribe();
      this._autoUpdateSubscription = this.deviceStore.deviceUpdates.subscribe(
        (devices) => (this.dataSource.data = devices)
      );
    } else {
      if (this._autoUpdateSubscription !== null) this._autoUpdateSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}