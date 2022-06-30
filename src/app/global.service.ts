import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()

export class GlobalService {
  
  constructor() { }
  // private header = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  // public readonly headers = { headers: this.header };

  public readonly address: string = 'http://aimachine.brimob.id:5000/ai';  
  public readonly upload_portrait: string = '/upload_portrait';  
  public readonly find_match_portrait: string = '/find_match_portrait';  
  public readonly upload_haystack: string = '/upload_haystack';  
  public readonly remove_haystack: string = '/remove_haystack';  
  public readonly remove_portrait: string = '/remove_portrait';  
  public readonly remove_original_portrait: string = '/remove_original_portrait';  
  public readonly list_haystack: string = '/list_haystack';  
  public readonly download_portrait: string = '/download_portrait';  
  public readonly list_portrait: string = '/list_portrait';  
  public readonly download_haystack: string = '/download_haystack';  
}