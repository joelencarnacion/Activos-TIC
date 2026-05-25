import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ImprimirService {
    private data: any;

    setData(data: any) {
      this.data = data;
    }
    getData() {
      return this.data;
    }
}
