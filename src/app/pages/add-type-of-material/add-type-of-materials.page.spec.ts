import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTypeOfMaterialsPage } from './add-type-of-materials.page';

describe('AddTypeOfMaterialsPage', () => {
  let component: AddTypeOfMaterialsPage;
  let fixture: ComponentFixture<AddTypeOfMaterialsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTypeOfMaterialsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTypeOfMaterialsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
