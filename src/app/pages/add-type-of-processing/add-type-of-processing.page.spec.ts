import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTypeOfProcessingPage } from './add-type-of-processing.page';

describe('AddTypeOfProcessingPage', () => {
  let component: AddTypeOfProcessingPage;
  let fixture: ComponentFixture<AddTypeOfProcessingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTypeOfProcessingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTypeOfProcessingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
