import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TypeOfMaterialsListPage } from './type-of-materials-list.page';

describe('TypeOfMaterialsListPage', () => {
  let component: TypeOfMaterialsListPage;
  let fixture: ComponentFixture<TypeOfMaterialsListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfMaterialsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TypeOfMaterialsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
