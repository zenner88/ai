import { GlobalService } from '../../global.service';
import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { DecimalPipe  } from '@angular/common';
import { Observable } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/file-upload.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as $ from "jquery";
import { TitleCasePipe } from '@angular/common';
import { DisableRightClickService } from '../../disable-right-click.service';

declare var window: any;
@Component({
  selector: 'app-foto-list',
  templateUrl: './foto-list.component.html',
  styleUrls: ['./foto-list.component.scss']
})
export class FotoListComponent implements OnInit {
  @ViewChild('htmlData') htmlData!: ElementRef;
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
  identifyRes: any;
  color: string | undefined;
  checkbox_checked: boolean = true;
  checkbox_checked2: boolean = false;
  state: any;
  irw:number = 2000;
  date = new Date();

  constructor(private http: HttpClient, private global: GlobalService, private modalService: NgbModal, private uploadService: FileUploadService, private elementRef:ElementRef, private renderer: Renderer2, private toastr: ToastrService, private _decimalPipe: DecimalPipe, private rightClickDisable: DisableRightClickService) { }

  ngOnInit(): void {
    this.callHaystack();
    this.callPotrait();    
    // this.rightClickDisable.disableRightClick();
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
    d1.insertAdjacentHTML('beforeend', '<div class="col-6 col-md-3 p-md-1 content"><img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/haystack/'+index.filename+'" alt="" style="max-width: 150px; align-self: end"></div>');
    this.selectedHaystack.push({"img" : index.filename});
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
    this.getRandomColor()
    console.log(index.portrait_filename, "ADD!!!");
    var d1 = this.elementRef.nativeElement.querySelector('#selectedFoto2');
    d1.insertAdjacentHTML('beforeend', '<div class="col-6 col-md-2 p-1"><img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+index.portrait_filename+'" alt="" style="max-width: 90px;"></div>');
    // d1.insertAdjacentHTML('beforeend', '<div class="col-6 col-md-2 p-1"><img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+index.portrait_filename+'" alt="" style="max-width: 90px;"><div class="form-group"><input type="color" id="potColor" name="potColor" value="'+this.color+'"></div></div>');
    this.selectedPortrait.push({"img" : index.portrait_filename,  "color" : this.color});
    // this.selectedPortrait.push([index.portrait_filename, this.color]);
    this.toastr.info('Foto E-KTP '+index.filename, 'Ditambahkan!', {positionClass: 'toast-bottom-right', timeOut: 2000});
    console.log(this.selectedPortrait, "selected portrait");
  }

  identify(){
    $("#result").html("");
    $("#result2").html("");
    $("#details").html("");

    var tres = (<HTMLInputElement>document.getElementById("treshold")).value;
    var ar = this.checkbox_checked;
    var dra = this.checkbox_checked2;
    var irw = (<HTMLInputElement>document.getElementById("irw")).value;
    var fdt = (<HTMLInputElement>document.getElementById("fdt")).value;
    
    // Call Potrait LIst Foto 
    let body = 
      {
        "confidence_threshold" : Number(tres),
        "arbitrary_rotation" : ar,
        "determine_rotation_angle" : dra,
        "internal_resize_width" : Number(irw),
        "face_detection_threshold" : Number(fdt),
        "haystacks" : this.selectedHaystack,
        "portraits" : this.selectedPortrait
      };
    this.http.post<any>(this.global.address+this.global.find_match_portrait, body).subscribe({
      next: data3 => {
        console.log("identify",data3);
        for (let i = 0; i < data3.result.length; i++) {
          var identify = data3.result; 
          this.identifyRes = identify;
          console.log("root", this.identifyRes);
          console.log("match found", identify[i].match_found.length);
          if (identify[i].match_found.length === 0){
            var d1 = this.elementRef.nativeElement.querySelector('#result');
            d1.insertAdjacentHTML('beforeend', '<div class="text-center text-danger"></div>');
            var d2 = this.elementRef.nativeElement.querySelector('#result2');
            d2.insertAdjacentHTML('beforeend', '<div class="text-center text-danger"></div>');
          }
          else{
            // result foto kejadian
            var d1 = this.elementRef.nativeElement.querySelector('#result');
            d1.insertAdjacentHTML('beforeend', '<div class="col-5 px-1 mb-2"> <img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/output/'+identify[i].output_file+'?r=' + Math.floor(Math.random()*100000)+'" alt="" style="width: 100%;"></div><div class="col-7 px-1 mb-2"> <div class="row" id="percent'+[i]+'"> </div></div><hr>');

            var d2 = this.elementRef.nativeElement.querySelector('#result2');
            d2.insertAdjacentHTML('beforeend', '<div class="col-5 px-1 mb-2"><h5>Foto Kejadian</h5> <img lass="content-image" src="https://aimachine.brimob.id/upload-images/ai-uploads/output/'+identify[i].output_file+'?r=' + Math.floor(Math.random()*100000)+'" alt="" style="width: 100%;"></div><div class="col-7 px-1 mb-2"> <div class="row" id="percent2'+[i]+'"><h5>Hasil Identifikasi </h5></div></div><hr>');
  
            for (let j = 0; j < identify[i].match_found.length; j++) {
              console.log("details", identify[i].match_found[j]);
              // potrait persentase
              var d1 = this.elementRef.nativeElement.querySelector('#percent'+[i]+'');
              d1.insertAdjacentHTML('beforeend', ' <div class="col-4"> <div class="card mb-2" style="cursor: pointer; background-color:'+identify[i].match_found[j].color+'" id="klik'+[j]+'"> <img class="card-img-top" src="https://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+identify[i].match_found[j].portrait+'" alt="Card image cap" placeholder="'+identify[i].match_found[j].original+'"> <p class="text-center text-light my-2" style="font-size: 12px;">Presentase(%) : '+this._decimalPipe.transform(identify[i].match_found[j].match_percentage,"1.2-2")+'</p> </div> </div> <div class="col-8"> <img class="" src="https://aimachine.brimob.id/upload-images/ai-uploads/originalportrait/'+identify[i].match_found[j].original+'" alt="Card image cap" placeholder="'+identify[i].match_found[j].original+'" style="max-height: 150px; border-color:'+identify[i].match_found[j].color+'"> </div>');

              var d2 = this.elementRef.nativeElement.querySelector('#percent2'+[i]+'');
              d2.insertAdjacentHTML('beforeend', ' <div class="col-4"><div class="card mb-2" style="cursor: pointer; background-color:'+identify[i].match_found[j].color+'" id="klik'+[j]+'"> <img class="card-img-top" src="https://aimachine.brimob.id/upload-images/ai-uploads/portrait/'+identify[i].match_found[j].portrait+'" alt="Card image cap" placeholder="'+identify[i].match_found[j].original+'"> <p class="text-center text-light my-2" style="font-size: 12px;">Presentase(%) : '+this._decimalPipe.transform(identify[i].match_found[j].match_percentage,"1.2-2")+'</p> </div> </div> <div class="col-8"> <img class="" src="https://aimachine.brimob.id/upload-images/ai-uploads/originalportrait/'+identify[i].match_found[j].original+'" alt="Card image cap" placeholder="'+identify[i].match_found[j].original+'" style="max-height: 150px; border-color:'+identify[i].match_found[j].color+'"> </div>');
              // ektp
              // var d2 = this.elementRef.nativeElement.querySelector('#klik'+[j]+'');
              // this.renderer.listen(d2, 'click', this.details);        
              // style="border-color:'+identify[i].match_found[j].color+'"
            }
          }
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
    $("#result2").html("");
    $("#percent2").html("");
    $("#details2").html("");
    this.resultIdentify = [];
    this.selectedHaystack = [];
    this.selectedPortrait = [];
  }
  
  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  open(){
    document.getElementById('pdfTable')?.setAttribute('style', ' display: block;')
    this.openPDF();
  }

  public openPDF(): void {
    var HTML_Width: any = document.getElementById('pdfTable')?.clientWidth;
		var HTML_Height: any = document.getElementById('pdfTable')?.clientHeight;
    // var HTML_Width: any = 208;
		// var HTML_Height: any = 450;
		var top_left_margin = 15;
		var PDF_Width = HTML_Width+(top_left_margin*2);
		var PDF_Height: any = (PDF_Width*1.5)+(top_left_margin*2);
		var canvas_image_width = HTML_Width;
		var canvas_image_height = HTML_Height;
		
		var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
    
    let DATA: any = document.getElementById('pdfTable');
    html2canvas(DATA, {useCORS: true}).then((canvas) => {
		// html2canvas($(".pdfTable")[0],{allowTaint:true}).then(function(canvas) {
			canvas.getContext('2d');
			
			console.log(canvas.height+"  "+canvas.width);
			
			
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
		    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
			
			
			for (var i = 1; i <= totalPDFPages; i++) { 
				// pdf.addPage(PDF_Width, PDF_Height);
				// pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
			}		
		    pdf.save("export-"+this.date+".pdf");
    });
    document.getElementById('pdfTable')?.setAttribute('style', ' display: none;')
        
    // let DATA: any = document.getElementById('pdfTable');
    // html2canvas(DATA, {useCORS: true}).then((canvas) => {
    //   let fileWidth = 208;
    //   let fileHeight = (canvas.height * fileWidth) / canvas.width;
    //   const FILEURI = canvas.toDataURL('image/png');
    //   let PDF = new jsPDF('p', 'mm', 'a4');
    //   let position = 0;
    //   PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    //   PDF.save('export-'+this.date+'.pdf');
    // });
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    this.color = '#'; // <-----------
    for (var i = 0; i < 6; i++) {
        this.color += letters[Math.floor(Math.random() * 16)];
    }
  }

  settings(event: any){ 
    let setting = document.getElementById('treshold')?.setAttribute('disabled', "")
                  document.getElementById('treshold')?.setAttribute('class', "form-control bg-dark text-muted")
                  document.getElementById('ar')?.setAttribute('disabled', "")
                  document.getElementById('dra')?.setAttribute('disabled', "")
                  document.getElementById('irw')?.setAttribute('disabled', "")
                  document.getElementById('irw')?.setAttribute('class', "form-control bg-dark text-muted")
                  document.getElementById('fdt')?.setAttribute('disabled', "")
                  document.getElementById('fdt')?.setAttribute('class', "form-control bg-dark text-muted")

    let target = event.target.value;
    if (target === "settings1"){
      setting
      document.getElementById('satu')?.setAttribute('class', "btn btn-2")
      document.getElementById('dua')?.setAttribute('class', "btn btn-three")
      document.getElementById('tiga')?.setAttribute('class', "btn btn-three")
      document.getElementById('empat')?.setAttribute('class', "btn btn-three")
      document.getElementById('cust')?.setAttribute('class', "btn btn-three")
      this.irw = 200;
    }else if (target === "settings2"){
      setting
      document.getElementById('satu')?.setAttribute('class', "btn btn-three")
      document.getElementById('dua')?.setAttribute('class', "btn btn-2")
      document.getElementById('tiga')?.setAttribute('class', "btn btn-three")
      document.getElementById('empat')?.setAttribute('class', "btn btn-three")
      document.getElementById('cust')?.setAttribute('class', "btn btn-three")
      this.irw = 300;
    }else if (target === "settings3"){
      setting
      document.getElementById('satu')?.setAttribute('class', "btn btn-three")
      document.getElementById('dua')?.setAttribute('class', "btn btn-three")
      document.getElementById('tiga')?.setAttribute('class', "btn btn-2")
      document.getElementById('empat')?.setAttribute('class', "btn btn-three")
      document.getElementById('cust')?.setAttribute('class', "btn btn-three")
      this.irw = 500;
    }else if (target === "settings4"){
      setting
      document.getElementById('satu')?.setAttribute('class', "btn btn-three")
      document.getElementById('dua')?.setAttribute('class', "btn btn-three")
      document.getElementById('tiga')?.setAttribute('class', "btn btn-three")
      document.getElementById('empat')?.setAttribute('class', "btn btn-2")
      document.getElementById('cust')?.setAttribute('class', "btn btn-three")
      this.irw = 2000;
    }else if (target === "custom"){
      document.getElementById('treshold')?.removeAttribute('disabled')
      document.getElementById('treshold')?.setAttribute('class', "form-control text-light bg-dark")
      document.getElementById('ar')?.removeAttribute('disabled')
      document.getElementById('dra')?.removeAttribute('disabled')
      document.getElementById('irw')?.removeAttribute('disabled')
      document.getElementById('irw')?.setAttribute('class', "form-control text-light bg-dark")
      document.getElementById('fdt')?.removeAttribute('disabled')
      document.getElementById('fdt')?.setAttribute('class', "form-control text-light bg-dark")

      document.getElementById('satu')?.setAttribute('class', "btn btn-three")
      document.getElementById('dua')?.setAttribute('class', "btn btn-three")
      document.getElementById('tiga')?.setAttribute('class', "btn btn-three")
      document.getElementById('empat')?.setAttribute('class', "btn btn-three")
      document.getElementById('cust')?.setAttribute('class', "btn btn-2")

    }
  }
}