import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotoListComponent } from './foto-list.component';

describe('FotoListComponent', () => {
  let component: FotoListComponent;
  let fixture: ComponentFixture<FotoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FotoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FotoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
