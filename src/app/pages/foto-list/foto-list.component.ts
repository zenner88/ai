import { GlobalService } from '../../global.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-foto-list',
  templateUrl: './foto-list.component.html',
  styleUrls: ['./foto-list.component.scss']
})
export class FotoListComponent implements OnInit {
  haystackLength: any;
  haystackList: any = [];
  errorMessage: any;
  potraitLength: any;
  potraitList: any = [];

  constructor(private http: HttpClient, private global: GlobalService) { }

  ngOnInit(): void {
    // Call Haystack LIst Foto 
    this.http.get<any>(this.global.address+this.global.list_haystack).subscribe({
      next: data1 => {
        this.haystackLength = data1.length;
        this.haystackList = data1;
        console.log(data1);
      },
      error: error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    })

    // Call Potrait LIst Foto 
    this.http.get<any>(this.global.address+this.global.list_portrait).subscribe({
      next: data2 => {
        this.potraitLength = data2.length;
        this.potraitList = data2;
        console.log(data2);
      },
      error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
      }
    })
  }
}
