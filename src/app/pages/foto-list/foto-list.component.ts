import { GlobalService } from '../../global.service';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/file-upload.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as $ from "jquery";
import { TitleCasePipe } from '@angular/common';
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
  resultIdentify: any =[];

  constructor(private http: HttpClient, private global: GlobalService, private modalService: NgbModal, private uploadService: FileUploadService, private elementRef:ElementRef, private renderer: Renderer2, private toastr: ToastrService) { }

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
            this.modalService.dismissAll();
            this.ngOnInit();
            this.topFunction();
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

  upload2(idx: number, file2: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file2.name };
    if (file2) {
      console.log(file2)
      this.uploadService.uploadPot(file2).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file2.name;
            this.message.push(msg);
            this.modalService.dismissAll();
            this.ngOnInit();
            this.topFunction();
          }
          var fdf = event.body.result;
          var fdf1 = event.body.valid;
          console.log("catch b",fdf)
          if (fdf1 === 2){
            const msg = 'Could not upload the file: ' + file2.name +'  FACE DETECT FAILED  ';
            this.message.push(msg);
          }
        },
        error: (err: any) => {
          console.log(err)
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file2.name;
          this.message.push(msg);
        }
      });
    }
  }

  deleteFoto(index: any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      imageUrl: 'https://aimachine.brimob.id/upload-images/ai-uploads/haystack/'+index.filename,
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
    var d1 = this.elementRef.nativeElement.querySelector('#selectedFoto1');
    d1.insertAdjacentHTML('beforeend', '<div class="col-12 col-md-6 p-md-1 content"><img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/haystack/'+index.filename+'" alt="" style="max-width: 100px;"></div>');
    this.selectedHaystack.push(index.filename);
    this.toastr.info('Foto Kejadian '+index.filename, 'Ditambahkan!', {positionClass: 'toast-bottom-right', timeOut: 2000});
    console.log(this.selectedHaystack, "selected haystack");
  }

  deleteFoto2(index: any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      imageUrl: 'https://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+index.portrait_filename,
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
    var d1 = this.elementRef.nativeElement.querySelector('#selectedFoto2');
    d1.insertAdjacentHTML('beforeend', '<div class="col-12 col-md-4 p-1"><img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+index.portrait_filename+'" alt="" style="max-width: 90px;"></div>');
    this.selectedPortrait.push(index.portrait_filename);
    this.toastr.info('Foto E-KTP '+index.filename, 'Ditambahkan!', {positionClass: 'toast-bottom-right', timeOut: 2000});
    console.log(this.selectedPortrait, "selected portrait");
  }

  identify(){
    $("#result").html("");
    $("#details").html("");

    var tres = (<HTMLInputElement>document.getElementById("treshold")).value;
    console.log(tres);
    // Call Potrait LIst Foto 
    let body = {
      "threshold" : Number(tres),
      "portraits" : this.selectedPortrait,
      "haystacks" : this.selectedHaystack
    };
    this.http.post<any>(this.global.address+this.global.find_match_portrait, body).subscribe({
      next: data3 => {
        console.log("identify",data3);
        for (let i = 0; i < data3.result.length; i++) {
          var identify = data3.result; 
          console.log("root", identify);
          console.log("match found", identify[i].match_found.length);
          var d1 = this.elementRef.nativeElement.querySelector('#result');
          d1.insertAdjacentHTML('beforeend', '<div class="col-12 col-md-8"><div class="row"><div class="col-6"><img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/output/'+identify[i].output_file+'" alt="" style="max-width: 250px;"></div><div class="row mt-2 mx-1" id="details'+[i]+'"></div></div></div><div class="col-12 col-md-4"><div class="row" id="percent'+[i]+'"></div></div>');
          // let details = identify[i].match_found;
          for (let j = 0; j < identify[i].match_found.length; j++) {
            console.log("details", identify[i].match_found[j]);
            var d1 = this.elementRef.nativeElement.querySelector('#percent'+[i]+'');
            d1.insertAdjacentHTML('beforeend', '<div class="card bg-dark mb-2" style="cursor: pointer;" id="klik'+[j]+'"> <img class="card-img-top" src="https://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+identify[i].match_found[j].portrait+'" alt="Card image cap" placeholder="'+identify[i].match_found[j].original+'"> <p class="text-center text-light my-2" style="font-size: 12px;">Match (%) : '+identify[i].match_found[j].match_percentage+'</p> </div>');
            var d2 = this.elementRef.nativeElement.querySelector('#klik'+[j]+'');
            this.renderer.listen(d2, 'click', this.details);          }
          }
      },
      error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
          var d1 = this.elementRef.nativeElement.querySelector('#result');
          d1.insertAdjacentHTML('beforeend', '<div class="text-center text-danger">Not Found!</div>');
      }
    })
  }

  details(event:any){
    $("#details1").html("");

    console.log(event.target.attributes.placeholder.value);
    var d1 = this.elementRef.nativeElement.querySelector('#details1');
    d1.insertAdjacentHTML('beforeend', '<div class="card bg-dark" style="width: 100%;"><img class="card-img-top" src="https://aimachine.brimob.id/upload-images/ai-uploads/originalportrait/'+event.target.attributes.placeholder.value+'"><div class="card-body bgBox"><p class="text-light">Nama :<BR>NIK :<BR>Alamat :</div></div>');
  }

  clearSelection(){
    $("#selectedFoto1").html("");
    $("#selectedFoto2").html("");
    $("#result").html("");
    $("#percent").html("");
    $("#details").html("");
    this.resultIdentify = [];
    this.selectedHaystack = [];
    this.selectedPortrait = [];
  }
  
  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}