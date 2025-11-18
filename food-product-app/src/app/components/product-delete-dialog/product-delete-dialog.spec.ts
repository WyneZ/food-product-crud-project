import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDeleteDialog } from './product-delete-dialog';

describe('ProductDeleteDialog', () => {
  let component: ProductDeleteDialog;
  let fixture: ComponentFixture<ProductDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDeleteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
