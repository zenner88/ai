import { GlobalService } from '../../global.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/file-upload.service';
import Swal from 'sweetalert2';
import * as $ from "jquery";
declare var window: any;
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
  selectedHaystack: any = [];
  selectedPortrait: any = [];
  modalHaystack: any;
  closeModal: string | undefined;

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];
  imageInfos?: Observable<any>;
  resultIdentify: any;

  constructor(private http: HttpClient, private global: GlobalService, private modalService: NgbModal, private uploadService: FileUploadService, private elementRef:ElementRef) { }

  ngOnInit(): void {
    this.callHaystack();
    setTimeout(() => {
      // this.onTimeOut();
      this.callPotrait();    
  }, 1000);

  this.progressInfos = []
  this.message = [];
  this.previews = [];
  this.imageInfos= undefined;

    
  }

  callHaystack(){
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
  }

  callPotrait(){
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

  triggerModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  uploadFiles(): void {
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {
      console.log(file)
      this.uploadService.uploadHay(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.ngOnInit();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }
  
  uploadFiles2(): void {
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload2(i, this.selectedFiles[i]);
      }
    }
  }

  upload2(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {
      console.log(file)
      this.uploadService.uploadPot(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
              this.ngOnInit();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }

  deleteFoto(index: any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      imageUrl: 'http://aimachine.brimob.id/upload-images/ai-uploads/haystack/'+index.filename,
      imageHeight: 150,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let body = {"filenames" : [index.filename]}
        this.http.post<any>(this.global.address+this.global.remove_haystack,body).subscribe({
          next: data1 => {
            console.log(data1);
            this.ngOnInit();
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  addFoto(index: any){
    console.log(index.filename, "ADD!!!");
    var d1 = this.elementRef.nativeElement.querySelector('#selectedFoto');
    d1.insertAdjacentHTML('beforeend', '<div class="col-6 p-2"><div class="content"><div class="content-overlay"></div><img lass="content-image p-2" src="http://aimachine.brimob.id/upload-images/ai-uploads/haystack/'+index.filename+'" alt="" style="max-width: 150px;"><div class="content-details"><i class="fa fa-trash text-light" aria-hidden="true"></i></div></div></div>');

    this.selectedHaystack.push(index.filename);
    console.log(this.selectedHaystack, "selected haystack");
  }

  deleteFoto2(index: any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      imageUrl: 'http://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+index.portrait_filename,
      imageHeight: 150,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let body = {"filenames" : [index.portrait_filename]}
        this.http.post<any>(this.global.address+this.global.remove_portrait,body).subscribe({
          next: data1 => {
            console.log(data1);
            this.ngOnInit();
          },
          error: error => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  addFoto2(index: any){
    console.log(index.portrait_filename, "ADD!!!");
    var d1 = this.elementRef.nativeElement.querySelector('#selectedFoto');
    d1.insertAdjacentHTML('beforeend', '<div class="col-6 p-2"><div class="content"><div class="content-overlay"></div><img lass="content-image p-2" src="http://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+index.portrait_filename+'" alt="" style="max-width: 150px;"><div class="content-details"><i class="fa fa-trash text-light" aria-hidden="true"></i></div></div></div>');
    this.selectedPortrait.push(index.portrait_filename);
    console.log(this.selectedPortrait, "selected portrait");
  }

  identify(){
    $("#result").html("");
    // Call Potrait LIst Foto 
    let body = {
      "threshold" : 97,
      "portraits" : this.selectedPortrait,
      "haystacks" : this.selectedHaystack
    };
    this.http.post<any>(this.global.address+this.global.find_match_portrait, body).subscribe({
      next: data3 => {
        this.resultIdentify = data3;
        console.log(data3);
        var d1 = this.elementRef.nativeElement.querySelector('#result');
        d1.insertAdjacentHTML('beforeend', '<div class="col-6 p-2"><div class="content"><div class="content-overlay"></div><img lass="content-image p-2" src="http://aimachine.brimob.id/upload-images/ai-uploads/output/'+data3.output_file+'" alt="" style="max-width: 300px;"><div class="content-details"><i class="fa fa-trash text-light" aria-hidden="true"></i></div></div></div>');
      },
      error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
      }
    })
  }

  clearSelection(){
    $("#selectedFoto").html("");
    $("#result").html("");

    this.selectedHaystack = [];
    this.selectedPortrait = [];
  }
  
}